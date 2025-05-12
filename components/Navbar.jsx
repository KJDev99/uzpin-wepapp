"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PiUser } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/libs/axios";
import CurrencySelector from "./CurrencySelector";
import Loader from "@/components/Loader";

export default function Navbar() {
  const { i18n } = useTranslation();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState();
  const { t } = useTranslation();

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

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");
    if (!hasReloaded) {
      setTimeout(() => {
        sessionStorage.setItem("hasReloaded", "true");
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }, 500);
    }
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setSelectedLang(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else {
      setSelectedLang("uz");
      i18n.changeLanguage("uz");
    }

    setProfileData(JSON.parse(localStorage.getItem("profileData")));
  }, [i18n]);
  const [selectedLang, setSelectedLang] = useState("uz");
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "uz", flag: "/flaguz.svg", alt: "Uzbekistan flag" },
    { code: "ru", flag: "/flagru.svg", alt: "Russia flag" },
    { code: "en", flag: "/flagen.svg", alt: "English flag" },
  ];

  useEffect(() => {
    const language1 = localStorage.getItem("language");

    if (!language1) {
      const savedLanguage = localStorage.setItem("language", "uz");
      console.log(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (code) => {
    setSelectedLang(code);
    i18n.changeLanguage(code);
    setIsHovered(false);
    localStorage.setItem("language", code);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
    setIsOpen(false);
  };

  if (loading || !data) {
    return <Loader />;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white overflow-x-clip">
      <div className="max-w-7xl mx-auto px-5 md:overflow-hidden">
        <div className="flex items-center justify-between h-[100px] max-md:h-20">
          <Link href="/" className="flex items-center">
            <Image
              src={data?.logo ? data.logo : "/logo.svg"}
              alt="target icon"
              width={150}
              height={24}
              className={`ml-1 mr-20 ${
                data?.logo ? "block" : "hidden"
              } max-sm:mr-5 max-sm:max-w-[108px] max-sm:max-h-[20px]`}
            />
          </Link>

          <div className="flex gap-0 items-center">
            <div className="flex max-md:w-max items-center space-x-10 max-sm:space-x-0">
              {profileData ? (
                <>
                  <Link href={"/profile"}>
                    <button className="max-md:hidden text-[black] font-medium transition-colors flex gap-2 border bg-[#FFBA00] border-[#FFBA00] rounded px-4 py-2">
                      <PiUser className="h-5 text-lg font-bold" />
                      {!isHovered && (
                        <p className="font-bold">
                          {profileData.fullname.split(" ")[0]}
                        </p>
                      )}
                    </button>
                  </Link>
                </>
              ) : (
                <Link href={"/login"}>
                  <button className="max-md:hidden text-[#ACACAC] font-medium transition-colors flex gap-2 border border-[#ACACAC] rounded px-4 py-2">
                    <PiUser className="h-5 text-lg font-bold" />
                    {!isHovered && <p>{i18n.t("login")}</p>}
                  </button>
                </Link>
              )}
              <div className="relative">
                <div className="text-left">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 text-[#ffba00] font-medium uppercase rounded-md shadow-md"
                  >
                    <Image
                      src={
                        languages.find((lang) => lang.code === selectedLang)
                          .flag
                      }
                      alt={
                        languages.find((lang) => lang.code === selectedLang)
                          .code
                      }
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    {languages.find((lang) => lang.code === selectedLang).code}
                  </button>

                  {isOpen && (
                    <ul className="absolute z-50 left-0 mt-2 w-22 bg-white border rounded-md shadow-lg">
                      {languages.map((lang) => (
                        <li
                          key={lang.code}
                          className="uppercase flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleLanguageChange(lang.code)}
                        >
                          <Image
                            src={lang.flag}
                            alt={lang.code}
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                          {lang.code}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <CurrencySelector />
          </div>
        </div>
      </div>
    </nav>
  );
}
