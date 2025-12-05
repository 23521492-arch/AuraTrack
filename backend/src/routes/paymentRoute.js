import express from 'express';
import {
  createPayPalPayment,
  verifyPayPalPayment,
  getPaymentStatus
} from '../controllers/paymentController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protectedRoute);

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment and subscription management
 */

/**
 * @swagger
 * /api/payments/paypal/create:
 *   post:
 *     summary: Create a PayPal payment session
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planType
 *               - amount
 *             properties:
 *               planType:
 *                 type: string
 *                 enum: [monthly, yearly]
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Payment session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentId:
 *                   type: string
 *                 approvalUrl:
 *                   type: string
 */
router.post('/paypal/create', createPayPalPayment);

/**
 * @swagger
 * /api/payments/paypal/verify:
 *   get:
 *     summary: Verify PayPal payment execution
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: PayerID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment verified and subscription activated
 */
router.get('/paypal/verify', verifyPayPalPayment);

/**
 * @swagger
 * /api/payments/status/{paymentId}:
 *   get:
 *     summary: Get payment status
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment status details
 */
router.get('/status/:paymentId', getPaymentStatus);

export default router;

