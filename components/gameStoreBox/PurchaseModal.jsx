"use client";

import axiosInstance from "@/libs/axios";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Alert } from "../Alert";
import PurchasesModal from "../profile/PurchasesModal";

export function PurchaseModal({
  isOpen,
  onClose,
  cart,
  totalUC,
  totalPrice,
  clear,
  savedCurrency,
  gameId,
}) {
  console.log(gameId);
  const { t } = useTranslation();
  const [playerId, setPlayerId] = useState("");
  const [promo_code, setPromo_Code] = useState("");
  const [token, setToken] = useState(null);
  const [error2, setError] = useState(false);
  const [error3, setError3] = useState(false);
  const [error4, setError4] = useState(false);
  const [error5, setError5] = useState(false);
  const [error401, setError401] = useState(false);
  const [success, setSuccess] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Sotib olish");
  const [discount, setDiscount] = useState(null);
  const [isOpenBuy, setIsOpenBuy] = useState(false);
  const [buyCode, setBuyCode] = useState();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const closeModal = () => {
    setBuyCode(null);
    setIsOpenBuy(false);
    onClose();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileData = localStorage.getItem("profileData");
      if (storedProfileData) {
        const parsedProfileData = JSON.parse(storedProfileData);
        setToken(parsedProfileData?.access || null);
      }
    }
  }, []);

  useEffect(() => {
    if (!promo_code?.trim()) {
      setButtonLabel("Sotib olish");
    } else {
      setButtonLabel("Tekshirish");
    }
  }, [promo_code]);

  const handleCheckPromoCode = async () => {
    if (!promo_code?.trim()) {
      return setButtonLabel("Sotib olish");
    }

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
      setButtonLabel("Sotib olish");
      setError4(false);
      setError5(false);
      setDiscount(response.data.discount);
    } catch (error) {
      if (
        error.response?.data?.error_en ===
        "You have already used this promo code before."
      ) {
        setError4(true);
      } else if (
        error.response?.data?.error_en === "Such a promo code was not found."
      ) {
        setError5(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBuyHandle = async () => {
    const savedCurrency =
      typeof window !== "undefined"
        ? localStorage.getItem("currency") || "uzs"
        : "uzs";
    const formattedData = {
      currency: savedCurrency,
      gamer_id: playerId == "" ? undefined : playerId,
      items: cart.map((item) => ({
        promocode: item.id,
        count: item.quantity,
      })),
    };
    if (promo_code.trim() !== "") {
      formattedData.promo_code = promo_code;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/client/promocode/buy",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (isOpen == 1) {
        setBuyCode(response.data[0].id);
        setIsOpenBuy(true);
      }
      if (isOpen == 2) {
        setSuccess(true);
      }
    } catch (error) {
      if (error.status == 401) {
        setError401(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else if (
        error.response.data.error_en == "Such a promo code was not found."
      ) {
        setError3(true);
        setTimeout(() => {
          setError3(false);
          onClose();
        }, 2000);
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

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      open={isOpen}
    >
      {error2 && (
        <Alert status={400} title={t("profile14")} message={t("profile15")} />
      )}
      {error3 && <Alert status={400} title={t("error3")} />}
      {error401 && (
        <Alert
          status={400}
          title={t("profile4011")}
          message={t("profile4012")}
        />
      )}
      {success && (
        <Alert status={200} title={t("profile16")} message={t("profile17")} />
      )}
      <div
        className={`fixed left-[50%] top-[50%]  rounded-[10px]  z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-[white] p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] max-sm:w-[95%] max-h-[95%] overflow-auto max-sm:rounded-lg ${
          isOpen && success && "hidden"
        }`}
      >
        <div>
          <div className="flex items-center justify-center text-2xl font-semibold mt-[40px] max-sm:m-0 max-sm:justify-start max-sm:font-medium max-sm:text-xl">
            {isOpen == 1 && <div>{t("all-games-text10")}</div>}
            {isOpen == 2 && <div>{t("all-games-text12")}</div>}
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground max-sm:top-6"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="pt-4">
              <div className="flex flex-col">
                <div className="flex justify-between font-bold">
                  <div className="flex gap-[10px]">
                    <span className="font-normal">{t("all-games-text8")}</span>
                    {totalUC
                      .toLocaleString("fr-FR", {
                        useGrouping: true,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 3,
                      })
                      .replace(",", ".")}
                  </div>
                  <div>
                    {totalPrice
                      .toLocaleString("fr-FR", {
                        useGrouping: true,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 3,
                      })
                      .replace(",", ".")}{" "}
                    {savedCurrency}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 mb-8">
              {cart.length > 0 &&
                cart.map((item) => (
                  <div key={item.id} className="space-y-4">
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
                              gameId === "00984e54-78f0-44f8-ad48-dac23d838bdc"
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
                        {(item.price * item.quantity)
                          .toLocaleString("fr-FR", {
                            useGrouping: true,
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 3,
                          })
                          .replace(",", ".")}{" "}
                        {savedCurrency}
                      </span>
                    </div>
                    {isOpen == 1 && (
                      <>
                        {/* <div className="space-y-2 flex flex-col justify-between items-center">
                          <div className="w-full flex items-center justify-between">
                            <label
                              htmlFor="playerId"
                              className="text-lg font-semibold max-sm:font-normal max-sm:text-base"
                            >
                              Promokod Kiriting
                            </label>
                            <input
                              id="promo_code"
                              // value={promo_code}
                              onChange={(e) => setPromo_Code(e.target.value)}
                              placeholder="Promokod Kiriting"
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
                      </>
                    )}

                    {isOpen == 2 && (
                      <>
                        <div className="space-y-2 flex justify-between items-center">
                          <label
                            htmlFor="playerId"
                            className="text-lg font-semibold max-sm:font-normal max-sm:text-base"
                          >
                            {gameId === "3f2ef70d-6e80-4f1a-8c65-9645a2e22d95"
                              ? t("id")
                              : t("all-games-text13")}
                          </label>
                          <input
                            id="playerId"
                            onChange={(e) => setPlayerId(e.target.value)}
                            placeholder={
                              gameId === "3f2ef70d-6e80-4f1a-8c65-9645a2e22d95"
                                ? t("id")
                                : t("all-games-text13")
                            }
                            className="border border-[#E7E7E7] rounded-[5px] py-3 px-5 font-semibold outline-none max-sm:max-w-[163px]"
                          />
                        </div>

                        <button
                          onClick={
                            buttonLabel === "Tekshirish"
                              ? handleCheckPromoCode
                              : fetchBuyHandle
                          }
                          disabled={!playerId.trim() || loading}
                          className={`w-full flex justify-center py-2 rounded text-black font-medium border-b-2 ${
                            !playerId.trim() || loading
                              ? "bg-gray-400 border-gray-600 cursor-not-allowed"
                              : "bg-[#FFBA00] border-black"
                          }`}
                        >
                          {loading ? (
                            <AiOutlineLoading3Quarters className="animate-spin" />
                          ) : (
                            buttonLabel
                          )}
                        </button>
                      </>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {isOpen == 1 && (
            <button
              onClick={
                buttonLabel === "Tekshirish"
                  ? handleCheckPromoCode
                  : fetchBuyHandle
              }
              disabled={loading}
              className={`w-full flex justify-center py-2 rounded text-black font-medium border-b-2 ${
                loading
                  ? "bg-gray-400 border-gray-600 cursor-not-allowed"
                  : "bg-[#FFBA00] border-black"
              }`}
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                buttonLabel
              )}
            </button>
          )}
        </div>
      </div>
      {isOpen == 1 && (
        <PurchasesModal
          isOpen={isOpenBuy}
          onClose={closeModal}
          selectedPurchase={buyCode}
        />
      )}
      {isOpen == 2 && (
        <PurchasesModal
          isOpen={isOpenBuy}
          onClose={closeModal}
          selectedPurchase={buyCode}
        />
      )}
    </div>
  );
}
