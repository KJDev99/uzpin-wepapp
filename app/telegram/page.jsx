"use client";
import dynamic from "next/dynamic";
import React from "react";

const TelegramPage1 = dynamic(() => import("@/components/telegram"), {
  ssr: false,
});

const TelegramPage = () => {
  return (
    <div>
      <TelegramPage1 />
    </div>
  );
};

export default TelegramPage;