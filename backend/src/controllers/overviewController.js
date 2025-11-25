import Mood from "../models/Mood.js"
import Journal from "../models/Journal.js"
import Habit from "../models/Habit.js"
import Sleep from "../models/Sleep.js"
import { getMoodTrend } from "../utils/moodStatistics.js"
import { calculateStreak, isCompletedToday, calculateOverallStreak } from "../utils/streakCalculator.js"
import { mapCategoryToIcon } from "../utils/habitMapper.js"

export const getOverview = async (req, res) => {
  try {
    const userId = req.user?._id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    // Get last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(23, 59, 59, 999)

    // Fetch data in parallel
    const [moods, journals, habits, sleeps] = await Promise.all([
      Mood.find({
        userId,
        date: { $gte: sevenDaysAgo, $lte: today }
      }).sort({ date: -1 }),
      Journal.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5),
      Habit.find({ userId }),
      Sleep.find({
        userId,
        date: { $gte: sevenDaysAgo, $lte: today }
      }).sort({ date: -1 }),
    ])
    
    // For streak calculation, we need ALL moods (not just last 7 days)
    // to accurately calculate consecutive days from today backwards
    const allMoods = await Mood.find({ userId }).sort({ date: -1 })

    const moodData = getMoodTrend(moods, 7)

    const activities = []

    // Add recent mood entries
    moods
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
      .forEach(mood => {
        const moodLabels = {
          1: 'Very Low',
          2: 'Low',
          3: 'Neutral',
          4: 'Good',
          5: 'Great',
        }
        const level = Math.ceil(mood.score / 2)
        activities.push({
          type: 'mood',
          text: `Logged mood: ${moodLabels[level] || 'Neutral'}`,
          date: mood.date,
          color: 'bg-[#D97757]',
        })
      })

    // Add recent journal entries
    journals.forEach(journal => {
      const journalObj = journal.toObject ? journal.toObject() : journal
      const contentPreview = journalObj.content 
        ? (journalObj.content.length > 30 ? journalObj.content.substring(0, 30) + '...' : journalObj.content)
        : 'Untitled'
      activities.push({
        type: 'journal',
        text: `Journal entry: ${contentPreview}`,
        date: journalObj.createdAt || journalObj.date,
        color: 'bg-[#78716C]',
      })
    })

    // Add recent habit completions
    habits.forEach(habit => {
      if (habit.completedDates && habit.completedDates.length > 0) {
        const sortedDates = habit.completedDates
          .map(d => new Date(d))
          .filter(d => !isNaN(d.getTime()))
          .sort((a, b) => b - a)
        
        if (sortedDates.length > 0) {
          activities.push({
            type: 'habit',
            text: `Completed: ${habit.name}`,
            date: sortedDates[0],
            color: 'bg-[#5E8B7E]',
          })
        }
      }
    })

    // Sort activities by date and take top 5
    activities.sort((a, b) => new Date(b.date) - new Date(a.date))
    const recentActivities = activities.slice(0, 5)

    // Calculate overall streak from mood logs and habit completions
    // Streak rules:
    // - Log mood = day completed
    // - Complete all habits = day completed  
    // - Day is completed if: has mood log OR all habits completed
    const overallStreak = calculateOverallStreak(allMoods, habits)
    
    // Calculate stats
    const completedToday = habits.filter(h => isCompletedToday(h.completedDates)).length

    // Transform habits with streak and completed
    const transformedHabits = habits.map(habit => {
      const habitObj = habit.toObject()
      habitObj.streak = calculateStreak(habit.completedDates || [])
      habitObj.completed = isCompletedToday(habit.completedDates || [])
      
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
      moodData,
      activities: recentActivities,
      stats: {
        totalHabits: habits.length,
        completedToday,
        streak: overallStreak,
      },
      habits: transformedHabits,
    })
  } catch (error) {
    console.error("Error in getOverview", error)
    res.status(500).json({ message: "System error" })
  }
}

