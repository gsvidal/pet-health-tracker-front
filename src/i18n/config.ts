import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esTranslations from './locales/es.json';
import enTranslations from './locales/en.json';

// Detectar idioma del navegador o usar español por defecto
const getInitialLanguage = (): string => {
  const savedLanguage = localStorage.getItem('i18nextLng');
  if (savedLanguage) {
    return savedLanguage;
  }

  const browserLanguage = navigator.language.split('-')[0];
  return browserLanguage === 'en' ? 'en' : 'es';
};

i18n.use(initReactI18next).init({
  resources: {
    es: {
      translation: esTranslations,
    },
    en: {
      translation: enTranslations,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false, // React ya escapa valores
  },
});

export default i18n;
