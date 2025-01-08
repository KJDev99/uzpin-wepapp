"use client";

import axiosInstance from "@/libs/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const HeaderSwiper = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState([]);
  const bot = searchParams?.get("bot") || null;

  useEffect(() => {
    const fetchBanner = async () => {
      if (!bot) {
        console.error("Bot ID mavjud emas");
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/client/webapp/banner/${bot}`
        );
        setData(response.data || []);
        console.log(response.data);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      }
    };

    fetchBanner();
  }, [bot]);

  return (
    <div className="mx-auto w-full">
      <div className="bg_hero"></div>
    </div>
  );
};

export default HeaderSwiper;
