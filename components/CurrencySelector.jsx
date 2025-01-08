"use client";

import { useState, useEffect } from "react";

export default function CurrencySelector() {
  const [currency, setCurrency] = useState("uzs");

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

  return (
    <select
      id="currency"
      value={currency}
      onChange={handleChange}
      className="px-4 py-2 border rounded-md bg-transparent text-[#ffba00] border-none outline-none"
    >
      <option value="uzs">UZS</option>
      <option value="usd">USD</option>
      <option value="rub">RUB</option>
    </select>
  );
}
