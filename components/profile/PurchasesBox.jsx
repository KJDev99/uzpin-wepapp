"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/libs/axios";
import PurchasesModal from "./PurchasesModal";
import Pagination from "../Pagination";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import Loader from "../Loader";
import { useTranslation } from "react-i18next";

export default function PurchasesBox() {
  const { t } = useTranslation();
  const [purchases, setPurchases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const openModal = (purchase) => {
    setSelectedPurchase(purchase);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedPurchase(null);
    setIsOpen(false);
  };

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileData = localStorage.getItem("profileData");
      if (storedProfileData) {
        const parsedProfileData = JSON.parse(storedProfileData);
        setToken(parsedProfileData?.access || null);
      }
    }
  }, []);

  const fetchPurchases = async (page) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/client/history?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;

      setPurchases(data.results || []);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPurchases(currentPage);
    }
  }, [currentPage, token]);
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 mb-10 ">
      <h1 className="text-2xl font-bold mb-4 max-md:hidden">{t("profile3")}</h1>

      <Link
        href={"/profile/profile-mobile"}
        className="md:px-6 py-4 border-b flex items-center max-md:gap-5 md:hidden mb-5"
      >
        <IoIosArrowBack className="text-2xl md:hidden" />
        <h2 className="text-xl font-bold md:mb-4">{t("profile3")}</h2>
      </Link>

      <div className="overflow-x-scroll">
        <table className="w-full border-collapse bg-white border">
          <thead>
            <tr className="text-left border">
              <th className="py-2 text-nowrap px-5 w-max border text-center font-medium">
                #
              </th>
              <th className="py-2 text-nowrap px-5 w-max border text-center font-medium">
                {t("profile41")}
              </th>
              <th className="py-2 text-nowrap px-5 w-max border text-center font-medium">
                {t("profile32")}
              </th>
              <th className="py-2 text-nowrap px-5 w-max border text-center font-medium">
                {t("profile33")}
              </th>
              <th className="py-2 text-nowrap px-5 w-max border text-center font-medium">
                {t("profile34")}
              </th>
              <th className="py-2 text-nowrap px-5 w-max border text-center font-medium">
                {t("profile35")}
              </th>
              <th className="py-2 text-nowrap px-5 w-max border text-center font-medium">
                {t("profile36")}
              </th>
            </tr>
          </thead>
          <tbody>
            {purchases.length > 0 ? (
              purchases.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border border-[#ACACAC] hover:bg-gray-50 ${
                    item.status === "DONE" && "text-[#45C06C]"
                  } ${item.status === "NEW" && "text-[#C46161]"} ${
                    item.status === "REJECTED" && "text-[#000000]"
                  } ${item.status === "ACCEPTED" && "text-[#D29D11]"}`}
                >
                  <td className="py-2 text-nowrap px-5 w-max  border text-center text-sm">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>
                  <td className="py-2 text-nowrap px-5 w-max border text-center text-sm">
                    <span
                      className={`${
                        item.status === "DONE" && "text-[#45C06C]"
                      } ${item.status === "NEW" && "text-[#C46161]"} ${
                        item.status === "REJECTED" && "text-[#000000]"
                      } ${item.status === "ACCEPTED" && "text-[#D29D11]"}`}
                    >
                      {item.status === "ACCEPTED"
                        ? t("transaction1")
                        : item.status === "NEW"
                        ? t("transaction2")
                        : item.status === "REJECTED"
                        ? t("transaction3")
                        : item.status === "DONE"
                        ? t("transaction5")
                        : t("transaction4")}
                    </span>
                  </td>
                  <td className="py-2 text-nowrap px-5 w-max border text-center text-sm">
                    {item.promocode}
                  </td>
                  <td className="py-2 text-nowrap px-5 w-max border text-center text-sm">
                    {item.count}
                  </td>
                  <td className="py-2 text-nowrap px-5 w-max border text-center text-sm">
                    {`${item.amount
                      .toLocaleString("fr-FR", {
                        useGrouping: true,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 3,
                      })
                      .replace(",", ".")} ${item.currency}`}
                  </td>
                  <td className="py-2 text-nowrap px-5 w-max border text-center text-sm">
                    {new Date(item.created).toLocaleString("uz-UZ")}
                  </td>
                  <td className="py-2 text-nowrap px-5 w-max flex justify-center  text-center text-sm">
                    <button
                      onClick={() => openModal(item.id)}
                      className="text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      Ko&apos;rish
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-3 border text-center text-sm text-gray-500"
                >
                  {t("profile37")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
      <PurchasesModal
        isOpen={isOpen}
        onClose={closeModal}
        selectedPurchase={selectedPurchase}
      />
    </div>
  );
}
