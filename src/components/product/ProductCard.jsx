import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../store/LanguageContext';
import { useCart } from '../../store/CartContext';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { getLocalized, isRTL } = useLanguage();

  if (!product) return null;

  const hasFlavors = product.flavors && Array.isArray(product.flavors) && product.flavors.length > 0;
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

  return (
    <motion.div 
      className="product-card flex flex-col h-full group/card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Section */}
      <div className="card-image aspect-square relative p-4 bg-white overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img 
            className="w-full h-full object-contain transition-transform duration-500 group-hover/card:scale-110" 
            src={productImage} 
            alt={productName} 
            onError={(e) => { e.target.src = 'https://proteinhouse-offers.com/wp-content/uploads/woocommerce-placeholder.png'; }}
          />
        </Link>
        
        <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} flex flex-col gap-2 z-20`}>
          {isOutOfStock && (
            <span className="bg-gray-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded">
              {isRTL ? 'غير متوفر' : 'Out of Stock'}
            </span>
          )}
          {hasDiscount && (
            <span className="bg-badge-sale text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm">
              {isRTL ? 'تخفيض!' : 'Sale!'}
            </span>
          )}
          {!hasDiscount && tags.length > 0 && (
            <span className="bg-primary text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm">
              {tags[0]}
            </span>
          )}
        </div>

        {/* Unique Hover Overlay using group/card */}
        <div className="card-overlay group-hover/card:opacity-100 opacity-0 bg-white/95 backdrop-blur-sm transition-all duration-300 z-10 flex flex-col items-center justify-center gap-3">
          <Link 
            to={`/product/${product.id}`}
            className="w-[160px] bg-secondary text-white py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-on-surface transition-all"
          >
            <Eye size={14} />
            {isRTL ? 'نظرة سريعة' : 'Quick View'}
          </Link>
          {!isOutOfStock && !hasFlavors && (
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="w-[160px] bg-primary text-white py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              <ShoppingCart size={14} />
              {isRTL ? 'إضافة للسلة' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
      
      <div className={`p-5 flex flex-col flex-grow ${isRTL ? 'text-right' : 'text-left'} border-t border-gray-50`}>
        <div className="mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-80">{product.brand}</span>
        </div>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-bold text-sm text-on-surface leading-snug mb-4 line-clamp-2 min-h-[40px] group-hover/card:text-primary transition-colors">
            {productName}
          </h3>
        </Link>
        
        <div className={`mt-auto flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[11px] text-on-surface-variant/40 line-through font-bold mb-[-4px]">
                {formatPrice(rawOriginalPrice)}
              </span>
            )}
            <span className={`text-lg font-black tracking-tighter ${hasDiscount ? 'text-badge-sale' : 'text-on-surface'}`}>
              {formatPrice(rawPrice)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
