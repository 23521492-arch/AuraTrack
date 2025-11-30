import express from "express"
import { getOverview } from "../controllers/overviewController.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Overview
 *   description: Dashboard overview and aggregated data
 */

/**
 * @swagger
 * /api/overview:
 *   get:
 *     summary: Get dashboard overview data
 *     description: Returns aggregated data for the dashboard including mood trends, recent activities, and habit stats.
 *     tags: [Overview]
 *     responses:
 *       200:
 *         description: Overview data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 moodData:
 *                   type: array
 *                   items:
 *                     type: object
 *                 activities:
 *                   type: array
 *                   items:
 *                     type: object
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalHabits:
 *                       type: integer
 *                     completedToday:
 *                       type: integer
 *                     streak:
 *                       type: integer
 *                 habits:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/", getOverview)

export default router

