import React from 'react';
import { Sparkles, ShieldCheck, CreditCard, RefreshCw, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-28 border-t border-white/[0.08] bg-slate-950/90 backdrop-blur-md">
      {/* Feature Highlights bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-white/[0.06]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 text-purple-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">Complimentary Shipping</h5>
              <p className="text-xs text-slate-400">On all orders over $100</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">Verified Authenticity</h5>
              <p className="text-xs text-slate-400">100% genuine guaranteed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 text-violet-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">Gateway Integration Ready</h5>
              <p className="text-xs text-slate-400">Stripe / Razorpay / PayPal ready</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-semibold text-white">Seamless 30-Day Returns</h5>
              <p className="text-xs text-slate-400">Hassle-free guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-wider text-white font-['Outfit']">AURA</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
              Curated precision electronics, minimalist essentials, and elevated lifestyle craftsmanship. Built on enterprise MERN stack architecture with dual Admin & Customer interfaces.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full MERN Stack Connected</span>
            </div>
          </div>

          <div>
            <h6 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Navigation</h6>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-purple-400 transition">Store Catalog</Link></li>
              <li><a href="#featured" className="hover:text-purple-400 transition">Featured Products</a></li>
              <li><Link to="/my-orders" className="hover:text-purple-400 transition">Order Lookup</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Portals</h6>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/admin/login" className="hover:text-purple-400 transition">Admin Portal</Link></li>
              <li><Link to="/admin" className="hover:text-purple-400 transition">Control Dashboard</Link></li>
              <li><span className="text-slate-500">API Documentation (/api)</span></li>
            </ul>
          </div>

          <div>
            <h6 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Next Expansion</h6>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Payment Gateway hooks prepared for instant modular plug-in with webhooks.
            </p>
            <span className="text-[10px] text-purple-400 font-mono">v1.0.0-production-ready</span>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AURA E-Commerce. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">Engineered with React + Tailwind + Express + MongoDB</p>
        </div>
      </div>
    </footer>
  );
}

