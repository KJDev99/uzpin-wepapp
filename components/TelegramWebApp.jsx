"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const TelegramApp = () => {
  const searchParams = useSearchParams();
  const chatId = searchParams?.get("chat_id") || null;

  useEffect(() => {
    if (typeof window !== "undefined") {
       if (chatId || sessionStorage.getItem("userId") || true) {
      // if (chatId || sessionStorage.getItem("userId")) {
        if (!chatId) return;
        sessionStorage.setItem("userId", chatId);
      } else if (window.Telegram) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.themeParams;
        tg.expand();

        if (tg.initDataUnsafe) {
          sessionStorage.setItem("userId", tg.initDataUnsafe?.user.id);
        }
      }
    }
  }, [chatId]); // chatId dependencyga қўшилди

  return null; // Компонент ҳеч нарса қайтармаса null қайтариш керак
};

export default TelegramApp;
