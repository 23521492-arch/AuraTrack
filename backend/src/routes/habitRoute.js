import express from "express"
import { createHabit, listHabits, getHabit, updateHabit, deleteHabit, toggleHabit, getHabitStats } from "../controllers/habitController.js"

const router = express.Router()

router.post("/", createHabit)
router.get("/", listHabits)
router.get("/stats", getHabitStats)
router.get("/all", listHabits)
router.get("/:id", getHabit)
router.patch("/:id", updateHabit)
router.delete("/:id", deleteHabit)
router.post("/:id/toggle", toggleHabit)

export default router