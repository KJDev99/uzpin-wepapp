"use client";
import { useEffect, useState } from "react";

const TelegramApp = () => {
  const chatId = searchParams?.get("chat_id") || null;
  useEffect(() => {
    if (chat_id) {
      sessionStorage.setItem("userId", chatId);
    }
    if (typeof window !== "undefined" && window.Telegram) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      tg.themeParams;
      tg.expand();

      if (tg.initDataUnsafe?.user?.id) {
        sessionStorage.setItem("userId", tg.initDataUnsafe?.user?.id);
      }
    }
  }, []);
};

export default TelegramApp;
