import express from "express"
import {
  getRandomFact,
  getAllFacts,
  createFact,
  updateFact,
  deleteFact
} from "../controllers/factController.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Facts
 *   description: Wellness facts and tips
 */

/**
 * @swagger
 * /api/facts:
 *   get:
 *     summary: Get a random fact
 *     tags: [Facts]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Random fact
 */
router.get("/", getRandomFact)

/**
 * @swagger
 * /api/facts/all:
 *   get:
 *     summary: Get all facts
 *     tags: [Facts]
 *     responses:
 *       200:
 *         description: List of all facts
 */
router.get("/all", getAllFacts)

/**
 * @swagger
 * /api/facts:
 *   post:
 *     summary: Create a new fact
 *     tags: [Facts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fact created
 */
router.post("/", createFact)

/**
 * @swagger
 * /api/facts/{id}:
 *   patch:
 *     summary: Update a fact
 *     tags: [Facts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fact updated
 */
router.patch("/:id", updateFact)

/**
 * @swagger
 * /api/facts/{id}:
 *   delete:
 *     summary: Delete a fact
 *     tags: [Facts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fact deleted
 */
router.delete("/:id", deleteFact)

export default router

