"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GoTrash } from "react-icons/go";
import { PurchaseModal } from "./PurchaseModal";
import { Alert } from "../Alert";
import axiosInstance from "@/libs/axios";
import Loader from "../Loader";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

export default function GameStore({ data }) {
  const { t } = useTranslation();
  const [cart, setCart] = useState([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  // const [showModalMessage, setShowModalMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState([]);
  const [amound, setAmound] = useState(0);

  const savedCurrency =
    typeof window !== "undefined"
      ? localStorage.getItem("currency") || "uzs"
      : "uzs";

  const fetchStats = async () => {
    setLoading(true);
    if (data.id) {
      try {
        const response = await axiosInstance.get(
          `/client/promocodes/${data.id}`,
          {
            headers: {
              Currency: savedCurrency,
            },
          }
        );
        setCode(response.data || []);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchStats();
  }, [data.id]);

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
      <div className="w-full mx-auto font-sans px-4 pb-5">
        <Link
          href={"/all-games"}
          className=" py-4  flex items-center max-md:gap-5"
        >
          <IoIosArrowBack className="text-2xl" />
          <h2 className="text-xl font-bold md:mb-4">{data.name}</h2>
        </Link>
        <div
          className={`grid ${cart.length > 0 ? "mb-[300px]" : " mb-[110px]"}`}
        >
          <div className="grid grid-cols-2  gap-2">
            {code.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-lg border hover:border-[#FFBA00] transition-all ease-linear bg-white  h-max"
              >
                <div className="flex flex-col px-[10px] pb-[10px] pt-5">
                  {pkg.photo ? (
                    <Image
                      src={pkg.photo}
                      alt={`${pkg.name} UC`}
                      width={120}
                      height={120}
                      className="mb-4  w-[110px] h-[110px] mx-auto"
                    />
                  ) : (
                    <Image
                      src="/mobile.webp"
                      alt={`${pkg.name} UC`}
                      width={120}
                      height={120}
                      className="mb-4  w-[110px] h-[110px] mx-auto"
                    />
                  )}
                  <h3 className="text-[#313131] mb-2 line-clamp-1 font-medium text-sm">
                    {pkg.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-[#313131] mb-4 text-xs text-nowrap leading-[14px]">
                      {pkg.price.toLocaleString()} {savedCurrency}
                    </p>
                    <p className="text-[#828282] text-xs text-nowrap mb-4 text-[10px] leading-[11px]">
                      {t("all-games-text5")} {pkg.count}
                    </p>
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
                        if (value !== e.target.value) e.target.value = quantity;
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
            ))}
          </div>

          <div
            className={` bg-[#F9F9F9] rounded-lg shadow-lg p-6 h-max w-[90%] bottom-[100px] left-[50%] translate-x-[-50%] fixed mx-auto mt-5 ${
              cart.length > 0 ? "block" : "hidden"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium">{t("all-games-text6")}</h2>
              <div className="flex cursor-pointer" onClick={() => ClearTash()}>
                <p className="text-[#828282] flex gap-[10px] items-center text-sm leading-4">
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
                      {/* <span className="hidden">{t("all-games-text8")}</span> */}
                      <div className="flex justify-between font-medium leading-[18px]">
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
                </div>
                <div className="flex items-center gap-2 mt-[11px] space-y-0">
                  <button
                    onClick={() => setShowPurchaseModal(1)}
                    className="w-full py-2 bg-[#FFBA00] rounded text-black font-medium border-b-2 border-[black] text-nowrap px-2"
                  >
                    {t("all-games-text10")}
                  </button>
                  <button
                    onClick={() => setShowPurchaseModal(2)}
                    className="w-full py-2 bg-[#FFBA00] rounded text-black font-medium border-b-2 border-[black] text-nowrap px-2"
                  >
                    {t("all-games-text11")}
                  </button>
                </div>
              </>
            ) : (
              <div
                className={`w-full flex mt-[60px] mb-[110px] justify-center ${
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
          />
        )}
      </div>
    </>
  );
}
