"use client";
import Login from "@/components/login/Login";
import React, { useState } from "react";
import ForgetPassword from "@/components/login/ForgetPassword";
import PasswordCheck from "@/components/login/PasswordCheck";
import NewPasswrod from "@/components/login/NewPasswrod";
import Register from "@/components/login/Registr";
import PasswordVerify from "@/components/login/PasswordVerify";
import { Check, X } from "lucide-react";

export default function Page() {
  const [loginCount, setLogin] = useState(1);
  const [mainEmail, setMainEmail] = useState();
  const [access, setAccess] = useState();
  const renderComponent = () => {
    switch (loginCount) {
      case 1:
        return <Login setLogin={setLogin} loginCount={loginCount} />;
      case 2:
        return (
          <Register
            setLogin={setLogin}
            loginCount={loginCount}
            setMainEmail={setMainEmail}
          />
        );
      case 3:
        return (
          <ForgetPassword
            setLogin={setLogin}
            loginCount={loginCount}
            setMainEmail={setMainEmail}
          />
        );
      case 4:
        return (
          <PasswordCheck
            mainEmail={mainEmail}
            setLogin={setLogin}
            loginCount={loginCount}
            setAccess={setAccess}
          />
        );
      case 5:
        return (
          <PasswordVerify
            setLogin={setLogin}
            loginCount={loginCount}
            mainEmail={mainEmail}
          />
        );
      case 6:
        return (
          <NewPasswrod
            setLogin={setLogin}
            loginCount={loginCount}
            mainEmail={mainEmail}
            access={access}
          />
        );
      case 7:
        return (
          <div className="fixed inset-0 z-[70] ">
            <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 px-5 ">
              <div className="flex flex-col mt-5  items-center  justify-center ">
                <div className="border border-[#009951] rounded-full h-11 w-11 flex justify-center items-center mb-6">
                  <Check className="h-6 w-6 text-[#009951] " />
                </div>

                <h2 className="mb-3 text-2xl font-bold redux_pro">
                  Muvaffaqiyatli yangilandi!
                </h2>
                <p className="mb-10 redux_pro">Sizning parolingiz yangilandi</p>
                <button
                  className="w-full redux_pro rounded-[5px] py-3 px-8 font-semibold  bg-[#FFBA00] text-[#313131] transition-all duration-300 ease-in-out"
                  onClick={() => setLogin(1)}
                >
                  KIRISH
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="bg-[white] md:hidden absolute left-0 top-0 min-h-screen max-h-max py-[30px] w-full flex justify-center items-center z-[99]">
        {renderComponent()}
      </div>
    </>
  );
}
