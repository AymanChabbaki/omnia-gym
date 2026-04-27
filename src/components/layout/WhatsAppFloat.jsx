import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../store/LanguageContext';

const WhatsAppFloat = () => {
  const { isRTL } = useLanguage();
  const phoneNumber = "212661349808"; // Your phone number
  const message = encodeURIComponent("Hello Omnia Shop, I'm interested in your products!");

  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className={`fixed bottom-6 md:bottom-8 z-[150] w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center transition-all hover:bg-[#128C7E] ${
        isRTL ? 'left-6 md:left-8' : 'right-6 md:right-8'
      }`}
    >
      <img src="/whatsapp-icon.svg" alt="WhatsApp" className="w-8 h-8 md:w-10 md:h-10" />
      
      {/* Pulse Effect */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
      
      {/* Tooltip */}
      <div className={`absolute bottom-full mb-3 hidden md:group-hover:block bg-white text-secondary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-xl whitespace-nowrap ${isRTL ? 'left-0' : 'right-0'}`}>
        {isRTL ? 'تحدث معنا' : 'Chat with us'}
      </div>
    </motion.a>
  );
};

export default WhatsAppFloat;
