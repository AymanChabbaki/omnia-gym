import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../store/LanguageContext';
import { useCart } from '../../store/CartContext';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { getLocalized, isRTL } = useLanguage();
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef(null);

  if (!product) return null;

  const flavors = Array.isArray(product.flavors) 
    ? product.flavors.filter(f => typeof f === 'string' && f.trim() !== '') 
    : (typeof product.flavors === 'string' ? product.flavors.split(',').map(s => s.trim()).filter(Boolean) : []);
  const hasFlavors = flavors.length > 0;
  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0;
  const rawPrice = Number(product.price) || 0;
  const rawOriginalPrice = Number(product.original_price) || 0;
  const hasDiscount = rawOriginalPrice > 0 && rawOriginalPrice > rawPrice;
  const productName = getLocalized(product, 'name') || product.name || '';
  
  const images = product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || '/placeholder.png'];
  
  const tags = Array.isArray(product.tags) ? product.tags : [];

  const formatPrice = (num) => {
    return Number(num).toLocaleString('fr-MA', { minimumFractionDigits: 2 }) + ' د.م.';
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (hasFlavors && !selectedFlavor) {
      alert(isRTL ? 'الرجاء اختيار النكهة أولاً' : 'Please select a flavor first');
      return;
    }
    addToCart({ ...product, flavor: selectedFlavor });
  };

  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const newIndex = Math.round(scrollPosition / width);
    if (newIndex !== currentImageIndex) {
      setCurrentImageIndex(newIndex);
    }
  };

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.div 
      className="product-card flex flex-col h-full group/card bg-white rounded-3xl overflow-hidden border border-gray-100"
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={{
        initial: { y: 0, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" },
        hover: { 
          y: -10, 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
          borderColor: "rgba(76, 175, 80, 0.2)"
        },
        tap: { scale: 0.98 }
      }}
    >
      {/* Image Section */}
      <div className="card-image aspect-square relative bg-white overflow-hidden flex items-center justify-center group/image">
        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
        >
          {images.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 snap-center p-6 flex items-center justify-center">
              <Link to={`/product/${product.id}`} className="block w-full h-full">
                <motion.img 
                  className="w-full h-full object-contain" 
                  variants={{
                    hover: { scale: 1.1 }
                  }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  src={img} 
                  alt={`${productName} - ${idx + 1}`} 
                  onError={(e) => { e.target.src = 'https://proteinhouse-offers.com/wp-content/uploads/woocommerce-placeholder.png'; }}
                />
              </Link>
            </div>
          ))}
        </div>
        
        {/* Quick Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 pointer-events-none">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  currentImageIndex === i ? 'bg-primary w-4' : 'bg-gray-300'
                }`} 
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows - Visible on hover */}
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.preventDefault(); scrollToIndex(currentImageIndex - 1); }}
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-secondary shadow-sm opacity-0 group-hover/image:opacity-100 transition-all hover:bg-primary hover:text-white z-20 ${currentImageIndex === 0 ? 'pointer-events-none !opacity-0' : ''}`}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); scrollToIndex(currentImageIndex + 1); }}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-secondary shadow-sm opacity-0 group-hover/image:opacity-100 transition-all hover:bg-primary hover:text-white z-20 ${currentImageIndex === images.length - 1 ? 'pointer-events-none !opacity-0' : ''}`}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
        
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex flex-col gap-2 z-20`}>
          {isOutOfStock && (
            <span className="bg-gray-500 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full shadow-sm">
              {isRTL ? 'غير متوفر' : 'Out of Stock'}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-[#ff4d4d] text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full shadow-sm">
              {isRTL ? 'تخفيض!' : 'Sale!'}
            </span>
          )}
        </div>
      </div>
      
      <div className={`p-6 flex flex-col flex-grow ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{product.brand}</span>
        </div>
        <Link to={`/product/${product.id}`} className="block mb-4">
          <motion.h3 
            className="font-bold text-sm leading-snug line-clamp-2 min-h-[40px] transition-colors"
            variants={{
              initial: { color: "#004a99" },
              hover: { color: "#4CAF50" }
            }}
          >
            {productName}
          </motion.h3>
        </Link>
        

        
        <div className={`mt-auto mb-6 flex flex-col gap-1 ${isRTL ? 'items-end' : 'items-start'}`}>
          {hasDiscount && (
            <span className="text-xs text-gray-300 line-through font-bold">
              {formatPrice(rawOriginalPrice)}
            </span>
          )}
          <span className={`text-xl font-black italic tracking-tighter ${hasDiscount ? 'text-[#ff4d4d]' : 'text-secondary'}`}>
            {formatPrice(rawPrice)}
          </span>
        </div>

        {/* Action Controls - Visible on both Mobile & Desktop */}
        <div className="space-y-4">
          {hasFlavors && (
            <div className="space-y-2">
               <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block ml-1">{isRTL ? 'اختر النكهة' : 'Select Flavor'}</label>
               <select 
                 value={selectedFlavor} 
                 onChange={(e) => setSelectedFlavor(e.target.value)}
                 className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none focus:border-primary transition-all appearance-none"
               >
                 <option value="">{isRTL ? '-- اختر --' : '-- Choose --'}</option>
                 {flavors.map(f => <option key={f} value={f}>{f}</option>)}
               </select>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-grow flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20 active:scale-95'}`}
            >
              <ShoppingCart size={14} />
              {isRTL ? 'أضف للسلة' : 'Add to Cart'}
            </button>
            <Link 
              to={`/product/${product.id}`}
              className="w-12 flex items-center justify-center bg-gray-50 text-secondary rounded-2xl hover:bg-secondary hover:text-white transition-all shadow-sm"
            >
              <Eye size={18} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
