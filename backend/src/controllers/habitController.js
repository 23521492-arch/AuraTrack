import Habit from "../models/Habit.js"
import mongoose from "mongoose"
import { calculateStreak, isCompletedToday, calculateOverallStreakFromHabits } from "../utils/streakCalculator.js"
import { mapCategoryToIcon } from "../utils/habitMapper.js"

export const createHabit = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { name, category, iconName = 'heart', goal = 1 } = req.body || {}
    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "name is required" })
    }

    const habit = await Habit.create({ userId, name: String(name).trim(), category, iconName, goal })
    // Convert to plain object to ensure proper serialization
    const habitObj = habit.toObject()
    // Ensure name is always a string
    if (habitObj.name && typeof habitObj.name !== 'string') {
      habitObj.name = String(habitObj.name)
    }
    return res.status(201).json({ habit: habitObj })
  } catch (error) {
    console.error("Error in createHabit", error)
    res.status(500).json({ message: "System error" })
  }
}

export const listHabits = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { includeStreak, includeCompleted } = req.query
    const items = await Habit.find({ userId }).sort({ name: 1 }).lean()
    const total = await Habit.countDocuments({ userId })

    // Transform items - always convert to plain objects
    const today = new Date().toDateString()
    const transformedItems = items.map(habit => {
      const habitObj = { ...habit } // Ensure it's a plain object
      
      if (includeStreak === 'true') {
        habitObj.streak = calculateStreak(habit.completedDates || [])
      }
      
      if (includeCompleted === 'true') {
        habitObj.completed = isCompletedToday(habit.completedDates || [])
      }
      
      // Map iconName from category if not set
      if (!habitObj.iconName && habitObj.category) {
        habitObj.iconName = mapCategoryToIcon(habitObj.category, habitObj.iconName)
      }
      
      // Ensure name is always a string
      if (habitObj.name && typeof habitObj.name !== 'string') {
        habitObj.name = String(habitObj.name)
      }
      
      return habitObj
    })

    return res.status(200).json({ items: transformedItems, total })
  } catch (error) {
    console.error("Error in listHabits", error)
    res.status(500).json({ message: "System error" })
  }
}

export const getHabitStats = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const habits = await Habit.find({ userId }).sort({ name: 1 }).lean()
    const today = new Date().toDateString()

    const completedToday = habits.filter(h => isCompletedToday(h.completedDates || [])).length
    const overallStreak = calculateOverallStreakFromHabits(habits)

    // Transform habits with streak and completed status
    const transformedHabits = habits.map(habit => {
      const habitObj = { ...habit } // Ensure it's a plain object
      habitObj.streak = calculateStreak(habit.completedDates || [])
      habitObj.completed = isCompletedToday(habit.completedDates || [])
      
      // Map iconName from category if not set
      if (!habitObj.iconName && habitObj.category) {
        habitObj.iconName = mapCategoryToIcon(habitObj.category, habitObj.iconName)
      }
      
      // Ensure name is always a string
      if (habitObj.name && typeof habitObj.name !== 'string') {
        habitObj.name = String(habitObj.name)
      }
      
      return habitObj
    })

    return res.status(200).json({
      total: habits.length,
      completedToday,
      streak: overallStreak,
      habits: transformedHabits,
    })
  } catch (error) {
    console.error("Error in getHabitStats", error)
    res.status(500).json({ message: "System error" })
  }
}

export const getHabit = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid habit id format" })
    }
    const habit = await Habit.findOne({ _id: id, userId }).lean()
    if (!habit) return res.status(404).json({ message: "Habit not found" })
    // Ensure name is always a string
    if (habit.name && typeof habit.name !== 'string') {
      habit.name = String(habit.name)
    }
    return res.status(200).json({ habit })
  } catch (error) {
    console.error("Error in getHabit", error)
    res.status(500).json({ message: "System error" })
  }
}

export const updateHabit = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid habit id format" })
    }
    const updates = {}
    const allowed = ["name", "category", "goal", "iconName"]
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key]
    }

    const habit = await Habit.findOneAndUpdate({ _id: id, userId }, updates, {
      new: true,
      runValidators: true,
      lean: true,
    })
    if (!habit) return res.status(404).json({ message: "Habit not found" })
    // Ensure name is always a string
    if (habit.name && typeof habit.name !== 'string') {
      habit.name = String(habit.name)
    }
    return res.status(200).json({ habit })
  } catch (error) {
    console.error("Error in updateHabit", error)
    res.status(500).json({ message: "System error" })
  }
}

export const deleteHabit = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid habit id format" })
    }
    const result = await Habit.deleteOne({ _id: id, userId })
    if (!result.deletedCount) return res.status(404).json({ message: "Habit not found" })
    return res.sendStatus(204)
  } catch (error) {
    console.error("Error in deleteHabit", error)
    res.status(500).json({ message: "System error" })
  }
}

export const toggleHabit = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid habit id format" })
    }
    const dateInput = req.body?.date ? new Date(req.body.date) : new Date()
    const dateStr = dateInput.toDateString()

    const habit = await Habit.findOne({ _id: id, userId })
    if (!habit) return res.status(404).json({ message: "Habit not found" })

    const exists = habit.completedDates.includes(dateStr)
    if (exists) {
      habit.completedDates = habit.completedDates.filter((d) => d !== dateStr)
    } else {
      habit.completedDates = [...habit.completedDates, dateStr]
    }
    await habit.save()
    // Convert to plain object and ensure name is string
    const habitObj = habit.toObject()
    if (habitObj.name && typeof habitObj.name !== 'string') {
      habitObj.name = String(habitObj.name)
    }
    return res.status(200).json({ habit: habitObj })
  } catch (error) {
    console.error("Error in toggleHabit", error)
    res.status(500).json({ message: "System error" })
  }
}
