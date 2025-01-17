import React, { useState, useRef } from "react";
import axiosInstance from "@/libs/axios";

const UploadComponent = ({ onUploadSuccess, triggerRef }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async () => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        setUploading(true);
        const response = await axiosInstance.post("/globals/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const fileUrl = response.data.file_url;
        onUploadSuccess(fileUrl);
      } catch (error) {
        console.error("Faylni yuklashda xatolik yuz berdi:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <input
      ref={triggerRef}
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      disabled={uploading}
      className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-no-drop dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
    />
  );
};

export default UploadComponent;
