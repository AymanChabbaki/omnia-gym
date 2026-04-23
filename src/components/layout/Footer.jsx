import React from 'react';
import { useLanguage } from '../../store/LanguageContext';

const Footer = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className={`bg-[#131313] w-full py-12 px-6 mt-auto ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="bg-[#1a1a1a] h-px mb-8"></div>
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Omnia Gym" className="h-8 w-auto object-contain" />
          </div>
          <p className="text-sm leading-relaxed text-gray-400 max-w-xs">{t('home.heroSubtitle')}</p>
        </div>
        <div>
          <h4 className="font-headline font-black text-white uppercase tracking-wider mb-4">{t('nav.browse')}</h4>
          <ul className="space-y-2 text-sm leading-relaxed text-gray-400">
            <li><a className="hover:text-primary transition-colors" href="#">{t('nav.wheyProtein')}</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">{t('nav.creatine')}</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">{t('nav.weightGainers')}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-headline font-black text-white uppercase tracking-wider mb-4">{t('common.engineered')}</h4>
          <ul className="space-y-2 text-sm leading-relaxed text-gray-400">
            <li><a className="hover:text-primary transition-colors" href="#">{t('product.bestSeller')}</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">{t('product.verifiedPure')}</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">{t('common.viewBundles')}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-headline font-black text-white uppercase tracking-wider mb-4">{isRTL ? 'اشترك' : 'Subscribe'}</h4>
          <div className={`flex bg-surface-container rounded overflow-hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
            <input className={`bg-transparent border-none focus:ring-0 text-sm p-3 w-full text-white ${isRTL ? 'text-right' : 'text-left'}`} placeholder={isRTL ? 'بريدك الإلكتروني' : 'Your Email'} type="email"/>
            <button className="bg-primary text-on-primary p-3">
              <span className={`material-symbols-outlined ${isRTL ? 'rotate-180' : ''}`}>send</span>
            </button>
          </div>
        </div>
      </div>
      <div className="text-center mt-12 pt-8 border-t border-white/5 text-gray-500 text-sm uppercase font-bold tracking-widest">
        © 2026 Omnia Shop. {t('common.engineered')}
      </div>
    </footer>
  );
};

export default Footer;
