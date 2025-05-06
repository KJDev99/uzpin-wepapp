"use client";
import Loader from "@/components/Loader";
import axiosInstance from "@/libs/axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Google() {
  const router = useRouter(); // Исправлено с rounter на router

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      const fetchBanners = async () => {
        try {
          const response = await axiosInstance.get(
            "client/auth/google/callback",
            {
              params: {
                code,
                redirect_url: "https://webapp.uzpin.games/google",
              },
            }
          );
          localStorage.setItem("profileData", JSON.stringify(response.data));
          router.push("/");
          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.location.reload();
            }
          }, 300);
        } catch (error) {
          console.error("Error fetching slides:", error);
        }
      };

      fetchBanners();
    }
  }, [router]); // router добавлен в dependency array

  return (
    <div>
      <Loader />
    </div>
  );
}
