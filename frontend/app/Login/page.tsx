"use client";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { AuthDataContext } from "../../context/AuthDataContext";
import { Lock, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../../lib/redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user.userData);
  const { serverUrl } = useContext(AuthDataContext);

  useEffect(() => {
    if (userData) router.replace("/");
  }, [userData, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(res.data.user));
      toast.success("Login Successful");
      router.push("/");
    } catch (err: any) {
      toast.error("Login Failed");
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const name = user.displayName;
      const email = user.email;
      const res = await axios.post(
        `${serverUrl}/api/auth/google`,
        { name, email },
        { withCredentials: true }
      );
      dispatch(setUserData(res.data.user));
      toast.success("Google Sign-In Successful");
      router.push("/");
    } catch (err) {
      console.error("Google Sign-In Failed", err);
      toast.error("Google Sign-In Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex justify-center items-center px-4 transition-colors duration-300">
      <div className="w-full max-w-md border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm bg-white dark:bg-slate-900/50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-[#4A90E2] transition-colors" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm focus:outline-none text-slate-900 dark:text-white focus:border-[#4A90E2] dark:focus:border-[#4A90E2] transition"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-[#4A90E2] transition-colors" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm focus:outline-none text-slate-900 dark:text-white focus:border-[#4A90E2] dark:focus:border-[#4A90E2] transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm shadow-lg shadow-black/10 dark:shadow-white/5 active:scale-[0.98]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition flex items-center justify-center gap-3 text-sm font-bold shadow-sm active:scale-[0.98]"
        >
          <FcGoogle className="w-5 h-5" />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          Don't have an account?{" "}
          <Link href="/Signup" className="text-[#4A90E2] font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;