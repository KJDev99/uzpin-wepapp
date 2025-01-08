"use client";
import Login from "@/components/login/Login";
import React, { useState } from "react";
import ForgetPassword from "@/components/login/ForgetPassword";
import PasswordCheck from "@/components/login/PasswordCheck";
import NewPasswrod from "@/components/login/NewPasswrod";
import Register from "@/components/login/Registr";
import PasswordVerify from "@/components/login/PasswordVerify";

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
