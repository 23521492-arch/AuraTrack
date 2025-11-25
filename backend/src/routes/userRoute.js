import express from 'express';
import { authMe, updateMe } from '../controllers/userController.js';
const router = express.Router();

router.get('/me', authMe);
router.patch('/me', updateMe);

export default router;