import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

const detectUiLanguage = () => {
  if (typeof navigator === "undefined") return "eng";
  const langs = navigator.languages && navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language].filter(Boolean);

  for (const lang of langs) {
    const lower = String(lang).toLowerCase();
    if (lower.startsWith("uz")) return "uzb";
    if (lower.startsWith("ru")) return "rus";
    if (lower.startsWith("en")) return "eng";
  }

  return "eng";
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => detectUiLanguage());

  useEffect(() => {
    setLanguage(detectUiLanguage());
    const intervalId = window.setInterval(() => {
      const next = detectUiLanguage();
      setLanguage((prev) => (prev === next ? prev : next));
    }, 2000);
    return () => window.clearInterval(intervalId);
  }, []);

  const changeLanguage = (lang) => {
    if (["rus", "eng", "uzb"].includes(lang)) {
      setLanguage(lang);
    }
  };

  const value = {
    language,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
