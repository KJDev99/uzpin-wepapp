import React from "react";
import { FallingLines } from "react-loader-spinner";

export default function Loader() {
  return (
    <div className="fixed z-[1000] left-0 top-0 h-screen w-screen bg-[#494949ce] flex flex-col items-center justify-center">
      <FallingLines
        color="#ffba00"
        width="100"
        visible={true}
        ariaLabel="falling-circles-loading"
      />
    </div>
  );
}
