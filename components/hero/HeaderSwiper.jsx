"use client";

import axiosInstance from "@/libs/axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../Loader";

const HeaderSwiper = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const bot = searchParams?.get("bot") || null;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      setLoading(true);
      if (!bot) {
        return;
      }

      try {
        const response = await axiosInstance.get(
          `/client/webapp/banner/${bot}`
        );
        setData(response.data || null);
        console.log(response.data);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [bot]);

  if (loading) {
    return <Loader />;
  }

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
