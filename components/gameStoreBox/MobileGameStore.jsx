import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "@/libs/axios";
import { Alert } from "../Alert";
import { Toast } from "../Toast";
import { useTranslation } from "react-i18next";

const MobileGameStore = ({ cart }) => {
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [userName, setUserName] = useState(null); // Backenddan kelgan `name`ni saqlash
  const [buttonLabel, setButtonLabel] = useState("Tekshirish"); // Tugma uchun matn
  const [token, setToken] = useState(null);
  const [error2, setError] = useState(false);
  const [error1, setError1] = useState(false);
  const [error401, setError401] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileData = localStorage.getItem("profileData");
      if (storedProfileData) {
        const parsedProfileData = JSON.parse(storedProfileData);
        setToken(parsedProfileData?.access || null);
      }
    }
  }, []);

  const handleCheckUser = async () => {
    const formattedData = {
      user_id: userId,
      server_id: serverId,
    };
    try {
      const response = await axiosInstance.post(
        "/client/mobile-legands/check/user",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setUserName(response.data.username); // `name` qiymatini saqlash
        setButtonLabel("Sotib olish"); // Tugma matnini o'zgartirish
        setError1(false);
      }
    } catch (error) {
      setError1(true);
      console.error("Xatolik yuz berdi:", error);
    }
  };

  const fetchBuyHandle = async () => {
    const savedCurrency =
      typeof window !== "undefined"
        ? localStorage.getItem("currency") || "uzs"
        : "uzs";
    const formattedData = {
      currency: savedCurrency,
      user_id: userId,
      server_id: serverId,
      items: cart.map((item) => ({
        promocode: item.id,
        count: item.quantity,
      })),
    };
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/client/mobile-legands/buy/promocode",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
    } catch (error) {
      if (error.status == 401) {
        setError401(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
          onClose();
        }, 2000);
      }
    } finally {
      clear();
      if (isOpen == 2) {
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      }
      setLoading(false);
    }
  };
  const handleClose = () => {
    setSuccess(false);
    setError(false);
  };

  return (
    <div className="space-y-4">
      {error2 && (
        <Alert
          status={400}
          title={t("profile14")}
          message={t("profile15")}
          onClose={handleClose}
        />
      )}
      {error401 && (
        <Alert
          status={400}
          title={t("profile4011")}
          message={t("profile4012")}
        />
      )}
      {success && (
        <Alert
          status={200}
          title={t("profile16")}
          message={t("profile17")}
          onClose={handleClose}
        />
      )}
      {/* {success && (
        <Toast type="success" text={t("profile52")} onClose={handleClose} />
      )} */}
      <div className="space-y-2 flex justify-between items-center">
        <label
          htmlFor="userId"
          className="text-lg font-semibold max-sm:font-normal max-sm:text-base"
        >
          User ID
        </label>
        <input
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
          className="border border-[#E7E7E7] rounded-[5px] py-3 px-5 font-semibold outline-none max-sm:max-w-[163px]"
        />
      </div>
      <div className="space-y-2 flex justify-between items-center">
        <label
          htmlFor="serverId"
          className="text-lg font-semibold max-sm:font-normal max-sm:text-base"
        >
          Server ID
        </label>
        <input
          id="serverId"
          value={serverId}
          onChange={(e) => setServerId(e.target.value)}
          placeholder="Server ID"
          className="border border-[#E7E7E7] rounded-[5px] py-3 px-5 font-semibold outline-none max-sm:max-w-[163px]"
        />
      </div>
      <div className="flex flex-col items-center space-y-4">
        {userName && (
          <p className="text-green-600 font-medium">
            {t("mobile1")} {userName}
          </p>
        )}
        {error1 && <p className="text-red-600 font-medium">{t("mobile2")}</p>}
        <button
          disabled={userId.length === 0 || serverId.length === 0}
          onClick={
            buttonLabel === "Tekshirish" ? handleCheckUser : fetchBuyHandle
          }
          className={`w-full py-2 rounded text-black font-medium border-b-2 disabled:cursor-not-allowed ${
            buttonLabel === "Tekshirish"
              ? "bg-[#FFBA00] border-[black]"
              : "bg-[#FFBA00] border-[black]"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default MobileGameStore;
