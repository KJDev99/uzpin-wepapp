"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function GameInfo({ data }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="max-w-[1200px] mx-auto mt-10 pb-[100px] max-sm:px-4">
      <div className="block lg:hidden">
        <div className="flex justify-between mb-[14px] border-b font-medium text-sm">
          <button
            className={`py-2 w-[50%] text-start ${
              activeTab === "description"
                ? "border-b-2 border-black"
                : "border-b-[0.5px] border-[#313131]"
            }`}
            onClick={() => setActiveTab("description")}
          >
            {t("all-games-text15")}
          </button>
          <button
            className={`py-2 w-[50%] text-start ${
              activeTab === "promo"
                ? "border-b-2 border-black"
                : "border-b-[0.5px] border-[#313131]"
            }`}
            onClick={() => setActiveTab("promo")}
          >
            {data.name} {t("all-games-text16")}
          </button>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        <div
          className={`mb-8 ${
            activeTab === "description" ? "block" : "hidden"
          } lg:block`}
        >
          <h2 className="text-xl font-bold mb-4 max-sm:hidden">
            {t("all-games-text15")}
          </h2>
          <div className="prose prose-gray max-w-none max-sm:text-sm">
            {data.desc}
          </div>
        </div>
        <div
          className={`mb-8 ${
            activeTab === "promo" ? "block" : "hidden"
          } lg:block`}
        >
          {data?.video?.slice(0, 23) === "https://api.uzpin.games" ? (
            <>
              <h2 className="text-xl font-bold mb-4 max-sm:hidden">
                {data.name} {t("all-games-text16")}
              </h2>

              <div className="mt-4 aspect-video w-full">
                <video
                  src={data.video}
                  controls
                  autoPlay
                  muted
                  loop
                  width="100%"
                  height="335px"
                  className="max-w-[600px] w-full h-[335px] max-sm:h-[191px]"
                ></video>
              </div>
            </>
          ) : (
            <iframe
              src={data.video || null}
              width="100%"
              height="335px"
              allowFullScreen
              style={{ height: "335px" }}
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
}
