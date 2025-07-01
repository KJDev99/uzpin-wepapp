"use client";
import axiosInstance from "@/libs/axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowRightLong } from "react-icons/fa6";
import Loader from "../Loader";

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
    <div className="game__content_bg">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 max-sm:grid-cols-2 gap-10 p-5 rounded-lg pt-[30px] max-sm:pt-6 max-sm:pb-4 max-sm:px-4 max-sm:gap-4">
        {games.length > 0 && (
          <div className="overflow-hidden border hover:border-[#ffba00] hover:shadow-lg transition-shadow duration-200 bg-white rounded-lg max-sm:rounded-[10px] max-sm:max-w-[166px] max-md:mx-auto">
            <Link href={`/all-games/1`} className="p-0">
              <div className="flex items-start gap-4 p-4 h-max max-sm:flex-col max-sm:p-[10px] max-sm:gap-[10px]">
                <div className="relative rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      "https://api.uzpin.games/media/uploads/57aafbba-6b61-4ea8-914d-9561d733204c.png"
                    }
                    alt={"img"}
                    width={200}
                    height={200}
                    className="object-cover w-[200px] h-[200px] max-sm:w-[146px] max-sm:h-[126px]"
                  />
                </div>
                <div className="flex flex-col w-full h-[200px] max-sm:h-auto">
                  <h3 className="text-[28px] text-[#313131] font-bold max-sm:font-medium max-sm:text-sm ">
                    Mobile Legends
                  </h3>
                  <div className="max-md:hidden flex mt-5 grow">
                    <p className="mt-[5px] text-[20px] font-medium leading-[18px] text-[#313131] max-sm:text-[10px] max-sm:hidden">
                      10 Almaz -
                    </p>
                    <p className="mt-[5px] text-[20px] font-medium leading-[18px] text-[#313131] max-sm:text-[10px] max-sm:hidden">
                      100 Almaz
                    </p>
                  </div>
                  <div>
                    <button className="w-full px-4 py-3 text-[#acacac] hover:text-[#ffba00] transition-colors duration-200 flex items-center gap-4 justify-end group max-sm:hidden">
                      <span>{t("see-more")}</span>
                      <FaArrowRightLong className="w-[18px] h-[20px] transition-transform duration-200 group-hover:translate-x-1" />
                    </button>

                    <button className="max-w-[146px] w-full mt-[18px] rounded-[5px] py-2 bg-[#ffba00] font-medium text-[12px] leading-[14px] sm:hidden">
                      <span>{t("see-more")}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
        {games.map((game) => (
          <div
            key={game.id}
            className="overflow-hidden border hover:border-[#ffba00] hover:shadow-lg transition-shadow duration-200 bg-white rounded-lg max-sm:rounded-[10px] max-sm:max-w-[166px] max-md:mx-auto"
          >
            <Link href={`/all-games/${game.id}`} className="p-0">
              <div className="flex items-start gap-4 p-4 h-max max-sm:flex-col max-sm:p-[10px] max-sm:gap-[10px]">
                <div className="relative rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={game.photo}
                    alt={game.name}
                    width={200}
                    height={200}
                    className="object-cover w-[200px] h-[200px] max-sm:w-[146px] max-sm:h-[126px]"
                  />
                </div>
                <div className="flex flex-col w-full h-[200px] max-sm:h-auto">
                  <h3 className="text-[28px] text-[#313131] font-bold max-sm:font-medium max-sm:text-sm ">
                    {game.name}
                  </h3>
                  <div className="max-md:hidden flex mt-5 grow">
                    {game.id === "00984e54-78f0-44f8-ad48-dac23d838bdc" ? (
                      <div className="flex gap-1">
                        <p className="mt-[5px] text-[20px] font-medium leading-[18px] text-[#313131] max-sm:text-[10px] max-sm:hidden">
                          8 -
                          {/* {game.promocodes[1].match(/\d+/g)?.join("") || 0} -  */}
                        </p>
                        <p className="mt-[5px] text-[20px] font-medium leading-[18px] text-[#313131] max-sm:text-[10px] max-sm:hidden">
                          6163 diamonds
                          {/* {game.promocodes[0]} */}
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="mt-[5px] text-[20px] font-medium leading-[18px] text-[#313131] max-sm:text-[10px] max-sm:hidden">
                          {game.promocodes[1].match(/\d+/g)?.join("") || 0} - 
                        </p>
                        <p className="mt-[5px] text-[20px] font-medium leading-[18px] text-[#313131] max-sm:text-[10px] max-sm:hidden">
                          {game.promocodes[0]}
                        </p>
                      </>
                    )}
                  </div>
                  <div>
                    <button className="w-full px-4 py-3 text-[#acacac] hover:text-[#ffba00] transition-colors duration-200 flex items-center gap-4 justify-end group max-sm:hidden">
                      <span>{t("see-more")}</span>
                      <FaArrowRightLong className="w-[18px] h-[20px] transition-transform duration-200 group-hover:translate-x-1" />
                    </button>

                    <button className="max-w-[146px] w-full mt-[18px] rounded-[5px] py-2 bg-[#ffba00] font-medium text-[12px] leading-[14px] sm:hidden">
                      <span>{t("see-more")}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
