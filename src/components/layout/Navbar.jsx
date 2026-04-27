import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../store/LanguageContext';
import { fetchCategories } from '../../services/api';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import MobileNav from './MobileNav';

const Navbar = () => {
  const { t, isRTL, getLocalized } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats.slice(0, 7)); // Keeping it slim as requested
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  return (
    <>
      <nav className="bg-white shadow-sm relative z-[105] border-b border-gray-50">
        <div className="max-w-1400 mx-auto px-4 md:px-8">
          <div className={`flex items-center justify-between h-16 md:h-24 ${isRTL ? 'flex-row-reverse' : ''}`}>
            
            {/* 1. Logo Section (Always Visible) */}
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-secondary hover:text-primary transition-colors"
              >
                <Menu size={24} />
              </button>

              <Link to="/" className={`flex items-center gap-3 group ${isRTL ? 'flex-row-reverse' : ''}`}>
                <img src="/logo.png" className="h-10 md:h-14 w-auto transition-transform group-hover:scale-105" alt="Omnia Shop" />
                <div className={`flex flex-col leading-none ${isRTL ? 'items-end' : 'items-start'}`}>
                  <span className="text-lg md:text-2xl font-black uppercase tracking-tighter text-secondary">
                    OMNIA <span className="text-primary italic">SHOP</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 whitespace-nowrap">{t('nav.tagline')}</span>
                </div>
              </Link>
            </div>

            {/* 2. Center Section: Navigation Links (Desktop Only) */}
            <div className={`hidden lg:flex items-center justify-center gap-6 xl:gap-10 ${isRTL ? 'flex-row-reverse' : ''} absolute left-1/2 -translate-x-1/2 w-max`}>
              <Link to="/" className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${location.pathname === '/' ? 'text-primary border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary'}`}>
                {isRTL ? 'الرئيسية' : 'Home'}
              </Link>
              
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalog?category=${cat.id}`}
                  className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${location.search.includes(cat.id) ? 'text-primary border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary'}`}
                >
                  {getLocalized(cat, 'name').split('&')[0].trim()} {/* Keep it short */}
                </Link>
              ))}
              
              <Link to="/catalog" className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${location.pathname === '/catalog' && !location.search ? 'text-primary border-b-2 border-primary pb-1' : 'text-primary hover:text-secondary'}`}>
                {isRTL ? 'المتجر' : 'Shop'}
              </Link>
            </div>

            {/* 3. Empty Right Section for spacing balance on desktop */}
            <div className="hidden lg:block w-[150px]"></div>

          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <MobileNav 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        categories={categories} 
      />
    </>
  );
};

export default Navbar;
