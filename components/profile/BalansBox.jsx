"use client";

import axiosInstance from "@/libs/axios";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { MdCheck, MdOutlineContentCopy } from "react-icons/md";
import { TfiReload } from "react-icons/tfi";
import { Alert } from "../Alert";
import Loader from "../Loader";
import UploadComponent from "../UploadComponent";
import BalansCardModal from "./BalansCardModal";

export default function BalansBox() {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("UZS");
  const [visibleCard, setVisibleCard] = useState(false);
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
  const [error2, setError2] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rublError, setRublError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState(false);
  const [comment, setComment] = useState("");
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [crypto, setCrypto] = useState(false);
  const [language, setLanguage] = useState("");
  const [copiedCardId, setCopiedCardId] = useState(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState(null);

  const handleCopyCardNumber = async (cardId, cardNumber) => {
    try {
      await navigator.clipboard.writeText(cardNumber);
      setCopiedCardId(cardId);
      setTimeout(() => setCopiedCardId(null), 2000);
    } catch (err) {
      console.error("Failed to copy card number: ", err);
    }
  };

  const handleCopyPhoneNumber = async (cardId, phoneNumber) => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopiedPhoneId(cardId);
      setTimeout(() => setCopiedPhoneId(null), 2000);
    } catch (err) {
      console.error("Failed to copy phone number: ", err);
    }
  };

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  useEffect(() => {
    const language = localStorage.getItem("language");
    setLanguage(language);
  }, []);
  const copyCryptoNumber = () => {
    const text = buttonRef.current.innerText;
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied2(true);
          setTimeout(() => setCopied2(false), 4000);
        })
        .catch(() => {
          console.log("Karta raqamini nusxalashda xatolik yuz berdi.");
        });
    }
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
    setVisibleCard((prev) => !prev);
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
        if (language === "uz") {
          setErrorMessage(error.response.data.uz[0]);
        }
        if (language === "ru") {
          setErrorMessage(error.response.data.ru[0]);
        }
        if (language === "en") {
          setErrorMessage(error.response.data.en[0]);
        }
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
      } catch (error) {
        if (error.status === 403) {
          localStorage.removeItem("profileData");
          setTimeout(() => {
            window.location.reload();
            router.push("/login");
          }, 300);
        }
        if (error.status === 401) {
          localStorage.removeItem("profileData");
          setTimeout(() => {
            window.location.reload();
            router.push("/login");
          }, 300);
        }
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
    if (!selectedCard) {
      setText(true);
      return;
    }

    const formattedData = {
      currency: selectedCurrency,
      amount: inputValue,
      chek: photo,
      from_bot: true,
      card: selectedCard.id,
    };

    setIsLoading(true);
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
        console.log(error.response.data.detail);
      } else {
        setError(true);
      }
    } finally {
      setTimeout(() => {
        setInputValue("");
        setPhoto("");
        setError(false);
        setSuccess(false);
        setIsLoading(false);
      }, 3000);
    }
  };
  const formatNumber = (num) => {
    const str = num.toString();
    if (str.includes(".")) {
      const [integerPart, decimalPart] = str.split(".");
      return `${integerPart}.${decimalPart.slice(0, 3)}`;
    }
    return str;
  };

  const FetchCryptoType1 = async () => {
    const formattedData = {
      amount: +inputValue,
    };
    if (selectedCard) {
      formattedData.type = selectedCard?.auto_pay_type;
    }
    try {
      const response = await axiosInstance.post(
        "/client/transfer-amount/create/",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCrypto(true);
    } catch (error) {
      setCrypto(false);
      setError2(true);
      if (language === "uz") {
        setErrorMessage(error.response.data.uz[0]);
      }
      if (language === "ru") {
        setErrorMessage(error.response.data.ru[0]);
      }
      if (language === "en") {
        setErrorMessage(error.response.data.en[0]);
      }
    }
  };

  const checkBalance2 = async () => {
    try {
      const response = await axiosInstance.get("client/auth/check-binance/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      if (language === "uz") {
        setErrorMessage(error.response.data.uz[0]);
      }
      if (language === "ru") {
        setErrorMessage(error.response.data.ru[0]);
      }
      if (language === "en") {
        setErrorMessage(error.response.data.en[0]);
      }
    } finally {
      setErrorMessage("");
    }
  };

  const rublAutoPay = async () => {
    try {
      const response = await axiosInstance.post(
        "client/create-code-pay-payment/",
        {
          amount: +inputValue,
          method: "sbp",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.open(response.data.url, "_blank");
    } catch (error) {
      setRublError(true);
    }
  };

  if (loading) {
    return <Loader />;
  }

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

  return (
    <div className="p-6 max-w-4xl mx-auto max-sm:p-0 max-sm:pb-4">
      {error && (
        <Alert
          onClose={() => {
            setError(false);
            window.location.reload();
          }}
          status={400}
          title={t("profile14")}
          message={t("profile15")}
        />
      )}
      {rublError && (
        <Alert
          onClose={() => {
            setRublError(false);
            window.location.reload();
          }}
          status={400}
          title={"Error"}
        />
      )}
      {error1 && (
        <Alert
          onClose={() => {
            setError1(false);
            window.location.href = "/";
          }}
          status={300}
          title={t("profile54")}
        />
      )}
      {error2 && (
        <Alert
          status={400}
          title={"Error"}
          message={errorMessage}
          onClose={() => {
            setError2(false);
            window.location.reload();
          }}
        />
      )}
      {text && (
        <Alert
          onClose={() => {
            setText(false);
          }}
          status={300}
          title={t("profile51")}
        />
      )}
      {success && (
        <Alert
          onClose={() => {
            setSuccess(false);
            window.location.href = "/";
          }}
          status={200}
          title={t("profile16")}
          message={t("profile17")}
        />
      )}
      <Link
        href={"/profile/profile-mobile"}
        className="md:px-6 py-4 max-md:border-b flex items-center max-md:gap-5 md:hidden"
      >
        <IoIosArrowBack className="text-2xl md:hidden" />
        <h2 className="text-xl font-bold md:mb-4">{t("profile2")}</h2>
      </Link>
      {/* web */}
      <div className="flex justify-between items-center mt-5 mb-8 max-sm:hidden">
        <h1 className="text-2xl font-semibold">{t("profile2")}</h1>
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
            onClick={() => {
              handleCurrencyChange("USD");
            }}
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
      {/* web */}

      <div className="grid md:grid-cols-2 gap-8 max-sm:mt-5 max-sm:gap-20">
        <div className="bg-[#FFFCF6] p-6 rounded-2xl shadow-custom max-sm:pt-0 max-sm:pb-[10px] max-sm:px-5">
          <div className="space-y-4 max-sm:space-y-[10px]">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-600 max-sm:hidden sm:w-full">
                Uzpin {t("profile18")}
              </h2>
              <div className="w-full flex items-center justify-between sm:justify-end">
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
          {/* mobile */}
          <div className="flex flex-col sm:hidden">
            <h2>{t("profile21")}</h2>
            <div className="mt-2.5">
              <button
                onClick={() => {
                  handleCurrencyChange("UZS");
                  setSelectedCard("");
                }}
                className={`px-4 py-2 rounded-tl-[5px] rounded-bl-[5px] max-sm:px-5 ${
                  selectedCurrency === "UZS"
                    ? "bg-zinc-800 text-white"
                    : "bg-gray-100 text-[#828282]"
                }`}
              >
                UZS
              </button>
              <button
                onClick={() => {
                  handleCurrencyChange("USD");
                  setSelectedCard("");
                }}
                className={`px-4 py-2  max-sm:px-5 ${
                  selectedCurrency === "USD"
                    ? "bg-zinc-800 text-white"
                    : "bg-gray-100 text-[#828282]"
                }`}
              >
                USD
              </button>
              <button
                onClick={() => {
                  handleCurrencyChange("RUB");
                  setSelectedCard("");
                }}
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
          {/* mobile */}

          <div className="space-y-4">
            {selectedCurrency !== "USD" && selectedCurrency !== "UZS" && (
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  {t("profile22")} {selectedCurrency}
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    const value = e.target.value;
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
              onClick={selectedCurrency === "RUB" ? rublAutoPay : openModal}
              disabled={
                selectedCurrency !== "USD" &&
                selectedCurrency !== "UZS" &&
                // !inputValue.trim() &&
                inputValue < 10
              }
              className={`w-full py-3 bg-[#FFC149] hover:bg-[#FFB529] text-black font-medium rounded-lg transition-colors max-sm:hidden ${
                // !inputValue.trim() &&
                selectedCurrency !== "USD" &&
                selectedCurrency !== "UZS" &&
                inputValue < 10
                  ? "bg-[#b7b7b7] hover:bg-[#b7b7b7] cursor-not-allowed"
                  : ""
              }`}
            >
              {t("profile23")}
            </button>
            <button
              onClick={
                selectedCurrency === "RUB" ? rublAutoPay : toggleCardVisibile
              }
              disabled={
                selectedCurrency !== "USD" &&
                selectedCurrency !== "UZS" &&
                inputValue < 10
                // !inputValue.trim()
              }
              className={`w-full py-3 bg-[#FFC149] hover:bg-[#FFB529] text-black font-medium rounded-lg transition-colors sm:hidden ${
                // !inputValue.trim() &&
                inputValue < 10 &&
                selectedCurrency !== "USD" &&
                selectedCurrency !== "UZS"
                  ? "bg-[#b7b7b7] hover:bg-[#b7b7b7] cursor-not-allowed"
                  : ""
              }`}
            >
              {t("profile23")}
            </button>
          </div>

          {/* {visibleCard && <BalansCardModal />} */}
          <div className={`${visibleCard ? "block" : "hidden"}`}>
            <div>
              {selectedCard?.video_url && (
                <iframe
                  width="100%"
                  height="200"
                  src={selectedCard?.video_url}
                  className="mb-5"
                  allowFullScreen
                ></iframe>
              )}
              <h3 className="font-semibold text-[16px]">{t("profile24")}</h3>
              <p className="mt-2.5 font-medium text-[#313131] text-[14px]">
                {t("profile25")}
              </p>
              <div className="flex flex-wrap gap-[11px] mt-6">
                {cart.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardSelect(card)}
                    className={`rounded-[5px] shadow-lg p-1 border ${
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
              <div className="mt-4 bg-[#f9f9f9] rounded-[5px]">
                {selectedCard.id !== "36832140-0df0-4541-9644-6bb7b8f20540" &&
                  selectedCard.id !== "444e1647-80ac-4777-a209-0e28f3a66f84" &&
                  selectedCard.id !== "07873980-c9d4-4de6-8e19-964f7d37afbe" &&
                  selectedCard?.extra_cards?.length === 0 && (
                    <>
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
                        className={`flex mx-auto items-center gap-[5px] mt-10 py-[10px] px-[15px] font-medium ${
                          selectedCard.card_number.length > 19
                            ? "text-[10px]"
                            : ""
                        } text-[16px] leading-[18px] bg-[#ffba00] rounded-[10px]`}
                        style={{
                          wordBreak:
                            selectedCard.card_number.length > 33
                              ? "break-word"
                              : "normal",
                          whiteSpace:
                            selectedCard.card_number.length > 33
                              ? "pre-line"
                              : "nowrap",
                          fontSize:
                            selectedCard.card_number.length > 33 ? "10px" : "",
                        }}
                        onClick={copyCardNumber}
                      >
                        {copied ? (
                          <MdCheck size={24} />
                        ) : (
                          <MdOutlineContentCopy size={24} />
                        )}
                        {selectedCard.card_number}
                      </button>
                    </>
                  )}

                {selectedCard.id === "36832140-0df0-4541-9644-6bb7b8f20540" ? (
                  <>
                    {crypto && (
                      <>
                        <Image
                          src="/trc20.jpg"
                          className="mt-5 mx-auto w-[200px] h-[200px]"
                          width={241}
                          height={241}
                          alt="img"
                        />
                        <button
                          ref={buttonRef}
                          className={`flex items-center gap-[5px] mx-auto mt-3 py-[10px] px-[15px] font-medium ${
                            selectedCard.card_number.length > 19
                              ? "text-[9px]"
                              : ""
                          } text-[16px] leading-[18px] bg-[#ffba00] rounded-[10px]`}
                          onClick={copyCryptoNumber}
                        >
                          {copied2 ? (
                            <MdCheck size={24} />
                          ) : (
                            <MdOutlineContentCopy size={24} />
                          )}
                          TAKhi9hHNuajmi5WyWj2fLDmaCFUKPuGVQ
                        </button>
                      </>
                    )}
                  </>
                ) : selectedCard.id ===
                  "444e1647-80ac-4777-a209-0e28f3a66f84" ? (
                  <>
                    {crypto && (
                      <>
                        <Image
                          src="/bep20.jpg"
                          className="mt-5 mx-auto w-[200px] h-[200px]"
                          width={241}
                          height={241}
                          alt="img"
                        />
                        <button
                          ref={buttonRef}
                          className={`flex items-center gap-[5px] mx-auto mt-3 py-[10px] px-[15px] font-medium ${
                            selectedCard.card_number.length > 19
                              ? "text-[9px]"
                              : ""
                          } text-[16px] leading-[18px] bg-[#ffba00] rounded-[10px]`}
                          onClick={copyCryptoNumber}
                        >
                          {copied2 ? (
                            <MdCheck size={24} />
                          ) : (
                            <MdOutlineContentCopy size={24} />
                          )}
                          0x1b246eee83c122106612d36bbaedc241933f4d94
                        </button>
                      </>
                    )}
                  </>
                ) : selectedCard.id ===
                  "07873980-c9d4-4de6-8e19-964f7d37afbe" ? (
                  <>
                    {crypto && (
                      <>
                        <Image
                          src="/aptos.jpg"
                          className="mt-5 mx-auto w-[200px] h-[200px]"
                          width={241}
                          height={241}
                          alt="img"
                        />
                        <button
                          ref={buttonRef}
                          className={`flex items-center gap-[5px] mx-auto mt-3 py-[10px] px-[15px] font-medium ${
                            selectedCard.card_number.length > 19
                              ? "text-[9px]"
                              : ""
                          } text-[16px] leading-[18px] bg-[#ffba00] rounded-[10px]`}
                          onClick={copyCryptoNumber}
                        >
                          {copied2 ? (
                            <MdCheck size={24} />
                          ) : (
                            <MdOutlineContentCopy size={24} />
                          )}
                          <span className="text-left">
                            0x523f93300e905007437ca0c7180716
                            <br className="block sm:hidden" />
                            384b6d690b11093f7b50816cff4b9c005d
                          </span>
                        </button>
                      </>
                    )}
                  </>
                ) : null}

                {(crypto || selectedCard?.is_auto_pay === false) &&
                  selectedCard?.extra_cards.map((card, index) => (
                    <div
                      key={index}
                      className="w-full border border-[#ffba00] rounded-[5px] p-1 mt-3"
                    >
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() =>
                            handleCopyCardNumber(card.id, card.card_number)
                          }
                          className="flex items-center gap-1 font-medium text-[14px] text-[#ffba00] leading-[18px] rounded-[10px] cursor-pointer"
                        >
                          {copiedCardId === card.id ? (
                            <MdCheck size={18} />
                          ) : (
                            <MdOutlineContentCopy size={18} />
                          )}
                          {card.card_number}
                        </button>
                        <button
                          onClick={() =>
                            handleCopyPhoneNumber(card.id, card.phone_number)
                          }
                          className={`flex items-center gap-[5px] font-medium text-[14px] text-[#ffba00] leading-[18px] rounded-[10px] cursor-pointer ${
                            card.phone_number ? "" : "hidden"
                          }`}
                        >
                          {copiedPhoneId === card.id ? (
                            <MdCheck size={18} />
                          ) : (
                            <MdOutlineContentCopy size={18} />
                          )}
                          {card.phone_number}
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <p>{card.full_name}</p>
                        <p>{card.bank_name}</p>
                      </div>
                    </div>
                  ))}

                {(selectedCurrency === "USD" || selectedCurrency === "UZS") &&
                  selectedCard?.id !==
                    "8f31f905-d153-4cb9-8514-5c3c5b53dac5" && (
                    <div className={`flex flex-col items-center mt-5`}>
                      <label className="block font-normal text-[20px] leading-[22px] mb-2">
                        {t("profile22")} {selectedCurrency}
                      </label>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[0-9.]*$/.test(value)) {
                            setInputValue(value);
                          }
                        }}
                        placeholder={t("profile22")}
                        className="max-w-[482px] w-full p-3 border rounded-lg border-[#E7E7E7] bg-[#F9F9F9] focus:ring-yellow-400"
                      />
                    </div>
                  )}

                {(selectedCard.id === "36832140-0df0-4541-9644-6bb7b8f20540" ||
                  selectedCard.id === "444e1647-80ac-4777-a209-0e28f3a66f84" ||
                  selectedCard.id === "07873980-c9d4-4de6-8e19-964f7d37afbe" ||
                  selectedCurrency === "UZS") && (
                  <div
                    className={`flex justify-center ${
                      selectedCard?.is_auto_pay === false ? "hidden" : ""
                    }`}
                  >
                    {!crypto ? (
                      <button
                        onClick={FetchCryptoType1}
                        disabled={
                          !selectedCard ||
                          !inputValue ||
                          (selectedCurrency === "UZS" &&
                            parseFloat(inputValue) < 1000)
                        }
                        className={`mx-auto mt-10 font-medium leading-[18px] py-[10px] px-[60px] rounded-[10px] relative group ${
                          !selectedCard ||
                          !inputValue ||
                          (selectedCurrency === "UZS" &&
                            parseFloat(inputValue) < 1000)
                            ? "bg-[#b7b7b7] cursor-not-allowed"
                            : "bg-[#ffba00] cursor-pointer"
                        }`}
                      >
                        {t("next")}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          checkBalance2();
                        }}
                        className={`max-w-[482px] mx-auto mt-5 flex items-center gap-[5px] py-[10px] px-[15px] font-medium text-[16px] text-white leading-[18px] rounded-[10px] ${
                          selectedCard && inputValue
                            ? "cursor-pointer bg-green-600"
                            : "cursor-not-allowed bg-[#b7b7b7]"
                        }`}
                      >
                        {t("pay")} <FaCheck size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            <div>
              {selectedCard?.id === "8f31f905-d153-4cb9-8514-5c3c5b53dac5" ? (
                <div className="p-5 mt-10 flex flex-col items-center">
                  <div className="flex items-start space-x-3 max-w-[450px]">
                    <span className="text-yellow-500 text-2xl">⚠️</span>
                    <p className="text-red-600 text-base">{t("comment")}</p>
                  </div>
                  <button
                    className={`flex items-center gap-[5px] mt-10 py-[10px] px-[15px] font-medium ${
                      selectedCard.card_number.length > 19 ? "text-[9px]" : ""
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
                    {t("pay")} <FaCheck size={18} />
                  </button>
                </div>
              ) : (
                selectedCard?.is_auto_pay === false && (
                  <>
                    <div
                      className={`max-w-[482px] mt-5 p-5 mx-auto border-2 border-gray-500 border-dashed rounded-lg text-center ${
                        photo || !inputValue ? "hidden" : ""
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
                        {t("profile26")}
                      </p>
                      <p className="mt-2.5 text-[12px] text-[#acacac]">
                        {t("login-text12")}
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
                  </>
                )
              )}

              {photo.length ? (
                <div className="flex flex-col">
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
                    className={`flex justify-center mx-auto mt-5 font-medium leading-[18px] bg-[#ffba00] py-[10px] px-[60px] rounded-[10px]`}
                  >
                    {isLoading ? (
                      <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                    ) : (
                      t("profile28")
                    )}
                  </button>
                </div>
              ) : null}
            </div>
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
