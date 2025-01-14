"use client";

import { useEffect } from "react";
import i18n from "@/i18n";
import { I18nextProvider } from "react-i18next";

const ClientProvider = ({ children }) => {
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "uz";
    i18n.changeLanguage(storedLanguage);

    const telegram = window.Telegram.WebApp;
    console.log(telegram.initDataUnsafe);
    console.log(telegram.initData);
  }, []);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default ClientProvider;
