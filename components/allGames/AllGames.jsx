"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Loader from "../Loader";
import axiosInstance from "@/libs/axios";
import { useTranslation } from "react-i18next";

export default function AllGames() {
  const { t } = useTranslation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchGames = async () => {
      try {
        const response = await axiosInstance.get("/client/games");
        setGames(response.data);
      } catch (err) {
        setError("Ma'lumotlarni olishda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <p className=" text-[#313131]  pt-[24px] ml-5 font-medium text-lg leading-[36px]">
        {t("all_games")}
      </p>
      <div className="grid  md:grid-cols-2 grid-cols-2  p-5 rounded-lg md:px-[120px]  pt-[30px]  pb-4 px-4 gap-4 mb-[100px]">
        {games.map((game) => (
          <div
            key={game.id}
            className="overflow-hidden  game__content_bg transition-shadow duration-200 bg-white  rounded-[10px] max-w-[166px] max-md:mx-auto"
          >
            <Link href={`/all-games/${game.id}`} className="p-0">
              <div className="flex items-start h-max flex-col p-[10px] gap-[10px]">
                <div className="relative rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={game.photo}
                    alt={game.name}
                    width={200}
                    height={200}
                    className="object-cover w-[146px] h-[126px]"
                  />
                </div>
                <div className="flex flex-col w-full  h-auto">
                  <h3 className="text-[28px] text-[#313131]  font-medium text-sm grow">
                    {game.name}
                  </h3>
                  <div>
                    <button className="max-w-[146px] w-full mt-[18px] rounded-[5px] py-2 bg-[#ffba00] font-medium text-xs sm:hidden">
                      <span>{t("see-more")}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
