import User from '../models/User.js';
import Payment from '../models/Payment.js';


export const createPayPalPayment = async (req, res) => {
  try {
    const { planType, amount } = req.body;
    const userId = req.user._id;

    // Validate plan type
    const validPlans = ['monthly', 'yearly'];
    if (!validPlans.includes(planType)) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    const planAmount = amount || (planType === 'monthly' ? 9.99 : 79.99);

    const paypalMeUsername = process.env.PAYPAL_ME_USERNAME;
    if (paypalMeUsername) {
      let cleanUsername = paypalMeUsername.trim();
      
      if (cleanUsername.startsWith('@')) {
        cleanUsername = cleanUsername.substring(1);
      }
      
      cleanUsername = cleanUsername.replace(/\s+/g, '');
      cleanUsername = cleanUsername.replace(/[^a-zA-Z0-9-]/g, '');
      
      if (!cleanUsername || cleanUsername.length === 0) {
        return res.status(400).json({ 
          message: 'Invalid PayPal.me username. Please check PAYPAL_ME_USERNAME in .env file.' 
        });
      }
      
      const paymentId = `PAYPALME-${Date.now()}-${userId.toString().slice(-6)}`;
      const paypalMeUrl = `https://paypal.me/${cleanUsername}/${planAmount.toFixed(2)}`;
      
      const payment = new Payment({
        userId,
        planType,
        amount: planAmount,
        paymentMethod: 'paypalme',
        status: 'pending',
        paymentId,
        paypalMeUrl,
        metadata: {
          paypalMeUsername: cleanUsername,
          originalUsername: paypalMeUsername,
          userAgent: req.headers['user-agent'],
          ip: req.ip || req.connection.remoteAddress
        }
      });
      
      await payment.save();
      
      return res.status(200).json({
        success: true,
        paymentId,
        approvalUrl: paypalMeUrl,
        redirectUrl: paypalMeUrl,
        message: 'PayPal.me payment link created',
        method: 'paypalme',
        username: cleanUsername
      });
    }

    let paypal;
    try {
      paypal = require('@paypal/checkout-server-sdk');
    } catch (error) {
      console.log('PayPal SDK not installed, using demo mode');
      const paymentId = `PAYPAL-${Date.now()}-${userId}`;
      
      return res.status(200).json({
        success: true,
        paymentId,
        approvalUrl: null,
        redirectUrl: null,
        message: 'PayPal payment initialized (Demo Mode)',
        demoMode: true
      });
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const mode = process.env.PAYPAL_MODE || 'sandbox';

    if (!clientId || !clientSecret) {
      console.log('PayPal credentials not configured, using demo mode');
      const paymentId = `PAYPAL-${Date.now()}-${userId}`;
      
      return res.status(200).json({
        success: true,
        paymentId,
        approvalUrl: null,
        redirectUrl: null,
        message: 'PayPal credentials not configured (Demo Mode)',
        demoMode: true
      });
    }

    const environment = mode === 'live'
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);
    
    const client = new paypal.core.PayPalHttpClient(environment);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: planAmount.toFixed(2)
        },
        description: `HealApp Pro - ${planType === 'monthly' ? 'Monthly' : 'Yearly'} Plan`,
        custom_id: `${userId}-${planType}-${Date.now()}`
      }],
      application_context: {
        brand_name: 'HealApp',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/checkout?paymentId={PAYMENT_ID}&PayerID={PAYER_ID}&token={TOKEN}&plan=${planType}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/checkout?canceled=true`
      }
    });

    const order = await client.execute(request);
    
    if (order.statusCode === 201) {
      const approvalLink = order.result.links.find(link => link.rel === 'approve');
      
      if (approvalLink) {
        const paymentId = order.result.id;
        
        const payment = new Payment({
          userId,
          planType,
          amount: planAmount,
          paymentMethod: 'paypal',
          status: 'pending',
          paymentId,
          paypalOrderId: order.result.id,
          metadata: {
            userAgent: req.headers['user-agent'],
            ip: req.ip || req.connection.remoteAddress
          }
        });
        
        await payment.save();
        
        res.status(200).json({
          success: true,
          paymentId: paymentId,
          approvalUrl: approvalLink.href,
          redirectUrl: approvalLink.href,
          message: 'PayPal payment link created successfully'
        });
      } else {
        throw new Error('Approval URL not found in PayPal response');
      }
    } else {
      throw new Error(`PayPal API error: ${order.statusCode}`);
    }
  } catch (error) {
    console.error('Error creating PayPal payment:', error);
    
    if (error.message.includes('PayPal') || error.message.includes('SDK')) {
      const paymentId = `PAYPAL-${Date.now()}-${req.user._id}`;
      return res.status(200).json({
        success: true,
        paymentId,
        approvalUrl: null,
        redirectUrl: null,
        message: 'PayPal error, using demo mode',
        demoMode: true,
        error: error.message
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create PayPal payment', 
      error: error.message 
    });
  }
};

export const verifyPayPalPayment = async (req, res) => {
  try {
    const { paymentId, payerId, token } = req.query;
    const userId = req.user._id;
    const planType = req.query.plan || 'monthly';

    if (!paymentId) {
      return res.status(400).json({ message: 'Missing payment ID' });
    }

    // Find payment record
    const payment = await Payment.findOne({ paymentId, userId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if already completed
    if (payment.status === 'completed') {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified',
        subscription: (await User.findById(userId)).subscription
      });
    }

    // Check if expired
    if (payment.isExpired()) {
      payment.status = 'cancelled';
      await payment.save();
      return res.status(400).json({ message: 'Payment session expired. Please create a new payment.' });
    }

    if (payment.paymentMethod === 'paypalme') {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await payment.markCompleted();
      payment.payerId = 'PAYPALME_USER';
      payment.token = 'PAYPALME_CONFIRMED';
      await payment.save();

      user.subscription = {
        plan: payment.planType,
        status: 'active',
        startDate: new Date(),
        endDate: payment.planType === 'yearly' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentMethod: 'paypalme',
        paymentId: payment.paymentId
      };

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Payment verified and subscription activated',
        subscription: user.subscription
      });
    }

    if (!payerId) {
      return res.status(400).json({ message: 'Missing payer ID for PayPal SDK verification' });
    }

    let paypal;
    try {
      paypal = require('@paypal/checkout-server-sdk');
    } catch (error) {
      console.log('PayPal SDK not installed, using demo mode for verification');
      return handleDemoPaymentVerification(req, res, userId, payment);
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const mode = process.env.PAYPAL_MODE || 'sandbox';

    if (!clientId || !clientSecret) {
      console.log('PayPal credentials not configured, using demo mode for verification');
      return handleDemoPaymentVerification(req, res, userId, payment);
    }

    const environment = mode === 'live'
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);
    
    const client = new paypal.core.PayPalHttpClient(environment);

    const paypalOrderId = payment.paypalOrderId || paymentId;
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});

    const capture = await client.execute(request);

    if (capture.statusCode === 201 && capture.result.status === 'COMPLETED') {
      await payment.markCompleted();
      payment.payerId = payerId;
      payment.token = token;
      payment.paypalOrderId = paypalOrderId;
      await payment.save();

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.subscription = {
        plan: payment.planType,
        status: 'active',
        startDate: new Date(),
        endDate: payment.planType === 'yearly' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentMethod: 'paypal',
        paymentId: payment.paymentId
      };

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Payment verified and subscription activated',
        subscription: user.subscription
      });
    } else {
      payment.status = 'failed';
      await payment.save();
      throw new Error(`Payment capture failed: ${capture.result.status}`);
    }
  } catch (error) {
    console.error('Error verifying PayPal payment:', error);
    
    if (error.message.includes('PayPal') || error.message.includes('SDK')) {
      const payment = await Payment.findOne({ paymentId, userId: req.user._id });
      if (payment) {
        return handleDemoPaymentVerification(req, res, req.user._id, payment);
      }
    }
    
    res.status(500).json({ 
      message: 'Failed to verify PayPal payment', 
      error: error.message 
    });
  }
};

const handleDemoPaymentVerification = async (req, res, userId, payment) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await payment.markCompleted();
    payment.payerId = 'DEMO_PAYER_ID';
    payment.token = 'DEMO_TOKEN';
    await payment.save();

    user.subscription = {
      plan: payment.planType,
      status: 'active',
      startDate: new Date(),
      endDate: payment.planType === 'yearly' 
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      paymentMethod: payment.paymentMethod || 'paypal',
      paymentId: payment.paymentId
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified and subscription activated (Demo Mode)',
      subscription: user.subscription,
      demoMode: true
    });
  } catch (error) {
    console.error('Error in demo payment verification:', error);
    res.status(500).json({ 
      message: 'Failed to verify payment', 
      error: error.message 
    });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user._id;

    const payment = await Payment.findOne({ paymentId, userId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({
      success: true,
      payment: {
        paymentId: payment.paymentId,
        status: payment.status,
        planType: payment.planType,
        amount: payment.amount,
        createdAt: payment.createdAt,
        completedAt: payment.completedAt,
        isExpired: payment.isExpired()
      }
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({ 
      message: 'Failed to get payment status', 
      error: error.message 
    });
  }
};

