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
import { Toast } from "../Toast";
import { useRouter } from "next/navigation";

export default function Login({ setLogin, loginCount }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    emailOrPhone: false,
    password: false,
  });
  const [error, setError] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const rounter = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!emailOrPhone) {
      setErrors((prev) => ({ ...prev, emailOrPhone: true }));
      hasError = true;
    } else {
      setErrors((prev) => ({ ...prev, emailOrPhone: false }));
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: true }));
      hasError = true;
    } else {
      setErrors((prev) => ({ ...prev, password: false }));
    }

    if (!hasError) {
      try {
        const response = await axiosInstance.post("client/auth/login", {
          email: emailOrPhone,
          password: password,
        });
        localStorage.setItem("profileData", JSON.stringify(response.data));
        rounter.push("/");
        setTimeout(() => {
          location.reload();
        }, 300);
      } catch (error) {
        console.error("Xatolik yuz berdi:", error);
        setError(true);
        setTimeout(() => setError(false), [3000]);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await axiosInstance.get("/client/auth/google/login");
      const { auth_url } = response.data;

      if (auth_url) {
        window.location.href = auth_url;
      } else {
        console.error("Auth URL not received from server");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };
  const handleAppleLogin = async () => {
    await signIn("apple", { callbackUrl: "/" });
  };

  const handleTelegramLogin = () => {
    alert("Telegram orqali kirish");
  };

  return (
    <div className="flex justify-center items-center">
      {error && (
        <Toast status="false" text="Kirish Jarayonida nimadir xato bo'ldi" />
      )}
      <div className="bg-white  rounded-lg p-8 w-full max-w-md max-sm:p-4">
        <div className="flex justify-end mb-[20px]">
          <Link href="/">
            <button className="text-[#313131]">
              <X className="h-6 w-6" />
            </button>
          </Link>
        </div>
        <div className="flex gap-4">
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
              htmlFor="email"
            >
              Elektron pochta yoki telefon raqam
            </label>
            <input
              type="text"
              id="email"
              placeholder="example@mail.ru"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg outline-none text-[#000000] ${
                errors.emailOrPhone
                  ? "border-b-2 border-[red]"
                  : "border-[#ACACAC]"
              }`}
            />
            {errors.emailOrPhone && (
              <p className="text-red-500 text-sm mt-1 px-1">
                Maydonni to&apos;ldirish shart
              </p>
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
              className={`w-full px-4 py-2 border rounded-lg outline-none text-[#000000] ${
                errors.password ? "border-b-2 border-[red]" : "border-[#ACACAC]"
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-10 text-gray-500"
            >
              {passwordVisible ? <AiOutlineEye /> : <PiEyeClosedBold />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 px-1">
                Parolni kiritish shart
              </p>
            )}
          </div>

          <p
            className="text-[#FFBA00] cursor-pointer ml-5 mb-4 text-sm"
            onClick={() => setLogin(3)}
          >
            Parolni unutdingizmi?
          </p>

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
              className="flex items-center justify-center text-[black] font-semibold py-2 px-4 rounded-[5px] gap-5 w-full mb-[10px] border-2 border-[#313131]"
            >
              <FcGoogle className="p-0 text-[28px] rounded-full" />
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

          <button
            type="submit"
            className="w-full bg-[#FFBA00] text-[#313131] py-2 px-4 font-medium  rounded-lg mt-2 mb-6 border-2 border-[transparent] border-b-[#313131]"
          >
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
}
