"use client";

import Image from "next/image";

export default function TransactionModal({ isOpen, onClose, checkUrl }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-[10px] shadow-lg">
        <div className="flex relative justify-between min-w-10 min-h-10">
          <Image src={checkUrl} width={400} height={800} alt="Image 1" />
        </div>
      </div>
    </div>
  );
}
