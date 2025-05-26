/**
 * Format a date in a human-readable format
 * @param {string|Date} date - The date to format
 * @param {string} format - The format to use ('full', 'monthYear', 'short')
 * @returns {string} The formatted date
 */
export const formatDate = (date, format = 'full') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  const options = {
    full: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYear: { year: 'numeric', month: 'long' },
    short: { year: 'numeric', month: 'short' }
  };
  
  return dateObj.toLocaleDateString('en-US', options[format] || options.full);
};

/**
 * Format currency values
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'IDR')
 * @returns {string} The formatted currency
 */
export const formatCurrency = (amount, currency = 'IDR') => {
  if (!amount && amount !== 0) return '';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Truncate text to a specified length and add ellipsis
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  
  return text.slice(0, length) + '...';
};

/**
 * Calculate time elapsed since a given date
 * @param {string|Date} date - The date to calculate from
 * @returns {string} Time elapsed in a human-readable format
 */
export const timeAgo = (date) => {
  if (!date) return '';
  
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago';
  }
  
  return Math.floor(seconds) + ' seconds ago';
};

/**
 * Capitalize the first letter of each word in a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Generate a random ID
 * @param {number} length - The length of the ID
 * @returns {string} A random ID
 */
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

/**
 * Extract image filename from a URL or path
 * @param {string} url - The URL or path containing the image filename
 * @returns {string} The extracted filename
 */
export const extractFilename = (url) => {
  if (!url) return '';
  
  return url.split('/').pop();
};