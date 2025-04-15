"use client";

import axiosInstance from "@/libs/axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../Loader";

const HeaderSwiper = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [devMode, setDevMode] = useState(null);
  const bot = searchParams?.get("bot");

  useEffect(() => {
    if (bot) {
      const decoded = decodeURIComponent(bot);
      console.log("Decoded bot:", decoded);

      const queryString = decoded.split("?")[1];
      if (queryString) {
        const nestedParams = new URLSearchParams(queryString);
        const dev_mode = nestedParams.get("dev_mode");
        console.log("dev_mode:", dev_mode);
        setDevMode(dev_mode);
      } else {
        console.warn("No query string found after '?' in decoded bot");
      }
    }
  }, [bot]);

  useEffect(() => {
    const loginUser = async () => {
      if (!devMode) return; // devMode mavjud bo‘lmasa so‘rov yuborma

      try {
        const response = await axiosInstance.post(
          `client/auth/telegram/login-new/`,
          {
            dev_mode: devMode,
          }
        );
        localStorage.setItem("profileData", JSON.stringify(response.data));
      } catch (error) {
        console.error("Xatolik yuz berdi:", error);
      }
    };

    loginUser();
  }, [devMode]);

  useEffect(() => {
    if (!bot) return;
    sessionStorage.setItem("bot", bot);
  }, []);

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
