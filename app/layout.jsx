import BottomNavbar from "@/components/BottomNavbar";
import ClientProvider from "@/components/ClientProvider";
import Navbar from "@/components/Navbar";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "UZpin",
  description: "Game PromoCode",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js?56" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-white">
        <ClientProvider>
          <Navbar />
          <div className="mt-20">{children}</div>
          <BottomNavbar />
        </ClientProvider>
      </body>
    </html>
  );
}
