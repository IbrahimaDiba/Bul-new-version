import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ChatbotFloatingButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <motion.button
      onClick={() => navigate('/chatbot')}
      className="fixed bottom-6 right-6 z-50 bg-white/60 backdrop-blur-md border border-white/40 hover:bg-crimson-500 hover:text-white text-crimson-500 rounded-full shadow-2xl p-4 flex items-center justify-center transition-colors focus:outline-none"
      title="Chat with BUL Assistant"
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}
    >
      <motion.span
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="flex"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.span>
      <span className="sr-only">Open Chatbot</span>
    </motion.button>
  );
};

export default ChatbotFloatingButton; 