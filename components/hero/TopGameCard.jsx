"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import axiosInstance from "@/libs/axios";
import Loader from "../Loader";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function TopGameCards() {
  const { t } = useTranslation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/client/games");
      const fetchedGames = response.data.map((game) => ({
        title: game.name,
        image: game.photo,
        id: game.id,
      }));
      setGames(fetchedGames);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full px-0 pt-6 pb-0">
      <h2 className=" font-medium text-lg mb-4 text-black ml-[10px]  ">
        {t("all_games")}
      </h2>
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-2 min-w-full snap-mandatory">
          {games.map((game, indx) => (
            <div key={indx} className="flex-shrink-0  snap-center w-[80px]">
              <Link
                href={`/all-games/${game.id}`}
                className="p-[5px] overflow-hidden flex flex-col items-center"
              >
                <div className="relative aspect-square">
                  <Image
                    src={game.image}
                    alt={game.title}
                    className="object-cover w-[60px] h-[60px] rounded-lg "
                    width={60}
                    height={60}
                  />
                </div>
                <div className="pt-2">
                  <h3 className="font-medium text-nowrap text-[#313131] text-xs text-left">
                    {game.title.length > 11
                      ? `${game.title.substring(0, 11)}...`
                      : game.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
