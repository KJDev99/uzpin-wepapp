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
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState([]);

  const fetchStats = async () => {
    setLoading(true);
    if (data.id) {
      try {
        const response = await axiosInstance.get(
          `/client/promocodes/${data.id}`
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
  }, [data]);

  const updateQuantity = (packageId, increment) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === packageId);
      if (!existingItem) {
        if (!increment) return prevCart;
        const newItem = {
          ...code.find((p) => p.id === packageId),
          quantity: 1,
        };
        return [...prevCart, newItem];
      }

      if (increment) {
        return prevCart.map((item) =>
          item.id === packageId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        if (existingItem.quantity === 1) {
          return prevCart.filter((item) => item.id !== packageId);
        }
        return prevCart.map((item) =>
          item.id === packageId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  };

  const getQuantity = (packageId) => {
    return cart.find((item) => item.id === packageId)?.quantity || 0;
  };

  const totalUC = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const ClearTash = () => {
    setCart([]);
  };

  if (loading) {
    return <Loader />;
  }
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
        <div className="grid mb-[40px]">
          <div className="grid grid-cols-2  gap-2">
            {code.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-lg p-2 border hover:border-[#FFBA00] transition-all ease-linear bg-white  h-max"
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
                      src="/uc.png"
                      alt={`${pkg.name} UC`}
                      width={120}
                      height={120}
                      className="mb-4  w-[110px] h-[110px] mx-auto"
                    />
                  )}
                  <h3 className="text-[#313131] mb-2 font-medium text-sm">
                    {pkg.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-[#313131] mb-4 text-xs leading-[14px]">
                      {pkg.price.toLocaleString()} UZS
                    </p>
                    <p className="text-[#828282] text-xs mb-4 text-[10px] leading-[11px]">
                      {t("all-games-text5")} {pkg.count}
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <button
                      className={`px-2 py-1 text-[28px] p-0 ${
                        getQuantity(pkg.id) === 0
                          ? "opacity-40 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => updateQuantity(pkg.id, false)}
                      disabled={getQuantity(pkg.id) === 0}
                    >
                      -
                    </button>
                    <span className="  border rounded-[10px] bg-[#F4F4F4] border-t-[#ACACAC] text-lg py-[7px] px-[35px]">
                      {getQuantity(pkg.id)}
                    </span>
                    <button
                      className={`px-2 py-1 text-[28px] p-0 ${
                        getQuantity(pkg.id) >= pkg.count
                          ? "opacity-40 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => updateQuantity(pkg.id, true)}
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
            className={` bg-[#F9F9F9] rounded-lg shadow-lg p-6 h-max fixed bottom-[110px] left-0 right-0 w-[90%] mx-auto ${
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
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-[#F4F4F4] py-3 px-5 rounded-[10px] shadow-lg mt-4 hidden"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src="/uccard.png"
                          alt={`${item.name} UC`}
                          width={40}
                          height={40}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span>
                        {(item.price * item.quantity).toLocaleString()} UZS
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex flex-col">
                      <span className="hidden">{t("all-games-text8")}</span>
                      <div className="flex justify-between font-medium leading-[18px]">
                        <div className="sm:hidden">{t("all-games-text9")}</div>
                        <div>{totalPrice.toLocaleString()} UZS</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-[11px] space-y-0">
                  <button
                    onClick={() => setShowPurchaseModal(1)}
                    className="w-full py-2 bg-[#FFBA00] rounded text-black font-medium border-b-2 border-[black]"
                  >
                    {t("all-games-text10")}
                  </button>
                  <button
                    onClick={() => setShowPurchaseModal(2)}
                    className="w-full py-2 bg-[#FFBA00] rounded text-black font-medium border-b-2 border-[black]"
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
          />
        )}
      </div>
    </>
  );
}
