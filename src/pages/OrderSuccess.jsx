import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../store/LanguageContext';
import { motion } from 'framer-motion';
import { CheckCircle2, Printer, Home, Package, Truck, CreditCard, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (location.state && location.state.order) {
      setOrder(location.state.order);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  if (!order) return <div className="min-h-screen bg-white"></div>;

  const handlePrint = () => {
    window.print();
  };

  const formattedPrice = (amount) => {
    return new Intl.NumberFormat('fr-MA', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(amount) + ' DH';
  };

  return (
    <main className={`min-h-screen bg-gray-50 pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="print:hidden">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-primary/10 mb-8 text-primary shadow-xl shadow-primary/5">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-secondary mb-4 italic">{t('orderSuccess.thanks')}</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto font-black uppercase tracking-widest leading-relaxed">
            {t('orderSuccess.contactDesc')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <button 
            onClick={handlePrint} 
            className="w-full sm:w-auto bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-dark transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 active:scale-95"
          >
            <Printer size={20} />
            Download Stack Receipt (PDF)
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            className="w-full sm:w-auto bg-white text-secondary px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-50 transition-all border border-gray-100 flex items-center justify-center gap-3 active:scale-95 shadow-sm"
          >
            <Home size={20} />
            {t('orderSuccess.backHome')}
          </button>
        </div>
      </motion.div>

      {/* This section is designed specifically for high-res printing and PDF conversion */}
      <div 
        className="max-w-3xl mx-auto print:max-w-full print:m-0 print:p-0"
        id="receipt-content"
      >
        <div className="relative bg-white p-8 md:p-16 rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden print:shadow-none print:border-none print:rounded-none print:p-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16 pb-12 border-b border-gray-50 print:flex-row">
            <div className="space-y-6">
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <img src="/logo.png" className="h-16 w-auto" alt="Logo" />
                <div className={`flex flex-col leading-none ${isRTL ? 'items-end' : ''}`}>
                  <span className="text-3xl font-black uppercase tracking-tighter text-secondary">OMNIA <span className="text-primary italic">SHOP</span></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Morocco Performance Systems</span>
                </div>
              </div>
              <div className={`flex flex-col gap-1 ${isRTL ? 'items-end' : ''}`}>
                 <p className="text-[10px] font-black uppercase tracking-widest text-primary">Order Confirmation Record</p>
                 <p className="text-xs font-bold text-gray-400">Date: {order.date}</p>
              </div>
            </div>
            
            <div className={`bg-gray-50 p-6 rounded-3xl border border-gray-100 min-w-[180px] ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Stack Identification</p>
              <p className="text-2xl font-black text-secondary tracking-tighter italic">#{order.orderId || '000'}</p>
              <div className="mt-4 pt-4 border-t border-gray-100 print:hidden">
                 <div className="flex items-center gap-2 text-green-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Live: Processing</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 print:grid-cols-2">
            <div className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
               <div className={`flex items-center gap-2 text-primary mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <CreditCard size={14} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Payment Strategy</p>
               </div>
               <p className="text-xl font-black text-secondary uppercase tracking-tight">{order.paymentMethod}</p>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Pay in cash upon delivery</p>
            </div>
            <div className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
               <div className={`flex items-center gap-2 text-primary mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Truck size={14} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Dispatch Zone</p>
               </div>
               <p className="text-xl font-black text-secondary uppercase tracking-tight">{order.city || 'National Delivery'}</p>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{order.address}</p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-16">
            <h3 className={`text-xs font-black uppercase tracking-[0.3em] text-gray-300 mb-8 border-b border-gray-50 pb-4 ${isRTL ? 'text-right' : ''}`}>Gym Stack Details</h3>
            <div className="space-y-8">
              {order.items?.map((item, i) => (
                <div key={`${item.id || 'item'}-${i}`} className={`flex justify-between items-start gap-8 ${isRTL ? 'flex-row-reverse' : ''} print:flex-row`}>
                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-200">
                       <Package size={24} />
                    </div>
                    <div className={`space-y-1 ${isRTL ? 'text-right' : ''}`}>
                       <h4 className="text-base font-black text-secondary uppercase tracking-tighter italic leading-none">{item.name_en || item.name}</h4>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity: {item.quantity} Unit(s)</p>
                       {item.flavor && (
                         <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">Flavor: {item.flavor}</span>
                         </div>
                       )}
                    </div>
                  </div>
                  <span className="text-lg font-black text-secondary tracking-tighter" dir="ltr">{formattedPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Section */}
          <div className="bg-secondary rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl print:bg-black print:text-white print:rounded-none print:shadow-none">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none print:hidden">
               <ShoppingBag size={120} className="rotate-12" />
            </div>
            <div className="space-y-6 relative z-10">
               <div className={`flex justify-between items-center opacity-40 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('orderSuccess.subtotal')}</span>
                  <span className="font-bold text-lg" dir="ltr">{formattedPrice(order.subtotal)}</span>
               </div>
               <div className={`flex justify-between items-center opacity-40 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('orderSuccess.delivery')}</span>
                  <span className="font-bold text-sm" dir="ltr">{isRTL ? 'من 20 إلى 45 درهم (ستضاف لاحقاً)' : '20 to 45 DH (Will be added)'}</span>
               </div>
               <div className={`flex justify-between items-center pt-6 border-t border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-2xl font-black uppercase tracking-tighter italic">{t('orderSuccess.total')}</span>
                  <span className="text-4xl font-black text-primary tracking-tighter italic" dir="ltr">{formattedPrice(order.total)}</span>
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center space-y-4">
             <p className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-200">
                Authentic Record | OMNIA SHOP Morocco Performance Systems
             </p>
             <div className="inline-block px-8 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 italic">
                This is a certified digital record for your personal gym stack
             </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white !important; margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
          .print\\:flex-row { flex-direction: row !important; }
          .print\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .print\\:max-w-full { max-width: 100% !important; }
          .print\\:m-0 { margin: 0 !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:p-10 { padding: 40px !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-none { border: none !important; }
          .print\\:bg-black { background-color: #000000 !important; -webkit-print-color-adjust: exact; }
          .print\\:text-white { color: #ffffff !important; }
          header, footer, .whatsapp-float, .scroll-to-top, .floating-cart { display: none !important; }
        }
      `}} />
    </main>
  );
};

export default OrderSuccess;
