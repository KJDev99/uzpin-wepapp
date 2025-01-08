"use client";

import axiosInstance from "@/libs/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
const HeaderSwiper = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bot = searchParams.get("bot");
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchBanner = async () => {
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
    console.log(searchParams, "router");
  }, []);
  return (
    <div className="mx-auto w-full">
      <div className="bg_hero"></div>
    </div>
  );
};

export default HeaderSwiper;
