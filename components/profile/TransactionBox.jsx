"use client";

import React, { useState, useEffect } from "react";
import TransactionModal from "./TransactionModal";
import axiosInstance from "@/libs/axios";
import { PiNewspaperClippingLight } from "react-icons/pi";
import Pagination from "../Pagination";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";
import Loader from "../Loader";
import { useTranslation } from "react-i18next";

export default function TransactionBox() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const openModal = (checkUrl) => {
    setSelectedCheck(checkUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedCheck("");
  };

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfileData = localStorage.getItem("profileData");
      if (storedProfileData) {
        const parsedProfileData = JSON.parse(storedProfileData);
        setToken(parsedProfileData?.access || null);
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchTransactions = async (page) => {
      try {
        const response = await axiosInstance.get(
          `/client/transactions?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(response.data.results || []);
        setTotalPages(Math.ceil(response.data.count / 10));
      } catch (error) {
        console.error("Xatolik yuz berdi:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchTransactions(currentPage);
    }
  }, [token, currentPage]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 max-md:hidden">{t('profile4')}</h1>
      <Link
        href={"/profile/profile-mobile"}
        className="md:px-6 py-4 border-b flex items-center max-md:gap-5 md:hidden mb-5"
      >
        <IoIosArrowBack className="text-2xl md:hidden" />
        <h2 className="text-xl font-bold md:mb-4">{t('profile4')}</h2>
      </Link>

      <div className="max-md:overflow-x-scroll">
        <table className="w-full border border-[#ACACAC] border-collapse ">
          <thead className="bg-[#F9F9F9] rounded-lg">
            <tr className="text-left border border-[#ACACAC] ">
              <th className="py-2 w-max text-nowrap text-sm text-center font-medium border border-[#ACACAC]">
                {t('profile41')}
              </th>
              <th className="py-2 w-max text-nowrap text-sm text-center font-medium border border-[#ACACAC]">
                {t('profile42')}
              </th>
              <th className="py-2 w-max text-nowrap text-sm text-center font-medium border border-[#ACACAC]">
                {t('profile43')}
              </th>
              <th className="py-2 w-max text-nowrap text-sm text-center font-medium border border-[#ACACAC]">
                {t('profile44')}
              </th>
              <th className="py-2 w-max text-nowrap text-sm text-center font-medium border border-[#ACACAC]">
                {t('profile35')}
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item, index) => (
              <tr
                key={item.id}
                className={`border border-[#ACACAC] hover:bg-gray-50 ${
                  item.status === "ACCEPTED" && "text-[#45C06C]"
                } ${item.status === "BUY" && "text-[#D29D11]"} ${
                  item.status === "REJECTED" && "text-[#C46161]"
                }`}
              >
                <td className="py-2 w-max text-nowrap text-sm text-left px-4 border border-[#ACACAC]">
                  <span
                    className={`${
                      item.status === "ACCEPTED" && "text-[#45C06C]"
                    } ${item.status === "BUY" && "text-[#D29D11]"} ${
                      item.status === "REJECTED" && "text-[#C46161]"
                    }`}
                  >
                    {item.status === "ACCEPTED"
                      ? "Qabul qilindi"
                      : item.status === "BUY"
                      ? "Sotib olindi"
                      : "Bekor qilindi"}
                  </span>
                </td>
                <td className="py-2 w-max text-nowrap text-sm text-left px-4 border border-[#ACACAC]">
                  {item.amount.toLocaleString()}
                </td>
                <td className="py-2 w-max text-nowrap text-sm text-left px-4 border border-[#ACACAC]">
                  {item.currency}
                </td>
                <td className="py-2 w-max text-nowrap text-sm text-left px-4 flex justify-center">
                  {item.chek ? (
                    <PiNewspaperClippingLight
                      onClick={() => openModal(item.chek)}
                      className={`text-xl cursor-pointer ${
                        item.status === "ACCEPTED" && "text-[#45C06C]"
                      } ${item.status === "BUY" && "text-[#D29D11]"} ${
                        item.status === "REJECTED" && "text-[#C46161]"
                      }`}
                    />
                  ) : (
                    " "
                  )}
                </td>
                <td className="py-2 w-max text-nowrap text-sm text-left px-4 border border-[#ACACAC]">
                  {new Date(item.created).toLocaleString("uz-UZ")}
                </td>
              </tr>
            ))}
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
      <TransactionModal
        isOpen={isOpen}
        onClose={closeModal}
        checkUrl={selectedCheck}
      />
    </div>
  );
}
