import React from "react";

export default function ProfileLayout({ children }) {
  return (
    <div className="relative mx-[120px] flex flex-wrap max-md:mx-5">
      <div className="md:flex-1 pl-10 max-md:pl-0 max-md:w-full">
        <main>{children}</main>
      </div>
    </div>
  );
}
