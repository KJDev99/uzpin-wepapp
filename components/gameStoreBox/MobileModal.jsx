"use client";

import axiosInstance from "@/libs/axios";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Alert } from "../Alert";

export function MobileModal({ isOpen, onClose, cart, clear, gameId, server }) {
  const pathname = usePathname();
  const id = pathname.replace("/all-games/", "");
  const router = useRouter();
  const { t } = useTranslation();
  const [token, setToken] = useState(null);
  const [error2, setError] = useState(false);
  const [error3, setError3] = useState(false);
  const [error4, setError4] = useState(false);
  const [error5, setError5] = useState(false);
  const [error1, setError1] = useState(false);
  const [error401, setError401] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [promo_code, setPromo_Code] = useState("");
  const [userName, setUserName] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [buttonLabel, setButtonLabel] = useState("Tekshirish");
  const [loading, setLoading] = useState(false);
  const [errormessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileData = localStorage.getItem("profileData");
      if (storedProfileData) {
        const parsedProfileData = JSON.parse(storedProfileData);
        setToken(parsedProfileData?.access || null);
      }
    }
  }, []);
  const ru = "ru";
  const ph = "ph";
  const cleanedGameId = id ? id.trim() : "";
  const handleCheckUser = async () => {
    const formattedData = {
      user_id: userId,
      server_id: serverId,
    };
    if (cleanedGameId === "00984e54-78f0-44f8-ad48-dac23d838bdc") {
      formattedData.server = ph;
    }
    if (cleanedGameId === "322d0721-1dca-4720-a0a3-68371ba8ed22") {
      formattedData.server = ru;
    }
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPromoCode = async () => {
    const formattedData = {
      discount_promo_code: promo_code,
    };
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/client/check-discount/",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setError4(false);
      setError5(false);
      setDiscount(response.data.discount);
    } catch (error) {
      if (
        error.response.data.error_en ==
        "You have already used this promo code before."
      ) {
        setError4(true);
      } else if (
        error.response.data.error_en == "Such a promo code was not found."
      ) {
        setError5(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckUserAndPromo = async () => {
    setLoading(true);
    await handleCheckUser();
    if (promo_code.trim() !== "") {
      await handleCheckPromoCode();
    }
    setLoading(false);
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
    if (promo_code.trim() !== "") {
      formattedData.promo_code = promo_code;
    }
    if (
      cleanedGameId === "00984e54-78f0-44f8-ad48-dac23d838bdc" ||
      server === "ph"
    ) {
      formattedData.server = ph;
    }
    if (
      cleanedGameId === "322d0721-1dca-4720-a0a3-68371ba8ed22" ||
      server === "ru"
    ) {
      formattedData.server = ru;
    }
    setLoading(true);
    if (server === "ph") {
      try {
        const response = await axiosInstance.post(
          // "/client/mobile-legands/buy/promocode",
          "/client/mobile-legands/buy/promocode/new/",
          formattedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSuccess(true);
      } catch (error) {
        setErrorMessage(
          error.response.data.detail || error.response.data.error
        );
        if (error.status == 401) {
          setError401(true);
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        } else if (error.response.data.message) {
          setError3(true);
          setErrorMessage(error.response.data.message);
          setTimeout(() => {
            setErrorMessage(false);
            onClose();
          }, 5000);
        } else if (error.response.data.code == -32014) {
          setError3(true);
        } else if (
          error.response.data.error_en ==
          "You have already used this promo code before."
        ) {
          setError4(true);
          setTimeout(() => {
            setError4(false);
            onClose();
          }, 2000);
        } else if (
          error.response.data.error_en == "Such a promo code was not found."
        ) {
          setError5(true);
          setTimeout(() => {
            setError5(false);
            onClose();
          }, 2000);
        } else {
          setError(true);
          setTimeout(() => {
            setError(false);
            onClose();
          }, 2000);
        }
      } finally {
        if (promo_code.trim() === "") {
          setError5(false);
        }
        if (isOpen == 2) {
          setTimeout(() => {
            setSuccess(false);
            clear();
            onClose();
          }, 5000);
        } else {
          setTimeout(() => {
            setSuccess(false);
            clear();
            onClose();
          }, 5000);
        }
        setLoading(false);
      }
    } else {
      try {
        const response = await axiosInstance.post(
          "/client/mobile-legands/buy/promocode",
          // "/client/mobile-legands/buy/promocode/new/",
          formattedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSuccess(true);
      } catch (error) {
        console.log(error.response.data.error);
        setError3(true);
        setErrorMessage(
          error.response.data.detail || error.response.data.error
        );
        if (error.status == 401) {
          setError401(true);
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        } else if (error.response.data.message) {
          setErrorMessage(error.response.data.message);
          setTimeout(() => {
            setErrorMessage(false);
            onClose();
          }, 5000);
        } else if (error.response.data.code == -32014) {
          setError3(true);
        } else if (
          error.response.data.error_en ==
          "You have already used this promo code before."
        ) {
          setError4(true);
          setTimeout(() => {
            setError4(false);
            onClose();
          }, 2000);
        } else if (
          error.response.data.error_en == "Such a promo code was not found."
        ) {
          setError5(true);
          setTimeout(() => {
            setError5(false);
            onClose();
          }, 2000);
        } else {
          setError(true);
          setTimeout(() => {
            setError(false);
            onClose();
          }, 2000);
        }
      } finally {
        if (promo_code.trim() === "") {
          setError5(false);
        }
        if (isOpen == 2) {
          setTimeout(() => {
            setSuccess(false);
            clear();
            onClose();
          }, 5000);
        } else {
          setTimeout(() => {
            setSuccess(false);
            clear();
            onClose();
          }, 5000);
        }
        setLoading(false);
      }
    }
  };
  const handleClose = () => {
    setSuccess(false);
    setError(false);
    setError3(false);
    setError4(false);
    setError5(false);
  };

  const ClearTash = () => {
    clear();
    onClose();
  };

  return (
    <>
      {error3 && (
        <Alert
          status={400}
          title="Error"
          message={errormessage}
          onClose={handleClose}
        />
      )}
      {error4 && (
        <Alert status={400} title={t("error4")} onClose={handleClose} />
      )}
      {error5 && (
        <Alert status={400} title={t("error5")} onClose={handleClose} />
      )}
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
          className={`sticky top-[25%] col-span-2 bg-[#F9F9F9] rounded-lg shadow-lg p-6 h-max max-sm:fixed max-sm:top-auto max-sm:bottom-[110px] left-0 right-0 max-w-[500px] mx-auto max-sm:col-span-5 max-sm:${
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
                  <div key={item.id}>
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-[#F4F4F4] py-3 px-5 rounded-[10px] shadow-lg my-4"
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
                        {item.price
                          .toLocaleString("fr-FR", {
                            useGrouping: true,
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 3,
                          })
                          .replace(",", ".")}{" "}
                        {savedCurrency}
                      </span>
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
                          <p className="text-red-600 font-medium">
                            {t("mobile2")}
                          </p>
                        )}
                        <div className="w-full space-y-2 flex justify-between items-center">
                          {/* <div className="w-full flex flex-col items-center">
                            <div className="w-full flex items-center justify-between mb-3">
                              <label
                                htmlFor="serverId"
                                className="text-lg font-semibold max-sm:font-normal max-sm:text-base"
                              >
                                Promokod kiriting
                              </label>
                              <input
                                id="serverId"
                                // value={promo_code}
                                onChange={(e) => setPromo_Code(e.target.value)}
                                placeholder="Promokod kiriting"
                                className="border border-[#E7E7E7] rounded-[5px] py-3 px-5 font-semibold outline-none max-sm:max-w-[163px]"
                              />
                            </div>
                            {discount && (
                              <p className="text-green-600 font-medium">
                                Chegirma narxi{" "}
                                {(item.price * (1 - discount / 100))
                                  .toLocaleString("fr-FR", {
                                    useGrouping: true,
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 3,
                                  })
                                  .replace(",", ".")}
                              </p>
                            )}
                            {error4 && (
                              <p className="text-red-600 font-medium">
                                {t("error4")}
                              </p>
                            )}
                            {error5 && (
                              <p className="text-red-600 font-medium">
                                {t("error5")}
                              </p>
                            )}
                          </div> */}
                        </div>
                        <button
                          disabled={
                            userId.length === 0 ||
                            serverId.length === 0 ||
                            loading
                          }
                          onClick={
                            buttonLabel === "Tekshirish"
                              ? handleCheckUserAndPromo
                              : fetchBuyHandle
                          }
                          className={`w-full flex justify-center py-2 rounded text-black font-medium border-b-2 disabled:cursor-not-allowed ${
                            buttonLabel === "Tekshirish"
                              ? "bg-[#FFBA00] border-[black]"
                              : "bg-[#FFBA00] border-[black]"
                          } ${
                            loading
                              ? "bg-gray-400 border-gray-600 cursor-not-allowed"
                              : "bg-[#FFBA00] border-black"
                          } `}
                        >
                          {loading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                          ) : (
                            buttonLabel
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className="space-y-4">
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
                  <div className="w-full space-y-2 flex justify-between items-center">
                    <div className="w-full flex flex-col items-center">
                      <div className="w-full flex items-center justify-between mb-3">
                        <label
                          htmlFor="serverId"
                          className="text-lg font-semibold max-sm:font-normal max-sm:text-base"
                        >
                          Promokod kiriting
                        </label>
                        <input
                          id="serverId"
                          // value={promo_code}
                          onChange={(e) => setPromo_Code(e.target.value)}
                          placeholder="Promokod kiriting"
                          className="border border-[#E7E7E7] rounded-[5px] py-3 px-5 font-semibold outline-none max-sm:max-w-[163px]"
                        />
                      </div>
                      {discount && (
                        <p className="text-green-600 font-medium">
                          Chegirma narxi {item.price
                        .toLocaleString("fr-FR", {
                          useGrouping: true,
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 3,
                        })
                        .replace(",", ".")}
                        </p>
                      )}
                      {error4 && (
                        <p className="text-red-600 font-medium">
                          {t("error4")}
                        </p>
                      )}
                      {error5 && (
                        <p className="text-red-600 font-medium">
                          {t("error5")}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    disabled={
                      userId.length === 0 || serverId.length === 0 || loading
                    }
                    onClick={
                      buttonLabel === "Tekshirish"
                        ? handleCheckUserAndPromo
                        : fetchBuyHandle
                    }
                    className={`w-full flex justify-center py-2 rounded text-black font-medium border-b-2 disabled:cursor-not-allowed ${
                      buttonLabel === "Tekshirish"
                        ? "bg-[#FFBA00] border-[black]"
                        : "bg-[#FFBA00] border-[black]"
                    } ${
                      loading
                        ? "bg-gray-400 border-gray-600 cursor-not-allowed"
                        : "bg-[#FFBA00] border-black"
                    } `}
                  >
                    {loading ? (
                      <AiOutlineLoading3Quarters className="animate-spin" />
                    ) : (
                      buttonLabel
                    )}
                  </button>
                </div>
              </div> */}
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
