"use client";
import Loader from "@/components/Loader";
import axiosInstance from "@/libs/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TelegramPage = () => {
  const rounter = useRouter();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const id = urlParams.get("id");
    const firstName = urlParams.get("first_name");
    const lastName = urlParams.get("last_name");
    const username = urlParams.get("username");
    const photo_url = urlParams.get("photo_url");
    const auth_date = urlParams.get("auth_date");
    const hash = urlParams.get("hash");

    const fetchBanners = async () => {
      try {
        const response = await axiosInstance.get("client/auth/telegram/login", {
          params: {
            id,
            first_name: firstName,
            last_name: lastName,
            username,
            photo_url,
            auth_date,
            hash,
          },
        });
        localStorage.setItem("profileData", JSON.stringify(response.data));
        rounter.push("/");
        setTimeout(() => {
          location.reload();
        }, 300);
      } catch (error) {
        console.error("Error fetching slides:", error);
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

export default TelegramPage;
