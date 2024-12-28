import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PiEyeClosedBold } from "react-icons/pi";
import { AiOutlineEye } from "react-icons/ai";
import { Toast } from "../Toast";
import Image from "next/image";
import { FaChevronLeft } from "react-icons/fa6";

export default function NewPasswrod({ setLogin, loginCount }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formIsValid = true;

    const newErrors = { password: false, confirmPassword: false };

    if (!password) {
      formIsValid = false;
      newErrors.password = true;
    }

    if (!confirmPassword || confirmPassword !== password) {
      formIsValid = false;
      newErrors.confirmPassword = true;
    }

    setErrors(newErrors);

    if (formIsValid) {
      try {
        await axiosInstance.post("client/auth/reset/password", {
          new_password: password,
          confirm_password: confirmPassword,
        });
        setLogin(1);
      } catch (error) {
        setError(true);
        setTimeout(() => setError(false), [3000]);
      }
    }
  };

  return (
    <div className="flex justify-center items-center">
      {error && (
        <Toast status="false" text="Kirish Jarayonida nimadir xato bo'ldi" />
      )}
      <div className="bg-white  rounded-lg p-8 w-full max-w-md max-sm:shadow-none max-sm:p-0">
        <div className="flex justify-end mb-[20px] max-sm:hidden">
          <Link href="/">
            <button className="text-[#313131]">
              <X className="h-6 w-6" />
            </button>
          </Link>
        </div>
        <div className="flex relative flex-col items-center gap-4">
          <Image
            src="/logo.svg"
            className="sm:hidden"
            width={162}
            height={31}
            alt="logo"
          />
          <Link href="/">
            <FaChevronLeft className="h-6 w-6 absolute top-[62%] left-[0%] sm:hidden" />
          </Link>
          <h2 className="text-[#141311] font-medium text-center text-3xl max-sm:mt-[60px]">
            Parolni yangilash
          </h2>
          <p className="mb-3 text-center text-[#909090] text-sm">
            Kirish uchun yangi parol o‘rnating
          </p>
        </div>
        <form onSubmit={handleSubmit}>
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
              className={`w-[382px] px-4 py-2 border rounded-lg outline-none text-[#000000] ${
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
              <p className="text-red-500 text-sm mt-1 px-1">Parolni kiriting</p>
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
              placeholder="Parolni takrorlang"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-[382px] px-4 py-2 border rounded-lg outline-none text-[#000000] ${
                errors.confirmPassword
                  ? "border-b-2 border-[red]"
                  : "border-[#ACACAC]"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 px-1">
                Parollar mos kelmayapti yoki bo&apos;sh
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#FFBA00] font-medium text-[#313131] py-2 px-4 rounded-lg mt-6 mb-6 border-2 border-[transparent] border-b-[#313131]"
          >
            Tasdiqlash
          </button>
        </form>
      </div>
    </div>
  );
}
