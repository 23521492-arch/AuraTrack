import express from 'express';
import { 
  createPayPalPayment, 
  verifyPayPalPayment, 
  getPaymentStatus
} from '../controllers/paymentController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protectedRoute);

router.post('/paypal/create', createPayPalPayment);
router.get('/paypal/verify', verifyPayPalPayment);
router.get('/status/:paymentId', getPaymentStatus);

export default router;

