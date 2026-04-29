import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useLanguage } from '../store/LanguageContext';
import { motion } from 'framer-motion';
import { createOrder } from '../services/api';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { t, isRTL, getLocalized } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const DELIVERY_FEE = 0;
  const FINAL_TOTAL = cartTotal;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.address || !formData.city || !formData.phone) {
      alert(t('checkout.requiredError'));
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        ...formData,
        subtotal: cartTotal,
        deliveryFee: DELIVERY_FEE,
        total: FINAL_TOTAL,
        items: cartItems
      };

      const savedOrder = await createOrder(orderPayload);
      
      const orderData = {
        orderId: savedOrder.id, 
        date: new Date().toLocaleDateString(isRTL ? 'ar-MA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        items: cartItems,
        subtotal: cartTotal,
        delivery: DELIVERY_FEE,
        total: FINAL_TOTAL,
        customer: formData,
        paymentMethod: t('checkout.codDesc')
      };

      clearCart();
      navigate('/order-success', { state: { order: orderData } });
    } catch (error) {
      console.error(error);
      alert(t('checkout.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen pt-32 text-center text-on-surface flex flex-col items-center">
         <h1 className="text-4xl font-black uppercase text-primary mb-4">{t('cart.empty')}</h1>
         <button onClick={() => navigate('/catalog')} className="bg-primary text-on-primary px-8 py-3 rounded uppercase font-bold">{t('cart.continue')}</button>
      </main>
    );
  }

  return (
    <main className={`pt-32 pb-20 px-6 max-w-7xl mx-auto text-on-surface ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* MOBILE ORDER SUMMARY (Shown only on small screens at the top) */}
        <div className="lg:hidden">
          <button 
            onClick={() => {
              const el = document.getElementById('order-summary');
              el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full p-6 bg-surface-container-high rounded-2xl border border-primary/20 flex justify-between items-center"
          >
            <div className="text-left">
              <span className="block text-[10px] font-black uppercase tracking-widest text-primary mb-1">{t('checkout.yourOrder')}</span>
              <span className="text-2xl font-black">{new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(FINAL_TOTAL)} DH</span>
            </div>
            <span className="material-symbols-outlined text-primary">expand_more</span>
          </button>
        </div>

        {/* FORM MODULE */}
        <motion.div initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className="bg-surface-container p-8 rounded-3xl border border-white/5 shadow-2xl">
          <h2 className="text-3xl font-black uppercase mb-8 text-primary">{t('checkout.billingDetails')}</h2>
          <form className="space-y-6" onSubmit={handleCompleteOrder}>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 block">{t('checkout.fullName')} *</label>
              <input required name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full bg-surface-container-high border border-outline-variant/30 rounded-lg p-4 outline-none focus:border-primary transition-colors ${isRTL ? 'text-right' : 'text-left'}`} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 block">{t('checkout.address')} *</label>
              <input required name="address" value={formData.address} onChange={handleChange} className={`w-full bg-surface-container-high border border-outline-variant/30 rounded-lg p-4 outline-none focus:border-primary transition-colors ${isRTL ? 'text-right' : 'text-left'}`} placeholder={isRTL ? "اسم الشارع، رقم المنزل، تفاصيل العنوان" : "Street name, house number, details"} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 block">{t('checkout.city')} *</label>
              <input required name="city" value={formData.city} onChange={handleChange} className={`w-full bg-surface-container-high border border-outline-variant/30 rounded-lg p-4 outline-none focus:border-primary transition-colors ${isRTL ? 'text-right' : 'text-left'}`} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-80 block">{t('checkout.phone')} *</label>
              <input required name="phone" type="tel" value={formData.phone} onChange={handleChange} className={`w-full bg-surface-container-high border border-outline-variant/30 rounded-lg p-4 outline-none focus:border-primary transition-colors ${isRTL ? 'text-right' : 'text-left'}`} dir="ltr" />
            </div>
            <div className="space-y-2 pt-4">
              <label className="text-sm font-bold opacity-80 block">{t('checkout.notes')}</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className={`w-full bg-surface-container-high border border-outline-variant/30 rounded-lg p-4 outline-none focus:border-primary transition-colors ${isRTL ? 'text-right' : 'text-left'}`} />
            </div>
          </form>
        </motion.div>

        {/* ORDER SUMMARY */}
        <motion.div id="order-summary" initial={{ opacity: 0, x: isRTL ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6 lg:sticky lg:top-28">
          <div className="bg-surface-container-high p-8 rounded-3xl border border-primary/20 shadow-xl overflow-hidden relative">
            <h2 className="text-2xl font-black uppercase mb-8">{t('checkout.yourOrder')}</h2>
            
            <div className="w-full text-sm">
              <div className={`flex font-black uppercase text-outline mb-4 pb-2 border-b border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-grow">{t('checkout.product')}</div>
                <div className={`w-32 ${isRTL ? 'text-right' : 'text-left'}`}>{t('checkout.subtotal')}</div>
              </div>
              
              <div className="space-y-6">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex flex-col pb-4 border-b border-white/5">
                    <div className={`flex justify-between items-start font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
                       <span className="flex-grow text-primary">
                         {getLocalized(item, 'name')} <span className="opacity-50 text-white font-mono ml-2">× {item.quantity}</span>
                       </span>
                       <span className={`w-32 font-mono ${isRTL ? 'text-right' : 'text-left'}`}>{new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(item.price * item.quantity)} DH</span>
                    </div>
                    {item.flavor && (
                      <div className={`text-xs mt-1 text-on-surface-variant ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('cart.flavor')} :: <br/><span className="italic">{item.flavor}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 space-y-4 text-base font-bold text-on-surface-variant">
                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span>{t('checkout.subtotal')}</span>
                  <span className="">{new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(cartTotal)} DH</span>
                </div>
                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span>{t('checkout.delivery')}</span>
                  <span className="">{isRTL ? 'من 20 إلى 45 درهم (ستضاف عند التوصيل)' : 'Will be added (20 to 45 DH)'}</span>
                </div>
                <div className={`flex justify-between text-2xl font-black pt-4 border-t border-white/10 text-primary ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span>{t('checkout.total')}</span>
                  <span>{new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(FINAL_TOTAL)} DH</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 mb-4">
                <label className={`flex items-center gap-3 font-bold cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <input type="radio" checked readOnly className="accent-primary w-5 h-5" />
                  <span>{t('checkout.cod')}</span>
                </label>
                <div className={`mt-3 text-sm text-on-surface-variant p-4 bg-background/50 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('checkout.codDesc')}
                </div>
              </div>

              <button 
                onClick={handleCompleteOrder}
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary py-5 rounded-xl font-black text-xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(244,255,198,0.15)] disabled:opacity-50"
              >
                {isSubmitting ? (isRTL ? 'جاري الإرسال...' : 'Sending...') : t('checkout.completeOrder')}
                <span className="text-sm font-mono opacity-80 mr-2" dir="ltr">{new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(FINAL_TOTAL)} DH</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Checkout;
