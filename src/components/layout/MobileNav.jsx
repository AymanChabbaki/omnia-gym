import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../store/LanguageContext';
import { useCart } from '../../store/CartContext';

const MobileNav = () => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  const { cartCount } = useCart();

  const navItems = [
    { label: isRTL ? 'الرئيسية' : 'Home', icon: 'home', path: '/' },
    { label: isRTL ? 'المتجر' : 'Shop', icon: 'storefront', path: '/catalog' },
    { label: isRTL ? 'السلة' : 'Cart', icon: 'shopping_bag', path: '/cart', fill: true, badge: cartCount },
    { label: 'WhatsApp', icon: 'chat', path: 'https://wa.me/+213661349808', external: true },
  ];

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-2 py-2.5 pb-safe bg-[#0e0e0e]/95 backdrop-blur-lg z-50 rounded-t-2xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] ${isRTL ? 'flex-row-reverse' : ''}`}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        if (item.external) {
          return (
            <a
              key={item.label}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center"
            >
              <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <img src="/whatsapp-icon.svg" alt="WhatsApp" className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-bold mt-1 text-[#25D366]">WhatsApp</span>
            </a>
          );
        }
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center transition-all relative ${
              isActive ? 'text-primary' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center relative ${isActive ? 'bg-primary/10' : ''}`}>
              <span 
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isActive && item.fill ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[7px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
