// utils/languageDetect.ts

export async function detectLanguage(text: string): Promise<string | null> {
  if (!text || text.trim().length < 3) {
    return null;
  }

  try {
    // First try to detect by character set as it's more reliable
    const charsetResult = detectByCharset(text);
    if (charsetResult) {
      return charsetResult;
    }

    // If no specific charset detected, try to detect if it's English using Free Dictionary API
    const isEnglish = await checkIfEnglish(text.split(/\s+/)[0]);
    if (isEnglish) {
      return 'en';
    }

    // If not English and no specific charset detected, use browser's language
    const browserLang = navigator.language.split('-')[0];
    return browserLang;

  } catch (error) {
    console.warn('Language detection warning:', error);
    return detectByCharset(text) || 'en'; // Fallback to charset detection or English
  }
}

async function checkIfEnglish(word: string): Promise<boolean> {
  try {
    // Use Free Dictionary API to check if the word exists in English
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`);
    return response.ok;
  } catch (error) {
    console.warn('Dictionary API check failed:', error);
    return false;
  }
}

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
