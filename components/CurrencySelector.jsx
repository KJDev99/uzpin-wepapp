"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/libs/axios";
import { BiRuble } from "react-icons/bi";
import { IoLogoUsd } from "react-icons/io5";

export default function CurrencySelector() {
  const [currency, setCurrency] = useState("uzs");
  const [token, setToken] = useState(null);
  const [balance, setBalance] = useState([]);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const handleChange = (event) => {
    const selectedCurrency = event.target.value;
    setCurrency(selectedCurrency);
    localStorage.setItem("currency", selectedCurrency);
    window.location.reload();
  };

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
    const fetchHandle = async () => {
      try {
        const response = await axiosInstance.get("/client/balance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBalance(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (token) {
      fetchHandle();
    }
  }, [token]);

  const formatNumber = (num) => {
    return num % 1 === 0 ? num?.toFixed(0) : num?.toFixed(2);
  };

  return (
    <div className="flex flex-col items-center ml-2">
      <select
        id="currency"
        value={currency}
        onChange={handleChange}
        className="px-2 py-1 text-[14px] border rounded-md bg-transparent text-[#ffba00] border-none outline-none"
      >
        <option value="uzs">UZS</option>
        <option value="usd">USD</option>
        <option value="rub">RUB</option>
      </select>
      {balance?.account_uzs || balance?.account_rub || balance?.account_usd ? (
        <div className="mr-2 text-[12px] text-end text-[#ffba00]">
          {currency === "uzs" ? (
            `${balance?.account_uzs ? formatNumber(balance?.account_uzs) : 0} S`
          ) : currency === "usd" ? (
            <div className="flex items-center gap-1">
              {balance?.account_usd ? formatNumber(balance?.account_usd) : 0}{" "}
              <IoLogoUsd />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {balance?.account_rub ? formatNumber(balance?.account_rub) : 0}{" "}
              <BiRuble />
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
