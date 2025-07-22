// Utility functions for the JobFinder application

// Cache for exchange rates to avoid too many API calls
let exchangeRatesCache = {
    rates: null,
    timestamp: null,
    expiry: 1000 * 60 * 60, // 1 hour cache
};

/**
 * Fetch current exchange rates from API
 * @returns {Promise<Object>} Exchange rates object
 */
export const fetchExchangeRates = async () => {
    try {
        // Check if we have valid cached rates
        if (
            exchangeRatesCache.rates &&
            exchangeRatesCache.timestamp &&
            Date.now() - exchangeRatesCache.timestamp <
                exchangeRatesCache.expiry
        ) {
            return exchangeRatesCache.rates;
        }

        // Fetch fresh rates from API
        const response = await fetch(
            'https://api.exchangerate-api.com/v4/latest/USD'
        );

        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();

        // Cache the results
        exchangeRatesCache = {
            rates: data.rates,
            timestamp: Date.now(),
            expiry: 1000 * 60 * 60, // 1 hour
        };

        return data.rates;
    } catch (error) {
        console.warn(
            'Failed to fetch exchange rates, using fallback rates:',
            error
        );
        // Fallback to hardcoded rates if API fails
        return {
            USD: 1.0,
            EUR: 0.85, // Approximate fallback rates
            GBP: 0.73,
        };
    }
};

/**
 * Convert currency to USD for consistent storage
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - The currency to convert from
 * @returns {Promise<number>} Amount in USD
 */
export const convertToUSD = async (amount, fromCurrency) => {
    if (!amount || fromCurrency === 'USD') return amount;

    try {
        const rates = await fetchExchangeRates();

        // Convert from the source currency to USD
        // Since our API gives rates FROM USD, we need to divide by the rate to convert TO USD
        const usdAmount =
            fromCurrency === 'USD' ? amount : amount / rates[fromCurrency];

        return Math.round(usdAmount);
    } catch (error) {
        console.error('Currency conversion failed:', error);
        // Fallback conversion rates
        const fallbackRates = {
            EUR: 1.08,
            GBP: 1.26,
            USD: 1.0,
        };
        return Math.round(amount * (fallbackRates[fromCurrency] || 1));
    }
};

/**
 * Convert from USD to another currency
 * @param {number} usdAmount - The USD amount to convert
 * @param {string} toCurrency - The target currency
 * @returns {Promise<number>} Amount in target currency
 */
export const convertFromUSD = async (usdAmount, toCurrency) => {
    if (!usdAmount || toCurrency === 'USD') return usdAmount;

    try {
        const rates = await fetchExchangeRates();

        // Convert from USD to target currency
        const convertedAmount = usdAmount * rates[toCurrency];

        return Math.round(convertedAmount);
    } catch (error) {
        console.error('Currency conversion failed:', error);
        // Fallback conversion rates (FROM USD)
        const fallbackRates = {
            EUR: 0.85,
            GBP: 0.73,
            USD: 1.0,
        };
        return Math.round(usdAmount * (fallbackRates[toCurrency] || 1));
    }
};

/**
 * Get formatted exchange rates for display
 * @returns {Promise<Object>} Formatted exchange rates
 */
export const getFormattedExchangeRates = async () => {
    try {
        const rates = await fetchExchangeRates();

        return {
            'USD to EUR': `1 USD = ${rates.EUR?.toFixed(4)} EUR`,
            'USD to GBP': `1 USD = ${rates.GBP?.toFixed(4)} GBP`,
            'EUR to USD': `1 EUR = ${(1 / rates.EUR)?.toFixed(4)} USD`,
            'GBP to USD': `1 GBP = ${(1 / rates.GBP)?.toFixed(4)} USD`,
            lastUpdated: new Date().toLocaleString(),
        };
    } catch (error) {
        console.error('Failed to get exchange rates:', error);
        return {
            'USD to EUR': '1 USD = 0.8500 EUR (approx)',
            'USD to GBP': '1 USD = 0.7300 GBP (approx)',
            'EUR to USD': '1 EUR = 1.0800 USD (approx)',
            'GBP to USD': '1 GBP = 1.2600 USD (approx)',
            lastUpdated: 'Rates unavailable',
        };
    }
};

/**
 * Get currency symbol
 * @param {string} currency - The currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency) => {
    const symbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
    };
    return symbols[currency] || '$';
};

/**
 * Format currency values
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return 'Salary not specified';

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format date for display
 * @param {Date|string|Firebase Timestamp} date - The date to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    if (!date) return '';

    // Handle Firebase Timestamp
    const dateObj = date.toDate ? date.toDate() : new Date(date);

    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    return dateObj.toLocaleDateString('en-US', {
        ...defaultOptions,
        ...options,
    });
};

/**
 * Get relative time (e.g., "2 days ago")
 * @param {Date|string|Firebase Timestamp} date - The date to format
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    const dateObj = date.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }

    return 'Just now';
};

/**
 * Truncate text to specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length (default: 150)
 * @param {string} suffix - Suffix to add when truncated (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 150, suffix = '...') => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + suffix;
};

/**
 * Capitalize first letter of each word
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Get job type color class for Bootstrap badges
 * @param {string} jobType - The job type
 * @returns {string} Bootstrap color class
 */
export const getJobTypeColor = (jobType) => {
    const colorMap = {
        'full-time': 'success',
        'part-time': 'warning',
        freelance: 'info',
        contract: 'secondary',
        internship: 'primary',
        temporary: 'dark',
    };

    return colorMap[jobType?.toLowerCase()] || 'primary';
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Generate a URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
export const createSlug = (text) => {
    if (!text) return '';

    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

/**
 * Extract keywords from job description for search
 * @param {string} text - Text to extract keywords from
 * @returns {string[]} Array of keywords
 */
export const extractKeywords = (text) => {
    if (!text) return [];

    // Common stop words to exclude
    const stopWords = new Set([
        'a',
        'an',
        'and',
        'are',
        'as',
        'at',
        'be',
        'by',
        'for',
        'from',
        'has',
        'he',
        'in',
        'is',
        'it',
        'its',
        'of',
        'on',
        'that',
        'the',
        'to',
        'was',
        'were',
        'will',
        'with',
        'you',
        'your',
    ]);

    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
        .split(/\s+/) // Split by whitespace
        .filter((word) => word.length > 2 && !stopWords.has(word)) // Filter out short words and stop words
        .slice(0, 10); // Limit to first 10 keywords
};

/**
 * Calculate salary range from min and max values
 * @param {number} min - Minimum salary
 * @param {number} max - Maximum salary
 * @returns {string} Formatted salary range
 */
export const formatSalaryRange = (min, max) => {
    if (!min && !max) return 'Salary not specified';
    if (min && !max) return `${formatCurrency(min)}+`;
    if (!min && max) return `Up to ${formatCurrency(max)}`;
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
};

/**
 * Parse salary range string to min/max values
 * @param {string} range - Salary range string (e.g., "50000-80000")
 * @returns {object} Object with min and max properties
 */
export const parseSalaryRange = (range) => {
    if (!range) return { min: 0, max: Infinity };

    const rangeMap = {
        '0-30000': { min: 0, max: 30000 },
        '30000-50000': { min: 30000, max: 50000 },
        '50000-80000': { min: 50000, max: 80000 },
        '80000+': { min: 80000, max: Infinity },
    };

    return rangeMap[range] || { min: 0, max: Infinity };
};

/**
 * Local storage utilities
 */
export const storage = {
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage:`, error);
            return defaultValue;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage:`, error);
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage:`, error);
        }
    },

    clear: () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error(`Error clearing localStorage:`, error);
        }
    },
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
