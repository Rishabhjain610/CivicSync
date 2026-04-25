"use client";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../lib/redux/userSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AuthDataContext } from "../../context/AuthDataContext";

const LoginButton: React.FC = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user.userData);
  const { serverUrl } = useContext(AuthDataContext);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
      dispatch(setUserData(null));
      router.push("/Login");
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };
  const handleLoginSignup = () => router.push("/Login");

  return (
    <div className="w-full">
      {userData ? (
        <button 
          onClick={handleLogout} 
          className="w-full md:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-full px-6 py-2 text-xs font-bold transition-all active:scale-95"
        >
          Logout
        </button>
      ) : (
        <button 
          onClick={handleLoginSignup} 
          className="w-full md:w-auto bg-[#4A90E2]/20 hover:bg-[#4A90E2]/30 text-[#4A90E2] border border-[#4A90E2]/40 rounded-full px-6 py-2 text-xs font-bold transition-all active:scale-95 shadow-lg shadow-[#4A90E2]/10"
        >
          Login / Signup
        </button>
      )}
    </div>
  );
};

export default LoginButton;