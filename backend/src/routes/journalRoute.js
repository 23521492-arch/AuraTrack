import express from "express"
import { createJournal, listJournals, listAllJournals, getJournal, updateJournal, deleteJournal } from "../controllers/journalController.js"

const router = express.Router()

router.post("/", createJournal)
router.get("/", listJournals)
router.get("/all", listAllJournals)
router.get("/:id", getJournal)
router.patch("/:id", updateJournal)
router.delete("/:id", deleteJournal)

export default router