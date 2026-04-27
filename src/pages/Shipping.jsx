import React from 'react';
import { useLanguage } from '../store/LanguageContext';
import { Truck, Clock, CreditCard, ShieldCheck } from 'lucide-react';

const Shipping = () => {
  const { isRTL } = useLanguage();

  const steps = [
    {
      icon: <Clock size={32} />,
      title: isRTL ? 'معالجة الطلب' : 'Processing',
      desc: isRTL ? 'يتم تأكيد ومعالجة طلبك خلال 24 ساعة.' : 'Your order is confirmed and processed within 24 hours.'
    },
    {
      icon: <Truck size={32} />,
      title: isRTL ? 'مدة التوصيل' : 'Delivery Time',
      desc: isRTL ? 'من 24 إلى 48 ساعة في الدار البيضاء، ومن 2 إلى 4 أيام لبقية المدن.' : '24-48 hours in Casablanca, and 2-4 days for other cities.'
    },
    {
      icon: <CreditCard size={32} />,
      title: isRTL ? 'الدفع' : 'Payment',
      desc: isRTL ? 'الدفع نقداً عند الاستلام لضمان راحتكم.' : 'Cash on delivery to ensure your convenience.'
    }
  ];

  return (
    <div className="bg-white py-20 md:py-32">
      <div className="max-w-1400 mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-20 italic">
          {isRTL ? 'معلومات' : 'Shipping'} <span className="text-primary">{isRTL ? 'التوصيل' : 'Information'}</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {steps.map((step, i) => (
            <div key={i} className={`p-10 bg-gray-50 rounded-[40px] border border-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="text-primary mb-6">{step.icon}</div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{step.title}</h3>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed opacity-70">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-secondary rounded-[60px] p-12 md:p-24 text-white">
          <div className={`flex flex-col md:flex-row items-center gap-12 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shrink-0 shadow-2xl shadow-primary/20">
              <ShieldCheck size={48} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-4">
                {isRTL ? 'ضمان التوصيل الآمن' : 'Safe Delivery Guarantee'}
              </h2>
              <p className="text-white/50 text-lg font-medium leading-relaxed">
                {isRTL 
                  ? 'نحن نضمن وصول منتجاتك في حالة ممتازة. إذا حدث أي ضرر أثناء التوصيل، سنقوم باستبدال المنتج مجاناً.' 
                  : 'We guarantee your products arrive in perfect condition. If any damage occurs during delivery, we will replace the product for free.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
