import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const languages = {
  en: { name: 'English', code: 'EN', dir: 'ltr' },
  ar: { name: 'العربية', code: 'AR', dir: 'rtl' },
  fr: { name: 'Français', code: 'FR', dir: 'ltr' }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('omnia_lang') || 'ar');

  useEffect(() => {
    localStorage.setItem('omnia_lang', currentLanguage);
    document.documentElement.dir = languages[currentLanguage].dir;
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[currentLanguage];
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path; // Fallback to path if not found
      }
    }
    return result;
  };

  const getLocalized = (obj, field) => {
    if (!obj) return '';
    
    // 1. Try new PostgreSQL Database Format (e.g., 'name_en')
    const dbField = `${field}_${currentLanguage}`;
    if (obj[dbField]) return obj[dbField];

    // 2. Try old static file CamelCase Format (e.g., 'nameAr')
    const suffix = currentLanguage === 'en' ? '' : currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1);
    const localizedField = `${field}${suffix}`;
    
    return obj[localizedField] || obj[field] || '';
  };

  const value = {
    currentLanguage,
    setLanguage: setCurrentLanguage,
    t,
    getLocalized,
    dir: languages[currentLanguage].dir,
    isRTL: languages[currentLanguage].dir === 'rtl'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
