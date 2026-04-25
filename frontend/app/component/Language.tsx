"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoLanguageOutline, IoChevronDownOutline, IoSearchOutline, IoCheckmark } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸", region: "US" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", region: "IN" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳", region: "IN" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳", region: "IN" },
  { code: "mr", label: "मराठी", flag: "🇮🇳", region: "IN" },
  { code: "gu", label: "ગુજરાતી", flag: "🇮🇳", region: "IN" },
  { code: "or", label: "ଓଡ଼ିଆ", flag: "🇮🇳", region: "IN" },
  { code: "bn", label: "বাংলা", flag: "🇧🇩", region: "BD" },
  { code: "ar", label: "العربية", flag: "🇸🇦", region: "SA" },
];

const Language: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(LANGUAGES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "gt_hidden_element"
        );
      }
    };

    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate) {
      window.googleTranslateElementInit();
    }

    const style = document.createElement("style");
    style.id = "gt-suppress";
    style.textContent = `
      .goog-te-banner-frame, #\\:1\\.container { display: none !important; }
      body { top: 0 !important; }
    `;
    if (!document.getElementById("gt-suppress")) {
      document.head.appendChild(style);
    }

    return () => {
      // @ts-ignore
      delete window.googleTranslateElementInit;
    };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLanguage = (lang: typeof LANGUAGES[0]) => {
    setSelected(lang);
    setIsOpen(false);
    setSearchQuery("");

    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = lang.code;
      select.dispatchEvent(new Event("change"));
    }
  };

  const filteredLanguages = LANGUAGES.filter(lang => 
    lang.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className="relative">
      <div id="gt_hidden_element" className="hidden" />

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="notranslate group flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 bg-white/5 dark:bg-black/20 backdrop-blur-md border-white/10 hover:border-[#4A90E2]/50 shadow-sm"
      >
        <IoLanguageOutline size={14} className="text-[#4A90E2]" />
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">
          {selected.code}
        </span>
        <IoChevronDownOutline
          size={10}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="absolute right-0 mt-2 w-52 rounded-2xl border bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden z-[100]"
          >
            {/* Search Bar */}
            <div className="p-3 pb-2">
              <div className="relative">
                <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-white/5 border-transparent rounded-lg text-[10px] focus:outline-none text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>

            {/* Language List */}
            <div className="max-h-60 overflow-y-auto py-1 px-1.5 scrollbar-hide">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang)}
                    className={`notranslate w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group mb-0.5
                      ${selected.code === lang.code
                        ? "bg-[#4A90E2]/10 text-[#4A90E2]"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-bold border transition-all
                        ${selected.code === lang.code 
                          ? "bg-white dark:bg-white/10 border-[#4A90E2]/30" 
                          : "bg-slate-50 dark:bg-white/5 border-transparent"}`}>
                        {lang.region}
                      </div>
                      <span className="text-[11px] font-bold tracking-tight">{lang.label}</span>
                    </div>
                    {selected.code === lang.code && (
                      <IoCheckmark size={12} className="text-[#4A90E2]" />
                    )}
                  </button>
                ))
              ) : (
                <p className="py-4 text-center text-[10px] text-slate-400 italic">No results</p>
              )}
            </div>

            {/* Footer */}
            <div className="p-2 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
              <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest notranslate">
                Select
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Language;
