/**
 * Seed facts data for database
 * Run this once to populate the Fact collection
 */

import Fact from "../models/Fact.js"

export const allFacts = [
  // Sleep Facts (from sleepFacts.js)
  {
    icon: '🌙',
    title: 'Sleep Cycles',
    fact: 'A full sleep cycle takes about 90 minutes. Most people need 4-6 cycles per night for optimal rest.',
    category: 'sleep',
  },
  {
    icon: '⏰',
    title: 'Circadian Rhythm',
    fact: 'Your body has a natural 24-hour cycle. Going to bed at the same time helps regulate it and improves sleep quality.',
    category: 'sleep',
  },
  {
    icon: '💤',
    title: 'Deep Sleep',
    fact: 'Deep sleep happens in the first half of the night. It\'s crucial for physical recovery and immune function.',
    category: 'sleep',
  },
  {
    icon: '🧠',
    title: 'REM Sleep',
    fact: 'REM sleep increases as the night progresses. It\'s when most dreaming occurs and helps with memory consolidation.',
    category: 'sleep',
  },
  {
    icon: '📊',
    title: 'Sleep Debt',
    fact: 'You can\'t fully "catch up" on lost sleep, but consistent good sleep helps maintain balance and recovery.',
    category: 'sleep',
  },
  {
    icon: '🌡️',
    title: 'Temperature',
    fact: 'Your body temperature drops during sleep. A cool room (65-68°F or 18-20°C) promotes better sleep quality.',
    category: 'sleep',
  },
  {
    icon: '📱',
    title: 'Blue Light',
    fact: 'Blue light from screens can delay sleep by suppressing melatonin. Try avoiding screens 1 hour before bed.',
    category: 'sleep',
  },
  {
    icon: '☕',
    title: 'Caffeine',
    fact: 'Caffeine has a half-life of 5-6 hours. Avoid it at least 6 hours before bedtime for better sleep.',
    category: 'sleep',
  },
  {
    icon: '🧘',
    title: 'Relaxation',
    fact: 'A relaxing bedtime routine signals your body it\'s time to sleep. Try reading, meditation, or gentle stretching.',
    category: 'sleep',
  },
  {
    icon: '🛏️',
    title: 'Bedroom Environment',
    fact: 'Keep your bedroom dark, quiet, and cool. These conditions help your body enter deep sleep faster.',
    category: 'sleep',
  },
  {
    icon: '⏳',
    title: 'Sleep Latency',
    fact: 'It typically takes 10-20 minutes to fall asleep. If it takes much longer, consider adjusting your routine.',
    category: 'sleep',
  },
  {
    icon: '🌅',
    title: 'Morning Light',
    fact: 'Exposure to natural light in the morning helps reset your circadian rhythm and improves sleep at night.',
    category: 'sleep',
  },
  
  // Wellness Facts (from OverviewPage fallback)
  {
    icon: '🌱',
    title: 'Growth Mindset',
    fact: 'Your brain creates new neural pathways every time you learn something new. Every day is a chance to grow!',
    category: 'wellness',
  },
  {
    icon: '💚',
    title: 'Self-Care Matters',
    fact: 'Taking just 5 minutes for yourself can reduce stress by up to 50%. Small moments add up to big changes.',
    category: 'wellness',
  },
  {
    icon: '✨',
    title: 'Progress Over Perfection',
    fact: 'Consistency beats intensity. Small daily actions create lasting transformation more than occasional big efforts.',
    category: 'wellness',
  },
  {
    icon: '🌙',
    title: 'Rest is Productive',
    fact: 'Quality sleep improves memory, creativity, and emotional regulation. Rest is not laziness—it\'s restoration.',
    category: 'wellness',
  },
  {
    icon: '💭',
    title: 'Emotions are Data',
    fact: 'Your feelings are messengers, not enemies. Understanding them helps you respond, not just react.',
    category: 'wellness',
  },
  
  // 10 New Facts
  {
    icon: '🧘',
    title: 'Mindful Breathing',
    fact: 'Just 5 minutes of deep breathing can activate your parasympathetic nervous system, reducing stress and anxiety significantly.',
    category: 'wellness',
  },
  {
    icon: '🌿',
    title: 'Nature Connection',
    fact: 'Spending time in nature, even just 20 minutes, can lower cortisol levels and improve your mood. Your brain needs green spaces.',
    category: 'wellness',
  },
  {
    icon: '💧',
    title: 'Hydration & Mood',
    fact: 'Even mild dehydration can affect your mood and cognitive function. Your brain is 75% water—keep it hydrated!',
    category: 'wellness',
  },
  {
    icon: '🎯',
    title: 'Small Wins Matter',
    fact: 'Celebrating small achievements releases dopamine, creating positive reinforcement loops that build lasting habits.',
    category: 'habits',
  },
  {
    icon: '🔄',
    title: 'Habit Stacking',
    fact: 'Linking new habits to existing ones makes them 3x more likely to stick. Your brain loves patterns and routines.',
    category: 'habits',
  },
  {
    icon: '📝',
    title: 'Journaling Benefits',
    fact: 'Writing about your emotions for just 15 minutes can improve mental clarity and reduce symptoms of anxiety and depression.',
    category: 'mood',
  },
  {
    icon: '🤝',
    title: 'Social Connection',
    fact: 'Strong social connections are as important for longevity as not smoking. Your relationships are medicine.',
    category: 'wellness',
  },
  {
    icon: '🎨',
    title: 'Creative Expression',
    fact: 'Engaging in creative activities, even briefly, can reduce stress and improve problem-solving abilities. Art is therapy.',
    category: 'wellness',
  },
  {
    icon: '🚶',
    title: 'Movement & Mental Health',
    fact: 'Just 10 minutes of walking can boost your mood and energy. Movement is medicine for both body and mind.',
    category: 'wellness',
  },
  {
    icon: '🌞',
    title: 'Sunlight & Serotonin',
    fact: 'Sunlight exposure helps your body produce serotonin, the "feel-good" hormone. Morning light is especially powerful.',
    category: 'wellness',
  },
]

/**
 * Seed facts to database
 * @returns {Promise<void>}
 */
export const seedFacts = async () => {
  try {
    // Check if facts already exist
    const existingCount = await Fact.countDocuments()
    if (existingCount > 0) {
      console.log(`Facts already exist (${existingCount} facts). Skipping seed.`)
      return
    }
    
    // Insert all facts
    const facts = await Fact.insertMany(allFacts)
    console.log(`✅ Seeded ${facts.length} facts to database`)
    return facts
  } catch (error) {
    console.error('Error seeding facts:', error)
    throw error
  }
}

/**
 * Get all facts (for migration or reference)
 * @returns {Array} All facts
 */
export const getAllFacts = () => {
  return allFacts
}

