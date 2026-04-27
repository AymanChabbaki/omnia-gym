import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../store/LanguageContext';
import { useCart } from '../../store/CartContext';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Plus } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { getLocalized, isRTL } = useLanguage();
  const [selectedFlavor, setSelectedFlavor] = useState('');

  if (!product) return null;

  const flavors = Array.isArray(product.flavors) ? product.flavors : [];
  const hasFlavors = flavors.length > 0;
  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0;
  const rawPrice = Number(product.price) || 0;
  const rawOriginalPrice = Number(product.original_price) || 0;
  const hasDiscount = rawOriginalPrice > 0 && rawOriginalPrice > rawPrice;
  const productName = getLocalized(product, 'name') || product.name || '';
  
  let productImage = '/placeholder.png';
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    productImage = product.images[0];
  } else if (product.image) {
    productImage = product.image;
  }
  
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
    addToCart(product, 1, selectedFlavor);
  };

  return (
    <motion.div 
      className="product-card flex flex-col h-full group/card bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
      whileHover={{ y: -5 }}
    >
      {/* Image Section */}
      <div className="card-image aspect-square relative p-6 bg-white overflow-hidden flex items-center justify-center">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img 
            className="w-full h-full object-contain transition-transform duration-700 group-hover/card:scale-110" 
            src={productImage} 
            alt={productName} 
            onError={(e) => { e.target.src = 'https://proteinhouse-offers.com/wp-content/uploads/woocommerce-placeholder.png'; }}
          />
        </Link>
        
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

        {/* Quick Actions Hover */}
        <div className="absolute inset-0 bg-secondary/5 group-hover/card:bg-secondary/0 transition-all pointer-events-none" />
      </div>
      
      <div className={`p-6 flex flex-col flex-grow ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{product.brand}</span>
        </div>
        <Link to={`/product/${product.id}`} className="block mb-4">
          <h3 className="font-bold text-sm text-secondary leading-snug line-clamp-2 min-h-[40px] group-hover/card:text-primary transition-colors">
            {productName}
          </h3>
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
