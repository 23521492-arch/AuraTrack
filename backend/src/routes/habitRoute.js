import express from "express"
import { createHabit, listHabits, getHabit, updateHabit, deleteHabit, toggleHabit, getHabitStats } from "../controllers/habitController.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Habits
 *   description: Habit tracking and management
 */

/**
 * @swagger
 * /api/habits:
 *   post:
 *     summary: Create a new habit
 *     tags: [Habits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               iconName:
 *                 type: string
 *               goal:
 *                 type: number
 *     responses:
 *       201:
 *         description: Habit created
 */
router.post("/", createHabit)

/**
 * @swagger
 * /api/habits:
 *   get:
 *     summary: Get all habits
 *     tags: [Habits]
 *     responses:
 *       200:
 *         description: List of habits
 */
router.get("/", listHabits)

/**
 * @swagger
 * /api/habits/stats:
 *   get:
 *     summary: Get habit statistics
 *     tags: [Habits]
 *     responses:
 *       200:
 *         description: Habit statistics
 */
router.get("/stats", getHabitStats)

/**
 * @swagger
 * /api/habits/all:
 *   get:
 *     summary: Get all habits (alias)
 *     tags: [Habits]
 *     responses:
 *       200:
 *         description: List of habits
 */
router.get("/all", listHabits)

/**
 * @swagger
 * /api/habits/{id}:
 *   get:
 *     summary: Get a specific habit
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habit details
 */
router.get("/:id", getHabit)

/**
 * @swagger
 * /api/habits/{id}:
 *   patch:
 *     summary: Update a habit
 *     tags: [Habits]
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
 *               name:
 *                 type: string
 *               goal:
 *                 type: number
 *     responses:
 *       200:
 *         description: Habit updated
 */
router.patch("/:id", updateHabit)

/**
 * @swagger
 * /api/habits/{id}:
 *   delete:
 *     summary: Delete a habit
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habit deleted
 */
router.delete("/:id", deleteHabit)

/**
 * @swagger
 * /api/habits/{id}/toggle:
 *   post:
 *     summary: Toggle habit completion for a specific date
 *     tags: [Habits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Habit status toggled
 */
router.post("/:id/toggle", toggleHabit)

export default router