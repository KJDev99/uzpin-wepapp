"use client";
import Loader from "@/components/Loader";
import axiosInstance from "@/libs/axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const TelegramPage1 = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

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
      const referral = typeof window !== "undefined" ? window.localStorage.getItem("referral") : null;
      try {
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

        if (typeof window !== "undefined") {
          window.localStorage.setItem("lastRequestURL", url);
        }

        const response = await axiosInstance.get(url);

        if (typeof window !== "undefined") {
          window.localStorage.setItem("profileData", JSON.stringify(response.data));
        }

        router.push("/");

        if (typeof window !== "undefined") {
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }
      } catch (error) {
        console.error("Error during Telegram login:", error);
      }
    };

    fetchBanners();
  }, [router]);

  return (
    <div>
      <Loader />
    </div>
  );
};

export default TelegramPage1;
