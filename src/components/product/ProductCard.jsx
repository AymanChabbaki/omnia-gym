import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useLanguage } from '../../store/LanguageContext';
import { useCart } from '../../store/CartContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { getLocalized, isRTL } = useLanguage();

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group bg-surface-container-high rounded-3xl overflow-hidden flex flex-col transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 ${isRTL ? 'text-right' : 'text-left'}`}
    >
      <Link to={`/product/${product.id}`} className="relative h-80 bg-surface-container overflow-hidden block">
        <motion.img 
          style={{ translateZ: 50 }}
          className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700" 
          src={product.images ? product.images[0] : product.image || '/placeholder.png'} 
          alt={getLocalized(product, 'name')} 
        />
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex flex-col gap-2`}>
          {product.tags && product.tags.map(tag => (
            <span key={tag} className="bg-primary text-on-primary px-3 py-1 rounded text-[10px] font-black uppercase italic tracking-tighter">
              {tag}
            </span>
          ))}
        </div>
      </Link>
      <div style={{ translateZ: 30 }} className="p-8 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-[10px] text-primary uppercase font-black tracking-[0.2em]">{product.brand}</span>
          <h3 className="font-headline font-black text-2xl uppercase tracking-tighter mt-1 italic leading-none">{getLocalized(product, 'name')}</h3>
        </div>
        <p className="text-on-surface-variant mb-6 flex-grow text-sm leading-relaxed font-medium opacity-70">{getLocalized(product, 'description')}</p>
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-3xl font-black text-white italic tracking-tighter">{product.price} DH</span>
          <button 
            onClick={() => addToCart(product)}
            className="p-4 bg-primary text-black rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-[0_10px_20px_rgba(244,255,198,0.2)]"
          >
            <span className="material-symbols-outlined font-black">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
