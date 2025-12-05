import express from "express"
import { createMood, listMoods, listAllMoods, getMood, updateMood, deleteMood, getMoodStats } from "../controllers/moodController.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Moods
 *   description: Mood tracking and management
 */

/**
 * @swagger
 * /api/moods:
 *   post:
 *     summary: Create a new mood entry
 *     tags: [Moods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *               - date
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *               note:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               sleep:
 *                 type: number
 *               activity:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Mood created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", createMood)

/**
 * @swagger
 * /api/moods:
 *   get:
 *     summary: Get list of moods
 *     tags: [Moods]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of moods
 */
router.get("/", listMoods)

/**
 * @swagger
 * /api/moods/all:
 *   get:
 *     summary: Get all moods history
 *     tags: [Moods]
 *     responses:
 *       200:
 *         description: Complete mood history
 */
router.get("/all", listAllMoods)

/**
 * @swagger
 * /api/moods/stats:
 *   get:
 *     summary: Get mood statistics
 *     tags: [Moods]
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *     responses:
 *       200:
 *         description: Mood statistics
 */
router.get("/stats", getMoodStats)

/**
 * @swagger
 * /api/moods/{id}:
 *   get:
 *     summary: Get a specific mood entry
 *     tags: [Moods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mood details
 *       404:
 *         description: Mood not found
 */
router.get("/:id", getMood)

/**
 * @swagger
 * /api/moods/{id}:
 *   patch:
 *     summary: Update a mood entry
 *     tags: [Moods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mood updated
 */
router.patch("/:id", updateMood)

/**
 * @swagger
 * /api/moods/{id}:
 *   delete:
 *     summary: Delete a mood entry
 *     tags: [Moods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mood deleted
 */
router.delete("/:id", deleteMood)

export default router
