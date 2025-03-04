"use client";

import axiosInstance from "@/libs/axios";
import { X } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Toast } from "../Toast";
import Image from "next/image";
import { FaChevronLeft } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Loader from "@/components/Loader";

export default function PasswordCheck({ setLogin, mainEmail, setAccess }) {
  const { t } = useTranslation();
  const [code, setCode] = useState(["", "", "", ""]);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [error, setError] = useState();
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (newCode.every((num) => num !== "")) {
      document.getElementById("submit-button").disabled = false;
      setDisabledBtn(false);
    } else {
      document.getElementById("submit-button").disabled = true;
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && code[index] === "") {
      inputsRef.current[index - 1].focus();
    }
  };

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/client/webapp/banner/${sessionStorage.getItem("bot")}`
        );
        setData(response?.data);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanner();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.every((num) => num !== "")) {
      const enteredCode = code.join("");
      setLoading(true);
      try {
        const response = await axiosInstance.post("client/auth/reset/verify", {
          email: mainEmail,
          code: enteredCode,
        });
        setLogin(6);
        setAccess(response.data.access);
      } catch (error) {
        setError(true);
        setTimeout(() => setError(false), [3000]);
      } finally {
        setLoading(false);
      }
    }
  };

  const TryPassWord = async () => {
    try {
      await axiosInstance.post("client/auth/reset", {
        email: mainEmail,
      });
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  };

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center items-center">
      {error && <Toast status="false" text={t("login-text16")} />}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md max-sm:p-0 max-sm:shadow-none">
        <div className="flex justify-end mb-[20px] max-sm:hidden">
          <Link href="/">
            <button className="text-[#313131]">
              <X className="h-6 w-6" />
            </button>
          </Link>
        </div>
        <div className="flex relative flex-col items-center gap-4">
          <Image
            src={data?.logo ? data.logo : "/logo.svg"}
            className="sm:hidden"
            width={162}
            height={31}
            alt="logo"
          />
          <Link href="/">
            <FaChevronLeft className="h-6 w-6 absolute top-[60%] left-[0%] sm:hidden" />
          </Link>
          <h2 className="text-[#141311] font-medium redux_pro text-center text-[32px] leading-[40px] max-sm:mt-[46px]">
            {t("login-text19")}
          </h2>
          <p className="mb-3 redux_pro font-light text-center text-[#909090] text-sm">
            {t("login-text20")}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-5 flex gap-4 justify-center">
            {code.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={code[index]}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-[53px] h-[53px] flex justify-center items-center border rounded-lg border-[#F49F3A] outline-none text-[#000000] text-center"
              />
            ))}
          </div>

          <button
            id="submit-button"
            onClick={() => setLogin(4)}
            disabled={disabledBtn}
            className="w-full bg-[#FFBA00] text-[#313131] py-2 px-4 rounded-lg mt-2 font-medium text-[20px] leading-[23px] border-2 border-[transparent] border-b-[#313131] disabled:bg-gray-300 disabled:border-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              t("login-text19")
            )}
          </button>
          <div className="flex justify-center text-center font-light text-sm text-[#909090] mt-3 mb-5">
            {t("login-text21")}{" "}
            <button
              onClick={() => TryPassWord()}
              href="#"
              className="text-[#FFBA00] font-normal"
            >
              {t("login-text22")}
            </button>{" "}
            {t("login-text23")}
          </div>
        </form>
      </div>
    </div>
  );
}
