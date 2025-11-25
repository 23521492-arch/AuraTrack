import Sleep from "../models/Sleep.js"
import mongoose from "mongoose"
import { getRandomSleepFact } from "../utils/sleepFacts.js"

export const createSleep = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { bedtime, wakeTime, duration, quality, notes, date } = req.body || {}
    if (!bedtime || !wakeTime) {
      return res.status(400).json({ message: "bedtime and wakeTime are required" })
    }

    const sleep = await Sleep.create({
      userId,
      bedtime: new Date(bedtime),
      wakeTime: new Date(wakeTime),
      duration,
      quality,
      notes,
      date: date ? new Date(date) : new Date(),
    })
    return res.status(201).json({ sleep })
  } catch (error) {
    console.error("Error in createSleep", error)
    res.status(500).json({ message: "System error" })
  }
}

export const listSleeps = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { from, to, limit = 30, page = 1 } = req.query || {}
    const query = { userId }

    if (from || to) {
      query.date = {}
      if (from) query.date.$gte = new Date(from)
      if (to) query.date.$lte = new Date(to)
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const [items, total] = await Promise.all([
      Sleep.find(query)
        .sort({ date: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      Sleep.countDocuments(query),
    ])

    return res.status(200).json({ items, total })
  } catch (error) {
    console.error("Error in listSleeps", error)
    res.status(500).json({ message: "System error" })
  }
}

export const listAllSleeps = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const items = await Sleep.find({ userId }).sort({ date: -1 }).lean()
    return res.status(200).json({ items })
  } catch (error) {
    console.error("Error in listAllSleeps", error)
    res.status(500).json({ message: "System error" })
  }
}

export const getSleep = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid sleep ID" })
    }

    const sleep = await Sleep.findOne({ _id: id, userId }).lean()
    if (!sleep) {
      return res.status(404).json({ message: "Sleep not found" })
    }

    return res.status(200).json({ sleep })
  } catch (error) {
    console.error("Error in getSleep", error)
    res.status(500).json({ message: "System error" })
  }
}

export const updateSleep = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid sleep ID" })
    }

    const { bedtime, wakeTime, duration, quality, notes } = req.body || {}
    const updateData = {}

    if (bedtime) updateData.bedtime = new Date(bedtime)
    if (wakeTime) updateData.wakeTime = new Date(wakeTime)
    if (duration !== undefined) updateData.duration = duration
    if (quality !== undefined) updateData.quality = quality
    if (notes !== undefined) updateData.notes = notes

    const sleep = await Sleep.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean()

    if (!sleep) {
      return res.status(404).json({ message: "Sleep not found" })
    }

    return res.status(200).json({ sleep })
  } catch (error) {
    console.error("Error in updateSleep", error)
    res.status(500).json({ message: "System error" })
  }
}

export const deleteSleep = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid sleep ID" })
    }

    const sleep = await Sleep.findOneAndDelete({ _id: id, userId })
    if (!sleep) {
      return res.status(404).json({ message: "Sleep not found" })
    }

    return res.status(200).json({ message: "Sleep deleted successfully" })
  } catch (error) {
    console.error("Error in deleteSleep", error)
    res.status(500).json({ message: "System error" })
  }
}

export const getSleepFact = async (req, res) => {
  try {
    const { category } = req.query
    const fact = getRandomSleepFact(category || null)
    return res.status(200).json(fact)
  } catch (error) {
    console.error("Error in getSleepFact", error)
    res.status(500).json({ message: "System error" })
  }
}

