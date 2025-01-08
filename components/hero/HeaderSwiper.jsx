"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const HeaderSwiper = () => {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
    console.log(pathname, "pathname");
    console.log(searchParams, "searchParams");
  }, []);
  return (
    <div className="mx-auto w-full">
      <div className="bg_hero"></div>
    </div>
  );
};

export default HeaderSwiper;
