'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, fallback: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key, fallback) => fallback,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    // In a real implementation, this would load translations from a file or API
    // This is a simplified example with some placeholder translations
    const mockTranslations = {
      en: {
        'hero.title': 'NexusAI',
        'hero.subtitle': 'Experience the future of AI in one powerful platform',
        'hero.start': 'Start Creating',
        'hero.explore': 'Explore Features',
        'features.title': 'Explore Our AI Capabilities',
        'features.subtitle': 'Discover what you can create with our advanced AI technologies',
        'features.tryNow': 'Try Now',
        'nav.chat': 'Chat',
        'nav.image': 'Image',
        'nav.video': 'Video',
        'nav.music': 'Music',
        'nav.audio': 'Audio',
        'nav.create': 'Create',
        'nav.pricing': 'Pricing',
        'nav.login': 'Sign In',
      },
      zh: {
        'hero.title': 'NexusAI',
        'hero.subtitle': '在一个强大的平台体验AI的未来',
        'hero.start': '开始创作',
        'hero.explore': '探索功能',
        'features.title': '探索我们的AI功能',
        'features.subtitle': '发现您可以使用我们的先进AI技术创建什么',
        'features.tryNow': '立即尝试',
        'nav.chat': '对话',
        'nav.image': '图像',
        'nav.video': '视频',
        'nav.music': '音乐',
        'nav.audio': '音频',
        'nav.create': '创建',
        'nav.pricing': '定价',
        'nav.login': '登录',
      },
      // Additional languages would be added here
    };

    setTranslations(mockTranslations);

    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (Object.keys(mockTranslations).includes(browserLang)) {
      setLanguage(browserLang);
    }
  }, []);

  const t = (key: string, fallback: string): string => {
    return translations[language]?.[key] || fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguage = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  if (language === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return { language, setLanguage };
};