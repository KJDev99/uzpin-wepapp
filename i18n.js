"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "./locales/ru/translation.json";
import uz from "./locales/uz/translation.json";
import en from "./locales/en/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    ru: {
      translation: ru,
    },
    uz: {
      translation: uz,
    },
    en: {
      translation: en,
    },
  },
  lng: "uz",
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
