"use client";

import axiosInstance from "@/libs/axios";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";
import { MdCheck, MdOutlineContentCopy } from "react-icons/md";
import { Alert } from "../Alert";
import Loader from "../Loader";
import UploadComponent from "../UploadComponent";

export default function BalansCardModal({
  isOpen,
  onClose,
  selectedCurrency,
  inputValue,
  setInputValue,
}) {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const [error, setError] = useState(false);
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [photo, setPhoto] = useState("");
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [comment, setComment] = useState("");
  const [crypto, setCrypto] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
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

  useEffect(() => {
    const language = localStorage.getItem("language");
    setLanguage(language);
  }, []);

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  const checkBalance1 = async () => {
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

  const copyCardNumber1 = () => {
    if (comment) {
      navigator.clipboard
        .writeText(comment)
        .then(() => {
          setCopied1(true);
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
    setLoading(true);
    const formattedData = {
      currency: selectedCurrency,
      amount: +inputValue,
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
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
      setIsLoading(false);
      setTimeout(() => {
        setInputValue("");
        setPhoto("");
        onClose();
        setError(false);
        setSuccess(false);
      }, 3000);
    }
  };

  const FetchCryptoType = async () => {
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
    } finally {
      setTimeout(() => {
        setErrorMessage("");
        setError2(false);
      }, 3000);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      {error && (
        <Alert status={400} title={t("profile14")} message={t("profile15")} />
      )}
      {error1 && <Alert status={300} title={t("profile54")} />}
      {/* crypto error */}
      {error2 && (
        <Alert
          status={400}
          title={"Error"}
          message={errorMessage}
          onClose={onClose}
        />
      )}
      {success && (
        <Alert status={200} title={t("profile16")} message={t("profile17")} />
      )}
      <div className="bg-white rounded-[10px] shadow-lg">
        <div className="flex relative justify-between">
          <div className="max-w-[750px] w-full mt-8 ml-8 mb-8">
            <p className="font-medium text-[20px] leading-[22px]">
              {t("profile25")}
            </p>
            <div className="flex gap-5 flex-wrap mt-[18px]">
              {cart.length > 0 &&
                cart.map((card) => (
                  <div
                    key={card.id}
                    className={`cursor-pointer shadow-lg w-[130px] h-[84px] rounded-lg border-2 ${
                      selectedCard?.id === card.id
                        ? " border-[#ffbb00]"
                        : " border-[#fff]"
                    }`}
                    onClick={() => handleCardSelect(card)}
                  >
                    <Image
                      src={card.photo}
                      className={`rounded-[5px] w-[127px] h-[81px] p-1  cursor-pointer`}
                      width={123}
                      height={77}
                      alt={card.card_name}
                    />
                  </div>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap mt-4">
              {selectedCard?.extra_cards?.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-2 border border-[#ffba00] px-3 py-1 rounded-lg"
                >
                  <button
                    onClick={() =>
                      handleCopyCardNumber(card.id, card.card_number)
                    }
                    className="flex items-center gap-1 mx-auto px-[15px] font-medium text-[16px] text-[#ffba00] leading-[18px] rounded-[10px] cursor-pointer"
                  >
                    {copiedCardId === card.id ? (
                      <MdCheck size={24} />
                    ) : (
                      <MdOutlineContentCopy size={24} />
                    )}
                    {card.card_number}
                  </button>
                  <button
                    onClick={() =>
                      handleCopyPhoneNumber(card.id, card.phone_number)
                    }
                    className="flex items-center gap-[5px] mx-auto px-[15px] font-medium text-[16px] text-[#ffba00] leading-[18px] rounded-[10px] cursor-pointer"
                  >
                    {copiedPhoneId === card.id ? (
                      <MdCheck size={24} />
                    ) : (
                      <MdOutlineContentCopy size={24} />
                    )}
                    {card.phone_number}
                  </button>
                  <p>{card.full_name}</p>
                  <p>{card.bank_name}</p>
                </div>
              ))}
            </div>

            {selectedCard?.id === "8f31f905-d153-4cb9-8514-5c3c5b53dac5" ? (
              <div className="p-5 mt-10 flex flex-col items-center">
                <div className="flex items-start space-x-3 max-w-[450px]">
                  <span className="text-yellow-500 text-2xl">⚠️</span>
                  <p className="text-red-600 text-base">{t("comment")}</p>
                </div>
                <button
                  ref={buttonRef}
                  className={`flex items-center gap-[5px] mx-auto mt-3 py-[10px] px-[15px] font-medium ${
                    selectedCard.card_number.length > 19 ? "text-[9px]" : ""
                  } text-[16px] leading-[18px] bg-[#ffba00] rounded-[10px]`}
                  onClick={copyCryptoNumber}
                >
                  {copied2 ? (
                    <MdCheck size={24} />
                  ) : (
                    <MdOutlineContentCopy size={24} />
                  )}
                  {selectedCard.card_number}
                </button>
                <button
                  className={`flex items-center gap-[5px] mt-5 py-[10px] px-[15px] font-medium ${
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
                  onClick={() => {
                    checkBalance1();
                    onClose();
                  }}
                  className={`flex items-center gap-[5px] mt-5 py-[10px] px-[15px] font-medium text-[16px] text-white leading-[18px] bg-green-600 rounded-[10px]`}
                >
                  {t("pay")} <FaCheck size={18} />
                </button>
                <p className="mt-10 max-w-[330px] mx-auto text-center text-[14px] leading-[18px]">
                  {t("profile30")}{" "}
                  <a href="t.me/Barbossa_gaming">@Barbossa_gaming</a>{" "}
                  {t("profile31")}
                </p>
              </div>
            ) : (
              <>
                {(selectedCurrency === "USD" || selectedCurrency === "UZS") &&
                  selectedCard?.id !== "8f31f905-d153-4cb9-8514-5c3c5b53dac5" &&
                  selectedCard && (
                    <>
                      <div className="flex flex-col items-center mt-4">
                        <label className="block font-medium text-[20px] leading-[22px] mb-2">
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
                    </>
                  )}

                {selectedCard?.is_auto_pay === false &&
                selectedCard?.id !== "8f31f905-d153-4cb9-8514-5c3c5b53dac5" ? (
                  <>
                    <p className="mt-5 text-center font-medium text-[20px] leading-[22px]">
                      {t("profile29")}
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
                        {t("profile26")}
                      </p>
                      <div className="hidden">
                        <UploadComponent
                          triggerRef={modalRef}
                          onUploadingChange={setLoading1}
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
                ) : (
                  <>
                    {selectedCard && (
                      <div className="flex flex-col justify-center">
                        {!crypto && (
                          <button
                            onClick={FetchCryptoType}
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
                        )}
                        {crypto && (
                          <div className="flex flex-col justify-center items-center mt-5">
                            <button
                              onClick={() => {
                                checkBalance1();
                              }}
                              className={`max-w-[482px] mx-auto flex items-center gap-[5px] py-[10px] px-[15px] font-medium text-[16px] text-white leading-[18px] rounded-[10px] ${
                                selectedCard && inputValue
                                  ? "cursor-pointer bg-green-600"
                                  : "cursor-not-allowed bg-[#b7b7b7]"
                              }`}
                            >
                              {t("pay")} <FaCheck size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {photo.length ? (
              <div className="flex flex-col">
                <div className="max-w-[482px] w-full mx-auto mt-5 py-5 px-8 border border-[#828282] rounded-[10px] flex items-center justify-between">
                  <div>
                    <p>{photo.split("/").pop()}</p>
                  </div>
                  <button onClick={clearFile} className="text-black underline">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="relative mx-auto">
                  <button
                    onClick={fetchHandle}
                    disabled={!selectedCard}
                    className={`mx-auto mt-5 font-medium leading-[18px] py-[10px] px-[60px] rounded-[10px] ${
                      selectedCard
                        ? "bg-[#ffba00] cursor-pointer"
                        : "bg-[#b7b7b7] cursor-not-allowed"
                    } relative group`}
                  >
                    {isLoading ? (
                      <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                    ) : (
                      t("profile28")
                    )}
                    {!selectedCard && (
                      <span className="absolute w-max bottom-[-30px] left-1/2 transform -translate-x-1/2 text-xs text-red-500 bg-white px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        {t("profile51")}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          <div>
            {selectedCard && selectedCurrency === "USD" && (
              <div
                className={`max-w-[400px] w-full ${
                  (selectedCard.video_url ||
                    crypto ||
                    selectedCard.id ===
                      "8f31f905-d153-4cb9-8514-5c3c5b53dac5") &&
                  "w-full px-6"
                } pt-8 pb-8 bg-[#f9f9f9] rounded-tr-[10px] rounded-br-[10px]`}
              >
                {selectedCard?.video_url && (
                  <iframe
                    width="100%"
                    height="200"
                    src={selectedCard?.video_url}
                    allowFullScreen
                  ></iframe>
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
                          0x523f93300e905007437ca0c7180716384b6d690b11093f7b50816cff4b9c005d
                        </button>
                      </>
                    )}
                  </>
                ) : selectedCard.id ===
                  "8f31f905-d153-4cb9-8514-5c3c5b53dac5" ? (
                  <>
                    <Image
                      src={selectedCard.photo}
                      className="mt-5 mx-auto rounded-xl w-[241px] h-[152px]"
                      width={241}
                      height={152}
                      alt="img"
                    />
                  </>
                ) : null}
              </div>
            )}
            {selectedCard && selectedCurrency !== "USD" && (
              <div className="max-w-[400px] w-full px-[24px] pt-8 pb-8 bg-[#f9f9f9] rounded-tr-[10px] rounded-br-[10px]">
                <p className="font-semibold text-[24px] leading-[28px]">
                  {selectedCard.card_name}
                </p>
                <p className="mt-2.5 font-semibold text-[24px] leading-[28px]">
                  {selectedCard.card_holder}
                </p>
                {selectedCard?.video_url && (
                  <iframe
                    width="100%"
                    height="200"
                    src={selectedCard?.video_url}
                    className="mt-5 rounded-xl"
                    allowFullScreen
                  ></iframe>
                )}
                {crypto && selectedCard?.extra_cards?.length === 0 && (
                  <button
                    className={`flex items-center gap-[5px] mt-10 py-[10px] px-[15px] font-medium ${
                      selectedCard.card_number.length > 19 ? "text-[9px]" : ""
                    } text-[16px] leading-[18px] bg-[#ffba00] rounded-[10px]`}
                    onClick={copyCardNumber}
                  >
                    {copied ? (
                      <MdCheck size={24} />
                    ) : (
                      <MdOutlineContentCopy size={24} />
                    )}
                    {selectedCard.card_number}
                  </button>
                )}
                <button
                  className={`flex items-center gap-[5px] mt-10 py-[10px] px-[15px] font-medium ${
                    selectedCard.card_number.length > 19 ? "text-[9px]" : ""
                  } ${
                    selectedCard?.id !==
                      "5e41111f-2187-493c-94ae-69bb1e137c10" &&
                    selectedCard?.id !== "31067404-94d2-4717-90c7-51463263ef1b"
                      ? "hidden"
                      : ""
                  } text-[16px] leading-[18px] bg-[#ffba00] rounded-[10px]`}
                  onClick={copyCardNumber}
                >
                  {copied ? (
                    <MdCheck size={24} />
                  ) : (
                    <MdOutlineContentCopy size={24} />
                  )}
                  {selectedCard.card_number}
                </button>
                <p className="mt-[87px] text-[14px] leading-[18px]">
                  {t("profile30")}{" "}
                  <a href="t.me/Barbossa_gaming">@Barbossa_gaming</a>{" "}
                  {t("profile31")}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              onClose;
              window.location.reload();
            }}
            className="absolute top-2 right-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
