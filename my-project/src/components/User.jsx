import React from "react";
import { FaCrown } from "react-icons/fa";

const User = ({ name }) => {
  return (
    <>
      <div className="flex flex-col items-center mx-1 rounded-lg bg-slate-800">
        <FaCrown color="yellow" className="mt-2 animate-bounce" size="20" />
        <img
          src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="w-[150px] h-[150px] rounded-full mx-auto my-10"
        />
        <h1 className="mb-10 text-3xl font-medium text-center text-white">
          {name}
        </h1>
      </div>
    </>
  );
};

export default User;
