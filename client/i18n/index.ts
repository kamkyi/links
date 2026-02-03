import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./locales/en.json";
import th from "./locales/th.json";
import my from "./locales/my.json";

const resources = {
  en: { translation: en },
  th: { translation: th },
  my: { translation: my },
};

const getInitialLanguage = (): string => {
  const deviceLang = Localization.getLocales()[0]?.languageCode;
  if (deviceLang && ["en", "th", "my"].includes(deviceLang)) {
    return deviceLang;
  }
  return "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v4",
});

export default i18n;
