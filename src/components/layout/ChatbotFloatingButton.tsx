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

  // Bounce animation keyframes for the basketball:
  // - y: 0 is the floor, -36px is the peak height
  // - scaleY and scaleX handle squash & stretch physics on impact
  const ballVariants = {
    bounce: {
      y: [0, -36, 0],
      scaleY: [0.85, 1.05, 1, 1.05, 0.85],
      scaleX: [1.15, 0.95, 1, 0.95, 1.15],
      transition: {
        y: {
          duration: 1.2,
          ease: ["easeOut", "easeIn"],
          repeat: Infinity,
          times: [0, 0.5, 1]
        },
        scaleY: {
          duration: 1.2,
          ease: ["easeOut", "easeIn", "easeOut", "easeIn"],
          repeat: Infinity,
          times: [0, 0.15, 0.5, 0.85, 1]
        },
        scaleX: {
          duration: 1.2,
          ease: ["easeOut", "easeIn", "easeOut", "easeIn"],
          repeat: Infinity,
          times: [0, 0.15, 0.5, 0.85, 1]
        }
      }
    }
  };

  // Shadow animation: shrinks and fades when ball is in the air, grows and darkens on landing
  const shadowVariants = {
    bounce: {
      scaleX: [1.2, 0.4, 1.2],
      opacity: [0.5, 0.12, 0.5],
      transition: {
        duration: 1.2,
        ease: ["easeOut", "easeIn"],
        repeat: Infinity,
        times: [0, 0.5, 1]
      }
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-end gap-4">
      
      {/* ── TOOLTIP (AI BRANDING) ── */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-3"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-black/5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-2xl px-5 py-4 w-64">
              <div className="flex gap-4 items-center">
                {/* Basketball-styled gradient icon */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shrink-0 shadow-sm">
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

      {/* ── BOUNCING BASKETBALL BUTTON ── */}
      <div className="relative w-[65px] h-[110px] flex flex-col items-center justify-end select-none">
        
        {/* Invisible touch target for accessibility and easy clicking */}
        <button
          onClick={() => navigate('/chatbot')}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="absolute inset-0 w-full h-full cursor-pointer outline-none focus:outline-none z-20"
          aria-label="Ouvrir le Chatbot"
        />

        {/* Visual elements container */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 pointer-events-none">
          
          {/* Bouncing & Squashing Basketball Graphic */}
          <motion.div
            variants={ballVariants}
            animate="bounce"
            className="w-[60px] h-[60px] relative mb-2"
            style={{ originX: 0.5, originY: 1 }} // Keeps bottom anchored for squash physics
          >
            {/* Ambient orange glow */}
            <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-md opacity-50 group-hover:opacity-85 transition-opacity duration-300" />
            
            {/* 3D-Look SVG Basketball */}
            <motion.svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-[0_6px_12px_rgba(0,0,0,0.25)]"
              animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
              transition={isHovered ? { repeat: Infinity, duration: 2, ease: "linear" } : { duration: 0.5, ease: "easeOut" }}
            >
              <defs>
                {/* Spherical orange gradient */}
                <radialGradient id="ballOrange" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffb06e" />
                  <stop offset="50%" stopColor="#ff6a00" />
                  <stop offset="85%" stopColor="#cc4e00" />
                  <stop offset="100%" stopColor="#802b00" />
                </radialGradient>
                {/* Edge shading for 3D sphere illusion */}
                <radialGradient id="innerShadow" cx="50%" cy="50%" r="50%">
                  <stop offset="78%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
                </radialGradient>
                {/* Circular mask for lines */}
                <clipPath id="ballClip">
                  <circle cx="50" cy="50" r="47" />
                </clipPath>
              </defs>

              {/* Base Sphere */}
              <circle cx="50" cy="50" r="47" fill="url(#ballOrange)" stroke="#1c0b00" strokeWidth="2.5" />

              {/* Seams / Recessed Lines */}
              <g clipPath="url(#ballClip)">
                {/* Vertical seam */}
                <line x1="50" y1="0" x2="50" y2="100" stroke="#1c0b00" strokeWidth="3.5" strokeLinecap="round" />
                {/* Horizontal seam */}
                <line x1="0" y1="50" x2="100" y2="50" stroke="#1c0b00" strokeWidth="3.5" strokeLinecap="round" />
                
                {/* Curved left panel seam */}
                <circle cx="5" cy="50" r="32" fill="none" stroke="#1c0b00" strokeWidth="3.5" />
                {/* Curved right panel seam */}
                <circle cx="95" cy="50" r="32" fill="none" stroke="#1c0b00" strokeWidth="3.5" />
                
                {/* 3D edge shade overlay */}
                <circle cx="50" cy="50" r="47" fill="url(#innerShadow)" />
              </g>

              {/* Glossy light reflection highlight */}
              <ellipse cx="32" cy="22" rx="10" ry="5" fill="#ffffff" opacity="0.32" transform="rotate(-30 32 22)" />
            </motion.svg>
          </motion.div>

          {/* Dynamic Ground Shadow */}
          <motion.div
            variants={shadowVariants}
            animate="bounce"
            className="w-10 h-[5px] bg-black/40 rounded-full blur-[1px]"
            style={{ originX: 0.5, originY: 0.5 }}
          />

        </div>
      </div>
    </div>
  );
};

export default ChatbotFloatingButton;