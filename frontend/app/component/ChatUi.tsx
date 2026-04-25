"use client";
import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoClose,
  IoSend,
  IoChatbubbles,
  IoCheckmarkDone,
} from "react-icons/io5";
import { Square, X, Trash2 } from "lucide-react";
import { Outfit, Space_Grotesk } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'], display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], display: 'swap' });

function SearchCard({ results, query }: any) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-4 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xl">
          🏛️
        </div>
        <div>
          <h3 className={`font-bold text-blue-500 text-sm uppercase tracking-wider ${outfit.className}`}>
            Civic Search
          </h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{query}</p>
        </div>
      </div>
      <div className="space-y-3">
        {Array.isArray(results) &&
          results.map((res: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-blue-500/40 hover:bg-white/10 transition-all group cursor-pointer"
            >
              <a
                href={res.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-slate-900 dark:text-white font-semibold hover:text-blue-500 text-sm mb-1 block transition-colors ${outfit.className}`}
              >
                {res.name}
              </a>
              <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                {res.description}
              </p>
            </motion.div>
          ))}
      </div>
    </div>
  );
}

function IssueListCard({ issues }: any) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-4 shadow-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-xl">
          📍
        </div>
        <div>
          <h3 className={`font-bold text-emerald-500 text-sm uppercase tracking-wider ${outfit.className}`}>
            Recent Issues
          </h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Live from Database</p>
        </div>
      </div>
      <div className="space-y-2">
        {Array.isArray(issues) &&
          issues.map((issue: any, idx: number) => (
            <div key={idx} className="p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">{issue.title}</p>
              <div className="flex items-center justify-between">
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-gray-400 font-bold uppercase tracking-tighter">
                  {issue.category}
                </span>
                <span className="text-[9px] text-emerald-500 font-black">
                  {issue.status}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function SummaryCard({ summary, itemCount, type }: any) {
  const config = (
    {
      search: {
        bg: "bg-blue-500/5",
        border: "border-blue-500/20",
        text: "text-blue-500",
        icon: "✨",
      },
      issue: {
        bg: "bg-emerald-500/5",
        border: "border-emerald-500/20",
        text: "text-emerald-500",
        icon: "📍",
      },
    } as Record<string, any>
  )[type] || {
    bg: "bg-white/5",
    border: "border-white/10",
    text: "text-white",
    icon: "📝",
  };

  return (
    <div
      className={`${config.bg} border ${config.border} rounded-2xl p-4 space-y-3 shadow-lg`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{config.icon}</span>
        <h3 className={`font-bold text-xs uppercase tracking-widest ${config.text} ${outfit.className}`}>
          Insight Summary ({itemCount})
        </h3>
      </div>
      <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
        {summary}
      </p>
    </div>
  );
}

function LoadingCard({ message }: { message: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center gap-3 shadow-lg">
      <div className="relative">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-sm animate-pulse" />
      </div>
      <span className={`text-xs text-blue-500 font-bold uppercase tracking-widest ${outfit.className}`}>{message}</span>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 shadow-lg">
      <span className="text-xl">⚠️</span>
      <span className="text-xs text-red-400 font-bold uppercase tracking-wider">{message}</span>
    </div>
  );
}

function MessageBubble({ message }: any) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} w-full px-4 mb-2`}
    >
      <div
        className={`relative group max-w-[85%] sm:max-w-[75%] ${
          isUser
            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm font-medium"
            : "bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-gray-100 rounded-2xl rounded-tl-sm"
        } px-4 py-3 shadow-lg overflow-hidden`}
      >

        
        <div className="relative space-y-3 z-10">
          {message.parts
            ? message.parts.map((part: any, index: number) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div
                        key={`${message.id}-part-${index}`}
                        className="text-sm leading-relaxed whitespace-pre-wrap break-words"
                      >
                        {part.text}
                      </div>
                    );

                  case "tool-civicSearch":
                    switch (part.state) {
                      case "input-streaming":
                        return <LoadingCard key={`${message.id}-search-${index}`} message="Searching Civic Laws..." />;
                      case "input-available":
                        return (
                          <div key={`${message.id}-search-${index}`} className={`text-[10px] uppercase tracking-widest bg-blue-500/10 border border-blue-500/30 px-4 py-3 rounded-xl font-bold text-blue-500 ${outfit.className}`}>
                            🔍 Searching: {part.input.query}
                          </div>
                        );
                      case "output-available":
                        return (
                          <div key={`${message.id}-search-${index}`} className="space-y-4">
                            <SearchCard results={part.output.results} query={part.input.query} />
                            {part.output.combinedSummary && (
                              <SummaryCard summary={part.output.combinedSummary} itemCount={part.output.results.length} type="search" />
                            )}
                          </div>
                        );
                      case "output-error":
                        return (
                          <ErrorCard
                            key={`${message.id}-search-${index}`}
                            message={part.errorText}
                          />
                        );
                      default: return null;
                    }

                  case "tool-getRecentIssues":
                    switch (part.state) {
                      case "input-streaming":
                        return <LoadingCard key={`${message.id}-issues-${index}`} message="Accessing Database..." />;
                      case "output-available":
                        return <IssueListCard key={`${message.id}-issues-${index}`} issues={part.output.issues} />;
                      default: return null;
                    }

                  default:
                    return null;
                }
              })
            : typeof message.content === "string" && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ChatUi() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, stop, sendMessage, status } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (status !== "ready") return;

    const userPrompt = input.trim();
    if (!userPrompt) return;

    sendMessage({ text: userPrompt });

    setInput("");
  };

  const lastMessage = messages.length ? messages[messages.length - 1] : null;
  const isLoading =
    (status === "submitted" || status === "streaming") &&
    lastMessage?.role === "user";

  const sendButtonDisabled =
    status !== "ready" || isLoading || !input.trim();

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full shadow-2xl flex items-center justify-center z-50 transition-all duration-300 hover:scale-110 active:scale-95"
      >

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
            >
              <IoClose size={32} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
              className="relative"
            >
              <IoChatbubbles size={28} />
              <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-black" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`fixed bottom-24 right-4 sm:bottom-28 sm:right-8 z-[40] flex items-end justify-end w-[calc(100%-2rem)] sm:w-[450px] ${spaceGrotesk.className}`}
            >
              <div className="w-full h-[500px] sm:h-[550px] bg-white dark:bg-[#05050A] border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden relative">
                {/* Decorative Elements */}


                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-[#0B0F19] border-b border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm">
                      <IoChatbubbles size={20} />
                    </div>
                    <div>
                      <h3 className={`font-bold text-slate-900 dark:text-white tracking-tight ${outfit.className}`}>
                        Civic Sync Assistant
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <p className="text-[10px] font-medium text-slate-500 dark:text-gray-400 uppercase tracking-widest">
                          Online
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <IoClose size={24} />
                  </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative z-10 scrollbar-hide">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-full space-y-6 py-6 px-4 text-center">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-3xl shadow-inner border border-blue-500/20">
                        💬
                      </div>
                      <div className="space-y-2">
                        <h2 className={`text-2xl font-bold text-slate-900 dark:text-white tracking-tight ${outfit.className}`}>
                          Civic Sync Help
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-gray-400 font-medium max-w-[240px] leading-relaxed">
                          Ask about reporting issues, tracking status, or urban guidelines.
                        </p>
                      </div>

                      <div className="w-full space-y-2.5 max-w-[280px]">
                        {[
                          "How do I report a pothole?",
                          "Show me issues in my locality",
                          "How does community upvoting work?",
                        ].map((text, i) => (
                          <button
                            key={i}
                            onClick={() => setInput(text)}
                            className="w-full px-4 py-3 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl text-xs text-slate-700 dark:text-gray-300 transition-all text-left font-bold shadow-sm flex items-center justify-between group"
                          >
                            <span>{text}</span>
                            <IoSend className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all -rotate-45" size={12} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 py-4">
                      {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                      ))}
                    </div>
                  )}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-start px-4"
                    >
                      <div className="bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl flex items-center gap-3 shadow-xl">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-cyan-500 border-t-transparent" />
                        <span className={`text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider ${outfit.className}`}>Processing</span>
                        <button
                          onClick={stop}
                          className={`ml-4 px-3 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 rounded-lg text-[10px] font-black hover:bg-fuchsia-500/20 uppercase transition-all ${outfit.className}`}
                        >
                          Abort
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-slate-50 dark:bg-[#0B0F19] border-t border-slate-200 dark:border-white/10">
                  <form 
                    className="flex items-center gap-2" 
                    onSubmit={onSubmit}
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      disabled={isLoading}
                      placeholder="Type a message..."
                      className={`flex-1 h-12 px-4 rounded-xl bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm shadow-inner ${outfit.className}`}
                    />
                    <button
                      type="submit"
                      disabled={sendButtonDisabled}
                      className="w-12 h-12 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center disabled:opacity-50 transition-all shadow-lg hover:bg-cyan-600 dark:hover:bg-cyan-500 dark:hover:text-white"
                    >
                      <IoSend size={20} />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
