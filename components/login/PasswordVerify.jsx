"use client";

import axiosInstance from "@/libs/axios";
import { X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Toast } from "../Toast";
import { useTranslation } from "react-i18next";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function PasswordVerify({ setLogin, mainEmail }) {
  const { t } = useTranslation();
  const [code, setCode] = useState(["", "", "", ""]);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.every((num) => num !== "")) {
      const enteredCode = code.join("");
      setLoading(true);
      try {
        await axiosInstance.post("client/auth/verify", {
          code: enteredCode,
          email: mainEmail,
        });
        setLogin(1);
      } catch (error) {
        setError(true);
        setTimeout(() => setError(false), [3000]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      {error && <Toast status="false" text={t("login-text16")} />}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-end mb-[20px]">
          <Link href="/">
            <button className="text-[#313131]">
              <X className="h-6 w-6" />
            </button>
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-[#141311] font-medium text-center text-3xl">
            {t("login-text19")}
          </h2>
          <p className="mb-3 text-center text-[#909090] text-sm">
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
            onClick={() => setLogin(5)}
            disabled={disabledBtn}
            className="w-full flex justify-center bg-[#FFBA00] text-[#313131] py-2 px-4 rounded-lg mt-2 font-medium border-2 border-[transparent] border-b-[#313131] disabled:bg-gray-300 disabled:border-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              t("login-text19")
            )}
          </button>
          <div className="text-center text-sm text-[black] mt-3 mb-5">
            {t("login-text21")}{" "}
            <Link href="#" className="text-[#FFBA00]">
              {t("login-text22")}
            </Link>{" "}
            {t("login-text23")}
          </div>
        </form>
      </div>
    </div>
  );
}
