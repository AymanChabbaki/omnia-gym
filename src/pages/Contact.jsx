import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../store/LanguageContext';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="bg-white py-20 md:py-32">
      <div className="max-w-1400 mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Contact Info */}
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic"
            >
              {isRTL ? 'تواصل' : 'Get in'} <span className="text-primary">{isRTL ? 'معنا' : 'Touch'}</span>
            </motion.h1>
            <p className="text-on-surface-variant text-lg font-medium leading-relaxed mb-12 opacity-70">
              {isRTL 
                ? 'هل لديك أي استفسار حول منتجاتنا أو طلبك؟ فريقنا جاهز لمساعدتك في أي وقت.' 
                : 'Do you have any questions about our products or your order? Our team is ready to help you anytime.'}
            </p>

            <div className="space-y-8">
              {[
                { icon: <Phone className="text-primary" />, title: isRTL ? 'الهاتف' : 'Phone', value: '0661349808', link: 'tel:0661349808' },
                { icon: <FaWhatsapp className="text-primary" size={24} />, title: 'WhatsApp', value: '+212 661 349 808', link: 'https://wa.me/212661349808' },
                { icon: <Mail className="text-primary" />, title: 'Email', value: 'contact@omniagym.ma', link: 'mailto:contact@omniagym.ma' },
                { icon: <MapPin className="text-primary" />, title: isRTL ? 'الموقع' : 'Location', value: 'Casablanca, Morocco', link: '#' },
              ].map((item, i) => (
                <a 
                  key={i}
                  href={item.link}
                  className={`flex items-center gap-6 p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-primary transition-all group ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                >
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{item.title}</p>
                    <p className="text-lg font-bold text-on-surface">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary rounded-[60px] p-8 md:p-16 text-white"
          >
            <h2 className="text-3xl font-black uppercase tracking-tight mb-10 italic">
              {isRTL ? 'أرسل لنا رسالة' : 'Send a Message'}
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-50">{isRTL ? 'الاسم' : 'Name'}</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-50">{isRTL ? 'الهاتف' : 'Phone'}</label>
                  <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">{isRTL ? 'الموضوع' : 'Subject'}</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">{isRTL ? 'الرسالة' : 'Message'}</label>
                <textarea rows="5" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all font-bold resize-none"></textarea>
              </div>
              <button className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
                {isRTL ? 'إرسال' : 'Send Message'} <Send size={20} />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
