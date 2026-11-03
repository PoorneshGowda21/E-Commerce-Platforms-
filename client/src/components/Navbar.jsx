import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Shield,
  User,
  LogOut,
  Package,
  Layers,
  Sparkles,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, openCart } = useCart();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-400 p-[1px] shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent font-['Outfit']">
                  AURA
                </span>
                <span className="text-[9px] uppercase tracking-widest text-purple-400 font-semibold -mt-1">
                  E-Commerce Studio
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <Link
                to="/"
                className={`hover:text-white transition flex items-center gap-1.5 ${
                  location.pathname === '/' ? 'text-purple-400 font-semibold' : ''
                }`}
              >
                <span>Store Catalog</span>
              </Link>
              <a
                href="#featured"
                className="hover:text-white transition"
              >
                Featured Drop
              </a>
              {user && !isAdmin && (
                <Link
                  to="/my-orders"
                  className={`hover:text-white transition flex items-center gap-1.5 ${
                    location.pathname === '/my-orders' ? 'text-purple-400 font-semibold' : ''
                  }`}
                >
                  <Package className="w-4 h-4 text-purple-400" />
                  <span>My Orders</span>
                </Link>
              )}
            </nav>

            {/* Right Action Bar */}
            <div className="flex items-center gap-3">
              {/* Admin Portal Gateway Button */}
              <button
                onClick={handleAdminClick}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-purple-500/30 text-purple-300 hover:bg-purple-950/40 hover:border-purple-400 hover:text-white transition shadow-sm"
                title={isAdmin ? 'Go to Admin Control Center' : 'Access Admin Login'}
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>{isAdmin ? 'Admin Panel' : 'Admin Login'}</span>
              </button>

              {/* Customer Account / Sign In */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-[10px] font-bold text-white flex items-center justify-center">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 py-2 rounded-xl glass-panel bg-slate-900/95 border border-slate-800 shadow-2xl z-50 animate-fade-in"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-800/80">
                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-purple-500/20 text-purple-300">
                          {user.role}
                        </span>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-purple-300 hover:bg-slate-800/60 transition"
                        >
                          <Shield className="w-4 h-4 text-purple-400" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      {!isAdmin && (
                        <Link
                          to="/my-orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/60 transition"
                        >
                          <Package className="w-4 h-4 text-slate-400" />
                          <span>Order History</span>
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900/80 transition"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Customer Sign In</span>
                </button>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-300 hover:bg-purple-600/20 hover:border-purple-500/40 hover:text-white transition group"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[11px] font-extrabold flex items-center justify-center shadow-lg shadow-purple-600/40 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-900 font-medium"
            >
              Store Catalog
            </Link>
            {user && !isAdmin && (
              <Link
                to="/my-orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-900 font-medium"
              >
                My Orders
              </Link>
            )}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAdminClick();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold bg-purple-900/30 border border-purple-500/30 text-purple-300"
              >
                <Shield className="w-4 h-4 text-purple-400" />
                <span>{isAdmin ? 'Admin Dashboard' : 'Admin Portal Login'}</span>
              </button>
              {!user && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-medium bg-slate-900 text-slate-300"
                >
                  Customer Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal triggered from navbar */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {}}
      />
    </>
  );
}

