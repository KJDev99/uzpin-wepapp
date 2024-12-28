"use client";
import { UserCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";

export default function ProfilMobile() {
  const [profileData, setProfileData] = useState();

  useEffect(() => {
    setProfileData(JSON.parse(localStorage.getItem("profileData")));
  }, []);
  return (
    <>
      <div className="mb-0 py-5 flex items-center border-b border-[#828282] w-full h-max">
        <h2 className="text-xl font-medium">{profileData?.fullname}</h2>
      </div>
      <div className="w-max h-screen">
        <Sidebar />
      </div>
    </>
  );
}
