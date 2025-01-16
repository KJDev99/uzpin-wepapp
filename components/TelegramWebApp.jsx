"use client";
import { useEffect, useState } from "react";

const TelegramApp = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      tg.themeParams;
      tg.expand();

      console.log(tg.initDataUnsafe?.user.id, "testapp");
      sessionStorage.setItem("userId", tg.initDataUnsafe?.user.id);
    }
  }, []);
};

export default TelegramApp;
