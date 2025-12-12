import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi }
};

// Get saved language or detect from browser
const getSavedLanguage = () => {
  const saved = localStorage.getItem('language');
  if (saved && ['en', 'hi'].includes(saved)) {
    return saved;
  }
  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  return ['en', 'hi'].includes(browserLang) ? browserLang : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Save language preference when changed
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
  // Update direction for RTL languages if needed in future
  document.documentElement.dir = 'ltr';
});

export default i18n;
