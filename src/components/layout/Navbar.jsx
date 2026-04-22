import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { useLanguage } from '../../store/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCategories } from '../../services/api';


const Navbar = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const { t, getLocalized, isRTL } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCart = location.pathname === '/cart';

  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
  }, []);


  return (
    <>
      <nav className={`bg-surface/80 backdrop-blur-xl fixed top-10 w-full z-50 flex justify-between items-center px-6 py-4 max-w-[1920px] left-1/2 -translate-x-1/2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Omnia Gym" className="h-8 md:h-10 w-auto object-contain" />
        </Link>
        
        <div className={`hidden md:flex items-center gap-8 font-headline tracking-tighter uppercase font-black text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link to="/" className="text-white/70 hover:text-white transition-colors">{t('nav.home')}</Link>
          
          <div 
            className="relative group"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            <button className={`flex items-center gap-2 transition-colors py-2 ${isMenuOpen ? 'text-primary' : 'text-white/70 hover:text-white'}`}>
              <span className="material-symbols-outlined text-lg">menu</span>
              {t('nav.categories')}
              <span className={`material-symbols-outlined text-xs transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute top-full ${isRTL ? 'right-0' : 'left-0'} w-[600px] bg-surface-container-high/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 mt-2 grid grid-cols-2 gap-4 shadow-2xl z-50`}
                >
                  {categories.map((cat) => (
                    
                    <Link 
                      key={cat.id}
                      to={`/catalog?category=${cat.id}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-center gap-4 p-3 rounded-xl hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center group-hover:scale-110 transition-transform ${cat.icon === 'local_fire_department' ? 'text-primary' : 'text-white/60 group-hover:text-primary'}`}>
                        <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <div className={`text-xs font-black tracking-widest uppercase transition-colors ${cat.icon === 'local_fire_department' ? 'text-primary' : 'group-hover:text-white'}`}>
                          {getLocalized(cat, 'name')}
                        </div>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Link to="/catalog" className="text-white/70 hover:text-white transition-colors">{t('nav.browse')}</Link>
          
        </div>

        <div className={`flex items-center gap-6 text-primary ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link to="/cart" className={`relative flex items-center gap-1 ${isCart ? 'border-b-2 border-primary pb-1' : ''}`}>
            <span className="material-symbols-outlined hover:scale-110 transition-all font-variation-settings-[fill_0]" style={{ fontVariationSettings: isCart ? "'FILL' 1" : "'FILL' 0" }}>
              shopping_cart
            </span>
            {cartCount > 0 && (
              <span className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} bg-secondary text-on-secondary text-[10px] font-bold px-1.5 rounded-full`}>
                {cartCount}
              </span>
            )}
          </Link>
          <button className="material-symbols-outlined hover:scale-110 transition-all text-white/70">person</button>
        </div>
      </nav>
      <div className="bg-gradient-to-b from-[#1a1a1a] to-transparent h-px w-full fixed top-[112px] z-50"></div>
    </>
  );
};

export default Navbar;
