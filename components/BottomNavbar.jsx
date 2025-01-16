"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function BottomNavbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isActive = (path) => {
    switch (path) {
      case "/":
        return "home";
      case "/all-games":
        return "allgames";
      case "/help-me":
        return "helpme";
      case "/login":
        return "login";
      case "/profile/balance":
        return "balance";
      case "/profile":
      case "/profile/profile-mobile":
      case "/profile/balance":
      case "/profile/purchases":
      case "/profile/transactions":
      case "/profile/logout":
        return "profile";
    }
  };
  const [profileData, setProfileData] = useState();

  useEffect(() => {
    setProfileData(JSON.parse(localStorage.getItem("profileData")));

    if (localStorage.getItem("profileData")) {
      const PostTest = async () => {
        try {
          await axios.post(
            `https://api.uzpin.games/api/v1/client/webapp/botuser/${sessionStorage.getItem(
              "bot"
            )}/${sessionStorage.getItem("userId")}`
          );
        } catch (e) {
          console.log(e.message);
        }
      };
    }
  }, []);

  const active = isActive(pathname);

  if (pathname === "/login") return false;

  return (
    <div className="md:hidden w-full px-5 flex justify-between gap-[22px] bg-[#F4F4F4]  fixed bottom-0 left-0 right-0 mx-auto z-50 pt-[10px] pb-[26px]  border">
      <Link href="/">
        <div className="flex flex-col items-center">
          {active === "home" ? (
            <Image
              src="/home-icon1.svg"
              width={24}
              height={24}
              alt="home icon"
            />
          ) : (
            <Image
              src="/home-icon.svg"
              width={24}
              height={24}
              alt="home icon"
            />
          )}

          <p
            className={`font-normal text-xs leading-[14px] mt-1 text-nowrap ${
              active === "home" ? "text-[#FFBA00]" : "text-[#828282]"
            }`}
          >
            {t("home1")}
          </p>
        </div>
      </Link>
      <Link href="/all-games">
        <div className="flex flex-col items-center">
          {active === "allgames" ? (
            <Image
              src="/allgames-icon1.svg"
              width={24}
              height={24}
              alt="home icon"
            />
          ) : (
            <Image
              src="/allgames-icon.svg"
              width={24}
              height={24}
              alt="home icon"
            />
          )}
          <p
            className={`font-normal text-xs leading-[14px] mt-1 text-nowrap ${
              active === "allgames" ? "text-[#FFBA00]" : "text-[#828282]"
            }`}
          >
            {t("all_games")}
          </p>
        </div>
      </Link>
      {profileData ? (
        <Link href="/profile/balance">
          <div className="flex flex-col items-center">
            <IoWalletOutline
              className={`font-normal text-2xl  ${
                active === "balance" ? "text-[#FFBA00]" : "text-[#828282]"
              }`}
            />
            <p
              className={`font-normal text-xs leading-[14px] mt-1 text-nowrap ${
                active === "balance" ? "text-[#FFBA00]" : "text-[#828282]"
              }`}
            >
              {t("profile20")}
            </p>
          </div>
        </Link>
      ) : (
        <Link href="/login">
          <div className="flex flex-col items-center">
            <IoWalletOutline
              className={`font-normal text-2xl  ${
                active === "balance" ? "text-[#FFBA00]" : "text-[#828282]"
              }`}
            />
            <p
              className={`font-normal text-xs leading-[14px] mt-1 text-nowrap ${
                active === "balance" ? "text-[#FFBA00]" : "text-[#828282]"
              }`}
            >
              {t("profile20")}
            </p>
          </div>
        </Link>
      )}
      {profileData ? (
        <Link href="/profile/profile-mobile">
          <div className="flex flex-col items-center">
            {active === "profile" ? (
              <Image
                src="/user-icon1.svg"
                width={24}
                height={24}
                alt="home icon"
              />
            ) : (
              <Image
                src="/user-icon.svg"
                width={24}
                height={24}
                alt="home icon"
              />
            )}
            <p
              className={`font-normal text-xs leading-[14px] mt-1 ${
                active === "profile" ? "text-[#FFBA00]" : "text-[#828282]"
              }`}
            >
              {profileData.fullname.split(" ")[0] || "profile"}
            </p>
          </div>
        </Link>
      ) : (
        <Link href="/login">
          <div className="flex flex-col items-center">
            {active === "login" ? (
              <Image
                src="/user-icon1.svg"
                width={24}
                height={24}
                alt="home icon"
              />
            ) : (
              <Image
                src="/user-icon.svg"
                width={24}
                height={24}
                alt="home icon"
              />
            )}
            <p
              className={`font-normal text-xs leading-[14px] mt-1 ${
                active === "login" ? "text-[#FFBA00]" : "text-[#828282]"
              }`}
            >
              {t("login1")}
            </p>
          </div>
        </Link>
      )}
    </div>
  );
}
