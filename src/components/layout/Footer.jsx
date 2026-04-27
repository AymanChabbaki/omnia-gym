import React from 'react';
import { useLanguage } from '../../store/LanguageContext';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-secondary text-white pt-16 pb-10">
      <div className="max-w-1400 mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <img src="/logo.png" alt="Omnia Shop" className="h-10 w-auto" />
            <div className={`flex flex-col leading-none ${isRTL ? 'items-end' : 'items-start'}`}>
              <span className="text-lg font-black uppercase tracking-tighter">Omnia <span className="text-primary italic">Shop</span></span>
              <span className="text-[8px] font-bold uppercase tracking-[0.3em] opacity-40">Morocco</span>
            </div>
          </div>
          <p className="text-white/50 text-[11px] leading-relaxed max-w-xs">
            {isRTL 
              ? 'متجرك رقم 1 للمكملات الغذائية عالية الجودة في المغرب. نحن نهتم بصحتك وأدائك الرياضي.' 
              : 'Your #1 shop for high-quality nutrition supplements in Morocco. We care about your health and performance.'}
          </p>
          <div className={`flex items-center gap-4 ${isRTL ? 'justify-end' : ''}`}>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all text-white">
              <FaFacebookF size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all text-white">
              <FaInstagram size={18} />
            </a>
          </div>
        </div>

        {/* Categories */}
        <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{isRTL ? 'الأقسام' : 'Categories'}</h4>
          <ul className="space-y-3">
            {[
              { name: isRTL ? 'واي بروتين' : 'Whey Protein', id: 'whey-protein' },
              { name: isRTL ? 'رابح الوزن' : 'Mass Gainer', id: 'mass-gainer' },
              { name: isRTL ? 'كرياتين' : 'Creatine', id: 'creatine' },
              { name: isRTL ? 'أحماض أمينية' : 'Amino Acids', id: 'amino-acids' }
            ].map(item => (
              <li key={item.id}>
                <Link to={`/catalog?category=${item.id}`} className="text-white/40 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{isRTL ? 'روابط سريعة' : 'Quick Links'}</h4>
          <ul className="space-y-3">
            {[
              { name: isRTL ? 'من نحن' : 'About Us', path: '/about' },
              { name: isRTL ? 'اتصل بنا' : 'Contact Us', path: '/contact' },
              { name: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy', path: '/privacy' },
              { name: isRTL ? 'معلومات التوصيل' : 'Shipping Info', path: '/shipping' }
            ].map(item => (
              <li key={item.path}>
                <Link to={item.path} className="text-white/40 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{isRTL ? 'اتصل بنا' : 'Contact Us'}</h4>
          <div className="space-y-4">
            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Phone size={14} className="text-primary mt-0.5" />
              <div>
                <p className="text-[9px] text-white/30 uppercase font-black">{isRTL ? 'الهاتف' : 'Phone'}</p>
                <p className="text-[11px] font-bold">0661349808</p>
              </div>
            </div>
            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Mail size={14} className="text-primary mt-0.5" />
              <div>
                <p className="text-[9px] text-white/30 uppercase font-black">{isRTL ? 'البريد الإلكتروني' : 'Email'}</p>
                <p className="text-[11px] font-bold">contact@omniagym.ma</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-1400 mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
          &copy; 2024 Omnia Shop Morocco. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
