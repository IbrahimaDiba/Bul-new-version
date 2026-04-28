import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotFloatingButton: React.FC = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-end gap-4">
      
      {/* ── BIG TECH / MINIMALIST TOOLTIP ── */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-1"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-2xl px-5 py-4 w-64">
              <div className="flex gap-4 items-center">
                {/* AI Gradient Sparkle Icon */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z" fill="currentColor"/>
                   </svg>
                </div>
                
                <div>
                  <h4 className="text-[14px] font-bold text-gray-900 tracking-tight leading-none mb-1">BUL Intelligence</h4>
                  <p className="text-[12px] text-gray-500 font-medium leading-tight">
                    Posez vos questions à l'IA
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BIG TECH STYLE BUTTON ── */}
      <motion.button
        onClick={() => navigate('/chatbot')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group outline-none focus:outline-none"
        aria-label="Ask AI"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Soft colorful ambient glow (Apple Intelligence style) */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 animate-[spin_6s_linear_infinite]" />

        {/* Pure White Minimalist Button Body */}
        <div className="relative w-[60px] h-[60px] rounded-full bg-white flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-black/[0.04] transition-transform duration-300">
          
          {/* AI Sparkles SVG */}
          <motion.div
            className="w-7 h-7 flex items-center justify-center"
            animate={isHovered ? { rotate: 180 } : { rotate: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
              <defs>
                <linearGradient id="aiGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ef4444" /> {/* Red */}
                  <stop offset="0.5" stopColor="#a855f7" /> {/* Purple */}
                  <stop offset="1" stopColor="#3b82f6" /> {/* Blue */}
                </linearGradient>
              </defs>
              <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z" fill="url(#aiGradient)"/>
              <path d="M19 4C19 5.65685 17.6569 7 16 7C17.6569 7 19 8.34315 19 10C19 8.34315 20.3431 7 22 7C20.3431 7 19 5.65685 19 4Z" fill="url(#aiGradient)"/>
              <path d="M6 18C6 18.5523 5.55228 19 5 19C5.55228 19 6 19.4477 6 20C6 19.4477 6.44772 19 7 19C6.44772 19 6 18.5523 6 18Z" fill="url(#aiGradient)"/>
            </svg>
          </motion.div>
          
        </div>
      </motion.button>
    </div>
  );
};

export default ChatbotFloatingButton;