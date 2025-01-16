import BestSales from "@/components/hero/BestSales";
import HeaderSwiper from "@/components/hero/HeaderSwiper";
import TopGameCards from "@/components/hero/TopGameCard";
import TelegramWebApp from "@/components/TelegramWebApp";
import { Suspense } from "react";

export const metadata = {
  title: "Home Page",
  description: "Game PromoCode",
};

export default function Home() {
  return (
    <div>
      <div>
        <Suspense>
          <HeaderSwiper />
        </Suspense>
        <TelegramWebApp />
        <TopGameCards />
        <BestSales />
      </div>
    </div>
  );
}
