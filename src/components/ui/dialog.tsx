import React from "react";

export const Dialog = ({ open, onOpenChange, children }: any) => (open ? children : null);
export const DialogContent = ({ children }: any) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50">
    <div className="bg-white p-6 rounded-xl max-w-md w-full">{children}</div>
  </div>
);
export const DialogHeader = ({ children }: any) => <div className="mb-3">{children}</div>;
export const DialogTitle = ({ children }: any) => <h2 className="text-xl font-semibold">{children}</h2>;
export const DialogFooter = ({ children }: any) => <div className="mt-3">{children}</div>;
