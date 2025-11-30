import express from "express"
import { createSleep, listSleeps, listAllSleeps, getSleep, updateSleep, deleteSleep, getSleepFact } from "../controllers/sleepController.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Sleep
 *   description: Sleep tracking and analysis
 */

/**
 * @swagger
 * /api/sleeps:
 *   post:
 *     summary: Log a sleep entry
 *     tags: [Sleep]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bedtime
 *               - wakeTime
 *               - date
 *             properties:
 *               bedtime:
 *                 type: string
 *                 format: date-time
 *               wakeTime:
 *                 type: string
 *                 format: date-time
 *               quality:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *               notes:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Sleep entry created
 */
router.post("/", createSleep)

/**
 * @swagger
 * /api/sleeps:
 *   get:
 *     summary: Get sleep history
 *     tags: [Sleep]
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
 *         description: List of sleep entries
 */
router.get("/", listSleeps)

/**
 * @swagger
 * /api/sleeps/all:
 *   get:
 *     summary: Get all sleep history
 *     tags: [Sleep]
 *     responses:
 *       200:
 *         description: Complete sleep history
 */
router.get("/all", listAllSleeps)

/**
 * @swagger
 * /api/sleeps/fact:
 *   get:
 *     summary: Get a random sleep fact
 *     tags: [Sleep]
 *     responses:
 *       200:
 *         description: Random sleep fact
 */
router.get("/fact", getSleepFact)

/**
 * @swagger
 * /api/sleeps/{id}:
 *   get:
 *     summary: Get a specific sleep entry
 *     tags: [Sleep]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sleep entry details
 */
router.get("/:id", getSleep)

/**
 * @swagger
 * /api/sleeps/{id}:
 *   patch:
 *     summary: Update a sleep entry
 *     tags: [Sleep]
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
 *               quality:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sleep entry updated
 */
router.patch("/:id", updateSleep)

/**
 * @swagger
 * /api/sleeps/{id}:
 *   delete:
 *     summary: Delete a sleep entry
 *     tags: [Sleep]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sleep entry deleted
 */
router.delete("/:id", deleteSleep)

export default router

