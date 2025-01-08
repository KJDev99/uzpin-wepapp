"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const HeaderSwiper = () => {
  const params = useParams();
  const { id } = params;
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axiosInstance.get(`/client/webapp/banner/${id}`);
        setData(response.data || []);
        console.log(response.data);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      }
    };
    fetchBanner();
    console.log(params, "params");
    console.log(id, "id");
  }, []);
  return (
    <div className="mx-auto w-full">
      <div className="bg_hero"></div>
    </div>
  );
};

export default HeaderSwiper;
