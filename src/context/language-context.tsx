
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dictionaries, Dictionary } from '@/dictionaries';

type Language = 'en' | 'fr' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  dictionary: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fr'); // Default to French
  const [dictionary, setDictionary] = useState<Dictionary>(dictionaries.fr);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language | null;
    if (storedLang && dictionaries[storedLang]) {
      setLanguageState(storedLang);
      setDictionary(dictionaries[storedLang]);
    }
    setIsInitialLoad(false);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    if (dictionaries[lang]) {
      localStorage.setItem('language', lang);
      setLanguageState(lang);
      setDictionary(dictionaries[lang]);
    }
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language, isInitialLoad]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
