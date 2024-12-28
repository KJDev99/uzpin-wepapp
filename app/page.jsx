import BestSales from "@/components/hero/BestSales";
import HeaderSwiper from "@/components/hero/HeaderSwiper";
import TopGameCards from "@/components/hero/TopGameCard";

export const metadata = {
  title: "Home Page",
  description: "Game PromoCode",
};

export default function Home() {
  return (
    <div>
      <div>
        <HeaderSwiper />
        <TopGameCards />
        <BestSales />
      </div>
    </div>
  );
}
