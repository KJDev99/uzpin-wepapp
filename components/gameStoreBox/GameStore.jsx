"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GoTrash } from "react-icons/go";
import { PurchaseModal } from "./PurchaseModal";
import axiosInstance from "@/libs/axios";
import { useTranslation } from "react-i18next";
import MobileGameStore from "./MobileGameStore";

export default function GameStore({ data, gameId }) {
  const { t } = useTranslation();
  const [cart, setCart] = useState([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  // const [showModalMessage, setShowModalMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState([]);
  const [amound, setAmound] = useState(0);
  const [token, setToken] = useState(null);

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

  const fetchStats = async () => {
    setLoading(true);
    let sendData = { Currency: savedCurrency };
    if (token) {
      sendData = {
        Authorization: `Bearer ${token}`,
        Currency: savedCurrency,
      };
      console.log(token, "tpkec");
    }
    if (data.id) {
      try {
        const response = await axiosInstance.get(
          `/client/promocodes/${data.id}`,
          {
            headers: sendData,
          }
        );
        if (gameId == "00984e54-78f0-44f8-ad48-dac23d838bdc") {
          const updatedData = response.data.map((item) => {
            return {
              ...item,
              count: 1000,
            };
          });
          setCode(updatedData);
        } else {
          setCode(response.data || []);
        }
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchStats();
  }, [data.id, token]);

  const updateQuantity = (packageId, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === packageId);
      if (!existingItem) {
        if (quantity === 0) return prevCart;
        const newItem = {
          ...code.find((p) => p.id === packageId),
          quantity: quantity,
        };
        return [...prevCart, newItem];
      }

      if (quantity > existingItem.quantity) {
        quantity = Math.min(quantity, existingItem.count);
      }
      if (quantity === 0) {
        return prevCart.filter((item) => item.id !== packageId);
      }

      return prevCart.map((item) =>
        item.id === packageId ? { ...item, quantity: quantity } : item
      );
    });
  };

  const getQuantity = (packageId) => {
    return cart.find((item) => item.id === packageId)?.quantity || 0;
  };

  const totalUC = cart.reduce(
    (sum, item) => sum + item.name.match(/\d+/)?.[0] * item.quantity,
    0
  );
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const ClearTash = () => {
    setCart([]);
  };

  return (
    <>
      <div
        className="game_bg"
        style={{
          backgroundImage: `url(${data.cover})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="max-w-[1200px] border-b border-[#828282] mx-auto font-sans max-sm:px-4 max-sm:py-5">
        <div className="grid grid-cols-5">
          <h1 className="col-span-5 text-3xl font-bold mt-10 mb-5 ml-[40px] max-sm:hidden">
            {data.name}
          </h1>
          <p className="col-span-5 mb-2 text-2xl font-medium text-[#313131] max-sm:text-xl max-sm:text-[#000000] max-sm:mb-[10px]">
            {data.name} {t("all-games-text1")}
          </p>
          <p className="col-span-3 text-lg text-[#313131] mb-[10px] max-sm:text-sm max-sm:col-span-5">
            {t("all-games-text2")} {data.name} {t("all-games-text3")}
          </p>
          <p className="col-span-3 text text-[#313131] mb-10 flex justify-center items-start gap-[10px] max-sm:col-span-5 max-sm:text-sm max-sm:leading-[14px]">
            <Image
              src="/Info.svg"
              alt="info"
              width={16}
              height={16}
              className="mt-1"
            />
            {t("all-games-text4")}
          </p>
        </div>
        <div className="grid grid-cols-5 gap-[50px] mb-[40px]">
          <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-sm:grid-cols-2 max-sm:col-span-5 max-sm:gap-2">
            {code.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-lg p-4 border hover:border-[#FFBA00] transition-all ease-linear bg-white max-sm:p-0 h-max"
              >
                <div className="flex flex-col max-sm:px-[0px] max-sm:pb-[10px]">
                  <div className="flex items-center justify-center max-w-[190px] w-full h-[190px] rounded-[10px] bg-gradient-to-b from-[#FFE69B] to-[#FEFDF8]">
                    {pkg.photo ? (
                      <Image
                        src={pkg.photo}
                        alt={`${pkg.name} UC`}
                        width={130}
                        height={130}
                        className="w-[130px] max-sm:w-[126px] h-[130px] max-sm:h-[126px] max-sm:mx-auto"
                      />
                    ) : (
                      <Image
                        src={
                          gameId === "00984e54-78f0-44f8-ad48-dac23d838bdc"
                            ? "/mobile.webp"
                            : "/uccard_converted.webp"
                        }
                        alt={`${pkg.name} UC`}
                        width={130}
                        height={130}
                        className="w-[130px] max-sm:w-[126px] max-sm:h-[126px] max-sm:mx-auto"
                      />
                    )}
                  </div>
                  <div className="max-sm:px-[10px]">
                    <h3 className="text-xl font-bold mb-2 max-sm:font-medium max-sm:text-sm line-clamp-1">
                      {pkg.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-[#313131] text-sm mb-4 max-sm:text-xs max-sm:leading-[14px] uppercase">
                        {pkg.price.toLocaleString()} {savedCurrency}
                      </p>
                      {gameId != "00984e54-78f0-44f8-ad48-dac23d838bdc" && (
                        <>
                          <p className="text-[#828282] text-xs mb-4 max-sm:hidden">
                            {t("all-games-text5")} {pkg.count}
                          </p>
                          <p className="text-[#828282] text-xs mb-4 sm:hidden max-sm:text-[10px] max-sm:leading-[11px]">
                            {t("all-games-text17")} {pkg.count}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <button
                        className={`px-2 py-1 text-[28px] max-sm:p-0 ${
                          getQuantity(pkg.id) === 0
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() =>
                          updateQuantity(pkg.id, getQuantity(pkg.id) - 1)
                        }
                        disabled={getQuantity(pkg.id) === 0}
                      >
                        -
                      </button>

                      <input
                        type="text"
                        value={getQuantity(pkg.id)}
                        className="text-center w-[100px] py-2 border rounded-[10px] bg-[#F4F4F4] border-t-[#ACACAC] outline-none text-lg max-sm:py-[7px] max-sm:px-[35px]"
                        onInput={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          const quantity = Math.min(
                            Math.max(parseInt(value) || 0, 0),
                            pkg.count
                          );
                          if (value !== e.target.value)
                            e.target.value = quantity;
                          updateQuantity(pkg.id, quantity);
                        }}
                      />

                      <button
                        className={`px-2 py-1 text-[28px] max-sm:p-0 ${
                          getQuantity(pkg.id) >= pkg.count
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() =>
                          updateQuantity(pkg.id, getQuantity(pkg.id) + 1)
                        }
                        disabled={getQuantity(pkg.id) >= pkg.count}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`sticky top-10 col-span-2 bg-[#F9F9F9] rounded-lg shadow-lg p-6 h-max max-sm:fixed max-sm:top-auto max-sm:bottom-[110px] left-0 right-0 w-[90%] mx-auto max-sm:col-span-5 max-sm:${
              cart.length > 0 ? "block" : "hidden"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">{t("all-games-text6")}</h2>
              <div className="flex cursor-pointer" onClick={() => ClearTash()}>
                <p className="text-[#828282] flex gap-[10px] items-center max-sm:text-sm max-sm:leading-4">
                  <GoTrash />
                  {t("all-games-text7")}
                </p>
              </div>
            </div>
            {cart.length > 0 ? (
              <>
                <div className="mt-2 mb-8">
                  <div className="border-t pt-4">
                    <div className="flex flex-col">
                      <span className="max-sm:hidden">
                        {t("all-games-text8")}
                      </span>
                      <div className="flex justify-between font-bold max-sm:font-medium max-sm:leading-[18px]">
                        <div className="sm:hidden">{t("all-games-text9")}</div>
                        <div className="w-full flex justify-between items-center">
                          <p>
                            {totalUC.toLocaleString()}{" "}
                            {code[0].name.match(/[a-zA-Z]+/)?.[0]}
                          </p>
                          <p>
                            {totalPrice.toLocaleString()} {savedCurrency}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-[#F4F4F4] py-3 px-5 rounded-[10px] shadow-lg mt-4 max-sm:hidden"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={
                            gameId === "00984e54-78f0-44f8-ad48-dac23d838bdc"
                              ? "/mobile.webp"
                              : item.photo
                          }
                          alt={`${item.name} UC`}
                          width={56}
                          height={56}
                          className="w-[56px] h-[56px]"
                        />
                        <span>{item.name}</span>
                      </div>
                      <span>
                        {(item.price * item.quantity).toLocaleString()}{" "}
                        {savedCurrency}
                      </span>
                    </div>
                  ))}
                </div>
                {gameId == "00984e54-78f0-44f8-ad48-dac23d838bdc" && (
                  <>
                    <MobileGameStore cart={cart} />
                  </>
                )}
                <div className="mt-6 space-y-2 max-sm:flex max-sm:items-center max-sm:gap-5 max-sm:mt-[11px] max-sm:space-y-0">
                  {gameId != "00984e54-78f0-44f8-ad48-dac23d838bdc" && (
                    <>
                      <button
                        onClick={() => setShowPurchaseModal(1)}
                        className="w-full py-2 bg-[#FFBA00] rounded text-black font-medium mb-[10px] border-b-2 border-[black] max-sm:m-0"
                      >
                        {t("all-games-text10")}
                      </button>
                      <button
                        onClick={() => setShowPurchaseModal(2)}
                        className="w-full py-2 bg-[#FFBA00] rounded text-black font-medium border-b-2 border-[black]"
                      >
                        {t("all-games-text11")}
                      </button>
                    </>
                  )}
                </div>
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

        {showPurchaseModal && (
          <PurchaseModal
            isOpen={showPurchaseModal}
            onClose={() => setShowPurchaseModal(false)}
            cart={cart}
            totalUC={totalUC}
            totalPrice={totalPrice}
            clear={() => ClearTash()}
            savedCurrency={savedCurrency}
            gameId={gameId}
          />
        )}
      </div>
    </>
  );
}
