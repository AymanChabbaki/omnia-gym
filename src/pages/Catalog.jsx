import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { useLanguage } from '../store/LanguageContext';

const Catalog = () => {
  const { t, getLocalized, isRTL } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFilter = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync state with URL parameter natively and fetch new API data
  useEffect(() => {
    setSelectedCategory(categoryParam);
    
    const loadData = async () => {
      setLoading(true);
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchProducts(categoryParam, searchFilter),
          fetchCategories()
        ]);
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error("Failed to load catalog data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [categoryParam, searchFilter]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSearchParams(prev => {
      if (catId === 'all') {
        prev.delete('category');
      } else {
        prev.set('category', catId);
      }
      return prev;
    });
  };

  const gridVariants = {
    hidden: { opacity: 0.01 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <main className="pt-32 pb-20 md:pb-12 px-6 max-w-[1920px] mx-auto min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 relative overflow-hidden rounded-xl h-[300px] flex items-center bg-surface-container-low"
      >
        <div className="absolute inset-0 z-0">
          <img 
            alt="Gym" 
            className="w-full h-full object-cover opacity-30 grayscale" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw54zRPQ4n-EtAxC4lnm0gzuxjAkmUwi8-thw8rkyu09v3r-p4HHHB_6gGFT-KkU7jI6DN5Kzp2Ck5-ItMsJM_JEdz-HJoqcKsQ6FyAemhBSW1v18zfG7JwpzWn4cLsnpPuvWrwOw648uIJsFhMK1d9nklJKRQVsMnY7lYi4Gj2M7I9CaD7z3FmQ3oVIuMRc5rsIDgRa-tEUPcUFlPA3-xARlySs4hEUVfwGplJTU8VWTachpLdoM447xRfWQFTukbk-qBW81mHlw"
          />
          <div className={`absolute inset-0 bg-gradient-to-r from-background ${isRTL ? 'via-background/80' : 'via-background/40'} to-transparent`}></div>
        </div>
        <div className={`relative z-10 px-8 md:px-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          <motion.h1 
            initial={{ x: isRTL ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-headline text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4"
          >
            {searchFilter ? `${t('common.search')} "${searchFilter}"` : <>{getLocalized({ name: 'Fuel Your', name_ar: 'غذي', name_fr: 'Nourrissez' }, 'name')} <span className="text-primary italic">{getLocalized({ name: 'Drive.', name_ar: 'تطورك.', name_fr: 'Progression.' }, 'name')}</span></>}
          </motion.h1 >
          <motion.p 
            initial={{ x: isRTL ? 30 : -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-on-surface-variant max-w-md font-body text-base md:text-lg leading-relaxed"
          >
            {t('home.heroSubtitle')}
          </motion.p>
        </div>
      </motion.section >

      <div className={`flex flex-col md:flex-row gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        {/* Mobile Toggle Button */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-surface-container-high px-6 py-3 rounded-xl border border-white/5 font-black uppercase text-xs tracking-widest text-primary"
          >
            <span className="material-symbols-outlined">filter_list</span>
            {t('nav.categories')}
          </button>
          
          <div className="text-[10px] font-black uppercase tracking-widest opacity-40">
            {products.length} {t('common.products')}
          </div>
        </div>

        {/* Sidebar Navigation Drawer */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
          )}
        </AnimatePresence>

        <aside className={`
          fixed md:relative top-0 ${isRTL ? 'right-0' : 'left-0'} h-full md:h-auto 
          w-72 md:w-64 bg-surface md:bg-transparent z-[110] md:z-auto
          transition-transform duration-500 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')} 
          md:translate-x-0 p-8 md:p-0 border-r md:border-r-0 border-white/10
        `}>
          <div className="sticky top-24 md:top-40 space-y-8">
            <div className="md:hidden flex justify-between items-center mb-10">
               <h2 className="text-2xl font-black uppercase italic tracking-tighter text-primary">OMNIA SHOP</h2>
               <button onClick={() => setIsSidebarOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                 <span className="material-symbols-outlined">close</span>
               </button>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className={`font-headline text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                {getLocalized({ name: 'Categories', name_ar: 'الفئات', name_fr: 'Catégories' }, 'name')}
              </h3>
              <ul className={`flex flex-col gap-3 ${isRTL ? 'items-end' : 'items-start'}`}>
                <li>
                  <button 
                    onClick={() => {
                      handleCategoryChange('all');
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={`flex items-center justify-between w-full transition-colors font-semibold group ${isRTL ? 'flex-row-reverse' : ''} ${selectedCategory === 'all' ? 'text-primary' : 'text-on-surface hover:text-primary'}`}
                  >
                    <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="material-symbols-outlined text-sm">bolt</span> {t('common.browseCatalog')}
                    </span> 
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => {
                        handleCategoryChange(cat.id);
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                      }}
                      className={`flex items-center justify-between w-full transition-colors group ${isRTL ? 'flex-row-reverse' : ''} ${selectedCategory === cat.id ? 'text-primary font-bold' : 'text-on-surface/60 hover:text-primary font-medium'}`}
                    >
                      <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="material-symbols-outlined text-sm">{cat.icon}</span> {getLocalized(cat, 'name')}
                      </span> 
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className={`flex justify-between items-end mb-8 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-headline text-3xl font-black uppercase tracking-tighter">
                {selectedCategory === 'all' 
                  ? t('common.browseCatalog') 
                  : getLocalized(categories.find(c => c.id === selectedCategory) || { name: selectedCategory }, 'name')
                } 
                <span className={`text-on-surface-variant text-lg font-normal ${isRTL ? 'mr-2' : 'ml-2'}`}>/ {products.length} {getLocalized({ name: 'Results', name_ar: 'نتائج', name_fr: 'Résultats' }, 'name')}</span>
              </h2>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
             {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="h-[400px] bg-surface-container rounded-3xl animate-pulse flex flex-col justify-between p-8 border border-white/5">
                    <div className="w-2/3 h-4 bg-white/10 rounded"></div>
                    <div className="w-1/2 h-8 bg-white/10 rounded mt-auto"></div>
                  </div>
                ))
              ) : (
                <AnimatePresence mode="popLayout">
                  {products.map(product => (
                    <motion.div key={product.id} variants={cardVariants} initial="hidden" animate="visible" layout>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
          </div>
          
          {!loading && products.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
              <p className="text-2xl font-headline font-black uppercase text-white/20">{t('common.noProducts')}</p>
            </motion.div>
          )}
        </div>
      </div>
    </main >
  );
};

export default Catalog;