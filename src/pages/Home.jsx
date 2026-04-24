
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { Link } from 'react-router-dom';
import { useLanguage } from '../store/LanguageContext';

const Home = () => {
  const { t, getLocalized, isRTL } = useLanguage();
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { type: 'image', src: '/img0.jpg' },
    { type: 'video', src: '/video.mp4' },
    { type: 'image', src: '/img1.png' },
    { type: 'image', src: '/img2.jpg' },
    { type: 'image', src: '/img3.png' },
    { type: 'video', src: '/herobg.mp4' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProducts();
        setBestSellers(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  const { scrollYProgress } = useScroll();

  // Mouse Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax Offsets
  const heroX = useTransform(smoothX, [0, 1920], isRTL ? [20, -20] : [-20, 20]);
  const heroY = useTransform(smoothY, [0, 1080], [-20, 20]);

  useEffect(() => {
    // Disable parallax on touch devices to prevent jitter
    if ('ontouchstart' in window) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" className="pt-24 overflow-hidden bg-surface">
      {/* Hero Section with Mouse Parallax */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center overflow-hidden bg-surface">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {slides[currentSlide].type === 'video' ? (
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover"
                >
                  <source src={slides[currentSlide].src} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={slides[currentSlide].src} 
                  className="w-full h-full object-cover" 
                  alt="" 
                />
              )}
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px]"></div>
          <div className={`absolute inset-0 bg-gradient-to-r from-surface ${isRTL ? 'via-surface/80' : 'via-surface/40'} to-transparent`}></div>
          
          {/* Carousel Indicators */}
          <div className={`absolute bottom-12 ${isRTL ? 'left-12' : 'right-12'} flex gap-3 z-20`}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-12 h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'bg-primary' : 'bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6">
          <div className={`max-w-4xl ${isRTL ? 'text-right rtl' : 'text-left'}`}>
            <motion.div
               style={{ x: useTransform(smoothX, [0, 1920], isRTL ? [15, -15] : [-15, 15]) }}
            >
              <motion.h1 
                variants={itemVariants}
                className="font-headline font-black text-[3rem] md:text-[9rem] leading-[0.85] tracking-tighter uppercase mb-6 italic"
              >
                {t('home.heroTitle').split(' ').map((word, i) => i === 2 ? <span key={i} className="text-primary block">{word}</span> : word + ' ')}
              </motion.h1>
            </motion.div>
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-2xl text-on-surface-variant max-w-xl mb-10 font-medium leading-relaxed"
            >
              {t('home.heroSubtitle')}
            </motion.p>
            <motion.div variants={itemVariants} className={`flex flex-wrap gap-4 ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
              <Link 
                to="/catalog" 
                className="group px-8 md:px-12 py-5 bg-primary text-on-primary font-headline font-black uppercase tracking-widest text-base md:text-lg rounded-xl hover:scale-105 transition-all flex items-center gap-3"
              >
                {t('common.shopAll')}
                <span className={`material-symbols-outlined transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}>arrow_forward</span>
              </Link>
              <button className="px-8 md:px-12 py-5 border-2 border-outline-variant text-secondary font-headline font-black uppercase tracking-widest text-base md:text-lg rounded-xl hover:bg-secondary/10 transition-all">
                {t('common.viewBundles')}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Huge Bottom Text Watermark */}
        <div className={`absolute bottom-4 ${isRTL ? 'left-8' : 'right-8'} pointer-events-none z-0 flex flex-col text-right select-none`}>
          <span className="font-headline font-black text-[12vw] md:text-[10vw] leading-[0.8] tracking-tight bleed-text uppercase italic whitespace-nowrap">OMNIA</span>
          <span className="font-headline font-black text-[12vw] md:text-[10vw] leading-[0.8] tracking-tight bleed-text uppercase italic whitespace-nowrap">SHOP</span>
        </div>
      </section>

      {/* Stats Section [NEW INTERACTIVE COMPONENT] */}
      <section className="py-20 border-y border-white/5 bg-surface-container-low overflow-hidden">
        <div className="container mx-auto px-6">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {[
              { val: '50', unit: 'K+', label: 'Athletes Served' },
              { val: '100', unit: '%', label: 'Lab Tested' },
              { val: '24', unit: 'H', label: 'Express Shipping' },
              { val: '4.9', unit: '/5', label: 'Customer Rating' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-6xl font-black text-primary italic mb-2 tracking-tighter">
                  {stat.val}<span className="text-xl text-white ml-1">{stat.unit}</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant font-headline">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Video Section */}
      <section className="py-16 md:py-32 bg-surface overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative group rounded-2xl md:rounded-3xl overflow-hidden aspect-[9/16] md:aspect-video shadow-[0_0_100px_rgba(244,255,198,0.1)]">
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" 
              alt="Cinematic" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20 flex flex-col justify-end p-6 md:p-16">
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={isRTL ? 'text-right' : 'text-left'}
              >
                <h2 className="text-3xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-[0.9] mb-4">
                  Powered by <span className="text-primary text-outline">Excellence</span>
                </h2>
                <p className="text-sm md:text-xl text-white/60 max-w-2xl mb-8 font-medium">Inside look at the science and sweat that fuels Omnia Shop every single day.</p>
                <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <motion.section 
        variants={containerVariants}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 container mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link to="/catalog?category=weight-gainers" className="md:col-span-2 md:row-span-2">
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden rounded-xl bg-surface-container-high h-[400px] md:h-[600px] cursor-pointer"
            >
              <img className="absolute inset-0 w-full h-full object-contain p-12 opacity-80 group-hover:scale-110 transition-transform duration-700" src="https://proteinpackage.co.uk/cdn/shop/products/Optimum-Nutrition-Serious-Mass-Banana-Whey-Protein-Powder-8-Serving-Tub-UK_1000x.png?v=1645900498" alt="" />
              <div className={`absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-surface to-transparent ${isRTL ? 'text-right items-end' : 'text-left items-start'}`}>
                <h3 className="font-headline font-black text-4xl uppercase tracking-tighter mb-2 text-white w-full">{t('home.categories.massGainers')}</h3>
                <p className="text-on-surface-variant text-lg w-full">{t('home.categories.massDesc')}</p>
              </div>
            </motion.div>
          </Link>
          
          <Link to="/catalog?category=whey-protein">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="group relative overflow-hidden rounded-xl bg-surface-container-high h-[288px] cursor-pointer">
              <img className="absolute inset-0 w-full h-full object-contain p-8 opacity-80 group-hover:scale-110 transition-transform duration-700" src="https://getrawnutrition.com/cdn/shop/files/isolateprotein-coldbrew.webp?v=1755271280&width=1080" alt="" />
              <div className={`absolute inset-0 p-6 flex flex-col justify-end ${isRTL ? 'text-right items-end' : 'text-left items-start'}`}>
                <h3 className="font-headline font-black text-2xl uppercase tracking-tighter text-white w-full">{t('home.categories.wheyIsolate')}</h3>
              </div>
            </motion.div>
          </Link>
          
          <Link to="/catalog?category=creatine">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="group relative overflow-hidden rounded-xl bg-surface-container-high h-[288px] cursor-pointer">
              <img className="absolute inset-0 w-full h-full object-contain p-8 opacity-80 group-hover:scale-110 transition-transform duration-700" src="https://www.suppleam.com/wp-content/uploads/2022/10/photo-output-9-768x1024.jpg" alt="" />
              <div className={`absolute inset-0 p-6 flex flex-col justify-end ${isRTL ? 'text-right items-end' : 'text-left items-start'}`}>
                <h3 className="font-headline font-black text-2xl uppercase tracking-tighter text-white w-full">{t('home.categories.creatine')}</h3>
              </div>
            </motion.div>
          </Link>
          
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Link to="/catalog" className="group relative overflow-hidden rounded-xl bg-surface-container-high h-[288px] block">
              <div className={`absolute inset-0 p-8 flex items-center justify-between ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <div className={isRTL ? 'text-right ml-4' : 'text-left mr-4'}>
                  <h3 className="font-headline font-black text-3xl md:text-4xl uppercase tracking-tighter mb-2 text-white">{t('home.categories.allCategories')}</h3>
                  <p className="text-on-surface-variant font-bold">{t('home.categories.allCategoriesDesc')}</p>
                </div>
                <span className={`material-symbols-outlined text-primary text-6xl group-hover:translate-x-4 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-4' : ''}`}>arrow_forward</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Best Sellers */}
      <motion.section 
        variants={containerVariants}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 bg-surface-container-low"
      >
        <div className="container mx-auto px-6">
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-end mb-12 ${isRTL ? 'md:flex-row-reverse text-right' : ''}`}>
            <motion.div variants={itemVariants} className={isRTL ? 'text-right w-full md:w-auto' : 'text-left w-full md:w-auto'}>
              <span className="text-secondary font-black uppercase tracking-widest text-sm mb-2 block">{t('common.engineered')}</span>
              <h2 className="font-headline font-black text-4xl md:text-6xl uppercase tracking-tighter text-white">{t('common.bestSellers')}</h2>
            </motion.div>
            <motion.div variants={itemVariants} className={`mt-6 md:mt-0 ${isRTL ? 'text-right w-full md:w-auto' : 'text-left w-full md:w-auto'}`}>
              <Link to="/catalog" className="text-primary font-bold uppercase tracking-widest border-b-2 border-primary pb-1 inline-block hover:text-white transition-colors">{t('common.shopAll')}</Link>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-96 md:h-[450px] bg-surface-container-high rounded-3xl animate-pulse flex flex-col justify-between p-8 border border-white/5">
                  <div className="w-1/2 h-4 bg-white/10 rounded"></div>
                  <div className="w-1/3 h-8 bg-white/10 rounded mt-auto"></div>
                </div>
              ))
            ) : (
              bestSellers.map(product => (
                <motion.div key={product.id} variants={itemVariants} whileHover={{ y: -10 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.section>

      {/* Interactive CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="py-32 px-6 container mx-auto text-center"
      >
        <div className="bg-primary/5 border border-primary/10 rounded-[3rem] p-12 md:p-32 overflow-hidden relative">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 blur-[100px] rounded-full"
          />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-8xl font-black uppercase italic tracking-tighter mb-8">{t('home.heroTitle')}</h2>
            <Link to="/catalog" className="inline-block bg-primary text-black px-12 py-6 rounded-2xl font-black uppercase text-xl italic hover:scale-110 active:scale-95 transition-all">
              Join the Elite
            </Link>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
