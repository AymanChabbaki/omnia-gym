import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { MessageCircle, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';

import { useLanguage, languages } from '../../store/LanguageContext';

const TopBar = () => {
  const { currentLanguage, setLanguage, t, isRTL } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${searchQuery}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="w-full bg-[#0e0e0e] border-b border-white/5 relative z-[60]">
      <div className="max-w-[1920px] mx-auto px-6 h-10 flex justify-between items-center">
        {/* Left: Social & Language */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`text-[9px] font-black tracking-tighter transition-colors ${
                  currentLanguage === code ? 'text-primary' : 'text-white/20 hover:text-white/50'
                }`}
              >
                {lang.code}
              </button>
            ))}
          </div>
          
          <div className="h-3 w-px bg-white/10 hidden sm:block"></div>

          <div className="flex items-center gap-4">
            <motion.a 
              href="https://wa.me/+213661349808" 
              target="_blank" 
              whileHover={{ scale: 1.1 }} 
              className="opacity-40 hover:opacity-100 transition-opacity"
            >
              <img src="/whatsapp-icon.svg" alt="WhatsApp" className="w-4 h-4 invert brightness-200" />
            </motion.a>
            <motion.a 
              href="https://instagram.com/omnia" 
              target="_blank" 
              whileHover={{ scale: 1.1 }} 
              className="opacity-40 hover:opacity-100 transition-opacity"
            >
              <img src="/black-instagram-icon.svg" alt="Instagram" className="w-4 h-4 invert brightness-200" />
            </motion.a>
            <motion.a 
              href="https://facebook.com/omnia" 
              target="_blank" 
              whileHover={{ scale: 1.1 }} 
              className="opacity-40 hover:opacity-100 transition-opacity"
            >
              <img src="/facebook-app-round-icon.svg" alt="Facebook" className="w-4 h-4 invert brightness-200" />
            </motion.a>
          </div>
        </div>

        {/* Promo Message */}
        <div className="hidden md:block">
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic"
          >
            {t('common.shippingPromo')}
          </motion.p>
        </div>

        {/* Search Integration */}
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            {!isSearchOpen ? (
              <motion.button
                key="search-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors cursor-pointer"
              >
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">{t('common.search')}</span>
                <Search size={16} />
              </motion.button>
            ) : (
              <motion.form
                key="search-form"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '200px', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                onSubmit={handleSearch}
                className="relative flex items-center"
              >
                <input
                  autoFocus
                  type="text"
                  placeholder={t('common.powerSearch')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-widest text-primary w-full p-0 ${isRTL ? 'text-right' : 'text-left'}`}
                />
                <button 
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-white/40 hover:text-white ml-2"
                >
                  <X size={14} />
                </button>

                {/* Dropdown Results */}
                {results.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute top-8 ${isRTL ? 'left-0' : 'right-0'} w-64 bg-surface-container border border-white/10 rounded-lg shadow-2xl p-2 z-[70]`}
                  >
                    {results.map(product => (
                      <div 
                        key={product.id}
                        onClick={() => {
                          navigate(`/product/${product.id}`);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className={`flex items-center gap-3 p-2 hover:bg-white/5 rounded transition-colors cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <img src={product.image} alt="" className="w-8 h-8 object-contain" />
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <p className="text-[10px] font-black uppercase text-white truncate w-40">{product.name}</p>
                          <p className="text-[8px] font-bold text-primary">{product.price} DH</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-primary ${isRTL ? 'origin-[100%]' : 'origin-[0%]'}`}
        style={{ scaleX }}
      />
    </div>
  );
};

export default TopBar;
