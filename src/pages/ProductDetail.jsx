import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProductById } from '../services/api';
import { useCart } from '../store/CartContext';
import { useLanguage } from '../store/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { t, getLocalized, isRTL } = useLanguage();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mainScrollRef = useRef(null);
  
  const flavors = product ? (Array.isArray(product.flavors) 
    ? product.flavors.filter(f => typeof f === 'string' && f.trim() !== '') 
    : (typeof product.flavors === 'string' ? product.flavors.split(',').map(s => s.trim()).filter(Boolean) : [])) : [];
  const hasFlavors = flavors.length > 0;

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleMainScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const newIndex = Math.round(scrollPosition / width);
    if (newIndex !== currentImageIndex) {
      setCurrentImageIndex(newIndex);
    }
  };

  const scrollToIndex = (index) => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({
        left: index * mainScrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  if (loading || !product) {
    return (
      <main className="pt-32 min-h-screen flex justify-center items-center px-6">
         <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  const images = product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || '/placeholder.png'];

  return (
    <main className="pt-32 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <motion.div 
          initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-outline mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Link to="/">{getLocalized({ name: 'Shop', name_ar: 'المتجر', name_fr: 'Boutique' }, 'name')}</Link>
          <span className={`material-symbols-outlined text-[12px] ${isRTL ? 'rotate-180' : ''}`}>chevron_right</span>
          <Link to="/catalog">{getLocalized({ name: 'Products', name_ar: 'المنتجات', name_fr: 'Produits' }, 'name')}</Link>
          <span className={`material-symbols-outlined text-[12px] ${isRTL ? 'rotate-180' : ''}`}>chevron_right</span>
          <span className="text-primary">{getLocalized(product, 'name')}</span>
        </motion.div>

        {/* Product Hero Section */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-start ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className={`lg:col-span-7 grid grid-cols-12 gap-4 ${isRTL ? 'order-last lg:order-none' : ''}`}
          >
            <div className="col-span-12 relative overflow-hidden rounded-3xl aspect-square md:aspect-[4/5] bg-white border border-gray-100 group/main-image">
              {/* Main Slider */}
              <div 
                ref={mainScrollRef}
                onScroll={handleMainScroll}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
              >
                {images.map((img, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 snap-center p-8 flex items-center justify-center">
                    <motion.img 
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full object-contain"
                      src={img} 
                      alt={`${getLocalized(product, 'name')} - ${idx + 1}`} 
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => scrollToIndex(currentImageIndex - 1)}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full text-secondary shadow-xl transition-all hover:bg-primary hover:text-white z-20 ${currentImageIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => scrollToIndex(currentImageIndex + 1)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full text-secondary shadow-xl transition-all hover:bg-primary hover:text-white z-20 ${currentImageIndex === images.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Status Badges */}
              <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'} flex flex-col gap-2 z-20`}>
                <span className="bg-primary text-on-primary px-3 py-1 rounded font-black text-xs uppercase tracking-tighter italic">{t('product.bestSeller')}</span>
                <span className="bg-secondary text-on-secondary px-3 py-1 rounded font-black text-xs uppercase tracking-tighter italic">{t('product.verifiedPure')}</span>
              </div>

              {/* Dots for Mobile */}
              {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 md:hidden">
                  {images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${currentImageIndex === i ? 'bg-primary w-6' : 'bg-gray-300 w-1.5'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Gallery Thumbs */}
            <div className="col-span-12 grid grid-cols-5 gap-4">
              {images.length > 1 && images.map((img, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToIndex(i)}
                  className={`rounded-2xl overflow-hidden aspect-square bg-white border-2 cursor-pointer p-2 transition-all ${
                    currentImageIndex === i ? 'border-primary shadow-lg shadow-primary/10' : 'border-gray-100 grayscale hover:grayscale-0'
                  }`}
                >
                  <img 
                    className="w-full h-full object-contain" 
                    src={img} 
                    alt={`${getLocalized(product, 'name')} thumbnail ${i}`} 
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            variants={stagger}
            initial="hidden"
            animate="visible"
            className={`lg:col-span-5 lg:sticky lg:top-40 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4 italic"
            >
              {getLocalized(product, 'name').split(' ').slice(0, -1).join(' ')} <span className="text-primary">{getLocalized(product, 'name').split(' ').pop()}</span>
            </motion.h1>
            
            <motion.div variants={fadeIn} className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex text-primary ${isRTL ? 'flex-row-reverse' : ''}`}>
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <span className="text-outline text-sm font-bold uppercase tracking-widest">({product.brand})</span>
            </motion.div>

            <motion.div variants={fadeIn} className="text-4xl font-black tracking-tighter mb-8">{product.price} DH</motion.div>
            
            <motion.p variants={fadeIn} className="text-on-surface-variant text-lg leading-relaxed mb-10">
              {getLocalized(product, 'description')}
            </motion.p>

            {/* Optional DB Tags rendered securely if available */}
            {product.tags && product.tags.length > 0 && (
               <div className={`flex flex-wrap gap-2 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                 {product.tags.map(tag => (
                   <span key={tag} className="px-3 py-1 bg-surface-container-high rounded text-xs font-bold uppercase text-primary">
                     {tag}
                   </span>
                 ))}
               </div>
            )}

            {/* Specs & Flavors */}
            <div className="space-y-8 mb-10">
              {hasFlavors && (
                <motion.div variants={fadeIn}>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-outline mb-4">{t('product.selectFlavor') || 'Select Flavor / اختر النكهة'}</label>
                  <div className={`flex flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {flavors.map((flavor) => (
                      <button 
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-6 py-3 rounded-lg font-black uppercase text-xs tracking-widest transition-all ${
                          selectedFlavor === flavor ? 'bg-primary text-on-primary ring-2 ring-primary ring-offset-4 ring-offset-surface' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                        }`}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* CTA */}
            <motion.button 
              variants={fadeIn}
              whileHover={selectedFlavor || !hasFlavors ? { scale: 1.02 } : {}}
              whileTap={selectedFlavor || !hasFlavors ? { scale: 0.98 } : {}}
              onClick={() => {
                if (hasFlavors && !selectedFlavor) {
                  alert(t('product.selectFlavor') || 'Please select a flavor');
                  return;
                }
                addToCart({ ...product, flavor: selectedFlavor });
              }}
              className={`w-full py-6 rounded-xl font-black uppercase text-xl tracking-tighter italic flex items-center justify-center gap-3 transition-all group shadow-[0_20px_50px_rgba(244,255,198,0.2)] ${isRTL ? 'flex-row-reverse' : ''} ${
                (hasFlavors && !selectedFlavor) 
                ? 'bg-gray-100 text-on-surface-variant cursor-not-allowed grayscale border border-gray-100' 
                : 'bg-primary text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined font-black">shopping_cart</span>
              {t('product.addToStack')}
              <span className={`material-symbols-outlined group-hover:translate-x-2 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-2' : ''}`}>arrow_forward</span>
            </motion.button>

            {/* Trust Chips */}
            <motion.div variants={fadeIn} className="grid grid-cols-2 gap-4 mt-8">
              <div className={`flex items-center gap-3 p-4 bg-surface-container-low rounded-lg border border-outline-variant/10 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <span className="material-symbols-outlined text-secondary">bolt</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{t('product.fastRecovery')}</span>
              </div>
              <div className={`flex items-center gap-3 p-4 bg-surface-container-low rounded-lg border border-outline-variant/10 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <span className="material-symbols-outlined text-secondary">verified</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{t('product.performanceLabel')}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </main>
  );
};

export default ProductDetail;
