import React from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import TopBar from './TopBar';
import Footer from './Footer';
import MobileNav from './MobileNav';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary selection:text-on-primary">
      <div className="fixed top-0 w-full z-[60]">
        <TopBar />
      </div>
      <Navbar />

      <AnimatePresence>
        <motion.main
          key={location.pathname}
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          exit={{ y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-grow"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Layout;
