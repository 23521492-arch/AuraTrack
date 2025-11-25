import express from "express"
import { createSleep, listSleeps, listAllSleeps, getSleep, updateSleep, deleteSleep, getSleepFact } from "../controllers/sleepController.js"

const router = express.Router()

router.post("/", createSleep)
router.get("/", listSleeps)
router.get("/all", listAllSleeps)
router.get("/fact", getSleepFact)
router.get("/:id", getSleep)
router.patch("/:id", updateSleep)
router.delete("/:id", deleteSleep)

export default router

