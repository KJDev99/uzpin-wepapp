"use client";

import axiosInstance from "@/libs/axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

const HeaderSwiper = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const bot = searchParams?.get("bot");

  function encodeToBase64(str) {
    const utf8Bytes = new TextEncoder().encode(str);
    const base64String = btoa(String.fromCharCode(...utf8Bytes));
    return base64String;
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const telegramWebApp = window?.Telegram?.WebApp;

    if (telegramWebApp && telegramWebApp.initDataUnsafe?.user) {
      const user = telegramWebApp.initDataUnsafe.user;
      const telegramId = user.id.toString();
      const fullName = `${user.first_name}${
        user.last_name ? " " + user.last_name : ""
      }`;
      const secretKey = "SIZNING_SECRET_KEY_BU_YERDA_BO‘LMASLIGI_KERAK";
      const combinedData = `${telegramId}:${fullName}:${secretKey}`;
      const encodedData = encodeToBase64(combinedData);

      const loginUser1 = async () => {
        try {
          const response = await axiosInstance.post(
            `client/auth/telegram/login-new/`,
            { dev_mode: encodedData }
          );
          localStorage.setItem("profileData", JSON.stringify(response.data));
        } catch (error) {
          console.error("Login xatoligi:", error);
        }
      };

      loginUser1();
    }
  }, []);

  const devMode1 = useMemo(() => {
    if (!bot) return null;
    const match = bot.match(/dev_mode=(.*)/);
    return match ? match[1] : null;
  }, [bot]);

  useEffect(() => {
    const loginUser = async () => {
      if (!devMode1) return;
      try {
        const response = await axiosInstance.post(
          `client/auth/telegram/login-new/`,
          { dev_mode: devMode1 }
        );
        localStorage.setItem("profileData", JSON.stringify(response.data));
      } catch (error) {
        console.error("DevMode orqali login xatoligi:", error);
      }
    };

    loginUser();
  }, [devMode1]);

  useEffect(() => {
    if (!bot) return;
    sessionStorage.setItem("bot", bot);
  }, [bot]);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const botValue = sessionStorage.getItem("bot");
        if (!botValue) return;
        const response = await axiosInstance.get(
          `/client/webapp/banner/${botValue}`
        );
        setData(response.data || null);
      } catch (error) {
        console.error("Banner yuklashda xatolik:", error);
      }
    };

    fetchBanner();
  }, []);

  return (
    <div className="mx-auto w-full">
      <div
        className="bg_hero"
        style={{
          background:
            data?.banner && `url(${data.banner}) center/cover no-repeat`,
        }}
      ></div>
    </div>
  );
};

export default HeaderSwiper;
