"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ToastProvider = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ToastContainer
      position="top-right"
      hideProgressBar={false}
      autoClose={3000}
      theme={resolvedTheme as "light" | "dark"}
      toastStyle={{
        borderRadius: "12px",
        fontWeight: "500",
        fontSize: "14px",
      }}
    />
  );
};

export default ToastProvider;