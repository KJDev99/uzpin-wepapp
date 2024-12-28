"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/libs/axios";

export default function Navbar() {
  const { i18n } = useTranslation();

  const [selectedLang, setSelectedLang] = useState("uz");
  const [isHovered, setIsHovered] = useState(false);

  const languages = [
    { code: "uz", flag: "/flaguz.png", alt: "Uzbekistan flag" },
    { code: "ru", flag: "/flagru.png", alt: "Russia flag" },
    { code: "en", flag: "/flagen.png", alt: "English flag" },
  ];

  const handleLanguageChange = (code) => {
    setSelectedLang(code);
    i18n.changeLanguage(code);
    setIsHovered(false);
    localStorage.setItem("language", code);
    axiosInstance
      .get("/client/popular/games", {
        headers: {
          "Accept-Language": code,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("API so'rovi xatosi:", error);
      });
  };

  return (
    <nav className="">
      <div className="max-w-7xl mx-auto px-5 max-md:overflow-hidden">
        <div className="flex items-center justify-between h-[100px] max-md:h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="target icon"
              width={150}
              height={24}
              className="ml-1 mr-20 max-w-[108px] max-h-[20px]"
            />
          </Link>

          <div className="flex w-[200px] max-md:w-max items-center space-x-10 space-x-0">
            <div
              className={`relative flex  justify-end md:overflow-hidden  transition-all ${
                isHovered ? "w-[150px] max-md:w-max" : "w-max"
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button className="flex grow-1 w-7 items-center justify-end">
                <Image
                  src={
                    languages.find((lang) => lang.code === selectedLang).flag
                  }
                  alt={languages.find((lang) => lang.code === selectedLang).alt}
                  width={28}
                  height={20}
                  className="cursor-pointer w-7"
                />
              </button>

              <div
                className={`absolute z-[999] max-md:flex max-md:flex-col max-md:top-4 max-md:pt-3 w-max left-[100px flex gap-2 transition-all duration-300 translate-x-2 ${
                  isHovered ? "left-[0px] max-md:left-[-8px]" : "left-[100px]"
                }`}
              >
                {languages
                  .filter((lang) => lang.code !== selectedLang)
                  .map((lang) => (
                    <Image
                      key={lang.code}
                      src={lang.flag}
                      alt={lang.alt}
                      width={24}
                      height={24}
                      className="cursor-pointer transition-transform  h-5 w-7 "
                      onClick={() => handleLanguageChange(lang.code)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
