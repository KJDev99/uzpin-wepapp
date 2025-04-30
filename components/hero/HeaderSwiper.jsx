"use client";

import axiosInstance from "@/libs/axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Loader from "../Loader";

const HeaderSwiper = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [devMode, setDevMode] = useState(null);
  const bot = searchParams?.get("bot");
  const dev_mode = searchParams?.get("dev_mode");

  const devMode1 = useMemo(() => {
    if (!bot) return null;

    const match = bot.match(/dev_mode=(.*)/);
    return match ? match[1] : null;
  }, [bot]);
  console.log(devMode1);
  // useEffect(() => {
  //   if (bot) {
  //     const decoded = decodeURIComponent(bot);

  //     const queryString = decoded.split("?")[1];
  //     console.log(queryString);
  //     if (queryString) {
  //       const nestedParams = new URLSearchParams(queryString);
  //       const dev_mode = nestedParams.get("dev_mode");
  //       setDevMode(dev_mode);
  //     } else {
  //       console.warn("No query string found after '?' in decoded bot");
  //     }
  //   }
  // }, [bot]);

  // useEffect(() => {
  //   const loginUser = async () => {
  //     if (!devMode) return; // devMode mavjud bo‘lmasa so‘rov yuborma
  //     try {
  //       const response = await axiosInstance.post(
  //         `client/auth/telegram/login-new/`,
  //         {
  //           dev_mode: devMode,
  //         }
  //       );
  //       localStorage.setItem("profileData", JSON.stringify(response.data));
  //     } catch (error) {
  //       console.error("Xatolik yuz berdi:", error);
  //     }
  //   };

  //   loginUser();
  // }, [devMode]);

  useEffect(() => {
    const loginUser = async () => {
      if (!devMode1) return; // devMode mavjud bo‘lmasa so‘rov yuborma
      try {
        const response = await axiosInstance.post(
          `client/auth/telegram/login-new/`,
          {
            dev_mode: devMode1,
          }
        );
        localStorage.setItem("profileData", JSON.stringify(response.data));
      } catch (error) {
        setDevError(true);
        setMessage(error.response.data.error);
        if (!devMode) return;
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
      {devError && (
        <Alert
          onClose={() => {
            setDevError(false);
          }}
          status={400}
          title="Error"
          message={message}
        />
      )}
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
