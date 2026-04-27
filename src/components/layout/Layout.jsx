import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileNav from './MobileNav';
import WhatsAppFloat from './WhatsAppFloat';
import FloatingActions from './FloatingActions';
import { useLanguage } from '../../store/LanguageContext';

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const { isRTL } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={`min-h-screen flex flex-col font-sans overflow-x-clip ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sticky Header Group */}
      <header className="sticky top-0 z-[100] w-full shadow-md">
        <TopBar />
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-full overflow-x-clip bg-white">
        {children}
      </main>

      <Footer />
      
      {/* Floating Action Groups */}
      <WhatsAppFloat />
      <FloatingActions />
      
      <div className="md:hidden">
        <MobileNav />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        ::selection {
          background-color: #4CAF50;
          color: white;
        }
        body {
          overflow-x: hidden;
          width: 100vw;
          margin: 0;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
        }
        /* Fix for sticky header shadow on scroll */
        .sticky-scrolled {
          @apply shadow-xl transition-shadow duration-300;
        }
      `}} />
    </div>
  );
};

export default Layout;
