import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../store/LanguageContext';
import { ShieldCheck, Target, Award } from 'lucide-react';

const About = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="bg-white py-20 md:py-32">
      <div className="max-w-1400 mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic"
          >
            {isRTL ? 'قصتنا' : 'Our'} <span className="text-primary">{isRTL ? 'وطموحنا' : 'Mission'}</span>
          </motion.h1>
          <p className="text-on-surface-variant text-lg font-medium leading-relaxed">
            {isRTL 
              ? 'أومنيا شوب هو الوجهة الأولى في المغرب للمكملات الغذائية عالية الجودة. بدأنا بهدف واحد: توفير أفضل المنتجات العالمية للرياضيين المغاربة بأفضل الأسعار.' 
              : 'Omnia Shop is Morocco\'s premier destination for high-quality nutrition supplements. We started with a single goal: to provide the best international products to Moroccan athletes at the best prices.'}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {[
            { 
              icon: <ShieldCheck size={40} />, 
              title: isRTL ? 'جودة مضمونة' : 'Guaranteed Quality', 
              desc: isRTL ? 'جميع منتجاتنا أصلية 100% ومستوردة مباشرة من المصنع.' : 'All our products are 100% authentic and imported directly from the manufacturer.' 
            },
            { 
              icon: <Target size={40} />, 
              title: isRTL ? 'هدفنا' : 'Our Target', 
              desc: isRTL ? 'مساعدة كل رياضي مغربي على الوصول إلى أهدافه البدنية والصحية.' : 'Helping every Moroccan athlete reach their physical and health goals.' 
            },
            { 
              icon: <Award size={40} />, 
              title: isRTL ? 'ثقة العملاء' : 'Customer Trust', 
              desc: isRTL ? 'أكثر من 5000 عميل راضٍ في جميع أنحاء المملكة.' : 'More than 5,000 satisfied customers all over the Kingdom.' 
            },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 bg-gray-50 rounded-[40px] border border-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <div className="text-primary mb-6">{item.icon}</div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{item.title}</h3>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed opacity-70">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-secondary rounded-[60px] p-12 md:p-24 text-white overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 italic">
                {isRTL ? 'لماذا' : 'Why'} <span className="text-primary italic">{isRTL ? 'أومنيا شوب؟' : 'Omnia Shop?'}</span>
              </h2>
              <div className="space-y-6 text-white/60 font-medium leading-relaxed">
                <p>
                  {isRTL 
                    ? 'نحن لا نبيع المكملات الغذائية فقط، بل نقدم تجربة متكاملة. من الاستشارة قبل الشراء إلى التوصيل السريع لمدينتك.' 
                    : 'We don\'t just sell supplements; we provide a complete experience. From pre-purchase advice to fast delivery to your city.'}
                </p>
                <p>
                  {isRTL 
                    ? 'فريقنا يتكون من خبراء في التغذية الرياضية جاهزين دائماً للإجابة على تساؤلاتكم ومساعدتكم في اختيار المكمل المناسب لنوع تداريبكم.' 
                    : 'Our team consists of sports nutrition experts who are always ready to answer your questions and help you choose the right supplement for your training type.'}
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070" 
                className="rounded-[40px] shadow-2xl" 
                alt="Gym"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
