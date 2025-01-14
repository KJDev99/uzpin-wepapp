import Script from "next/script";
import { useEffect } from "react";

const TelegramWebApp = () => {
  useEffect(() => {
    // Script yuklangandan so'ng Telegram SDK bilan ishlash
    if (typeof window !== "undefined" && window.Telegram) {
      const tg = window.Telegram.WebApp;

      // Telegramni ishga tushirish
      tg.ready();

      // Foydalanuvchi ma'lumotlarini konsolga chiqarish
      console.log("Telegram WebApp user:", tg.initDataUnsafe?.user);

      // Telegram interfeys ranglarini o'zgartirish (ixtiyoriy)
      tg.themeParams && console.log("Theme params:", tg.themeParams);
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Script
        src="https://telegram.org/js/telegram-web-app.js?56"
        strategy="afterInteractive"
        onLoad={() => console.log("Telegram WebApp SDK yuklandi.")}
      />
    </div>
  );
};

export default TelegramWebApp;
