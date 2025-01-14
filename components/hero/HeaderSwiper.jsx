"use client";

import axiosInstance from "@/libs/axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../Loader";

const HeaderSwiper = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const bot = searchParams?.get("bot") || null;

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
