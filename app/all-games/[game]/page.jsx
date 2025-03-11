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
  useEffect(() => {
    setLoading(true);
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get(
          `/client/games/${pathname.game}/detail`
        );
        setData(response.data || []);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <GameStore data={data} gameId={pathname.game} />
      <GameInfo data={data} />
    </div>
  );
}
