"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";

export function Alert({ isOpen, onClose, status, title, message }) {
  return (
    <div
      className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      open={isOpen}
    >
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-[white] p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        <div className="flex flex-col mt-5  items-center space-x-2 justify-center ">
          {status ? (
            <div className="border border-[#009951] rounded-full h-11 w-11 flex justify-center items-center mb-7">
              <Check className="h-6 w-6 text-[#009951] " />
            </div>
          ) : (
            <div className="border border-[#FF0000] rounded-full h-11 w-11 flex justify-center items-center mb-7">
              <X className="h-6 w-6 text-[#FF0000] " />
            </div>
          )}
          <h2 className="mb-4 text-2xl font-bold">{title}</h2>
          <p className="mb-10">{message}</p>
        </div>
      </div>
    </div>
  );
}
