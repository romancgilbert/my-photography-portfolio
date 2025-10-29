import React from "react";

export const Input = (props: any) => (
  <input
    {...props}
    className={`border rounded-md px-3 py-2 text-sm w-full ${props.className || ""}`}
  />
);
