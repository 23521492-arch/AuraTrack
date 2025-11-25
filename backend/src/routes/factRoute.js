import express from "express"
import { 
  getRandomFact, 
  getAllFacts, 
  createFact, 
  updateFact, 
  deleteFact 
} from "../controllers/factController.js"

const router = express.Router()

router.get("/", getRandomFact)
router.get("/all", getAllFacts)
router.post("/", createFact)
router.patch("/:id", updateFact)
router.delete("/:id", deleteFact)

export default router

