import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../store/LanguageContext';
import { fetchCategories } from '../../services/api';

const Navbar = () => {
  const { isRTL, getLocalized, t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error("Navbar category fetch error", err);
      }
    };
    loadCategories();
  }, []);

  return (
    <nav className="bg-white text-on-surface w-full border-b border-gray-50">
      <div className="max-w-1400 mx-auto px-4 md:px-8 flex items-center justify-between h-14 md:h-16">
        
        {/* Logo Section */}
        <Link to="/" className={`flex items-center gap-3 group ${isRTL ? 'flex-row-reverse' : ''}`}>
          <img 
            src="/logo.png" 
            alt="Omnia Shop" 
            className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            onError={(e) => { e.target.src = '/placeholder.png'; }}
          />
          <div className={`hidden lg:flex flex-col leading-none ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="text-base font-black uppercase tracking-tighter text-on-surface">Omnia <span className="text-primary italic">Shop</span></span>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-on-surface-variant opacity-50">
              Morocco
            </span>
          </div>
        </Link>

        {/* Ultra-Slim Categories - Desktop */}
        <div className={`hidden lg:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {categories.slice(0, 8).map((cat) => (
            <Link 
              key={cat.id} 
              to={`/catalog?category=${cat.id}`}
              className={`text-[8px] font-black uppercase tracking-[0.25em] whitespace-nowrap transition-all hover:text-primary relative group py-1 ${
                location.search.includes(cat.id) ? 'text-primary' : 'text-on-surface-variant/70'
              }`}
            >
              {getLocalized(cat, 'name')}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                location.search.includes(cat.id) ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          ))}
        </div>

        {/* Compact Actions */}
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link 
            to="/catalog" 
            className="bg-primary text-white px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-md shadow-primary/10"
          >
            {t('nav.shop')}
          </Link>
        </div>
      </div>

      {/* Mobile Category Pill Scroller */}
      <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-2 px-4 py-2 bg-gray-50/30 border-t border-gray-50">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            to={`/catalog?category=${cat.id}`}
            className="flex-shrink-0 px-3 py-1 bg-white rounded-lg text-[7px] font-black uppercase tracking-widest text-on-surface border border-gray-100 shadow-sm transition-all"
          >
            {getLocalized(cat, 'name')}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
