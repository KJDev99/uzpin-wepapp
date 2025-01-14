"use client";
import { useEffect, useState } from "react";

const TelegramApp = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      // Set theme params or perform additional initialization
      tg.themeParams;
      tg.expand();

      // Get user data
      const user = tg.initDataUnsafe?.user;
      setUserData(user);
      console.log(tg.initDataUnsafe?.user, "test");
      console.log(JSON.stringify(tg.initDataUnsafe), "polni");
    }
  }, []);

  return (
    <div>
      <h1>Welcome to Telegram WebApp</h1>
      {userData ? <p>Hello, {userData.first_name}!</p> : <p>Loading...</p>}
    </div>
  );
};

export default TelegramApp;
