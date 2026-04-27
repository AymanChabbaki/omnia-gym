import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { useLanguage } from '../../store/LanguageContext';

const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { cartCount } = useCart();
  const { isRTL } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`fixed bottom-24 md:bottom-32 z-50 flex flex-col gap-4 ${isRTL ? 'left-6 md:left-8' : 'right-6 md:right-8'}`}>
      <AnimatePresence>
        {/* Floating Cart (Only if items exist) */}
        {cartCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
          >
            <Link 
              to="/cart"
              className="w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center relative hover:bg-primary-dark transition-all"
            >
              <ShoppingBag size={24} />
              <span className="absolute -top-1 -right-1 bg-badge-sale text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            </Link>
          </motion.div>
        )}

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={scrollToTop}
            className="w-14 h-14 bg-white text-secondary rounded-full shadow-2xl flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-all"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActions;
