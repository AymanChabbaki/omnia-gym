import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../store/LanguageContext';
import { X, ChevronRight, Home, ShoppingCart, Info, Phone, Shield, Truck, Package } from 'lucide-react';

const MobileNav = ({ isOpen, onClose, categories }) => {
  const { isRTL, getLocalized, t } = useLanguage();

  const menuItems = [
    { icon: <Home size={20} />, label: isRTL ? 'الرئيسية' : 'Home', path: '/' },
    { icon: <ShoppingCart size={20} />, label: isRTL ? 'المتجر' : 'Shop All', path: '/catalog' },
    { icon: <Info size={20} />, label: isRTL ? 'من نحن' : 'About Us', path: '/about' },
    { icon: <Phone size={20} />, label: isRTL ? 'اتصل بنا' : 'Contact', path: '/contact' },
  ];

  const footerLinks = [
    { label: isRTL ? 'الشحن' : 'Shipping', path: '/shipping' },
    { label: isRTL ? 'الخصوصية' : 'Privacy', path: '/privacy' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Solid Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: isRTL ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 bottom-0 w-[300px] bg-white z-[210] shadow-2xl flex flex-col ${isRTL ? 'right-0' : 'left-0'}`}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <img src="/logo.png" className="h-8 w-auto" alt="Logo" />
              <button 
                onClick={onClose}
                className="p-2 bg-gray-50 text-secondary rounded-full hover:bg-gray-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-8">
              
              {/* Main Links */}
              <div className="space-y-2">
                {menuItems.map((item, i) => (
                  <Link
                    key={i}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all group ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-secondary">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Categories Section */}
              <div className="space-y-4">
                <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 px-4 ${isRTL ? 'text-right' : ''}`}>
                  {isRTL ? 'الأقسام' : 'Categories'}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/catalog?category=${cat.id}`}
                      onClick={onClose}
                      className={`flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-primary/5 transition-all group ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                         <span className="material-symbols-outlined text-lg text-gray-400 group-hover:text-primary transition-colors">{cat.icon}</span>
                         <span className="text-[11px] font-bold uppercase tracking-widest text-secondary">{getLocalized(cat, 'name')}</span>
                      </div>
                      <ChevronRight size={14} className={`text-gray-300 group-hover:text-primary transition-all ${isRTL ? 'rotate-180' : ''}`} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Information */}
            <div className="p-8 bg-gray-50 mt-auto">
              <div className={`flex flex-wrap gap-4 mb-6 ${isRTL ? 'justify-end' : ''}`}>
                {footerLinks.map((link, i) => (
                  <Link key={i} to={link.path} onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary">
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className={`flex items-center gap-3 text-secondary font-black ${isRTL ? 'flex-row-reverse' : ''}`}>
                 <Phone size={14} className="text-primary" />
                 <span className="text-xs" dir="ltr">0661349808</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
