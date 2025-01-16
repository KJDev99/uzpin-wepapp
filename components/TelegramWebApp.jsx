"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const TelegramApp = () => {
  const searchParams = useSearchParams();
  const chatId = searchParams?.get("chat_id") || null;
  useEffect(() => {
    if (chatId || sessionStorage.getItem("chat_id")) {
      if (!chatId) return;
      sessionStorage.setItem("userId", chatId);
    } else if (typeof window !== "undefined" && window.Telegram) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      tg.themeParams;
      tg.expand();

      if (tg.initDataUnsafe) {
        sessionStorage.setItem("userId", tg.initDataUnsafe?.user.id);
      }
    }
  }, []);
};

export default TelegramApp;
