import Navbar from "@/components/Navbar";
import "./globals.css";
import Head from "next/head";
import BottomNavbar from "@/components/BottomNavbar";
import ClientProvider from "@/components/ClientProvider";
import Script from "next/script";

export const metadata = {
  title: "UZpin",
  description: "Game PromoCode",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js?56" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-white">
        <ClientProvider>
          <Navbar />
          {children}
          <BottomNavbar />
        </ClientProvider>
      </body>
    </html>
  );
}
