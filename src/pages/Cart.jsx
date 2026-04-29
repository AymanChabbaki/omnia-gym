import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useLanguage } from '../store/LanguageContext';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, updateFlavor, cartTotal } = useCart();
  const { getLocalized, t, isRTL } = useLanguage();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <main className="flex-grow pt-32 pb-32 px-4 md:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-black uppercase text-primary mb-8">{t('cart.empty')}</h1>
        <p className="text-on-surface-variant font-medium tracking-wide mb-12">{t('cart.emptyDesc')}</p>
        <Link to="/catalog" className="px-10 py-4 bg-primary text-on-primary font-headline font-black uppercase tracking-widest text-lg rounded-lg hover:scale-105 active:scale-95 transition-all duration-200">
          {t('common.browseCatalog')}
        </Link>
      </main>
    );
  }

  const DELIVERY_FEE = 0;
  const FINAL_TOTAL = cartTotal;

  return (
    <main className={`flex-grow pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto w-full ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-black uppercase text-primary mb-2">{t('cart.title')}</h1>
        <p className="text-on-surface-variant font-medium tracking-wide">{cartItems.length} {t('cart.selected')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-6">
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className={`group relative flex flex-col md:flex-row gap-6 p-6 bg-surface-container rounded-xl transition-all duration-300 hover:bg-surface-container-high border-primary ${isRTL ? 'border-r-4' : 'border-l-4 border-transparent hover:border-primary'}`}>
              <div className="w-full md:w-40 h-40 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
                <img alt={getLocalized(item, 'name')} className="w-full h-full object-cover" src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder.png'} />
              </div>
              <div className="flex-grow flex flex-col justify-between py-2">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="font-headline text-2xl font-bold text-on-surface uppercase">{getLocalized(item, 'name')}</h3>
                    {item.flavors && item.flavors.length > 0 && (
                      <div className="mt-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1 block">
                          {t('cart.flavor')}
                        </label>
                        <select 
                          value={item.flavor || ''}
                          onChange={(e) => updateFlavor(item.id, item.flavor, e.target.value)}
                          className="bg-surface-container-lowest border border-white/5 rounded-lg px-3 py-1.5 text-xs font-bold text-primary outline-none focus:border-primary/40 transition-colors w-full sm:w-auto"
                        >
                          {!item.flavor && <option value="">{t('product.selectFlavor')}</option>}
                          {item.flavors.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div className={isRTL ? 'text-left' : 'text-right'}>
                    <span className="font-headline text-2xl font-black text-primary" dir="ltr">
                      {new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(item.price * item.quantity)} DH
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full mt-6">
                  <div className="flex items-center bg-surface-container-lowest rounded-lg p-1 border border-outline-variant/20" dir="ltr">
                    <button onClick={() => updateQuantity(item.id, item.flavor, -1)} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="w-10 text-center font-bold font-headline text-primary">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.flavor, 1)} className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.flavor)} className="flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors text-sm font-bold uppercase tracking-tighter">
                    <span className="material-symbols-outlined text-lg">delete</span>
                    {t('cart.remove')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="bg-surface-container-high p-8 rounded-2xl shadow-2xl">
            <h2 className="font-headline text-2xl font-black text-on-surface uppercase mb-8">{t('checkout.yourOrder')}</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-medium">{t('cart.subtotal')}</span>
                <span className="font-bold text-on-surface" dir="ltr">{new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(cartTotal)} DH</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-medium">{t('cart.delivery')}</span>
                <span className="font-bold text-on-surface text-sm" dir="ltr">{isRTL ? 'من 20 إلى 45 درهم (ستضاف لاحقاً)' : '20 to 45 DH (Will be added)'}</span>
              </div>
              <div className="pt-4 border-t border-outline-variant/20">
                <div className="flex justify-between items-end">
                  <span className="font-headline text-xl font-bold text-white uppercase">{t('cart.total')}</span>
                  <div className={isRTL ? 'text-left' : 'text-right'}>
                    <span className="block font-headline text-4xl font-black text-primary leading-none" dir="ltr">
                      {new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(FINAL_TOTAL)} DH
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 mb-4 text-sm font-bold flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span>{t('checkout.cod')}</span>
                  <input type="radio" checked readOnly className="accent-primary" />
                </div>
                <div className="text-on-surface-variant text-xs">{t('checkout.codDesc')}</div>
              </div>

              <button onClick={() => navigate('/checkout')} className="w-full py-4 bg-primary text-on-primary font-black uppercase tracking-tighter rounded-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
                {t('cart.checkout')}
                <span className="font-mono text-sm ml-2" dir="ltr">{new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(FINAL_TOTAL)} DH</span>
              </button>
            </div>
          </div>
          
          <Link to="/catalog" className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <span className={`material-symbols-outlined ${isRTL ? 'rotate-180' : ''}`}>undo</span>
            {t('cart.continue')}
          </Link>
        </div>
      </div>
      {/* Floating Checkout Button for Mobile */}
      <div className="md:hidden fixed bottom-24 left-0 w-full px-6 z-40">
        <button 
          onClick={() => navigate('/checkout')}
          className="w-full bg-primary text-on-primary py-5 rounded-2xl font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(244,255,198,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">shopping_cart_checkout</span>
          {t('cart.checkout')}
          <span className="font-mono text-xs opacity-70">({new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(FINAL_TOTAL)} DH)</span>
        </button>
      </div>
    </main>
  );
};

export default Cart;
