export const calculateStreak = (completedDates = []) => {
  if (!completedDates || completedDates.length === 0) return 0;

  const getDateString = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const uniqueDateStrings = new Set();
  completedDates.forEach(d => {
    try {
      const date = new Date(d);
      if (!isNaN(date.getTime())) {
        uniqueDateStrings.add(getDateString(date));
      }
    } catch (e) {}
  });

  if (uniqueDateStrings.size === 0) return 0;

  const sortedDateStrings = Array.from(uniqueDateStrings).sort();

  let streak = 0;
  
  for (let i = 0; i <= sortedDateStrings.length; i++) {
    const checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - i);
    const checkDateStr = getDateString(checkDate);
    
    if (sortedDateStrings.includes(checkDateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateOverallStreak = (moods = [], habits = []) => {
  const moodDates = new Set();
  moods.forEach(mood => {
    if (mood && mood.date) {
      try {
        const date = new Date(mood.date);
        if (!isNaN(date.getTime())) {
          date.setHours(0, 0, 0, 0);
          moodDates.add(date.toISOString().split('T')[0]);
        }
      } catch (e) {
      }
    }
  });

  const habitDatesMap = new Map();
  habits.forEach(habit => {
    if (habit && habit.completedDates && Array.isArray(habit.completedDates)) {
      habit.completedDates.forEach(dateStr => {
        try {
          const date = new Date(dateStr);
          
          if (!isNaN(date.getTime())) {
            date.setHours(0, 0, 0, 0);
            const dateKey = date.toISOString().split('T')[0];
            if (!habitDatesMap.has(dateKey)) {
              habitDatesMap.set(dateKey, new Set());
            }
            const habitId = habit._id?.toString() || habit.id?.toString() || String(habit._id) || String(habit.id);
            if (habitId) {
              habitDatesMap.get(dateKey).add(habitId);
            }
          }
        } catch (e) {
          console.warn('Invalid date in habit completedDates:', dateStr, e);
        }
      });
    }
  });

  const totalHabits = habits.length;

  const completedDates = new Set();

  moodDates.forEach(date => completedDates.add(date));

  if (totalHabits > 0) {
    habitDatesMap.forEach((completedHabitIds, dateKey) => {
      if (completedHabitIds.size === totalHabits) {
        completedDates.add(dateKey);
      }
    });
  }

  const completedDatesArray = Array.from(completedDates);
  return calculateStreak(completedDatesArray);
};

export const calculateOverallStreakFromHabits = (habits = []) => {
  if (!habits || habits.length === 0) return 0;

  const allDates = new Set();
  habits.forEach(habit => {
    if (habit.completedDates && Array.isArray(habit.completedDates)) {
      habit.completedDates.forEach(dateStr => {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          date.setHours(0, 0, 0, 0);
          allDates.add(date.toISOString().split('T')[0]);
        }
      });
    }
  });

  return calculateStreak(Array.from(allDates));
};

export const isCompletedToday = (completedDates = []) => {
  const today = new Date().toDateString();
  return completedDates.includes(today);
};

export const isDayCompleted = (date, moods = [], habits = []) => {
  const dateKey = new Date(date).toISOString().split('T')[0];
  
  const hasMood = moods.some(mood => {
    if (!mood.date) return false;
    const moodDate = new Date(mood.date).toISOString().split('T')[0];
    return moodDate === dateKey;
  });

  if (hasMood) return true;

  if (habits.length === 0) return false;

  const totalHabits = habits.length;
  let completedCount = 0;

  habits.forEach(habit => {
    if (habit.completedDates && Array.isArray(habit.completedDates)) {
      const isCompleted = habit.completedDates.some(dateStr => {
        const habitDate = new Date(dateStr).toISOString().split('T')[0];
        return habitDate === dateKey;
      });
      if (isCompleted) completedCount++;
    }
  });

  return completedCount === totalHabits;
};
