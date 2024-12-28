"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/libs/axios";
import PurchasesModal from "./PurchasesModal";
import Pagination from "../Pagination";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import Loader from "../Loader";

export default function PurchasesBox() {
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
      <h1 className="text-2xl font-bold mb-4 max-md:hidden">Xaridlar tarixi</h1>

      <Link
        href={"/profile/profile-mobile"}
        className="md:px-6 py-4 border-b flex items-center max-md:gap-5 md:hidden mb-5"
      >
        <IoIosArrowBack className="text-2xl md:hidden" />
        <h2 className="text-xl font-bold md:mb-4">Xaridlar tarixi</h2>
      </Link>

      <div className="overflow-x-scroll">
        <table className="w-full border-collapse bg-white border">
          <thead>
            <tr className="text-left border">
              <th className="py-2 text-nowrap px-5 w-max border text-center font-medium">
                #
              </th>
              <th className="py-2 text-nowrap px-5 w-max border text-center font-medium">
                Promokod
              </th>
              <th className="py-2 text-nowrap px-5 w-max border text-center font-medium">
                Miqdor
              </th>
              <th className="py-2 text-nowrap px-5 w-max border text-center font-medium">
                To&apos;lov
              </th>
              <th className="py-2 text-nowrap px-5 w-max border text-center font-medium">
                Sana
              </th>
              <th className="py-2 text-nowrap px-5 w-max border text-center font-medium">
                Ko&apos;rish
              </th>
            </tr>
          </thead>
          <tbody>
            {purchases.length > 0 ? (
              purchases.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 text-nowrap px-5 w-max  border text-center text-sm">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>
                  <td className="py-2 text-nowrap px-5 w-max border text-center text-sm">
                    {item.promocode}
                  </td>
                  <td className="py-2 text-nowrap px-5 w-max border text-center text-sm">
                    {item.count}
                  </td>
                  <td className="py-2 text-nowrap px-5 w-max border text-center text-sm">
                    {`${item.amount.toLocaleString()} ${item.currency}`}
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
                  Ma&apos;lumotlar yo&apos;q.
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
