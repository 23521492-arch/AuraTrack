import express from "express"
import { createMood, listMoods, listAllMoods, getMood, updateMood, deleteMood, getMoodStats } from "../controllers/moodController.js"

const router = express.Router()

router.post("/", createMood)
router.get("/", listMoods)
router.get("/all", listAllMoods)
router.get("/stats", getMoodStats)
router.get("/:id", getMood)
router.patch("/:id", updateMood)
router.delete("/:id", deleteMood)

export default router
