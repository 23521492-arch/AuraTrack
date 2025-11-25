export const calculateMoodStats = (moods = []) => {
  if (!moods || moods.length === 0) {
    return {
      total: 0,
      averageScore: 0,
      distribution: {
        veryHigh: 0,
        high: 0,
        neutral: 0,
        low: 0,
        veryLow: 0,
      },
      topTags: [],
    };
  }

  const total = moods.length;
  
  const sum = moods.reduce((acc, m) => acc + (m.score || 0), 0);
  const averageScore = total > 0 ? sum / total : 0;

  const distribution = {
    veryHigh: moods.filter(m => m.score >= 8).length,
    high: moods.filter(m => m.score >= 6 && m.score < 8).length,
    neutral: moods.filter(m => m.score >= 4 && m.score < 6).length,
    low: moods.filter(m => m.score >= 2 && m.score < 4).length,
    veryLow: moods.filter(m => m.score < 2).length,
  };

  const allTags = moods.flatMap(m => m.tags || []);
  const tagCounts = {};
  allTags.forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  
  const topTags = Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5

  return {
    total,
    averageScore: Math.round(averageScore * 10) / 10,
    distribution,
    topTags,
  };
};

/**
 * Get mood trend for last N days
 * @param {Array} moods - Array of mood objects
 * @param {number} days - Number of days (default: 7)
 * @returns {Array} Array of { date, score } objects
 */
export const getMoodTrend = (moods = [], days = 7) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const trend = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const moodEntry = moods.find(m => {
      const moodDate = new Date(m.date);
      moodDate.setHours(0, 0, 0, 0);
      return moodDate.getTime() === date.getTime();
    });
    
    trend.push({
      date: date.toISOString(),
      score: moodEntry ? moodEntry.score : null,
      hasData: !!moodEntry,
    });
  }
  
  return trend;
};

