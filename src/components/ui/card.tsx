import React from "react";

export const Card = ({ children, className = "" }: any) => (
  <div className={`rounded-xl border p-2 bg-white shadow-sm ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }: any) => (
  <div className={className}>{children}</div>
);
