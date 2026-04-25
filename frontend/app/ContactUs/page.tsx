"use client";
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function ContactUsPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult("Sending...");
    
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        toast.success("Message sent successfully!");
        event.currentTarget.reset();
      } else {
        console.log("Error", data);
        setResult(data.message);
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Submit Error", error);
      setResult(error.message || "Something went wrong. Please try again.");
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center pt-32 pb-20 px-6 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Contact Us</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">We'd love to hear from you. Send us a message.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <input type="hidden" name="access_key" value={process.env.NEXT_PUBLIC_WEB3_FORMS_ACCESS_KEY} />
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Name</label>
            <input 
              type="text" 
              name="name" 
              required
              placeholder="Your Name"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-slate-900 dark:focus:border-white text-slate-900 dark:text-white transition shadow-sm" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
            <input 
              type="email" 
              name="email" 
              required
              placeholder="email@example.com"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-slate-900 dark:focus:border-white text-slate-900 dark:text-white transition shadow-sm" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Message</label>
            <textarea 
              name="message" 
              required
              rows={5}
              placeholder="How can we help?"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-slate-900 dark:focus:border-white text-slate-900 dark:text-white transition shadow-sm resize-none" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-xl transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {result && (
          <p className={`mt-6 text-center text-xs font-bold uppercase tracking-widest ${result.includes("Successfully") ? "text-[#00ff87]" : "text-red-500"}`}>
            {result}
          </p>
        )}
      </div>
    </main>
  );
}
