"use client";

import axiosInstance from "@/libs/axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function BestSales() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const currency =
    typeof window !== "undefined"
      ? localStorage.getItem("currency") || "uzs"
      : "uzs";

  useEffect(() => {
    setLoading(true);
    const fetchGames = async () => {
      try {
        const response = await axiosInstance.get(`/client/webapp/games`, {
          headers: {
            Currency: currency,
          },
        });
        setData(response.data.results || []);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const formatNumber = (num) => {
    const str = num.toString();
    if (str.includes(".")) {
      const [integerPart, decimalPart] = str.split(".");
      return `${integerPart}.${decimalPart.slice(0, 3)}`;
    }
    return str;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full px-0 mb-[120px]">
      {data.map((game) => (
        <div key={game.id} className="mb-8">
          <h2 className="font-medium text-lg text-black ml-[10px] mb-4">
            {game.name}
          </h2>
          <div className="overflow-x-auto px-6 pb-0">
            <div className="flex space-x-4 min-w-full snap-mandatory">
              {game.promocodes.map(
                (promo) =>
                  ![
                    "38ade9a5-98f9-4c61-afb2-198434af8612",
                    "bf94ab2e-addc-4998-9ff1-5a73b3e8f7c0",
                    "ed0637d4-e2ec-49b1-b497-b8ae45939299",
                    "49a8481b-ead0-477e-aff5-a1b748301106",
                  ].includes(promo.id) && (
                    <div
                      key={promo.id}
                      className="flex-shrink-0 snap-center rounded-[10px] w-[140px] game__content_bg mt-4 mb-4"
                    >
                      <div className="p-2.5">
                        <div className="relative aspect-square overflow-hidden">
                          {promo.photo ? (
                            <Image
                              src={promo.photo}
                              alt={promo.name}
                              className="object-cover rounded h-[228px] w-full max-w-[120px] max-h-[120px]"
                              width={228}
                              height={228}
                            />
                          ) : (
                            <Image
                              src="/mobile.webp"
                              alt={promo.name}
                              className="object-cover rounded h-[228px] w-full max-w-[120px] max-h-[120px]"
                              width={228}
                              height={228}
                            />
                          )}
                        </div>
                        <div className="p-4 space-y-3 px-0 pb-0">
                          <div>
                            <h3 className="text-[#313131] line-clamp-1 font-medium text-sm mb-1">
                              {promo.name}
                            </h3>
                            <p className="text-[#313131] text-xs font-medium">
                              {promo.price ? formatNumber(promo.price) : "0"}{" "}
                              {currency}
                            </p>
                          </div>
                          <Link href={`/all-games/${promo.game.id}`}>
                            <button className="w-full bg-[#FFBA00] text-black font-medium rounded-[5px] text-xs py-2 mt-2">
                              {t("purchase")}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
