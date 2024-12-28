"use client";

import { useEffect } from "react";
import { Check, X } from "lucide-react";

export function Toast({ text, type }) {
  useEffect(() => {
    const timer = setTimeout(() => {}, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`absolute top-6 right-6 z-[55] flex items-center gap-4 p-4 rounded-lg shadow-lg 
        ${
          type === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        } 
      transition-transform duration-300 ease-in-out transform`}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
          type === "success" ? "bg-green-200" : "bg-red-200"
        }`}
      >
        {type === "success" ? (
          <Check className="h-5 w-5" />
        ) : (
          <X className="h-5 w-5" />
        )}
      </div>
      <p className="font-bold">{text}</p>
    </div>
  );
}
