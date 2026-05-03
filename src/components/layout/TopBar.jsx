import React, { useState } from 'react';
import { useLanguage } from '../../store/LanguageContext';
import { useCart } from '../../store/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Search, ShoppingBag, X, Languages, ShoppingCart } from 'lucide-react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

const TopBar = () => {
  const { isRTL, setLanguage, language, t } = useLanguage();
  const { cartCount, cartTotal } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="bg-secondary text-white py-1.5 md:py-2.5 px-4 md:px-8 border-b border-white/10 relative z-[110]">
      <div className={`max-w-1400 mx-auto flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        
        {/* Left: Contact & Social (Hidden on very small mobiles) */}
        <div className={`flex items-center gap-4 md:gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <a href="tel:0661349808" className="flex items-center gap-2 text-[10px] md:text-[11px] font-black hover:text-primary transition-colors">
            <Phone size={12} className={isRTL ? 'rotate-[-100deg]' : ''} />
            <span className="hidden xs:inline" dir="ltr">0661349808</span>
          </a>
          <div className="hidden md:flex items-center gap-4 border-l border-white/20 pl-6 ml-2">
            <a href="https://www.facebook.com/share/1LArvhpzGM/?mibextid=wwXIfr" className="hover:text-primary transition-all"><FaFacebookF size={14} /></a>
            <a href="https://www.instagram.com/omniagym_officiel?igsh=NzFwZHpjMTR6eTA4&utm_source=ig_contact_invite" className="hover:text-primary transition-all"><FaInstagram size={14} /></a>
          </div>
        </div>

        {/* Center: Promo (Hidden on mobile to save space) */}
        <div className="hidden lg:block text-[9px] font-black uppercase tracking-[0.2em] animate-pulse text-primary/90">
          {isRTL ? 'توصيل مجاني للطلبات فوق 500 درهم' : 'Free delivery on orders over 500 DH'}
        </div>

        {/* Right: Actions */}
        <div className={`flex items-center gap-2 md:gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          
          {/* Language Mobile Switcher */}
          <div className="relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 hover:bg-white/10 rounded-full transition-all flex items-center gap-1"
            >
              <Languages size={14} />
              <span className="text-[10px] font-black uppercase hidden xs:block">{language}</span>
            </button>
            
            <AnimatePresence>
              {showLangMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute top-full mt-2 bg-white text-secondary rounded-xl shadow-2xl p-1 z-[200] min-w-[80px] border border-gray-100 ${isRTL ? 'left-0' : 'right-0'}`}
                >
                  {['ar', 'en', 'fr'].map(lang => (
                    <button 
                      key={lang}
                      onClick={() => { setLanguage(lang); setShowLangMenu(false); }}
                      className={`w-full px-4 py-2 text-[10px] font-black uppercase rounded-lg text-left ${language === lang ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Toggle */}
          <div className="flex items-center">
            <div className={`overflow-hidden transition-all duration-300 flex items-center ${isSearchOpen ? 'w-32 xs:w-48 md:w-64 opacity-100 mr-2' : 'w-0 opacity-0'}`}>
              <form onSubmit={handleSearch} className="w-full">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRTL ? 'ابحث...' : 'Search...'} 
                  className="w-full bg-white/10 border border-white/20 rounded-full py-1.5 px-4 text-[10px] outline-none focus:border-primary transition-all font-bold placeholder:text-white/30"
                  autoFocus={isSearchOpen}
                />
              </form>
            </div>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:text-primary transition-all flex items-center justify-center"
            >
              {isSearchOpen ? <X size={16} /> : <Search size={16} />}
            </button>
          </div>

          {/* Mini Cart Button */}
          <Link to="/cart" className={`flex items-center gap-2 bg-primary/10 md:bg-white/10 hover:bg-white/20 transition-all p-1.5 md:px-4 md:py-1.5 rounded-full ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="relative flex items-center justify-center">
              <ShoppingCart size={16} className="text-primary md:text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-secondary">
                  {cartCount}
                </span>
              )}
            </div>
            <div className={`hidden sm:flex flex-col items-start leading-none ${isRTL ? 'items-end' : ''}`}>
              <span className="text-[10px] font-black">{cartTotal.toFixed(2)} د.م.</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

import { motion, AnimatePresence } from 'framer-motion';
export default TopBar;
