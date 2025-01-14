"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function NotFoundComponent() {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl flex flex-col justify-center items-center h-[calc(100vh-100px)] mx-auto">
      <Image
        src="/not-found.svg"
        className="mx-auto"
        width={216}
        height={162}
        alt="404"
      />
      <p className="text-center text-[24px] leading-[28px] mt-[100px]">
        {t("not1")}
      </p>
      <Link href="/">
        <button className="text-center border-b-[2px] border-[#313131] bg-[#ffba00] py-3 px-12 mt-10 rounded-[10px] font-medium text-[20px] leading-[23px]">
          {t("not2")}
        </button>
      </Link>
    </div>
  );
}
