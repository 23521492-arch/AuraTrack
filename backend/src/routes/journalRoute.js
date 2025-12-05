import express from "express"
import { createJournal, listJournals, listAllJournals, getJournal, updateJournal, deleteJournal } from "../controllers/journalController.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Journals
 *   description: Journal entries management
 */

/**
 * @swagger
 * /api/journals:
 *   post:
 *     summary: Create a new journal entry
 *     tags: [Journals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - date
 *             properties:
 *               content:
 *                 type: string
 *               prompt:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Journal created
 */
router.post("/", createJournal)

/**
 * @swagger
 * /api/journals:
 *   get:
 *     summary: Get list of journals
 *     tags: [Journals]
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
 *         description: List of journals
 */
router.get("/", listJournals)

/**
 * @swagger
 * /api/journals/all:
 *   get:
 *     summary: Get all journals history
 *     tags: [Journals]
 *     responses:
 *       200:
 *         description: Complete journal history
 */
router.get("/all", listAllJournals)

/**
 * @swagger
 * /api/journals/{id}:
 *   get:
 *     summary: Get a specific journal entry
 *     tags: [Journals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Journal details
 */
router.get("/:id", getJournal)

/**
 * @swagger
 * /api/journals/{id}:
 *   patch:
 *     summary: Update a journal entry
 *     tags: [Journals]
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
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Journal updated
 */
router.patch("/:id", updateJournal)

/**
 * @swagger
 * /api/journals/{id}:
 *   delete:
 *     summary: Delete a journal entry
 *     tags: [Journals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Journal deleted
 */
router.delete("/:id", deleteJournal)

export default router