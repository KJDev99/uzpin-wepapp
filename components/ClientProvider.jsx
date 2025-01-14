"use client";

import { useEffect } from "react";
import i18n from "@/i18n";
import { I18nextProvider } from "react-i18next";

const ClientProvider = ({ children }) => {
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") || "uz";
    i18n.changeLanguage(storedLanguage);

    const telegram = window.Telegram.WebApp;
    alert(telegram.initDataUnsafe, "test telegram");
    alert(telegram.initData, "test telegram2");
  }, []);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default ClientProvider;
