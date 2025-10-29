import React from "react";

export const Badge = ({ children, className = "", variant = "default" }: any) => {
  const style =
    variant === "secondary"
      ? "bg-gray-100 text-gray-800"
      : variant === "outline"
      ? "border border-gray-400 text-gray-700"
      : "bg-black text-white";
  return (
    <span className={`inline-block text-xs px-2 py-1 rounded-full ${style} ${className}`}>
      {children}
    </span>
  );
};
