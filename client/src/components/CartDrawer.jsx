import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import AuthModal from './AuthModal';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQty,
    cartSubtotal,
    shippingPrice,
    taxPrice,
    cartTotal,
    clearCart,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      // Prompt login/registration modal as requested
      setAuthModalOpen(true);
    } else {
      closeCart();
      navigate('/checkout');
    }
  };

  const handleAuthSuccess = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-slate-900/95 border-l border-white/[0.08] shadow-2xl flex flex-col backdrop-blur-xl">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your Shopping Bag</h3>
                  <p className="text-xs text-slate-400">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">Your bag is empty</h4>
                  <p className="text-xs text-slate-400 max-w-xs mb-6">
                    Browse our curated collection and add signature pieces to your cart.
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition shadow-lg shadow-purple-600/30"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product}
                    className="flex gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg bg-slate-900 shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-white truncate max-w-[180px]">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-purple-400 font-semibold">
                            ${Number(item.price).toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="text-slate-500 hover:text-rose-400 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quantity control */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/80">
                          <button
                            onClick={() => updateQty(item.product, item.qty - 1)}
                            className="p-1 hover:text-purple-400 text-slate-400 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-slate-200">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.product, item.qty + 1)}
                            className="p-1 hover:text-purple-400 text-slate-400 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-white">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Calculation & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-slate-200">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span className={shippingPrice === 0 ? 'text-emerald-400 font-medium' : 'text-slate-200'}>
                      {shippingPrice === 0 ? 'Free Shipping' : `$${shippingPrice.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-slate-200">${taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                    <span>Total</span>
                    <span className="text-base text-purple-400">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>
                    {!isAuthenticated
                      ? 'You can sign in or register at next step'
                      : 'Authenticated customer checkout'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal Trigger for Checkout */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        message="Please sign in or create an account to proceed with your checkout and order confirmation."
      />
    </>
  );
}

