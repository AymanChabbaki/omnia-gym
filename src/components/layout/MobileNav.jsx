import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../store/LanguageContext';

const MobileNav = () => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();

  const navItems = [
    { label: t('nav.home'), icon: 'home', path: '/' },
    { label: t('nav.browse'), icon: 'storefront', path: '/catalog' },
    { label: t('common.cart'), icon: 'shopping_bag', path: '/cart', fill: true },
    { label: 'WhatsApp', icon: 'chat', path: 'https://wa.me/+213661349808', external: true },
  ];

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-2 py-3 pb-safe bg-[#0e0e0e]/95 backdrop-blur-lg z-50 rounded-t-3xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] ${isRTL ? 'flex-row-reverse' : ''}`}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        if (item.external) {
          return (
            <a
              key={item.label}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-primary"
            >
              <span className="material-symbols-outlined text-2xl">chat</span>
              <span className="font-headline text-[8px] font-black uppercase mt-1">+213661349808</span>
            </a>
          );
        }
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
