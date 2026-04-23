import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../store/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [order, setOrder] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const receiptRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.order) {
      setOrder(location.state.order);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  if (!order) return <div className="min-h-screen bg-background"></div>;

  const handleDownloadPDF = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    
    // Small delay to ensure any animations are settled
    await new Promise(resolve => setTimeout(resolve, 500));

    const element = receiptRef.current;
    if (!element) {
      setIsGenerating(false);
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#0e0e0e',
        logging: false,
        windowWidth: 800,
        onclone: (clonedDoc) => {
          // Force HEX colors for root variables to bypass oklab/oklch parsing errors in html2canvas
          const root = clonedDoc.documentElement;
          root.style.setProperty('--color-primary', '#f4ffc6', 'important');
          root.style.setProperty('--color-background', '#0e0e0e', 'important');
          root.style.setProperty('--color-surface', '#0e0e0e', 'important');
          root.style.setProperty('--color-on-surface', '#ffffff', 'important');
          root.style.setProperty('--color-surface-container-low', '#131313', 'important');
          root.style.setProperty('--color-on-surface-variant', '#adaaaa', 'important');

          const receipt = clonedDoc.getElementById('receipt-content');
          if (receipt) {
            receipt.style.backgroundColor = '#0e0e0e';
            receipt.style.color = '#ffffff';
            
            // Inject a style tag to force HEX on all problematic classes
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
              #receipt-content, #receipt-content * {
                color: #ffffff !important;
                border-color: rgba(255,255,255,0.1) !important;
                background-color: transparent !important;
                box-shadow: none !important;
              }
              #receipt-content .text-primary { color: #f4ffc6 !important; }
              #receipt-content .bg-primary { 
                background-color: #f4ffc6 !important; 
                color: #000000 !important; 
                border-radius: 12px !important;
            }
            #receipt-content .bg-primary * {
                color: #000000 !important;
            }
            #receipt-content .bg-summary-row {
                background-color: rgba(255, 255, 255, 0.05) !important;
                border-radius: 12px !important;
            }
            #receipt-content .bg-status-section {
                background-color: rgba(255, 255, 255, 0.08) !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                border-radius: 20px !important;
            }
            #receipt-content .bg-surface-container-low { background-color: #131313 !important; }
              #receipt-content .bg-white { background-color: #ffffff !important; }
              #receipt-content .bg-primary\\/10 { background-color: rgba(244, 255, 198, 0.1) !important; }
              #receipt-content .text-on-surface-variant { color: #adaaaa !important; }
              #receipt-content .bg-white\\/5 { background-color: rgba(255, 255, 255, 0.05) !important; }
            `;
            clonedDoc.head.appendChild(style);
            
            // Final pass: iterate and force computed style to RGB if it contains okl
            const allElements = receipt.getElementsByTagName('*');
            for (let i = 0; i < allElements.length; i++) {
              const el = allElements[i];
              const compStyle = window.getComputedStyle(el);
              if (compStyle.color.includes('okl')) el.style.color = '#ffffff';
              if (compStyle.backgroundColor.includes('okl')) el.style.backgroundColor = 'transparent';
              if (compStyle.borderColor.includes('okl')) el.style.borderColor = 'rgba(255,255,255,0.1)';
            }
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 3, canvas.height / 3] // Scale back down to normal size for PDF
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
      pdf.save(`OMNIA-SHOP-Receipt-${order.orderId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formattedPrice = (amount) => {
    return new Intl.NumberFormat('fr-MA', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(amount) + ' DH';
  };

  return (
    <main className={`min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto text-on-surface ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <span className="material-symbols-outlined text-5xl text-primary">check_circle</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase text-primary mb-4 leading-tight">{t('orderSuccess.thanks')}</h1>
          <p className="text-on-surface-variant text-base md:text-lg max-w-lg mx-auto font-medium px-4">
            {t('orderSuccess.contactDesc')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <button 
            onClick={handleDownloadPDF} 
            disabled={isGenerating}
            className={`group relative overflow-hidden bg-white text-black px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black uppercase tracking-tighter flex items-center gap-3 transition-all active:scale-95 ${isGenerating ? 'opacity-80 cursor-not-allowed' : 'hover:bg-primary hover:text-on-primary shadow-xl shadow-white/5'}`}
          >
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.span 
                  key="loading"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="material-symbols-outlined"
                >
                  progress_activity
                </motion.span>
              ) : (
                <motion.span key="icon" className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform">download</motion.span>
              )}
            </AnimatePresence>
            {isGenerating ? 'GENERATING...' : t('orderSuccess.download')}
          </button>
          
          <button 
            onClick={() => navigate('/')} 
            className="bg-surface-container-high border border-white/10 text-white px-6 md:px-10 py-3 md:py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-white/5 transition-all flex items-center gap-3 active:scale-95"
          >
            <span className="material-symbols-outlined">home</span>
            {t('orderSuccess.backHome')}
          </button>
        </div>

        {/* Premium Receipt Content */}
        <div className="relative group">
          {/* Decorative Elements */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent rounded-[32px] blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          
          <div 
            ref={receiptRef}
            className="relative bg-[#0e0e0e] p-6 md:p-14 rounded-[24px] md:rounded-[30px] border border-white/10 shadow-2xl overflow-hidden"
            id="receipt-content"
          >
            {/* Brand Watermark */}
            <div className="absolute top-0 right-0 p-6 md:p-10 opacity-[0.03] pointer-events-none select-none">
                <h2 className="text-6xl md:text-9xl font-black rotate-12 transform translate-x-1/4 -translate-y-1/4">OMNIA SHOP</h2>
            </div>

            {/* Receipt Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 pb-12 border-b border-white/10">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-primary mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-3xl md:text-4xl">fitness_center</span>
                  OMNIA SHOP
                </h2>
                <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">{t('orderSuccess.received')}</p>
              </div>
              <div className={`text-right ${isRTL ? 'md:text-left' : 'md:text-right'}`}>
                <div className="bg-primary/10 px-4 py-2 rounded-lg inline-block mb-2 border border-primary/20">
                    <p className="text-xs font-black text-primary uppercase tracking-widest">{t('orderSuccess.orderId')}</p>
                    <p className="font-mono font-black text-lg">#{order.orderId}</p>
                </div>
                <p className="text-sm font-bold opacity-50">{order.date}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 opacity-70">{t('orderSuccess.paymentMethod')}</h3>
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-3xl opacity-50">payments</span>
                        <p className="text-xl font-bold">{order.paymentMethod}</p>
                    </div>
                </div>
                <div className="bg-status-section p-6 rounded-2xl border border-white/5 bg-white/5 shadow-inner">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 opacity-70">STATUS</h3>
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-3xl text-primary animate-pulse">pending</span>
                        <p className="text-lg md:text-xl font-bold uppercase tracking-tighter">Processing Order</p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-12">
              <div className={`flex items-center justify-between font-black uppercase text-xs tracking-[0.2em] opacity-40 mb-6 px-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{t('orderSuccess.item')}</span>
                <span>{t('orderSuccess.itemTotal')}</span>
              </div>
              
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className={`group/item flex flex-col p-5 rounded-2xl bg-white/5 border border-white/0 hover:border-white/5 hover:bg-white/[0.07] transition-all`}>
                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                       <div className="flex flex-col">
                         <span className="font-black text-lg leading-tight group-hover/item:text-primary transition-colors">
                           {item.name_en || item.name}
                         </span>
                         <span className="text-sm font-bold opacity-40 mt-1 uppercase tracking-tighter">
                           Qty: {item.quantity} × {formattedPrice(item.price)}
                         </span>
                       </div>
                       <span className="font-mono font-black text-lg text-primary" dir="ltr">
                         {formattedPrice(item.price * item.quantity)}
                       </span>
                    </div>
                    {item.flavor && (
                      <div className={`mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-on-surface-variant ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="material-symbols-outlined text-sm opacity-50">palette</span>
                        {t('cart.flavor')}: <span className="text-white uppercase tracking-widest bg-white/10 px-2 py-1 rounded">{item.flavor}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="space-y-3">
                <div className={`flex justify-between items-center p-5 bg-summary-row rounded-xl border border-white/5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="uppercase tracking-widest text-xs font-black opacity-60">{t('orderSuccess.subtotal')}</span>
                  <span className="font-mono font-black text-lg" dir="ltr">{formattedPrice(order.subtotal)}</span>
                </div>
                <div className={`flex justify-between items-center p-5 bg-summary-row rounded-xl border border-white/5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="uppercase tracking-widest text-xs font-black opacity-60">{t('orderSuccess.delivery')}</span>
                  <span className="font-mono font-black text-lg" dir="ltr">{formattedPrice(order.delivery)}</span>
                </div>
                <div className={`flex justify-between items-center p-5 md:p-6 bg-primary rounded-2xl shadow-xl shadow-primary/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-lg md:text-xl font-black uppercase tracking-tighter text-black">{t('orderSuccess.total')}</span>
                  <span className="text-2xl md:text-3xl font-black font-mono text-black" dir="ltr">{formattedPrice(order.total)}</span>
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-12 text-center">
                <p className="text-on-surface-variant font-black uppercase tracking-[0.3em] text-[10px] opacity-30 mb-4">
                  Powered by OMNIA SHOP Performance Systems
                </p>
                <div className="inline-block px-6 py-2 border-2 border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest opacity-40">
                  This is a digital record for your gym stack
                </div>
            </div>

          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default OrderSuccess;
