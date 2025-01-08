import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const savedLanguage =
  typeof window !== "undefined"
    ? localStorage.getItem("language") || "uz"
    : "uz";
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": savedLanguage,
  },
});

export default axiosInstance;
