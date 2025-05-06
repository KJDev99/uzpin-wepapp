"use client";
import GameInfo from "@/components/gameStoreBox/GameInfo";
import GameStore from "@/components/gameStoreBox/GameStore";
import Loader from "@/components/Loader";
import axiosInstance from "@/libs/axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GameDetails() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const pathname = useParams();
  const gameName = pathname.game; // pathname.game ни ўзгарувчига олиш

  useEffect(() => {
    if (typeof window === "undefined") return; // Сервер томонида ишламаслик учун

    setLoading(true);
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get(
          `/client/games/${gameName}/detail`
        );
        setData(response.data || []);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [gameName]); // pathname.game ўрнига gameName қўшилди

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <GameStore data={data} gameId={gameName} />
      <GameInfo data={data} />
    </div>
  );
}
