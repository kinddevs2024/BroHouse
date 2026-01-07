// Google Translate API utility
// Uses free public endpoint: https://translate.googleapis.com/translate_a/single

/**
 * Translate text using Google Translate API
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'uz', 'ru', 'en')
 * @param {string} sourceLang - Source language code (default: 'auto')
 * @returns {Promise<string>} Translated text
 */
export const translateText = async (text, targetLang, sourceLang = 'auto') => {
  if (!text || !text.trim()) return text;
  
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Google Translate returns nested array structure
    if (data && data[0] && Array.isArray(data[0])) {
      const translatedText = data[0]
        .map(item => item[0])
        .filter(Boolean)
        .join('');
      return translatedText || text;
    }
    
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
};

/**
 * Translate multiple texts in batch
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLang - Target language code
 * @param {string} sourceLang - Source language code
 * @returns {Promise<string[]>} Array of translated texts
 */
export const translateBatch = async (texts, targetLang, sourceLang = 'auto') => {
  if (!texts || texts.length === 0) return [];
  
  try {
    // Join texts with a special separator
    const combinedText = texts.join(' ||| ');
    const translated = await translateText(combinedText, targetLang, sourceLang);
    
    // Split back into array
    return translated.split(' ||| ').map((text, index) => text || texts[index]);
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts; // Return original texts on error
  }
};

/**
 * Map browser language to Google Translate language code
 * @param {string} browserLang - Browser language code (e.g., 'uz-UZ', 'ru-RU')
 * @returns {string} Google Translate language code
 */
export const mapBrowserLangToGoogleLang = (browserLang) => {
  if (!browserLang) return 'uz';
  
  // Extract base language code
  const baseLang = browserLang.split('-')[0].toLowerCase();
  
  // Map common language codes to Google Translate codes
  const langMap = {
    'uz': 'uz',
    'ru': 'ru',
    'en': 'en',
    'ar': 'ar',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'it': 'it',
    'pt': 'pt',
    'tr': 'tr',
    'ja': 'ja',
    'ko': 'ko',
    'zh': 'zh',
    'hi': 'hi',
    'th': 'th',
    'vi': 'vi',
    'id': 'id',
    'pl': 'pl',
    'nl': 'nl',
    'sv': 'sv',
    'da': 'da',
    'fi': 'fi',
    'no': 'no',
    'cs': 'cs',
    'sk': 'sk',
    'hu': 'hu',
    'ro': 'ro',
    'bg': 'bg',
    'el': 'el',
    'he': 'he',
    'fa': 'fa',
    'uk': 'uk',
    'be': 'be',
    'kk': 'kk',
    'ky': 'ky',
    'az': 'az',
    'ka': 'ka',
    'hy': 'hy',
    'mn': 'mn',
    'ne': 'ne',
    'si': 'si',
    'my': 'my',
    'km': 'km',
    'lo': 'lo',
    'bn': 'bn',
    'ta': 'ta',
    'te': 'te',
    'ml': 'ml',
    'kn': 'kn',
    'gu': 'gu',
    'pa': 'pa',
    'mr': 'mr',
    'or': 'or',
    'as': 'as',
    'mai': 'mai',
    'sa': 'sa',
  };
  
  return langMap[baseLang] || baseLang || 'uz';
};

/**
 * Get all supported Google Translate language codes (200+ languages)
 * This is a comprehensive list of Google Translate supported languages
 */
export const getSupportedLanguages = () => {
  return [
    'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'ny', 'zh', 'zh-CN', 'zh-TW',
    'co', 'hr', 'cs', 'da', 'dv', 'nl', 'en', 'eo', 'et', 'tl', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu',
    'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'rw',
    'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne',
    'no', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so',
    'es', 'su', 'sw', 'sv', 'tg', 'ta', 'tt', 'te', 'th', 'tr', 'uk', 'ur', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo',
    'zu', 'he', 'jv', 'yi', 'zu'
  ];
};
