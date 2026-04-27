import React from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import FloatingActions from './FloatingActions';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!isAdminPage && (
        <header className="sticky top-0 z-[100] w-full shadow-sm">
          <TopBar />
          <Navbar />
        </header>
      )}
      
      <main className="flex-grow overflow-x-hidden">
        {children}
      </main>

      {!isAdminPage && <Footer />}
      
      {/* Floating Interactive Elements */}
      {!isAdminPage && (
        <>
          <WhatsAppFloat />
          <FloatingActions />
        </>
      )}
    </div>
  );
};

export default Layout;
