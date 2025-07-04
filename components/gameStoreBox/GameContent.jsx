"use client";

import axiosInstance from "@/libs/axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GoTrash } from "react-icons/go";
import MobileGameStore from "./MobileGameStore";
import { MobileModal } from "./MobileModal";
import { PurchaseModal } from "./PurchaseModal";

// GameContent komponenti - asosiy mantiq va UI uchun
const GameContent = ({ data, gameId, savedCurrency, t, server }) => {
  const pathname = useParams().game;
  const [cart, setCart] = useState([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState([]);
  const [token, setToken] = useState(null);
  const isMobile =
    gameId === "00984e54-78f0-44f8-ad48-dac23d838bdc" ||
    gameId === "322d0721-1dca-4720-a0a3-68371ba8ed22" ||
    gameId === "7d64856a-ae76-4ddc-be75-3a361dcbf9a2" ||
    gameId === "b9f1aeb0-50fa-4826-87e2-cb9c906dbe1d" ||
    gameId === "628861ab-0687-4868-971c-94ba7e5e2134";

  // Token ni localStoragedan olish
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
    }

    if (pathname === "1") {
      try {
        const response = await axiosInstance.get(
          `/client/promocodes/${gameId}`,
          {
            headers: sendData,
          }
        );
        setCode(response.data || []);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    }

    if (data.id) {
      try {
        const response = await axiosInstance.get(
          `/client/promocodes/${data.id}`,
          { headers: sendData }
        );

        if (
          gameId === "00984e54-78f0-44f8-ad48-dac23d838bdc" ||
          gameId === "322d0721-1dca-4720-a0a3-68371ba8ed22" ||
          gameId === "7d64856a-ae76-4ddc-be75-3a361dcbf9a2"
        ) {
          const updatedData = response.data.map((item) => ({
            ...item,
            count: 1000,
          }));
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

  const filteredCode =
    server === "ph" || server === "ru"
      ? code.filter((pkg) => pkg.server === server)
      : code;

  // Komponent yuklanganda va kerakli o'zgarishlarda ma'lumotlarni yangilash
  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id, token, showPurchaseModal, showMobileModal]);

  // Korzinkadagi miqdorni yangilash
  const updateQuantity = (packageId, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === packageId);

      // Yangi mahsulot qo'shish
      if (!existingItem) {
        if (quantity === 0) return prevCart;
        const newItem = {
          ...code.find((p) => p.id === packageId),
          quantity: quantity,
        };
        return [...prevCart, newItem];
      }

      // Miqdorni cheklash
      if (data.no_promocode === false) {
        quantity = Math.min(quantity, existingItem.count);
      } else {
        quantity = Math.min(quantity, 1000);
      }

      // Agar miqdor 0 bo'lsa, olib tashlash
      if (quantity === 0) {
        return prevCart.filter((item) => item.id !== packageId);
      }

      // Miqdorni yangilash
      return prevCart.map((item) =>
        item.id === packageId ? { ...item, quantity } : item
      );
    });
  };

  // Berilgan packageId uchun miqdorni olish
  const getQuantity = (packageId) => {
    return cart.find((item) => item.id === packageId)?.quantity || 0;
  };

  // Jami UC hisoblash
  const totalUC = cart.reduce(
    (sum, item) => sum + (item.name.match(/\d+/)?.[0] || 0) * item.quantity,
    0
  );

  // Jami narx hisoblash
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Korzinkani tozalash
  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="max-w-[1200px] mt-10 border-b border-[#828282] mx-auto font-sans max-sm:px-4 max-sm:py-5">
      <div className="grid grid-cols-5 gap-[50px] mb-[40px]">
        <div
          className={`${
            gameId === "00984e54-78f0-44f8-ad48-dac23d838bdc" ||
            gameId === "322d0721-1dca-4720-a0a3-68371ba8ed22" ||
            gameId === "7d64856a-ae76-4ddc-be75-3a361dcbf9a2" ||
            gameId === "b9f1aeb0-50fa-4826-87e2-cb9c906dbe1d" ||
            gameId === "628861ab-0687-4868-971c-94ba7e5e2134"
              ? "col-span-5 lg:grid-cols-5"
              : "col-span-3 lg:grid-cols-3"
          } grid grid-cols-1 md:grid-cols-2 gap-5 max-sm:grid-cols-2 max-sm:col-span-5 max-sm:gap-2`}
        >
          {filteredCode.map(
            (pkg) =>
              ![
                "38ade9a5-98f9-4c61-afb2-198434af8612",
                "bf94ab2e-addc-4998-9ff1-5a73b3e8f7c0",
                "ed0637d4-e2ec-49b1-b497-b8ae45939299",
                "49a8481b-ead0-477e-aff5-a1b748301106",
              ].includes(pkg.id) && (
                <div
                  key={pkg.id}
                  className="rounded-lg p-4 border hover:border-[#FFBA00] transition-all ease-linear bg-white max-sm:p-0 h-max"
                >
                  <div className="flex flex-col max-sm:px-[0px] max-sm:pb-[10px]">
                    {/* Mahsulot rasmi */}
                    <div className="flex items-center justify-center w-full h-[190px] rounded-[10px] bg-gradient-to-b from-[#FFE69B] to-[#FEFDF8]">
                      <Image
                        src={
                          pkg.photo
                            ? pkg.photo
                            : gameId ===
                                "00984e54-78f0-44f8-ad48-dac23d838bdc" ||
                              gameId ===
                                "322d0721-1dca-4720-a0a3-68371ba8ed22" ||
                              gameId === "7d64856a-ae76-4ddc-be75-3a361dcbf9a2"
                            ? "/mobile.webp"
                            : "/uccard_converted.webp"
                        }
                        alt={`${pkg.name} UC`}
                        width={130}
                        height={130}
                        className="w-[130px] max-sm:w-[126px] h-[130px] max-sm:h-[126px] max-sm:mx-auto"
                      />
                    </div>

                    {/* Mahsulot ma'lumotlari */}
                    <div className="max-sm:px-[10px]">
                      <h3 className="text-[15px] font-bold mb-2 max-sm:font-medium max-sm:text-sm line-clamp-1">
                        {pkg.name}
                      </h3>

                      {/* Narx va qoldiq */}
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-[#313131] text-sm mb-4 max-sm:text-xs max-sm:leading-[14px] uppercase">
                          {pkg.price
                            .toLocaleString("fr-FR", {
                              useGrouping: true,
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 3,
                            })
                            .replace(",", ".")}{" "}
                          {savedCurrency}
                        </p>

                        {gameId !== "00984e54-78f0-44f8-ad48-dac23d838bdc" &&
                          gameId !== "322d0721-1dca-4720-a0a3-68371ba8ed22" &&
                          gameId !== "7d64856a-ae76-4ddc-be75-3a361dcbf9a2" && (
                            <>
                              <p className="text-[#828282] text-xs mb-4 max-sm:hidden">
                                {data.no_promocode == false
                                  ? t("all-games-text5")
                                  : ""}{" "}
                                {data.no_promocode == false && pkg.count}
                              </p>
                              <p className="text-[#828282] text-xs mb-4 sm:hidden max-sm:text-[10px] max-sm:leading-[11px]">
                                {data.no_promocode == false
                                  ? t("all-games-text17")
                                  : ""}
                                {data.no_promocode == false && pkg.count}
                              </p>
                            </>
                          )}
                      </div>

                      {/* Miqdorni boshqarish */}
                      {gameId !== "00984e54-78f0-44f8-ad48-dac23d838bdc" &&
                        gameId !== "322d0721-1dca-4720-a0a3-68371ba8ed22" &&
                        gameId !== "7d64856a-ae76-4ddc-be75-3a361dcbf9a2" &&
                        gameId !== "b9f1aeb0-50fa-4826-87e2-cb9c906dbe1d" &&
                        gameId !== "628861ab-0687-4868-971c-94ba7e5e2134" && (
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
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                const quantity = Math.min(
                                  Math.max(parseInt(value) || 0, 0),
                                  data.no_promocode == false ? pkg.count : 1000
                                );
                                updateQuantity(pkg.id, quantity);
                              }}
                            />

                            <button
                              className={`px-2 py-1 text-[28px] max-sm:p-0 ${
                                data.no_promocode == false &&
                                getQuantity(pkg.id) >= pkg.count
                                  ? "opacity-40 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() =>
                                updateQuantity(pkg.id, getQuantity(pkg.id) + 1)
                              }
                              disabled={
                                data.no_promocode == false &&
                                getQuantity(pkg.id) >= pkg.count
                              }
                            >
                              +
                            </button>
                          </div>
                        )}

                      {/* Mobile o'yinlar uchun maxsus tugma */}
                      {isMobile && (
                        <div>
                          <button
                            onClick={() => {
                              updateQuantity(pkg.id, getQuantity(pkg.id) + 1);
                              setShowMobileModal(true);
                            }}
                            className="w-full py-2 bg-[#FFBA00] rounded text-black font-medium mb-[10px] border-b-2 border-[black] max-sm:m-0"
                          >
                            {t("all-games-text10")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
          )}
        </div>

        {/* Korzinka paneli */}
        <div
          className={`${
            isMobile ? "hidden" : "block"
          } sticky top-10 col-span-2 bg-[#F9F9F9] rounded-lg shadow-lg p-6 h-max max-sm:fixed max-sm:top-auto max-sm:bottom-[110px] left-0 right-0 w-[90%] mx-auto max-sm:col-span-5 ${
            cart.length > 0 ? "max-sm:block" : "max-sm:hidden"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">{t("all-games-text6")}</h2>
            <div className="flex cursor-pointer" onClick={clearCart}>
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
                          {totalUC
                            .toLocaleString("fr-FR", {
                              useGrouping: true,
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 3,
                            })
                            .replace(",", ".")}{" "}
                          {gameId !== "00984e54-78f0-44f8-ad48-dac23d838bdc" &&
                          gameId !== "322d0721-1dca-4720-a0a3-68371ba8ed22" &&
                          gameId !== "7d64856a-ae76-4ddc-be75-3a361dcbf9a2"
                            ? code[0]?.name.match(/[a-zA-Z]+/)?.[0] || "UC"
                            : "diamonds"}
                        </p>
                        <p>
                          {totalPrice
                            .toLocaleString("fr-FR", {
                              useGrouping: true,
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 3,
                            })
                            .replace(",", ".")}{" "}
                          {savedCurrency}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Korzinkadagi mahsulotlar ro'yxati (faqat desktop uchun) */}
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-[#F4F4F4] py-3 px-5 rounded-[10px] shadow-lg mt-4 max-sm:hidden"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={
                          gameId !== "00984e54-78f0-44f8-ad48-dac23d838bdc" ||
                          gameId !== "322d0721-1dca-4720-a0a3-68371ba8ed22" ||
                          gameId !== "7d64856a-ae76-4ddc-be75-3a361dcbf9a2"
                            ? item.photo || "/mobile.webp"
                            : "/uccard_converted.webp"
                        }
                        alt={`${item?.name || "Unknown"} UC`}
                        width={56}
                        height={56}
                        className="w-[56px] h-[56px]"
                      />
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
                ))}
              </div>

              {/* Mobile o'yinlar uchun maxsus komponent */}
              {gameId === "00984e54-78f0-44f8-ad48-dac23d838bdc" ||
              gameId === "322d0721-1dca-4720-a0a3-68371ba8ed22" ||
              gameId === "7d64856a-ae76-4ddc-be75-3a361dcbf9a2" ? (
                <MobileGameStore
                  cart={cart}
                  clear={clearCart}
                  onClose={() => setShowPurchaseModal(false)}
                />
              ) : (
                <div className="mt-6 space-y-2 max-sm:flex max-sm:items-center max-sm:gap-5 max-sm:mt-[11px] max-sm:space-y-0">
                  {data.no_promocode == false && (
                    <button
                      onClick={() => setShowPurchaseModal(1)}
                      className="w-full py-2 bg-[#FFBA00] rounded text-black font-medium mb-[10px] border-b-2 border-[black] max-sm:m-0"
                    >
                      {t("all-games-text10")}
                    </button>
                  )}
                  {gameId !== "28f97b34-7c40-4a98-947c-a0499c108141" &&
                    gameId !== "8e3cba6c-a5db-4711-a781-c3d35d5eba7d" &&
                    gameId !== "ef5eb029-7de6-4263-ae0a-ea08d83c7ddd" && (
                      <button
                        onClick={() => setShowPurchaseModal(2)}
                        className="w-full py-2 bg-[#FFBA00] rounded text-black font-medium border-b-2 border-[black]"
                      >
                        {gameId === "3f2ef70d-6e80-4f1a-8c65-9645a2e22d95"
                          ? t("username")
                          : t("all-games-text11")}
                      </button>
                    )}
                </div>
              )}
            </>
          ) : (
            <div className="w-full flex mt-[60px] mb-[110px] justify-center max-sm:hidden">
              <Image src="/nocard.svg" alt="Clear" width={98} height={89} />
            </div>
          )}
        </div>
      </div>

      {/* Modallar */}
      {showPurchaseModal && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          cart={cart}
          totalUC={totalUC}
          totalPrice={totalPrice}
          clear={clearCart}
          savedCurrency={savedCurrency}
          gameId={gameId}
        />
      )}
      {showMobileModal && (
        <MobileModal
          cart={cart}
          gameId={gameId}
          server={server}
          clear={clearCart}
          onClose={() => setShowMobileModal(false)}
        />
      )}
    </div>
  );
};

export default GameContent;
