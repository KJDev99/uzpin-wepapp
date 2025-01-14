import { useEffect } from "react";

const TelegramWebApp = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.onload = () => {
      const tg = window.Telegram.WebApp;
      tg.ready();
      console.log("Telegram WebApp foydalanuvchi:", tg.initDataUnsafe?.user);
    };
    document.head.appendChild(script);
  }, []);

  return <div style={{ textAlign: "center", marginTop: "50px" }}>aaa</div>;
};

export default TelegramWebApp;
