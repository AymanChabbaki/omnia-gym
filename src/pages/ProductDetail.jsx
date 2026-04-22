import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProductById } from '../services/api';
import { useCart } from '../store/CartContext';
import { useLanguage } from '../store/LanguageContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { t, getLocalized, isRTL } = useLanguage();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlavor, setSelectedFlavor] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        if (data.flavors && data.flavors.length > 0) setSelectedFlavor(data.flavors[0]);
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

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
            <div className="col-span-12 relative overflow-hidden rounded-xl aspect-[4/5] bg-surface-container">
              <motion.img 
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                className="w-full h-full object-contain p-8" /* Upgraded to object-contain for multi-ratio DB strings */ 
                src={product.images ? product.images[0] : '/placeholder.png'} 
                alt={getLocalized(product, 'name')} 
              />
              <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'} flex flex-col gap-2`}>
                <span className="bg-primary text-on-primary px-3 py-1 rounded font-black text-xs uppercase tracking-tighter italic">{t('product.bestSeller')}</span>
                <span className="bg-secondary text-on-secondary px-3 py-1 rounded font-black text-xs uppercase tracking-tighter italic">{t('product.verifiedPure')}</span>
              </div>
            </div>
            {/* Dynamic Gallery Thumbs */}
            {product.images && product.images.map((img, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05 }}
                className="col-span-4 rounded-xl overflow-hidden aspect-square bg-surface-container-high cursor-pointer p-4"
              >
                <img 
                  className="w-full h-full object-contain" 
                  src={img} 
                  alt={`${getLocalized(product, 'name')} gallery ${i}`} 
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Product Details */}
          <motion.div 
            variants={stagger}
            initial="hidden"
            animate="visible"
            className={`lg:col-span-5 sticky top-40 ${isRTL ? 'text-right' : 'text-left'}`}
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

            <motion.div variants={fadeIn} className="text-4xl font-black tracking-tighter mb-8">DH{product.price}</motion.div>
            
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
              {product.flavors && product.flavors.length > 0 && (
                <motion.div variants={fadeIn}>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-outline mb-4">{t('product.selectFlavor') || 'Select Flavor / اختر النكهة'}</label>
                  <div className={`flex flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {product.flavors.map((flavor) => (
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => addToCart({ ...product, flavor: selectedFlavor })}
              className={`w-full bg-primary text-on-primary py-6 rounded-xl font-black uppercase text-xl tracking-tighter italic flex items-center justify-center gap-3 transition-all group shadow-[0_20px_50px_rgba(244,255,198,0.2)] ${isRTL ? 'flex-row-reverse' : ''}`}
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
