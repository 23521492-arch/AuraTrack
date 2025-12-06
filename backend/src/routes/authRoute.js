import express from 'express';
import { signUp, signIn, signOut } from '../controllers/authController.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - displayName
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               displayName:
 *                 type: string
 *     responses:
 *       204:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Username or email already exists
 */
router.post("/signup", signUp);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post("/signin", signIn);

/**
 * @swagger
 * /api/auth/signout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       204:
 *         description: Logout successful
 */
router.post("/signout", signOut);
export default router;

