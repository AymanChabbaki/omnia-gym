import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../store/LanguageContext';
import { fetchCategories } from '../../services/api';
import { Menu, X, ChevronDown, ChevronRight, User } from 'lucide-react';
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
        setCategories(cats.slice(0, 7)); // Keep it slim
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-sm relative z-[105]">
        <div className="max-w-1400 mx-auto px-4 md:px-8">
          <div className={`flex items-center justify-between h-14 md:h-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
            
            {/* Mobile Menu Trigger & Logo Grouping for opposite sides */}
            <div className={`flex w-full items-center justify-between lg:hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-secondary hover:text-primary transition-colors"
              >
                <Menu size={24} />
              </button>

              <Link to="/" className="flex items-center gap-2 group">
                <img src="/logo.png" className="h-8 w-auto transition-transform group-hover:scale-105" alt="Omnia Shop" />
                <div className={`hidden xs:flex flex-col leading-none ${isRTL ? 'items-end' : 'items-start'}`}>
                  <span className="text-sm font-black uppercase tracking-tighter text-secondary">
                    OMNIA <span className="text-primary italic">SHOP</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Only Logo (Hidden on mobile) */}
            <Link to="/" className="hidden lg:flex items-center gap-2 group">
              <img src="/logo.png" className="h-12 w-auto transition-transform group-hover:scale-105" alt="Omnia Shop" />
              <div className={`flex flex-col leading-none ${isRTL ? 'items-end' : 'items-start'}`}>
                <span className="text-xl font-black uppercase tracking-tighter text-secondary">
                  OMNIA <span className="text-primary italic">SHOP</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-300">EST. 2024</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className={`hidden lg:flex items-center gap-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">
                {isRTL ? 'الرئيسية' : 'Home'}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalog?category=${cat.id}`}
                  className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors"
                >
                  {getLocalized(cat, 'name')}
                </Link>
              ))}
              <Link to="/catalog" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-secondary transition-colors">
                {isRTL ? 'المتجر' : 'Shop'}
              </Link>
            </div>

            {/* User Account / Profile Icon */}
            <div className="hidden lg:flex items-center gap-2">
               <Link to="/admin" className="p-2 text-secondary hover:text-primary transition-all">
                 <User size={18} />
               </Link>
            </div>

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
