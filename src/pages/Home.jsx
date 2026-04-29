import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../store/LanguageContext';
import ProductCarousel from '../components/product/ProductCarousel';
import { fetchProducts, fetchCategories } from '../services/api';
import { ArrowRight, Zap, ShieldCheck, Truck, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const { t, isRTL, getLocalized } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Hero Carousel State
  const heroImages = [
    '/hero11.png',
    '/hero9.png',
    '/hero7.png',
    '/hero8.png',
    '/hero6.png',
    '/hero5.png'
  ];
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextHero = () => setCurrentHero((prev) => (prev + 1) % heroImages.length);
  const prevHero = () => setCurrentHero((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(cats);
        
        const productsMap = {};
        await Promise.all(cats.map(async (cat) => {
          const products = await fetchProducts(cat.id);
          productsMap[cat.id] = products;
        }));
        
        const allProducts = await fetchProducts();
        productsMap['all'] = allProducts;
        
        setProductsByCategory(productsMap);
      } catch (err) {
        console.error("Home data fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const features = [
    { icon: <Truck size={24} />, title: isRTL ? 'توصيل سريع' : 'Fast Delivery', desc: isRTL ? 'لكل المدن المغربية' : 'To all Moroccan cities' },
    { icon: <ShieldCheck size={24} />, title: isRTL ? 'منتجات أصلية' : '100% Authentic', desc: isRTL ? 'ضمان الجودة العالية' : 'High quality guaranteed' },
    { icon: <Zap size={24} />, title: isRTL ? 'أفضل الأسعار' : 'Best Prices', desc: isRTL ? 'عروض حصرية يومية' : 'Daily exclusive offers' },
    { icon: <Headphones size={24} />, title: isRTL ? 'دعم متواصل' : '24/7 Support', desc: isRTL ? 'نحن هنا لمساعدتك' : 'We are here to help' },
  ];

  const brandLogos = [
    '/dymatize.svg',
    '/Optimum_Nutrition.png',
    '/muscletech.webp',
    '/biotechusa.svg',
    '/scitec.png',
    '/applied.png',
  ];

  return (
    <div className="bg-white min-h-screen max-w-full overflow-hidden">
      {/* Pure Hero Carousel Section */}
      <section className="relative h-auto md:h-[800px] overflow-hidden bg-white">
        {/* Spacer Ghost Image for Mobile Responsiveness to show full image */}
        <img 
          src={heroImages[currentHero]} 
          className="w-full h-auto opacity-0 pointer-events-none block md:hidden"
          alt="Spacer"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={heroImages[currentHero]} 
              className="w-full h-full object-contain md:object-cover"
              alt={`Hero ${currentHero + 1}`}
            />
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Arrows - Minimal Style */}
        <button 
          onClick={prevHero}
          className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-6' : 'left-6'} z-30 p-2 rounded-full bg-white/30 hover:bg-white text-secondary transition-all active:scale-90`}
        >
          <ChevronLeft size={24} className={isRTL ? 'rotate-180' : ''} />
        </button>
        <button 
          onClick={nextHero}
          className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-6' : 'right-6'} z-30 p-2 rounded-full bg-white/30 hover:bg-white text-secondary transition-all active:scale-90`}
        >
          <ChevronRight size={24} className={isRTL ? 'rotate-180' : ''} />
        </button>

        {/* Carousel Indicators - Minimal */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentHero(i)}
              className={`h-1 transition-all duration-300 rounded-full ${currentHero === i ? 'w-8 bg-primary' : 'w-2 bg-black/20'}`}
            />
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-1400 mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className={`flex items-center gap-5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-primary shadow-inner">
                {f.icon}
              </div>
              <div>
                <h4 className="font-black uppercase text-xs tracking-wider text-on-surface">{f.title}</h4>
                <p className="text-[11px] text-on-surface-variant font-bold uppercase opacity-50">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Ticker */}
      <section className="py-16 bg-white overflow-hidden border-b border-gray-100">
        <div className="relative">
          <div className="flex animate-scroll gap-24 items-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            {[...brandLogos, ...brandLogos].map((logo, i) => (
              <img key={i} src={logo} alt="Brand" className="h-10 md:h-16 w-auto object-contain" />
            ))}
          </div>
        </div>
      </section>

      {/* Shop Sections */}
      <section className="py-32 bg-white">
        <div className="max-w-1400 mx-auto px-6">
          <div className={`flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 italic">
                {isRTL ? 'تسوق حسب' : 'Shop By'} <span className="text-primary italic">{isRTL ? 'الأقسام' : 'Category'}</span>
              </h2>
              <p className="text-on-surface-variant font-bold uppercase tracking-widest text-sm opacity-50">
                {isRTL ? 'اكتشف أفضل المكملات الغذائية المختارة بعناية' : 'Explore our hand-picked premium supplements'}
              </p>
            </div>
            
            <div className="flex bg-gray-100 p-2 rounded-2xl gap-1">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'all' ? 'bg-white shadow-xl text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {isRTL ? 'الكل' : 'All'}
              </button>
              <button 
                onClick={() => setActiveTab('new')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'new' ? 'bg-white shadow-xl text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {isRTL ? 'منتجات جديدة' : 'New Arrivals'}
              </button>
            </div>
          </div>

          {loading ? (
             <div className="h-[500px] bg-gray-50 rounded-[40px] animate-pulse"></div>
          ) : (
            <div className="space-y-40">
              {categories.map(cat => (
                <div key={cat.id}>
                  <div className={`flex items-center justify-between mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <h3 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                       <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                       </div>
                       {getLocalized(cat, 'name')}
                    </h3>
                    <Link to={`/catalog?category=${cat.id}`} className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:gap-5 transition-all group">
                      {isRTL ? 'مشاهدة الكل' : 'View All'} 
                      <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                  <ProductCarousel products={productsByCategory[cat.id] || []} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-secondary text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070" className="w-full h-full object-cover" alt="Background" />
        </div>
        <div className="relative z-10 max-w-1400 mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-10 italic leading-none">
            {isRTL ? 'انضم إلى' : 'Join the'} <br /> <span className="text-primary">{isRTL ? 'مجتمعنا الرياضي' : 'Elite Community'}</span>
          </h2>
          <p className="max-w-3xl mx-auto text-white/50 font-bold uppercase tracking-[0.2em] text-sm mb-16 leading-relaxed">
            {isRTL ? 'اشترك في نشرتنا الإخبارية للحصول على أحدث العروض والنصائح الرياضية مباشرة إلى بريدك' : 'Subscribe to our newsletter for the latest offers, training tips, and premium content delivered to you.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder={isRTL ? 'بريدك الإلكتروني' : 'Enter your email'} 
              className="bg-white/5 border border-white/10 px-8 py-5 rounded-2xl text-white outline-none focus:border-primary transition-all flex-grow font-bold placeholder:text-white/20"
            />
            <button className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30">
              {isRTL ? 'اشترك' : 'Subscribe'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
