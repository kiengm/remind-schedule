import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import viTranslation from './locales/vi.json';
import enTranslation from './locales/en.json';

export const SUPPORTED_LANGUAGES = ['vi', 'en'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

const STORAGE_KEY = 'app_lang';

export const getSavedLanguage = (): SupportedLanguage => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'vi' || saved === 'en') {
    return saved;
  }
  // Mặc định tiếng Việt
  return 'vi';
};

export const setAppLanguage = (lang: SupportedLanguage) => {
  localStorage.setItem(STORAGE_KEY, lang);
  i18n.changeLanguage(lang);
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: viTranslation },
      en: { translation: enTranslation },
    },
    lng: getSavedLanguage(),
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // React đã tự escape XSS
    },
  });

export default i18n;

