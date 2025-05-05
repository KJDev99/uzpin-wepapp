"use client";

import axiosInstance from "@/libs/axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Loader from "../Loader";

const HeaderSwiper = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const bot = searchParams?.get("bot");

  useEffect(() => {
    if (typeof window === "undefined") return; // Server side renderingdan himoya

    const telegramWebApp = window?.Telegram?.WebApp;

    if (telegramWebApp && telegramWebApp.initDataUnsafe?.user) {
      // Telegram foydalanuvchi ma'lumotlarini olish
      const user = telegramWebApp.initDataUnsafe.user;
      const telegramId = user.id.toString();
      const fullName = `${user.first_name}${
        user.last_name ? " " + user.last_name : ""
      }`;
      const secretKey =
        "django-insecure-m+8j64=s_8l8ykb36((5e@d^p(eh81h^k(pren3^_(y)r_33f8"; // Bu sizning server tomoningizdan berilishi kerak

      function encodeTelegramId(telegramId, fullName, secretKey) {
        const combined = `${telegramId}:${fullName}:${secretKey}`;
        const encryptedData = btoa(combined); // browser uchun
        return encryptedData;
      }

      const encodedData = encodeTelegramId(telegramId, fullName, secretKey);

      const loginUser1 = async () => {
        try {
          const response = await axiosInstance.post(
            `client/auth/telegram/login-new/`,
            {
              dev_mode: encodedData,
            }
          );
          try {
            localStorage.setItem("profileData", JSON.stringify(response.data));
          } catch (e) {
            console.error("LocalStorage xatosi:", e);
          }
        } catch (error) {
          console.log("Login xatosi:", error);
        }
      };

      loginUser1();
    } else {
      console.log(
        "Telegram ma'lumotlari mavjud emas, test ma'lumotlaridan foydalanilmoqda"
      );
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
          {
            dev_mode: devMode1,
          }
        );
        localStorage.setItem("profileData", JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      }
    };

    loginUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devMode1]);

  useEffect(() => {
    if (!bot) return;
    sessionStorage.setItem("bot", bot);
  }, [bot]);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axiosInstance.get(
          `/client/webapp/banner/${sessionStorage.getItem("bot")}`
        );
        setData(response.data || null);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      }
    };

    fetchBanner();
  }, []);

  return (
    <>
      <div className="mx-auto w-full">
        <div
          className="bg_hero"
          style={{
            background:
              data?.banner && `url(${data.banner}) center/cover no-repeat`,
          }}
        ></div>
      </div>
    </>
  );
};

export default HeaderSwiper;
