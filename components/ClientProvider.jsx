"use client";

import { useEffect } from "react";
import i18n from "@/i18n";
import { I18nextProvider } from "react-i18next";

const ClientProvider = ({ children }) => {
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "uz"; // Default to 'uz' if no language is stored
    i18n.changeLanguage(storedLanguage);
  }, []);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default ClientProvider;
