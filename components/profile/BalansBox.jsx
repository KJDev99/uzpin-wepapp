"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import BalansCardModal from "./BalansCardModal";
import axiosInstance from "@/libs/axios";
import Loader from "../Loader";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import { MdCheck, MdOutlineContentCopy } from "react-icons/md";
import UploadComponent from "../UploadComponent";
import { Alert } from "../Alert";
import { useTranslation } from "react-i18next";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { TfiReload } from "react-icons/tfi";

export default function BalansBox() {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("UZS");
  const [visibleCard, setVisibleCard] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [balance, setBalance] = useState();
  const [token, setToken] = useState(null);
  const [fullname, setFullName] = useState(null);
  const [photo, setPhoto] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [error1, setError1] = useState(false);
  const [success, setSuccess] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [comment, setComment] = useState("");
  const [copied1, setCopied1] = useState(false);

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
  const copyCardNumber1 = () => {
    if (selectedCard.card_number) {
      navigator.clipboard
        .writeText(comment)
        .then(() => {
          setCopied1(true);
          setTimeout(() => setCopied1(false), 4000);
        })
        .catch(() => {
          console.log("Karta raqamini nusxalashda xatolik yuz berdi.");
        });
    }
  };

  const toggleCardVisibile = () => {
    setVisibleCard((prev) => true);
    window.scrollTo({
      top: 500,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileData = localStorage.getItem("profileData");
      if (storedProfileData) {
        const parsedProfileData = JSON.parse(storedProfileData);
        setToken(parsedProfileData?.access || null);
        setFullName(parsedProfileData?.fullname || null);
      }
    }
  }, []);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  useEffect(() => {
    setLoading(true);
    const fetchHandle = async () => {
      try {
        const response = await axiosInstance.get("/client/balance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBalance(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchHandle();
    }
  }, [token]);

  const checkBalance = async () => {
    if (token) {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axiosInstance.get("client/auth/check-binance/", {
          headers,
        });
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Token mavjud emas!");
    }
  };

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
        if (error.status === 403) {
          localStorage.removeItem("profileData");
          setTimeout(() => {
            window.location.reload();
            router.push("/login");
          }, 300);
        }
        console.log(error.status);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchCard();
    }
  }, [token, selectedCurrency]);

  const handleUploadSuccess = (key, url) => {
    setPhoto(url);
  };

  const clearFile = () => {
    modalRef.current.value = "";
    setPhoto("");
  };

  const fetchHandle = async () => {
    setLoading(true);
    const formattedData = {
      currency: selectedCurrency,
      amount: inputValue,
      chek: photo,
      from_bot: false,
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
      if (
        error.response.data[0] ===
        "Sizda hali kutilayotgan taranzaksiya mavjud!"
      ) {
        setError1(true);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        setInputValue("");
        setPhoto("");
        // onClose();
        setError(false);
        setSuccess(false);
        location.reload();
      }, 3000);
    }
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0"; // Xatoni oldini olish
    const str = num.toString();
    if (str.includes(".")) {
      const [integerPart, decimalPart] = str.split(".");
      return `${integerPart}.${decimalPart.slice(0, 3)}`;
    }
    return str;
  };

  if (selectedCard?.id === "8f31f905-d153-4cb9-8514-5c3c5b53dac5") {
    const fetchComment = async () => {
      try {
        const response = await axiosInstance.get(
          "client/auth/user-binance-comment/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComment(response.data.comment);
      } catch (error) {
        console.error("Ma'lumotni olishda xatolik:", error);
      }
    };

    fetchComment();
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto max-sm:p-0 max-sm:pb-4 mb-20">
      {error && (
        <Alert status={400} title={t("profile14")} message={t("profile15")} />
      )}
      {error1 && <Alert status={300} title={t("profile55")} />}
      {success && (
        <Alert status={200} title={t("profile16")} message={t("profile17")} />
      )}
      <div className="px-6 py-4 max-md:border-b max-md:hidden">
        <h2 className="text-xl font-bold md:mb-4">{t("profile1")}</h2>
      </div>
      <Link
        href={"/profile/profile-mobile"}
        className="md:px-6 py-4 max-md:border-b flex items-center max-md:gap-5 md:hidden"
      >
        <IoIosArrowBack className="text-2xl md:hidden" />
        <h2 className="text-xl font-bold md:mb-4">{t("profile2")}</h2>
      </Link>
      <div className="flex justify-between items-center mt-5 mb-8 max-sm:hidden">
        <h1 className="text-2xl font-semibold">Balans</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleCurrencyChange("UZS")}
            className={`px-4 py-2 rounded-lg ${
              selectedCurrency === "UZS"
                ? "bg-zinc-800 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            UZS
          </button>
          <button
            onClick={() => handleCurrencyChange("USD")}
            className={`px-4 py-2 rounded-lg ${
              selectedCurrency === "USD"
                ? "bg-zinc-800 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            USD
          </button>
          <button
            onClick={() => handleCurrencyChange("RUB")}
            className={`px-4 py-2 rounded-lg ${
              selectedCurrency === "RUB"
                ? "bg-zinc-800 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            RUB
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-sm:mt-5 max-sm:gap-12">
        <div className="bg-[#FFFCF6] p-6 rounded-2xl shadow-custom max-sm:pt-0 max-sm:pb-[10px] max-sm:px-5">
          <div className="space-y-4 max-sm:space-y-[10px]">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-600 max-sm:hidden">
                Uzpin {t("profile18")}
              </h2>
              <div className="w-full flex items-center justify-between">
                <h2 className="sm:hidden font-semibold text-[20px] text-[#313131]">
                  {fullname}
                </h2>
                <button
                  onClick={checkBalance}
                  className={`flex items-center gap-2 py-2 px-3 font-medium text-[16px] text-white leading-[18px] bg-green-600 rounded-[10px]`}
                >
                  {t("update")} <TfiReload size={20} />
                </button>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="sm:hidden font-normal text-[14px] text-[#313131]">
                {t("profile19")}
              </p>
              <span className="text-4xl font-bold flex max-sm:font-semibold max-sm:text-[20px] max-sm:ml-[30px]">
                {selectedCurrency == "UZS" && balance?.account_uzs
                  ? formatNumber(balance?.account_uzs)
                  : ""}
                {console.log(formatNumber(balance?.account_uzs))}
                {selectedCurrency == "USD" && balance?.account_usd
                  ? formatNumber(balance?.account_usd)
                  : ""}
                {selectedCurrency == "RUB" && balance?.account_rub
                  ? formatNumber(balance?.account_rub)
                  : ""}
                {(selectedCurrency == "UZS" && balance?.account_uzs) ||
                (selectedCurrency == "USD" && balance?.account_usd) ||
                (selectedCurrency == "RUB" && balance?.account_rub)
                  ? ""
                  : 0}
              </span>
              <span className="text-gray-600 max-sm:font-medium max-sm:text-sm max-sm:text-[#000000]">
                {selectedCurrency}
              </span>
            </div>
            <div className="text-gray-600 max-sm:hidden">{fullname}</div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">{t("profile20")}</h2>

          <div className="flex flex-col sm:hidden">
            <h2>{t("profile21")}</h2>
            <div className="mt-2.5">
              <button
                onClick={() => handleCurrencyChange("UZS")}
                className={`px-4 py-2 rounded-l-[5px] max-sm:px-5 ${
                  selectedCurrency === "UZS"
                    ? "bg-zinc-800 text-white"
                    : "bg-gray-100 text-[#828282]"
                }`}
              >
                UZS
              </button>
              <button
                onClick={() => handleCurrencyChange("USD")}
                className={`px-4 py-2 max-sm:px-5 ${
                  selectedCurrency === "USD"
                    ? "bg-zinc-800 text-white"
                    : "bg-gray-100 text-[#828282]"
                }`}
              >
                USD
              </button>
              <button
                onClick={() => handleCurrencyChange("RUB")}
                className={`px-4 py-2 rounded-br-[5px] rounded-tr-[5px] max-sm:px-5 ${
                  selectedCurrency === "RUB"
                    ? "bg-zinc-800 text-white"
                    : "bg-gray-100 text-[#828282]"
                }`}
              >
                RUB
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {selectedCurrency !== "USD" && (
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {t("profile22")} {selectedCurrency}
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Faqat raqamlar va '.' ni qabul qilish uchun tekshirish
                    if (/^[0-9.]*$/.test(value)) {
                      setInputValue(value);
                    }
                  }}
                  placeholder={t("profile22")}
                  className="w-full p-3 border rounded-lg border-[#E7E7E7] bg-[#F9F9F9] focus:ring-yellow-400"
                />
              </div>
            )}
            <button
              onClick={toggleCardVisibile}
              disabled={!inputValue && selectedCurrency !== "USD"}
              className={`w-full py-3 text-black font-medium rounded-lg transition-colors sm:hidden ${
                inputValue || selectedCurrency === "USD"
                  ? "bg-[#FFC149] hover:bg-[#FFB529]"
                  : "bg-[#9d9d9d] cursor-not-allowed"
              }`}
            >
              {t("profile23")}
            </button>
          </div>

          <div className={`${visibleCard ? "block " : "hidden"}`}>
            <div>
              <h3 className="font-semibold text-[16px] ">{t("profile24")}</h3>
              <p className="mt-2.5 font-medium text-[#313131] text-[14px]">
                {t("profile25")}
              </p>
              <div className="flex flex-wrap gap-[11px] mt-6">
                {cart.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardSelect(card)}
                    className={`rounded-[5px] p-1 border ${
                      selectedCard?.id === card.id
                        ? "border-[#ffba00]"
                        : "border-[#fff]"
                    }`}
                  >
                    <Image
                      src={card.photo}
                      className="rounded-[3px] w-[72px] h-[45px]"
                      width={72}
                      height={45}
                      alt={card.card_name}
                    />
                    <p className="mt-[6px] font-normal text-[14px] text-[#313131]">
                      {card.card_name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {selectedCard && (
              <>
                <div className="mt-[30px] bg-[#f9f9f9] rounded-[5px] py-[10px]">
                  <p className="font-semibold text-[16px]">
                    {selectedCard.card_name}
                  </p>
                  <p className="mt-[6px] font-semibold text-[16px]">
                    {selectedCard.card_holder}
                  </p>
                  <Image
                    src={selectedCard.photo}
                    className="w-[210px] h-[132px] rounded-[10px] mt-5 mx-auto"
                    width={210}
                    height={132}
                    alt="card"
                  />
                  <button
                    className={`flex items-center gap-[5px] mt-5 mx-auto font-medium ${
                      selectedCard.card_number.length > 19
                        ? "text-[10px] flex-col p-1"
                        : "p-3"
                    } text-[14px] bg-[#ffba00] rounded-[5px]`}
                    onClick={copyCardNumber}
                  >
                    {copied ? (
                      <MdCheck size={16} />
                    ) : (
                      <MdOutlineContentCopy size={16} />
                    )}
                    {selectedCard.card_number}
                  </button>
                  {selectedCurrency === "USD" &&
                    selectedCard?.id !==
                      "8f31f905-d153-4cb9-8514-5c3c5b53dac5" && (
                      <div className="flex flex-col items-center mt-10">
                        <label className="block font-normal text-[20px] leading-[22px] mb-2">
                          {t("profile22")} {selectedCurrency}
                        </label>
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Faqat raqamlar va '.' ni qabul qilish uchun tekshirish
                            if (/^[0-9.]*$/.test(value)) {
                              setInputValue(value);
                            }
                          }}
                          placeholder={t("profile22")}
                          className="max-w-[482px] w-full p-3 border rounded-lg border-[#E7E7E7] bg-[#F9F9F9] focus:ring-yellow-400"
                        />
                      </div>
                    )}
                  {selectedCard?.id ===
                  "8f31f905-d153-4cb9-8514-5c3c5b53dac5" ? (
                    <>
                      <div className="p-5 mt-10 flex flex-col items-center">
                        <div className="flex items-start space-x-3 max-w-[450px]">
                          <span className="text-yellow-500 text-2xl">⚠️</span>
                          <p className="text-red-600 text-base">
                            {t("comment")}
                          </p>
                        </div>
                        <button
                          className={`flex items-center gap-[5px] mt-10 py-[10px] px-[15px] font-medium ${
                            selectedCard.card_number.length > 19
                              ? "text-[9px]"
                              : ""
                          } text-[16px] leading-[18px] bg-[#ffba00] rounded-[10px]`}
                          onClick={copyCardNumber1}
                        >
                          {copied1 ? (
                            <MdCheck size={24} />
                          ) : (
                            <MdOutlineContentCopy size={24} />
                          )}
                          {comment}
                        </button>
                        <button
                          onClick={checkBalance}
                          className={`flex items-center gap-[5px] mt-5 py-[10px] px-[15px] font-medium text-[16px] text-white leading-[18px] bg-green-600 rounded-[10px]`}
                        >
                          {t("pay")}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div
                      className={`max-w-[482px] mb-[100px] mt-5 p-5 mx-auto border-2 border-gray-500 border-dashed rounded-lg text-center ${
                        photo ? "hidden" : ""
                      }`}
                    >
                      <Image
                        src="/file-upload.svg"
                        className="mx-auto"
                        width={26}
                        height={26}
                        alt="img"
                      />
                      <p className="mt-2.5 text-[14px] text-[#313131]">
                        {t("profile54")}
                      </p>
                      <div className="hidden">
                        <UploadComponent
                          onUploadingChange={setLoading1}
                          triggerRef={modalRef}
                          onUploadSuccess={(url) =>
                            handleUploadSuccess("cover", url)
                          }
                        />
                      </div>
                      <button
                        onClick={() => modalRef.current.click()}
                        className="mt-2.5 font-medium text-[14px] bg-[#ffba00] py-3 px-10 rounded-[5px]"
                      >
                        {loading1 ? (
                          <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                        ) : (
                          t("profile27")
                        )}
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  {photo.length ? (
                    <div className="flex flex-col mb-[120px]">
                      <div className="max-w-[482px] w-full mx-auto mt-5 py-5 px-8 border border-[#828282] rounded-[10px] flex items-center justify-between">
                        <div>
                          <p>{photo.split("/").pop()}</p>
                        </div>
                        <button
                          onClick={clearFile}
                          className="text-black underline"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                      <button
                        onClick={fetchHandle}
                        className="mx-auto mt-5 font-medium leading-[18px] bg-[#ffba00] py-[10px] px-[60px] rounded-[10px]"
                      >
                        {t("profile28")}
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <BalansCardModal
        isOpen={isOpen}
        onClose={closeModal}
        selectedCurrency={selectedCurrency}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </div>
  );
}
