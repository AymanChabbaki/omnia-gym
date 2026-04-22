import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../store/LanguageContext';

const MobileNav = () => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();

  const navItems = [
    { label: t('nav.browse'), icon: 'storefront', path: '/catalog' },
    { label: t('common.search'), icon: 'search', path: '#' },
    { label: t('common.cart'), icon: 'shopping_bag', path: '/cart', fill: true },
    { label: t('common.account'), icon: 'person', path: '#' },
  ];

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-[#0e0e0e]/90 backdrop-blur-md z-50 rounded-t-2xl border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] ${isRTL ? 'flex-row-reverse' : ''}`}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center transition-all ${
              isActive ? 'text-primary scale-110' : 'text-white/40 hover:text-white'
            }`}
          >
            <span 
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isActive && item.fill ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-headline text-[10px] font-bold uppercase mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
