import React, { useState } from 'react';
import { useLanguage } from '../../store/LanguageContext';
import { useCart } from '../../store/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Search, ShoppingBag, X } from 'lucide-react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

const TopBar = () => {
  const { isRTL, setLanguage, language, t } = useLanguage();
  const { cartCount, cartTotal } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
    <div className="bg-secondary text-white py-2.5 px-4 md:px-8 border-b border-white/10 relative z-[110]">
      <div className={`max-w-1400 mx-auto flex flex-wrap justify-between items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        
        {/* Left: Contact & Social */}
        <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <a href="tel:0661349808" className="flex items-center gap-2 text-[11px] font-black hover:text-primary transition-colors">
            <Phone size={14} className={isRTL ? 'rotate-[-100deg]' : ''} />
            <span dir="ltr">0661349808</span>
          </a>
          <div className="hidden sm:flex items-center gap-4 border-l border-white/20 pl-6 ml-2">
            <a href="#" className="hover:text-primary transition-all"><FaFacebookF size={14} /></a>
            <a href="#" className="hover:text-primary transition-all"><FaInstagram size={14} /></a>
          </div>
        </div>

        {/* Center: Promo */}
        <div className="hidden lg:block text-[9px] font-black uppercase tracking-[0.2em] animate-pulse text-primary/90">
          {isRTL ? 'توصيل مجاني للطلبات فوق 500 درهم' : 'Free delivery on orders over 500 DH'}
        </div>

        {/* Right: Actions */}
        <div className={`flex items-center gap-4 md:gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
            <button onClick={() => setLanguage('ar')} className={`px-2.5 py-1 text-[9px] font-black uppercase rounded ${language === 'ar' ? 'bg-primary text-white' : 'hover:bg-white/5'}`}>العربية</button>
            <button onClick={() => setLanguage('en')} className={`px-2.5 py-1 text-[9px] font-black uppercase rounded ${language === 'en' ? 'bg-primary text-white' : 'hover:bg-white/5'}`}>EN</button>
            <button onClick={() => setLanguage('fr')} className={`px-2.5 py-1 text-[9px] font-black uppercase rounded ${language === 'fr' ? 'bg-primary text-white' : 'hover:bg-white/5'}`}>FR</button>
          </div>

          {/* Search Toggle Group */}
          <div className="flex items-center gap-2">
            <div className={`overflow-hidden transition-all duration-300 flex items-center ${isSearchOpen ? 'w-48 md:w-64 opacity-100' : 'w-0 opacity-0'}`}>
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
              className="p-1 hover:text-primary transition-all flex items-center justify-center"
            >
              {isSearchOpen ? <X size={16} /> : <Search size={18} />}
            </button>
          </div>

          <Link to="/cart" className={`flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-all px-4 py-1.5 rounded-full ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="relative flex items-center justify-center">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-secondary">
                  {cartCount}
                </span>
              )}
            </div>
            <div className={`hidden sm:flex flex-col items-start leading-none ${isRTL ? 'items-end' : ''}`}>
              <span className="text-[8px] uppercase font-bold opacity-60 mb-0.5">{t('nav.cart')}</span>
              <span className="text-[10px] font-black">{cartTotal.toFixed(2)} د.م.</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
