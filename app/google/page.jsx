"use client";
import Loader from "@/components/Loader";
import axiosInstance from "@/libs/axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Google() {
  const rounter = useRouter();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const code = urlParams.get("code");

    const fetchBanners = async () => {
      try {
        const response = await axiosInstance.get(
          "client/auth/google/callback",
          {
            params: {
              code,
            },
          }
        );
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
}
