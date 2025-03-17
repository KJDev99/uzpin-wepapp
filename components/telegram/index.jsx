"use client";
import Loader from "@/components/Loader";
import axiosInstance from "@/libs/axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const TelegramPage1 = () => {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const id = urlParams.get("id");
    const firstName = urlParams.get("first_name");
    const lastName = urlParams.get("last_name");
    const username = urlParams.get("username");
    const photo_url = urlParams.get("photo_url");
    const auth_date = urlParams.get("auth_date");
    const hash = urlParams.get("hash");

    if (!id || !auth_date || !hash) {
      console.error("Required query parameters are missing!");
      return;
    }

    const fetchBanners = async () => {
      let referral = localStorage.getItem("referral");
      try {
        // Parametrlarni qo'shish
        const params = new URLSearchParams({
          id,
          first_name: firstName || "",
          last_name: lastName || "",
          username: username || "",
          photo_url: photo_url || "",
          auth_date,
          hash,
        });

        let url = `client/auth/telegram/login?${params.toString()}`;
        if (referral) {
          url = `client/auth/telegram/login?referral=${referral}&${params.toString()}`;
        }

        // URL'ni localStorage'ga saqlash
        localStorage.setItem("lastRequestURL", url);
        console.log("Saved Request URL:", url);

        // So‘rovni to‘g‘ridan-to‘g‘ri URL bilan yuborish
        const response = await axiosInstance.get(url);

        localStorage.setItem("profileData", JSON.stringify(response.data));
        router.push("/");
        setTimeout(() => {
          location.reload();
        }, 300);
      } catch (error) {
        console.error("Error during Telegram login:", error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div>
      <Loader />
    </div>
  );
};

export default TelegramPage1;
