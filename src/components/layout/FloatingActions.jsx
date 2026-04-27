import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { useLanguage } from '../../store/LanguageContext';

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { cartCount } = useCart();
  const { isRTL } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`fixed bottom-24 md:bottom-32 z-[150] flex flex-col gap-4 ${isRTL ? 'left-6 md:left-8' : 'right-6 md:right-8'}`}>
      <AnimatePresence>
        {/* Floating Cart - Forced Visibility for testing/use */}
        {cartCount > 0 && (
          <motion.div
            key="floating-cart"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            className="relative"
          >
            <Link 
              to="/cart"
              className="w-16 h-16 bg-primary text-white rounded-full shadow-[0_20px_50px_rgba(76,175,80,0.3)] flex items-center justify-center relative hover:bg-primary-dark transition-all border-4 border-white"
            >
              <ShoppingCart size={28} />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                {cartCount}
              </span>
            </Link>
          </motion.div>
        )}

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <motion.button
            key="scroll-top"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={scrollToTop}
            className="w-14 h-14 bg-white text-secondary rounded-full shadow-xl flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-all"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActions;
