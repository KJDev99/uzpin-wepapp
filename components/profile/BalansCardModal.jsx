"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { MdCheck, MdOutlineContentCopy } from "react-icons/md";
import UploadComponent from "../UploadComponent";
import axiosInstance from "@/libs/axios";
import { Alert } from "../Alert";
import Loader from "../Loader";

export default function BalansCardModal({
  isOpen,
  onClose,
  selectedCurrency,
  inputValue,
  setInputValue,
}) {
  const modalRef = useRef(null);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [photo, setPhoto] = useState("");
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);

  const [copied, setCopied] = useState(false);
  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  const copyCardNumber = () => {
    if (selectedCard.card_number) {
      navigator.clipboard
        .writeText(selectedCard.card_number)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 4000);
        })
        .catch(() => {
          console.log("Karta raqamini nusxalashda xatolik yuz berdi.");
        });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && isOpen) {
      const storedProfileData = localStorage.getItem("profileData");
      if (storedProfileData) {
        const parsedProfileData = JSON.parse(storedProfileData);
        setToken(parsedProfileData?.access || null);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    setLoading(true);
    const fetchCard = async () => {
      try {
        const response = await axiosInstance.get(
          `/client/card/${selectedCurrency}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCart(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchCard();
    }
  }, [token, selectedCurrency]);

  if (!isOpen) {
    return null;
  }

  const handleUploadSuccess = (key, url) => {
    setPhoto(url);
  };

  const clearFile = () => {
    modalRef.current.value = "";
    setPhoto("");
  };

  const fetchHandle = async () => {
    const formattedData = {
      currency: selectedCurrency,
      amount: inputValue,
      chek: photo,
      from_bot: true,
      card: selectedCard.id,
    };

    try {
      const response = await axiosInstance.post(
        "/client/transaction/create",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(true);
    } catch (error) {
      setError(true);
      console.log(error);
    } finally {
      setTimeout(() => {
        setInputValue("");
        setPhoto("");
        onClose();
        setError(false);
        setSuccess(false);
      }, 3000);
    }
  };

  if (loading) <Loader />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      {error && (
        <Alert
          status={false}
          title="Mablag’ yetarli emas!"
          message="Iltimos hisobingizni to’ldiring"
        />
      )}
      {success && (
        <Alert
          status={true}
          title="Muvaffaqiyatli bajarildi!"
          message="Iltimos haridingiz tasdiqlanishini kuting"
        />
      )}
      <div className="bg-white rounded-[10px] shadow-lg">
        <div className="flex relative justify-between">
          <div className="w-[682px] mt-8 ml-8 mb-8">
            <p className="font-medium text-[20px] leading-[22px]">
              To&apos;lovni amalga oshirish uchun quyidagi kartalardan birini
              tanlang
            </p>
            <div className="flex gap-[30px] mt-[18px]">
              {cart.length > 0 &&
                cart.map((card) => (
                  <div key={card.id} onClick={() => handleCardSelect(card)}>
                    <Image
                      src={card.photo}
                      className={`rounded-[5px] w-[127px] h-[81px] p-1  cursor-pointer border-2 ${
                        selectedCard?.id === card.id
                          ? " border-[#ffbb00]"
                          : " border-[#fff]"
                      }`}
                      width={123}
                      height={77}
                      alt={card.card_name}
                    />
                  </div>
                ))}
            </div>
            <p className="mt-[38px] font-medium text-[20px] leading-[22px]">
              Pul o&apos;tkazmasi chekini yuklang
            </p>
            <div
              className={`max-w-[482px] mt-5 p-[35px] mx-auto border-2 border-gray-500 border-dashed rounded-lg text-center ${
                photo ? "hidden" : ""
              }`}
            >
              <Image
                src="/file-upload.svg"
                className="mx-auto"
                width={40}
                height={40}
                alt="img"
              />
              <p className="mt-2.5 text-[14px] leading-4 text-[#828282]">
                Nusxa olingan chekni qo&apos;ying
              </p>
              <p className="mt-2.5 text-[14px] leading-4 text-[#828282]">
                yoki
              </p>
              <div className="hidden">
                <UploadComponent
                  triggerRef={modalRef}
                  onUploadSuccess={(url) => handleUploadSuccess("cover", url)}
                />
              </div>
              <button
                onClick={() => modalRef.current.click()}
                className="mt-2.5 font-medium text-xl border border-black py-2 px-8 rounded-[10px]"
              >
                Faylni tanlang
              </button>
            </div>
            {photo.length && (
              <div className="flex flex-col">
                <div className="max-w-[482px] w-full mx-auto mt-5 py-5 px-8 border border-[#828282] rounded-[10px] flex items-center justify-between">
                  <div>
                    <p>check</p>
                  </div>
                  <button onClick={clearFile} className="text-black underline">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <button
                  onClick={fetchHandle}
                  className="mx-auto mt-5 font-medium leading-[18px] bg-[#ffba00] py-[10px] px-[60px] rounded-[10px]"
                >
                  Yuborish
                </button>
              </div>
            )}
          </div>
          {selectedCard && (
            <div className="w-[310px] px-[24px] pt-8 pb-8 bg-[#f9f9f9] rounded-tr-[10px] rounded-br-[10px]">
              <p className="font-semibold text-[24px] leading-[28px]">
                {selectedCard.card_name}
              </p>
              <p className="mt-2.5 font-semibold text-[24px] leading-[28px]">
                {selectedCard.card_holder}
              </p>
              <Image
                src={selectedCard.photo}
                className="mt-5 rounded-xl w-[241px] h-[152px]"
                width={241}
                height={152}
                alt="img"
              />
              <button
                className="flex items-center gap-[5px] mt-10 py-[10px] px-[15px] font-medium text-[16px] leading-[18px] bg-[#ffba00] rounded-[10px]"
                onClick={copyCardNumber}
              >
                {copied ? (
                  <MdCheck size={24} />
                ) : (
                  <MdOutlineContentCopy size={24} />
                )}
                {copied
                  ? "Karta raqamidan nusxa olindi"
                  : "Karta raqamidan nusxa olish"}
              </button>
              <p className="mt-[87px] text-[14px] leading-[18px]">
                *Balansni to&apos;ldirishda muammoga duch kelsangiz Telegram
                orqali <a href="t.me/Barbossa_gaming">@Barbossa_gaming</a> ga
                murojaat qiling
              </p>
            </div>
          )}
          <button onClick={onClose} className="absolute top-2 right-2">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
