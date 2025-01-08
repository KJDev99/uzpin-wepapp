"use client";

import axiosInstance from "@/libs/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HeaderSwiper = () => {
  const router = useRouter();
  // const { bot } = router.query;
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axiosInstance.get(`/client/webapp/banner/`);
        setData(response.data || []);
        console.log(response.data);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      }
    };
    fetchBanner();
    console.log(router, "router");
  }, []);
  return (
    <div className="mx-auto w-full">
      <div className="bg_hero"></div>
    </div>
  );
};

export default HeaderSwiper;
