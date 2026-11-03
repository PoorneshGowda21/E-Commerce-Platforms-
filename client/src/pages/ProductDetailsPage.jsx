import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import {
  Star,
  ShoppingBag,
  Zap,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
} from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        setActiveImage(res.data.image);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-slate-800 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-800 rounded w-3/4" />
            <div className="h-5 bg-slate-800 rounded w-1/4" />
            <div className="h-24 bg-slate-800 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">The requested product could not be found.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    } else {
      navigate('/checkout');
    }
  };

  const gallery = [product.image, ...(product.images || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden glass-card bg-slate-900 border border-slate-800">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-purple-300 border border-purple-500/20">
              {product.category}
            </span>
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === imgUrl ? 'border-purple-500' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Action */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="font-bold text-sm text-white">{product.rating || 4.8}</span>
            </div>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">{product.reviewsCount || 24} Verified Ratings</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit'] mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 mb-6">
            ${Number(product.price).toFixed(2)}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/80 p-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-white">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock || 10, qty + 1))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-slate-400">
              ({product.stock} units available)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-500/60 transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Add to Shopping Bag</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Instant Buy Now</span>
            </button>
          </div>

          {/* Value Props */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Truck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Standard delivery within 2-4 business days. Free shipping on orders over $100.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Authentic craftsmanship with 1-Year manufacturer warranty included.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Hassle-free 30-day exchange and return policy.</span>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => navigate('/checkout')}
        message="Sign in or register to proceed to order checkout."
      />
    </div>
  );
}

