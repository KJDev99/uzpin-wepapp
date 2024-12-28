import HeaderGames from "@/components/allGames/HeaderGames";
import AllGames from "@/components/allGames/AllGames";

export const metadata = {
  title: "Barcha O'yinlar",
  description: "Game PromoCode",
};

export default function AllGamesPage() {
  return (
    <div>
      <HeaderGames />
      <AllGames />
    </div>
  );
}
