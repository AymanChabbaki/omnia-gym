import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { useLanguage } from '../store/LanguageContext';
import { Filter, X, ChevronRight } from 'lucide-react';

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

  return (
    <main className="bg-white pt-10 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto min-h-screen">
      {/* Breadcrumbs */}
      <div className={`flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Link to="/" className="hover:text-primary transition-colors">{isRTL ? 'الرئيسية' : 'Home'}</Link>
        <ChevronRight size={12} className={isRTL ? 'rotate-180' : ''} />
        <span className="text-primary">{isRTL ? 'المتجر' : 'Shop'}</span>
      </div>

      <div className={`flex flex-col md:flex-row gap-12 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        
        {/* Sidebar Filter */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28">
            <h3 className={`text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Filter size={14} />
              {isRTL ? 'الأقسام' : 'Categories'}
            </h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isRTL ? 'text-right' : ''} ${selectedCategory === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-on-surface-variant hover:bg-gray-100'}`}
                >
                  {isRTL ? 'كل المنتجات' : 'All Products'}
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isRTL ? 'text-right' : ''} ${selectedCategory === cat.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100/50 text-on-surface-variant hover:bg-gray-100'}`}
                  >
                    {getLocalized(cat, 'name')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className={`flex justify-between items-end mb-10 pb-6 border-b border-gray-100 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <div>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">
                {selectedCategory === 'all' 
                  ? (isRTL ? 'كل المنتجات' : 'All Products') 
                  : getLocalized(categories.find(c => c.id === selectedCategory) || { name: selectedCategory }, 'name')
                }
              </h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 mt-2">
                {products.length} {isRTL ? 'منتج متاح' : 'Products Available'}
              </p>
            </div>
          </div>
          
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[400px] bg-gray-50 rounded-2xl animate-pulse"></div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {products.map(product => (
                  <motion.div 
                    key={product.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {!loading && products.length === 0 && (
            <div className="py-32 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">search_off</span>
              <p className="text-xl font-black uppercase tracking-tighter text-gray-400">{t('common.noProducts')}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Catalog;