import axiosInstance from "@/libs/axios";
import { X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Toast } from "../Toast";
import Image from "next/image";
import { FaChevronLeft } from "react-icons/fa6";

export default function PasswordCheck({ setLogin, mainEmail }) {
  const [code, setCode] = useState(["", "", "", ""]);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [error, setError] = useState();
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (newCode.every((num) => num !== "")) {
      document.getElementById("submit-button").disabled = false;
      setDisabledBtn(false);
    } else {
      document.getElementById("submit-button").disabled = true;
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && code[index] === "") {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.every((num) => num !== "")) {
      const enteredCode = code.join("");
      try {
        await axiosInstance.post("client/auth/reset/verify", {
          email: mainEmail,
          code: enteredCode,
        });
        setLogin(6);
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
      <div className="bg-white rounded-lg p-8 w-full max-w-md max-sm:p-0 max-sm:shadow-none">
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
            <FaChevronLeft className="h-6 w-6 absolute top-[60%] left-[0%] sm:hidden" />
          </Link>
          <h2 className="text-[#141311] font-medium text-center text-3xl max-sm:mt-[46px]">
            Tasdiqlash.
          </h2>
          <p className="mb-3 text-center text-[#909090] text-sm">
            Emailingizga yuborilgan 4 xonali kodni kiriting
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-5 flex gap-4 justify-center">
            {code.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={code[index]}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-[53px] h-[53px] flex justify-center items-center border rounded-lg border-[#F49F3A] outline-none text-[#000000] text-center"
              />
            ))}
          </div>

          <button
            id="submit-button"
            onClick={() => setLogin(4)}
            disabled={disabledBtn}
            className="w-full bg-[#FFBA00] text-[#313131] py-2 px-4 rounded-lg mt-2 font-medium border-2 border-[transparent] border-b-[#313131] disabled:bg-gray-300 disabled:border-none disabled:cursor-not-allowed"
          >
            Tasdiqlash
          </button>
          <div className="text-center text-sm text-[black] mt-3 mb-5">
            Agar kod kelmagan bo‘lsa{" "}
            <Link href="#" className="text-[#FFBA00]">
              qayta yuborishni
            </Link>{" "}
            bosing
          </div>
        </form>
      </div>
    </div>
  );
}
