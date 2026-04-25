"use client";
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-slate-800 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xl font-bold text-slate-900 dark:text-white">Logo</div>
        
        <nav className="flex gap-8">
          <Link href="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
          <Link href="/About" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
          <Link href="/ContactUs" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
        </nav>

        <p className="text-xs text-slate-500 dark:text-slate-600">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;