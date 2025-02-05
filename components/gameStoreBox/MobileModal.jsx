"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import axiosInstance from "@/libs/axios";
import { Alert } from "../Alert";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export function MobileModal({
  //   data,
  isOpen,
  onClose,
  cart,
  //   totalUC,
  //   totalPrice,
  clear,
  //   savedCurrency,
  gameId,
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [token, setToken] = useState(null);

  const [error2, setError] = useState(false);
  const [error1, setError1] = useState(false);
  const [error401, setError401] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [userName, setUserName] = useState(null);
  const [buttonLabel, setButtonLabel] = useState("Tekshirish");
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
      if (error.status == 401) {
        setError401(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
      setError1(true);
      console.error("Xatolik yuz berdi:", error);
    }
  };

  const savedCurrency =
    typeof window !== "undefined"
      ? localStorage.getItem("currency") || "uzs"
      : "uzs";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileData = localStorage.getItem("profileData");
      if (storedProfileData) {
        const parsedProfileData = JSON.parse(storedProfileData);
        setToken(parsedProfileData?.access || null);
      }
    }
  }, []);

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
    //  setLoading(true);
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
        }, 1000);
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
          onClose();
        }, 2000);
      }
    } finally {
      if (isOpen == 2) {
        setTimeout(() => {
          setSuccess(false);
          clear();
          onClose();
        }, 2000);
      } else {
        setTimeout(() => {
          setSuccess(false);
          clear();
          onClose();
        }, 2000);
      }
      // setLoading(false);
    }
  };
  const handleClose = () => {
    setSuccess(false);
    setError(false);
  };

  const ClearTash = () => {
    clear();
    onClose();
  };

  return (
    <>
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
      <div
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        open={isOpen}
      >
        <div
          className={`sticky top-[25%] col-span-2 bg-[#F9F9F9] rounded-lg shadow-lg p-6 h-max max-sm:fixed max-sm:top-auto max-sm:bottom-[110px] left-0 right-0 max-w-[400px] mx-auto max-sm:col-span-5 max-sm:${
            cart.length > 0 ? "block" : "hidden"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">{t("all-games-text6")}</h2>
            <div className="flex cursor-pointer" onClick={() => ClearTash()}>
              <button
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground max-sm:top-6"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          {cart.length > 0 ? (
            <>
              <div className="mt-2 mb-8">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-[#F4F4F4] py-3 px-5 rounded-[10px] shadow-lg mt-4"
                  >
                    <div className="flex items-center gap-4">
                      {item.photo ? (
                        <Image
                          src={item.photo}
                          alt={`${item.name} UC`}
                          width={35}
                          height={35}
                        />
                      ) : (
                        <Image
                          src={
                            gameId !== "00984e54-78f0-44f8-ad48-dac23d838bdc"
                              ? "/mobile.webp"
                              : "/uccard_converted.webp"
                          }
                          alt={`${item.name} UC`}
                          width={35}
                          height={35}
                        />
                      )}
                      <span>{item.name}</span>
                    </div>
                    <span>
                      {(item.price * item.quantity).toLocaleString()}{" "}
                      {savedCurrency}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
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
                  {error1 && (
                    <p className="text-red-600 font-medium">{t("mobile2")}</p>
                  )}
                  <button
                    disabled={userId.length === 0 || serverId.length === 0}
                    onClick={
                      buttonLabel === "Tekshirish"
                        ? handleCheckUser
                        : fetchBuyHandle
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
              {/* {gameId == "00984e54-78f0-44f8-ad48-dac23d838bdc" && (
              <>
                <MobileGameStore
                  cart={cart}
                  clear={() => ClearTash()}
                  onClose={() => setShowPurchaseModal(false)}
                />
              </>
            )} */}
            </>
          ) : (
            <div
              className={`w-full flex mt-[60px] mb-[110px] justify-center max-sm:${
                cart.length > 0 ? "flex" : "hidden"
              }`}
            >
              <Image src="/nocard.svg" alt="Clear" width={98} height={89} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
