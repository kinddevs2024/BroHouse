import { createContext, useContext, useState, useEffect } from "react";
import { mapBrowserLangToGoogleLang } from "../utils/translate";

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Function to detect browser language and map to Google Translate language code
const detectBrowserLanguage = () => {
  if (typeof window === "undefined") return "uz";

  // Get browser language(s)
  const browserLang = navigator.language || navigator.userLanguage;
  const browserLangs = navigator.languages || [browserLang];

  // Check all browser languages and map to Google Translate code
  for (const lang of browserLangs) {
    const googleLang = mapBrowserLangToGoogleLang(lang);
    if (googleLang) {
      return googleLang;
    }
  }

  // Default to Uzbek if no match found
  return "uz";
};

export const LanguageProvider = ({ children }) => {
  // Now using Google Translate language codes (e.g., 'uz', 'ru', 'en', 'fr', etc.)
  const [language, setLanguage] = useState(() => {
    // First, check if user has saved a language preference
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      return savedLanguage;
    }

    // If no saved preference, detect from browser
    const detectedLanguage = detectBrowserLanguage();
    
    // Save detected language to localStorage for future visits
    localStorage.setItem("language", detectedLanguage);
    
    return detectedLanguage;
  });

  // Initialize language detection on mount (only if no saved preference)
  useEffect(() => {
    // This effect runs only once on mount
    const savedLanguage = localStorage.getItem("language");
    
    // Only auto-detect if saved language is missing
    if (!savedLanguage) {
      const detectedLanguage = detectBrowserLanguage();
      // Only update if different from current (to avoid unnecessary re-renders)
      if (detectedLanguage !== language) {
        setLanguage(detectedLanguage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  useEffect(() => {
    // Save language to localStorage whenever it changes
    localStorage.setItem("language", language);
    // Update document language attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const changeLanguage = (lang) => {
    // Accept any valid language code (200+ languages supported)
    if (lang && typeof lang === "string" && lang.length >= 2) {
      setLanguage(lang);
    }
  };

  const value = {
    language, // Now returns Google Translate language code (e.g., 'uz', 'ru', 'en')
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

