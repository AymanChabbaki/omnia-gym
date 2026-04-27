import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../store/LanguageContext';

const ProductCarousel = ({ products }) => {
  const scrollRef = useRef(null);
  const { isRTL } = useLanguage();
  const [showButtons, setShowButtons] = useState(false);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = current.offsetWidth * 0.8;
      current.scrollBy({
        left: direction === 'left' ? (isRTL ? scrollAmount : -scrollAmount) : (isRTL ? -scrollAmount : scrollAmount),
        behavior: 'smooth'
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      {/* Navigation Buttons - Independent of Card Groups */}
      <div className={`absolute top-1/2 -translate-y-1/2 -left-4 z-30 transition-opacity duration-300 ${showButtons ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={() => scroll('left')}
          className="w-12 h-12 bg-white shadow-2xl rounded-full flex items-center justify-center text-on-surface hover:bg-primary hover:text-white transition-all transform active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      
      <div className={`absolute top-1/2 -translate-y-1/2 -right-4 z-30 transition-opacity duration-300 ${showButtons ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={() => scroll('right')}
          className="w-12 h-12 bg-white shadow-2xl rounded-full flex items-center justify-center text-on-surface hover:bg-primary hover:text-white transition-all transform active:scale-90"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto no-scrollbar pb-10 pt-4 px-2 -mx-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {products.map((product, index) => (
          <div 
            key={product.id}
            className="w-[280px] md:w-[350px] flex-shrink-0"
            style={{ scrollSnapAlign: 'start' }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
