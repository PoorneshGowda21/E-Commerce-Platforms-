import React from 'react';
import { Star, ShoppingBag, ArrowUpRight, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onRequireAuth }) {
  const { addToCart, openCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product, 1);

    if (!isAuthenticated) {
      if (onRequireAuth) {
        onRequireAuth(() => {
          navigate('/checkout');
        });
      }
    } else {
      navigate('/checkout');
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="group relative flex flex-col rounded-2xl glass-card overflow-hidden cursor-pointer"
    >
      {/* Product Image Wrapper */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900/80">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-lg bg-slate-950/70 backdrop-blur-md text-purple-300 border border-purple-500/20">
            {product.category}
          </span>
        </div>

        {/* Quick Buy floating action on hover */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-purple-600 text-white backdrop-blur-md border border-white/10 transition-all flex items-center justify-center gap-1.5 shadow-lg"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all flex items-center justify-center gap-1 shadow-lg shadow-purple-600/30"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-semibold text-slate-200">{product.rating || 4.8}</span>
            <span className="text-[11px] text-slate-500">({product.reviewsCount || 24})</span>
          </div>

          <span
            className={`text-[11px] font-medium ${
              product.stock > 5 ? 'text-emerald-400' : product.stock > 0 ? 'text-amber-400' : 'text-rose-400'
            }`}
          >
            {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
          </span>
        </div>

        <h3 className="font-bold text-white text-base leading-snug group-hover:text-purple-300 transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-800/80">
          <div>
            <span className="text-xs text-slate-500 block">Price</span>
            <span className="text-lg font-extrabold text-white">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <div className="w-8 h-8 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-purple-600 group-hover:border-purple-500 transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

