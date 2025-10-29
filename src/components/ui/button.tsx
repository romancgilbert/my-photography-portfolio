import React from "react";

export const Button = ({ children, onClick, className = "", variant = "default" }: any) => {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium px-3 py-2 transition";
  const style =
    variant === "secondary"
      ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
      : variant === "ghost"
      ? "bg-transparent hover:bg-gray-100"
      : "bg-black text-white hover:bg-gray-800";
  return (
    <button onClick={onClick} className={`${base} ${style} ${className}`}>
      {children}
    </button>
  );
};
