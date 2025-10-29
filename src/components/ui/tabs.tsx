import React, { useState } from "react";

export const Tabs = ({ value, onValueChange, children }: any) => {
  const [tab, setTab] = useState(value);
  const change = (v: string) => {
    setTab(v);
    onValueChange?.(v);
  };
  return (
    <div className="w-full">
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, { tab, change })
      )}
    </div>
  );
};

export const TabsList = ({ children }: any) => (
  <div className="flex gap-2 flex-wrap">{children}</div>
);

export const TabsTrigger = ({ value, tab, change, children, className = "" }: any) => (
  <button
    onClick={() => change(value)}
    className={`px-3 py-1 rounded-md text-sm border ${
      tab === value ? "bg-black text-white" : "bg-white text-black"
    } ${className}`}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, tab, children }: any) => (
  <div>{tab === value && children}</div>
);
