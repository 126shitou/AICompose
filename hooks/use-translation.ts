import { useCallback, useState, createContext, useContext } from 'react';

interface TranslationHook {
  t: (key: string, fallback: string) => string;
}

interface LanguageHook {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageHook>({
  language: 'en',
  setLanguage: () => {},
});

export function useLanguage(): LanguageHook {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslation(): TranslationHook {
  const t = useCallback((key: string, fallback: string) => {
    // For now, return the fallback text
    // This can be expanded later to support actual translations
    return fallback;
  }, []);

  return { t };
}