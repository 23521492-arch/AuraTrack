import express from "express"
import { getOverview } from "../controllers/overviewController.js"

const router = express.Router()

// Routes for Overview/Aggregated data
// Base: /api/overview

// Get overview data (mood trends, activities, stats)
// GET /api/overview
router.get("/", getOverview)

export default router

