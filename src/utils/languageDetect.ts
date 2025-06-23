// utils/languageDetect.ts

// Debounce function that returns a promise
function debounce<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    return new Promise((resolve) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        const result = await func(...args);
        resolve(result);
      }, wait);
    });
  };
}

// Common English words to check first before making API calls
const commonEnglishWords = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  // Add more common words as needed
]);

// Cache for detected languages to avoid repeated API calls
const languageCache = new Map<string, string>();

export async function detectLanguage(text: string): Promise<string | null> {
  try {
    // Early return conditions
    if (!text) return null;
    const trimmedText = text.trim();
    if (trimmedText.length < 3) return null;

    // Check cache first
    const cacheKey = trimmedText.slice(0, 50); // Limit cache key length
    if (languageCache.has(cacheKey)) {
      return languageCache.get(cacheKey) || null;
    }

    // Split text into words and prepare for analysis
    const words = trimmedText
      .split(/\s+/)
      .filter(word => {
        // Filter out words that we know won't be in the dictionary
        if (word.length < 3) return false;
        if (/^[A-Z]/.test(word)) return false; // Skip proper nouns
        if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(word)) return false;
        return true;
      })
      .slice(0, 5); // Check up to 5 words

    if (words.length === 0) return null;

    // Check words in parallel to speed up the process
    const results = await Promise.all(
      words.map(word => checkIfEnglish(word))
    );

    const englishWordCount = results.filter(Boolean).length;
    const result = englishWordCount >= Math.ceil(words.length / 3) ? 'en' : null;

    // Cache the result
    languageCache.set(cacheKey, result || '');
    
    return result;
  } catch (error) {
    console.error('Language detection error:', error);
    return null;
  }
}

// Cache API responses
const apiCache = new Map<string, boolean>();

async function checkIfEnglish(word: string): Promise<boolean> {
  const originalWord = word.trim();
  const normalizedWord = originalWord.toLowerCase();
  
  // If the word is empty or just whitespace
  if (!normalizedWord) return false;
  
  // If it's a common English word, return true immediately
  if (commonEnglishWords.has(normalizedWord)) return true;
  
  // Check cache first
  if (apiCache.has(normalizedWord)) {
    return apiCache.get(normalizedWord) || false;
  }
  
  // Skip API call for:
  // 1. Words with numbers or special characters
  if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(normalizedWord)) return false;
  
  // 2. Words that are too short
  if (normalizedWord.length < 3) return false;
  
  // 3. Words that start with a capital letter (likely proper nouns)
  if (/^[A-Z]/.test(originalWord)) {
    apiCache.set(normalizedWord, false);
    return false;
  }
  
  // 4. Skip if word looks like a code snippet or technical term
  if (/^[_$]|[A-Z]{2,}/.test(originalWord)) {
    apiCache.set(normalizedWord, false);
    return false;
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(normalizedWord)}`
    );
    const result = response.ok;
    apiCache.set(normalizedWord, result);
    return result;
  } catch (error) {
    console.warn('Dictionary API check failed:', error);
    return false;
  }
}

// Create a debounced version of checkIfEnglish
const debouncedCheckIfEnglish = debounce(checkIfEnglish, 500);

// Export the debounced version
export { debouncedCheckIfEnglish as checkIfEnglish };

function detectByCharset(text: string): string | null {
  // Remove spaces, punctuation, and numbers
  const cleanText = text.replace(/[\s\p{P}0-9]/gu, '');
  
  if (!cleanText) return null;

  // Character set patterns for different languages
  const patterns = {
    zh: {
      pattern: /[\u4E00-\u9FFF]/,
      threshold: 0.5,  // 50% of characters should match
    },
    ja: {
      pattern: /[\u3040-\u309F\u30A0-\u30FF]/,
      threshold: 0.2,  // 20% of characters should match
    },
    ko: {
      pattern: /[\u3131-\u314E\u314F-\u3163\uAC00-\uD7A3]/,
      threshold: 0.3,  // 30% of characters should match
    },
    ar: {
      pattern: /[\u0600-\u06FF]/,
      threshold: 0.5,
    },
    hi: {
      pattern: /[\u0900-\u097F]/,
      threshold: 0.5,
    },
    th: {
      pattern: /[\u0E00-\u0E7F]/,
      threshold: 0.5,
    },
    he: {
      pattern: /[\u0590-\u05FF]/,
      threshold: 0.5,
    },
    ru: {
      pattern: /[\u0400-\u04FF]/,
      threshold: 0.5,
    },
    el: {
      pattern: /[\u0370-\u03FF]/,
      threshold: 0.5,
    }
  };

  // Count characters for each language pattern
  const counts: { [key: string]: number } = {};
  const total = cleanText.length;

  for (const [lang, { pattern }] of Object.entries(patterns)) {
    const matches = cleanText.match(new RegExp(pattern, 'g'));
    counts[lang] = matches ? matches.length / total : 0;
  }

  // Find the language with the highest character match ratio that meets the threshold
  for (const [lang, { threshold }] of Object.entries(patterns)) {
    if (counts[lang] >= threshold) {
      return lang;
    }
  }

  // If no specific pattern is found with high confidence, return null
  // This will allow the caller to try other detection methods
  return null;
}
