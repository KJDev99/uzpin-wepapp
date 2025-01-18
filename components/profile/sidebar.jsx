"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserCircle,
  Wallet,
  History,
  ArrowRightLeft,
  LogOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const sidebarItems = [
    {
      title: t("profile1"),
      icon: UserCircle,
      href: "/profile",
    },
    {
      title: t("profile2"),
      icon: Wallet,
      href: "/profile/balance",
    },
    {
      title: t("profile3"),
      icon: History,
      href: "/profile/purchases",
    },
    {
      title: t("profile4"),
      icon: ArrowRightLeft,
      href: "/profile/transactions",
    },
    {
      title: t("profile5"),
      icon: LogOut,
      href: "/profile/logout",
    },
  ];

  return (
    <div className="absolute left-0 z-30 h-[610px] max-w-[380px] rounded-[8px] md:shadow-lg max-md:h-max">
      <div className="h-full py-2">
        <div className="px-3 py-2">
          {sidebarItems.map((item) => (
            <button
              key={item.href}
              className={`w-full justify-start text-[#000000] text-lg text-semibold  rounded-[5px] mb-2 ${
                pathname === item.href
                  ? "bg-[#F9F9F9] border-l-2 border-[#FFBA00] shadow-lg"
                  : ""
              }`}
            >
              <Link
                className="flex items-center gap-4 px-2 py-3"
                href={item.href}
              >
                <item.icon className=" h-6 w-6" />
                {item.title}
              </Link>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
