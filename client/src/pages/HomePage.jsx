import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import AuthModal from '../components/AuthModal';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState(['All', 'Electronics', 'Accessories', 'Apparel', 'Home & Living']);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onAuthSuccessCallback, setOnAuthSuccessCallback] = useState(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchTerm.trim()) params.keyword = searchTerm.trim();
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (sortBy === 'price-asc') params.sort = 'price-asc';
        if (sortBy === 'price-desc') params.sort = 'price-desc';
        if (sortBy === 'rating') params.sort = 'rating';

        const res = await axios.get('/api/products', { params });
        setProducts(res.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, sortBy]);

  // Fetch dynamic categories
  useEffect(() => {
    axios
      .get('/api/products/categories')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.log('Using default categories'));
  }, []);

  const handleRequireAuth = (callback) => {
    setOnAuthSuccessCallback(() => callback);
    setAuthModalOpen(true);
  };

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section with animated aesthetic */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Next-Gen MERN E-Commerce Architecture</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span className="text-slate-400">Standard Luxury Design</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] font-['Outfit']">
          Engineered Aesthetics for the{' '}
          <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
            Modern Mind.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Explore artisanal tech, ergonomic desk gear, and everyday lifestyle essentials. Customers can freely browse and curate their cart; sign in or register upon checkout.
        </p>

        {/* Quick CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#catalog"
            className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#featured"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/80 transition"
          >
            Featured Releases
          </a>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Flame className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Drops</h2>
              <p className="text-xs text-slate-400">Hand-curated standout pieces for this season</p>
            </div>
          </div>
          <span className="text-xs text-purple-400 font-semibold hidden sm:inline-flex items-center gap-1">
            Top Rated Selection
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onRequireAuth={handleRequireAuth}
            />
          ))}
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog" className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/[0.08]">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Complete Store Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Showing {products.length} refined items ready for delivery
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500 transition cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filters Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-900/40 border border-slate-800 p-4 animate-pulse space-y-4"
              >
                <div className="aspect-[4/3] bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
                <div className="h-6 bg-slate-800 rounded w-1/3 pt-2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-slate-800 p-8">
            <PackageCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No products found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              We couldn't find any products matching "{searchTerm}". Try clearing your search filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/40 border border-purple-500/30 hover:bg-purple-900/40 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onRequireAuth={handleRequireAuth}
              />
            ))}
          </div>
        )}
      </section>

      {/* Authentication Modal triggered when customer tries to buy */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          if (onAuthSuccessCallback) {
            onAuthSuccessCallback();
          }
        }}
        message="Please sign in or create an account to proceed with your purchase."
      />
    </div>
  );
}

