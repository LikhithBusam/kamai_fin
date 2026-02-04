// StoreBuddy UAE - Language Context
// Provides i18n support with RTL handling

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, t as translate, isRTL, getDirection, getFontFamily } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  fontFamily: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'storebuddy_language';

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Initialize from localStorage or default to English
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['en', 'ar', 'hi', 'ur'].includes(stored)) {
        return stored as Language;
      }
    }
    return 'en';
  });

  // Update document direction and lang when language changes
  useEffect(() => {
    document.documentElement.dir = getDirection(language);
    document.documentElement.lang = language;
    document.body.style.fontFamily = getFontFamily(language);
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string) => translate(key, language);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL: isRTL(language),
    direction: getDirection(language),
    fontFamily: getFontFamily(language),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Language options for the dropdown
export const languageOptions = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
] as const;

export default LanguageContext;
