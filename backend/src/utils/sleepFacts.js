/**
 * Sleep fun facts and tips
 * These can be expanded or moved to database later
 */

export const sleepFacts = [
  {
    icon: '🌙',
    title: 'Sleep Cycles',
    fact: 'A full sleep cycle takes about 90 minutes. Most people need 4-6 cycles per night for optimal rest.',
    category: 'science',
  },
  {
    icon: '⏰',
    title: 'Circadian Rhythm',
    fact: 'Your body has a natural 24-hour cycle. Going to bed at the same time helps regulate it and improves sleep quality.',
    category: 'science',
  },
  {
    icon: '💤',
    title: 'Deep Sleep',
    fact: 'Deep sleep happens in the first half of the night. It\'s crucial for physical recovery and immune function.',
    category: 'science',
  },
  {
    icon: '🧠',
    title: 'REM Sleep',
    fact: 'REM sleep increases as the night progresses. It\'s when most dreaming occurs and helps with memory consolidation.',
    category: 'science',
  },
  {
    icon: '📊',
    title: 'Sleep Debt',
    fact: 'You can\'t fully "catch up" on lost sleep, but consistent good sleep helps maintain balance and recovery.',
    category: 'health',
  },
  {
    icon: '🌡️',
    title: 'Temperature',
    fact: 'Your body temperature drops during sleep. A cool room (65-68°F or 18-20°C) promotes better sleep quality.',
    category: 'tips',
  },
  {
    icon: '📱',
    title: 'Blue Light',
    fact: 'Blue light from screens can delay sleep by suppressing melatonin. Try avoiding screens 1 hour before bed.',
    category: 'tips',
  },
  {
    icon: '☕',
    title: 'Caffeine',
    fact: 'Caffeine has a half-life of 5-6 hours. Avoid it at least 6 hours before bedtime for better sleep.',
    category: 'tips',
  },
  {
    icon: '🧘',
    title: 'Relaxation',
    fact: 'A relaxing bedtime routine signals your body it\'s time to sleep. Try reading, meditation, or gentle stretching.',
    category: 'tips',
  },
  {
    icon: '🛏️',
    title: 'Bedroom Environment',
    fact: 'Keep your bedroom dark, quiet, and cool. These conditions help your body enter deep sleep faster.',
    category: 'tips',
  },
  {
    icon: '⏳',
    title: 'Sleep Latency',
    fact: 'It typically takes 10-20 minutes to fall asleep. If it takes much longer, consider adjusting your routine.',
    category: 'health',
  },
  {
    icon: '🌅',
    title: 'Morning Light',
    fact: 'Exposure to natural light in the morning helps reset your circadian rhythm and improves sleep at night.',
    category: 'tips',
  },
];

/**
 * Get a random sleep fact
 * @param {string} category - Optional category filter
 * @returns {Object} Sleep fact object
 */
export const getRandomSleepFact = (category = null) => {
  let facts = sleepFacts;
  if (category) {
    facts = sleepFacts.filter(f => f.category === category);
  }
  if (facts.length === 0) {
    facts = sleepFacts;
  }
  return facts[Math.floor(Math.random() * facts.length)];
};

/**
 * Get all sleep facts
 * @returns {Array} All sleep facts
 */
export const getAllSleepFacts = () => {
  return sleepFacts;
};

