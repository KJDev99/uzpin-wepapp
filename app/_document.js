import Script from "next/script";

export const metadata = {
  title: "Telegram WebApp",
  description: "Telegram WebApp integration with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Telegram SDK */}
        <Script src="https://telegram.org/js/telegram-web-app.js?56" />
      </head>
      <body>{children}</body>
    </html>
  );
}
