import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="flex-grow pt-32 pb-32 px-4 md:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-black uppercase text-primary mb-8">Stack Empty</h1>
        <p className="text-on-surface-variant font-medium tracking-wide mb-12">You haven't selected any performance fuel yet.</p>
        <Link to="/catalog" className="px-10 py-4 bg-primary text-on-primary font-headline font-black uppercase tracking-widest text-lg rounded-lg hover:scale-105 active:scale-95 transition-all duration-200">
          Go to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-24 pb-32 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <header className="mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-black uppercase text-primary mb-2">Your Stack</h1>
        <p className="text-on-surface-variant font-medium tracking-wide">{cartItems.length} Items selected for peak performance.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="group relative flex flex-col md:flex-row gap-6 p-6 bg-surface-container rounded-xl transition-all duration-300 hover:bg-surface-container-high border-l-4 border-transparent hover:border-primary">
              <div className="w-full md:w-40 h-40 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0">
                <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
              </div>
              <div className="flex-grow flex flex-col justify-between py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline text-2xl font-bold text-on-surface uppercase">{item.name}</h3>
                    <p className="text-secondary font-bold text-sm tracking-widest uppercase mb-2">
                      {item.flavor || 'Universal'} | {item.size || 'Standard'}
                    </p>
                    <div className="flex gap-2">
                      {item.tags && item.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-surface-variant text-[10px] font-bold px-2 py-0.5 rounded uppercase text-on-surface-variant tracking-tighter">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-headline text-2xl font-black text-primary">DH{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center bg-surface-container-lowest rounded-lg p-1 border border-outline-variant/20">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="w-10 text-center font-bold font-headline text-primary">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors text-sm font-bold uppercase tracking-tighter"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Free Shipping Progress */}
          <div className="p-6 bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/20">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-on-surface uppercase tracking-wider">Free Shipping Progress</span>
              <span className="text-sm font-black text-secondary uppercase">
                {cartTotal >= 150 ? 'FREE SHIPPING QUALIFIED' : `$${(150 - cartTotal).toFixed(2)} left to qualify`}
              </span>
            </div>
            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-secondary to-secondary-fixed transition-all duration-500" style={{ width: `${Math.min(100, (cartTotal / 150) * 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-4 sticky top-28">
          <div className="bg-surface-container-high p-8 rounded-2xl shadow-2xl">
            <h2 className="font-headline text-2xl font-black text-on-surface uppercase mb-8">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-medium">Subtotal</span>
                <span className="font-bold text-on-surface">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-medium">Estimated Shipping</span>
                <span className="font-bold text-secondary uppercase text-xs">
                  {cartTotal >= 150 ? 'FREE' : '$9.99'}
                </span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="text-sm font-medium">Tax</span>
                <span className="font-bold text-on-surface">$0.00</span>
              </div>
              <div className="pt-4 border-t border-outline-variant/20">
                <div className="flex justify-between items-end">
                  <span className="font-headline text-lg font-bold text-white uppercase">Total</span>
                  <div className="text-right">
                    <span className="block font-headline text-4xl font-black text-primary leading-none">
                      ${(cartTotal + (cartTotal >= 150 ? 0 : 9.99)).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">USD</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <button className="w-full py-4 bg-primary text-on-primary font-black uppercase tracking-tighter rounded-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
                Proceed to Checkout
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <div className="pt-6">
                <div className="flex items-center gap-4 text-on-surface-variant mb-4 opacity-60">
                  <span className="material-symbols-outlined">lock</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Secure 256-bit SSL Checkout</span>
                </div>
                <div className="grid grid-cols-4 gap-2 opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
                  {['credit_card', 'payments', 'account_balance', 'shopping_bag'].map(icon => (
                    <div key={icon} className="h-8 bg-surface-container flex items-center justify-center rounded">
                      <span className="material-symbols-outlined text-sm">{icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Link to="/catalog" className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined">undo</span>
            Continue Training (Shop More)
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Cart;
