/**
 * Map category to icon name
 * @param {string} category - Habit category
 * @param {string} iconName - Existing iconName (if any)
 * @returns {string} - Icon name
 */
export const mapCategoryToIcon = (category, iconName) => {
  if (iconName) return iconName;
  if (!category) return 'heart';

  const categoryToIcon = {
    'meditation': 'brain',
    'health': 'drop',
    'reading': 'book-open',
    'sleep': 'moon',
    'exercise': 'barbell',
    'wellness': 'heart',
    'productivity': 'lightbulb',
    'fitness': 'barbell',
    'creativity': 'camera',
    'learning': 'graduation',
    'social': 'phone',
    'general': 'heart',
  };

  return categoryToIcon[category.toLowerCase()] || 'heart';
};

