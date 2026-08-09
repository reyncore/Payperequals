"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1A1A28",
            color: "#F8F8FF",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "Inter, sans-serif",
          },
          success: {
            iconTheme: {
              primary: "#00D4FF",
              secondary: "#1A1A28",
            },
          },
          error: {
            iconTheme: {
              primary: "#E94560",
              secondary: "#1A1A28",
            },
          },
        }}
      />
    </SessionProvider>
  );
}
