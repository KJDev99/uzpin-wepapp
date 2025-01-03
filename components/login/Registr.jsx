import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PiEyeClosedBold } from "react-icons/pi";
import { AiOutlineEye } from "react-icons/ai";
import { RiTelegram2Fill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io5";
import { signIn } from "next-auth/react";
import axiosInstance from "@/libs/axios";

export default function Register({ setLogin, loginCount, setMainEmail }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const handleAppleLogin = async () => {
    await signIn("apple", { callbackUrl: "/" });
  };

  const handleTelegramLogin = () => {
    alert("Telegram orqali kirish");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Ism maydoni to'ldirilishi shart.";
    if (!email)
      newErrors.email =
        "Elektron pochta yoki telefon raqami kiritilishi shart.";
    if (!password) newErrors.password = "Parol kiritilishi shart.";
    if (!confirmPassword)
      newErrors.confirmPassword =
        "Parolni tasdiqlash maydoni to'ldirilishi shart.";
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Parollar mos kelmadi.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const requestData = {
        fullname: name,
        email: email,
        password: password,
        confirm_password: confirmPassword,
      };

      try {
        const response = await axiosInstance.post(
          "client/auth/register",
          requestData
        );
        console.log("Server javobi:", response.data);
        setLogin(5);
        setMainEmail(email);
      } catch (error) {
        console.error("Xatolik yuz berdi:", error);
        alert("Xatolik yuz berdi! Qaytadan urinib ko'ring.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md max-sm:p-4">
        <div className="flex justify-end mb-[20px]">
          <Link href="/">
            <button className="text-[#313131]">
              <X className="h-6 w-6" />
            </button>
          </Link>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className={`w-[190px] h-[50px] border-none outline-none text-lg rounded-[5px] max-sm:w-[164px] ${
              loginCount == 1
                ? "bg-[#313131] text-[#F9F9F9]"
                : "bg-[#F4F4F4] text-[#828282]"
            }`}
            onClick={() => setLogin(1)}
          >
            Kirish
          </button>
          <button
            className={`w-[190px] h-[50px] border-none outline-none text-lg rounded-[5px] max-sm:w-[164px] ${
              loginCount == 2
                ? "bg-[#313131] text-[#F9F9F9]"
                : "bg-[#F4F4F4] text-[#828282]"
            }`}
            onClick={() => setLogin(2)}
          >
            Ro&apos;yxatdan o&apos;tish
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-5">
            <label
              className="block text-[#828282] text-sm px-5 pb-2"
              htmlFor="name"
            >
              Ism
            </label>
            <input
              type="text"
              id="name"
              placeholder="Ismingiz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg border-[#ACACAC] outline-none text-[#000000]"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-[#828282] text-sm px-5 pb-2"
              htmlFor="email"
            >
              Elektron pochta yoki telefon raqam
            </label>
            <input
              type="text"
              id="email"
              placeholder="example@mail.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg border-[#ACACAC] outline-none text-[#000000]"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <label
              className="block text-[#828282] text-sm px-5 pb-2"
              htmlFor="password"
            >
              Parol
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg border-[#ACACAC] outline-none text-[#000000]"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-10 text-gray-500"
            >
              {passwordVisible ? <AiOutlineEye /> : <PiEyeClosedBold />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-[#828282] text-sm px-5 pb-2"
              htmlFor="confirmPassword"
            >
              Parolni takrorlang
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              id="confirmPassword"
              placeholder="Parolni tasdiqlang"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg border-[#ACACAC] outline-none text-[#000000]"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="flex gap-6 justify-center items-center">
            <div className="w-[130px] bg-[#828282] h-[1px]"></div>
            <p className="text-[#828282]">yoki</p>
            <div className="w-[130px] bg-[#828282] h-[1px]"></div>
          </div>

          <div className="flex flex-col justify-between items-center my-4">
            <button
              type="button"
              onClick={handleTelegramLogin}
              className="flex text-[black] items-center justify-center font-semibold py-2 px-4 rounded-[5px] gap-5 w-full mb-[10px] border-2 border-[#313131]"
            >
              <RiTelegram2Fill className="bg-[#2AABEE] text-[white] p-1 text-[28px] rounded-full" />
              Telegram orqali
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center  text-[black] font-semibold py-2 px-4 rounded-[5px] gap-5 w-full mb-[10px] border-2 border-[#313131] "
            >
              <FcGoogle className=" p-0 text-[28px] rounded-full" />
              Google orqali
            </button>
            <button
              type="button"
              onClick={handleAppleLogin}
              className="flex items-center justify-center  text-[black] font-semibold py-2 px-4 rounded-[5px] gap-5 w-full mb-[10px] border-2 border-[#313131] "
            >
              <IoLogoApple className=" text-[28px] rounded-full" />
              Apple orqali
            </button>
          </div>
          <div className="text-center text-sm text-[black] mt-3">
            Saytda ro&apos;yxatdan o&apos;tish bilan{" "}
            <Link href="#" className="text-[#FFBA00]">
              Foydalanish shartlari
            </Link>{" "}
            ni qabul qilganingizni tasdiqlaysiz.
          </div>

          <button
            type="submit"
            className="w-full bg-[#FFBA00] font-medium text-[#313131] py-2 px-4 rounded-lg mt-6 mb-6 border-2 border-[transparent] border-b-[#313131]"
          >
            Ro&apos;yxatdan o&apos;tish
          </button>
        </form>
      </div>
    </div>
  );
}
