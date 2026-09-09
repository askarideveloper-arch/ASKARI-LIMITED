import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Star,
  Flame,
  Heart,
  ShoppingCart,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const HomeView: React.FC = () => {
  const {
    settings,
    products,
    categories,
    setCurrentView,
    setSelectedProductId,
    setSelectedCategorySlug,
    addToCart,
    toggleWishlist,
    isWishlisted,
    reviews,
  } = useStore();

  // Simple deal countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 35,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredCategories = categories.filter((c) => c.isActive).slice(0, 6);
  const bestSellers = products.filter((p) => p.isBestSeller && p.isAvailable).slice(0, 4);
  const newArrivals = products.slice(0, 4);
  const flashDeals = products.filter((p) => p.discountPercentage >= 30).slice(0, 3);
  const customerReviews = reviews.filter((r) => r.status === 'Approved').slice(0, 4);

  const openProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-900 text-white">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
          <img
            src={settings.heroImageUrl}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 text-xs font-semibold tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.heroBadge || 'PAKISTAN TRUSTED ONLINE STORE'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              {settings.heroHeadline || 'Experience Luxury Shopping Across Pakistan'}
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-sm sm:text-base lg:text-lg text-stone-300 leading-relaxed max-w-2xl font-normal">
              {settings.heroSubheadline}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                id="hero-shop-now-btn"
                onClick={() => {
                  setSelectedCategorySlug(null);
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-amber-500/20 flex items-center gap-2 group cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-categories-btn"
                onClick={() => {
                  setCurrentView('categories');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white font-semibold text-sm border border-stone-700 transition-colors cursor-pointer"
              >
                Browse Categories
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="mt-10 pt-8 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-medium text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cash on Delivery (COD)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Express 2-4 Days Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>7-Day Hassle-Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 tracking-tight">
              Featured Categories
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentView('categories');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="group cursor-pointer rounded-2xl bg-white p-3 border border-stone-200 hover:border-emerald-700/50 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[11px] text-stone-700 mt-0.5 font-medium">
                {cat.itemCount > 0 ? `${cat.itemCount}+ Items` : 'Explore'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Customer Favorites
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 tracking-tight">
              Best Selling Products
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentView('shop');
            }}
            className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>See More</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => openProduct(product.id)}
              onAddToCart={() => addToCart(product, 1)}
              onToggleWishlist={() => toggleWishlist(product.id)}
              isWishlisted={isWishlisted(product.id)}
            />
          ))}
        </div>
      </section>

      {/* Special Offer / Flash Deals Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/30">
                <Clock className="w-3.5 h-3.5" />
                <span>LIMITED TIME FLASH SALE</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Up to 35% OFF on Premium Tech & Kurtas
              </h2>
              <p className="mt-2 text-sm text-stone-300">
                Enjoy huge price cuts on authentic watches, active noise cancellation earbuds, and pure Egyptian cotton apparel. Free nationwide shipping on orders over Rs. 3,000.
              </p>

              {/* Countdown */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex flex-col items-center bg-stone-900/90 border border-stone-700 px-3.5 py-2 rounded-xl min-w-[55px]">
                  <span className="text-lg sm:text-xl font-extrabold text-amber-400">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase text-stone-400 font-semibold">Hours</span>
                </div>
                <span className="text-xl font-bold text-stone-500">:</span>
                <div className="flex flex-col items-center bg-stone-900/90 border border-stone-700 px-3.5 py-2 rounded-xl min-w-[55px]">
                  <span className="text-lg sm:text-xl font-extrabold text-amber-400">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase text-stone-400 font-semibold">Mins</span>
                </div>
                <span className="text-xl font-bold text-stone-500">:</span>
                <div className="flex flex-col items-center bg-stone-900/90 border border-stone-700 px-3.5 py-2 rounded-xl min-w-[55px]">
                  <span className="text-lg sm:text-xl font-extrabold text-amber-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase text-stone-400 font-semibold">Secs</span>
                </div>
              </div>
            </div>

            {/* Quick Flash Deal Products Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              {flashDeals.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openProduct(item.id)}
                  className="bg-stone-900/80 hover:bg-stone-800/90 p-3 rounded-2xl border border-stone-700/60 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-28 object-cover rounded-xl mb-2"
                  />
                  <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">
                      Rs. {item.salePrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-rose-600 font-bold text-white">
                      -{item.discountPercentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Fresh Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 tracking-tight">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentView('shop');
            }}
            className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => openProduct(product.id)}
              onAddToCart={() => addToCart(product, 1)}
              onToggleWishlist={() => toggleWishlist(product.id)}
              isWishlisted={isWishlisted(product.id)}
            />
          ))}
        </div>
      </section>

      {/* Why Choose ASKARI LIMITED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Trust & Reliability
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 tracking-tight">
            Why Choose ASKARI LIMITED
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Built specifically for Pakistani shoppers with strict authenticity checks, doorstep verification, and responsive customer service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-700/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Fast Nationwide Delivery</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              We partner with TCS, Leopards & Trax to deliver within 2-4 working days across all Pakistani cities, tehsils, and towns.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-700/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">100% Cash on Delivery</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Shop with absolute peace of mind. Pay the courier driver only when the parcel arrives at your home or office.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-700/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">7-Day Easy Returns</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Received a damaged or incorrect size item? Get a prompt replacement or refund directly to your EasyPaisa, JazzCash, or bank.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-emerald-700/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">24/7 WhatsApp Support</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Have questions about sizing or parcel tracking? Connect with our dedicated Urdu/English support team instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 tracking-tight">
              Customer Reviews from Pakistan
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-600">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-stone-900">4.9 / 5.0</span>
            <span>Overall Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {customerReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-stone-700 italic leading-relaxed line-clamp-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-stone-900">{rev.customerName}</p>
                  <p className="text-[11px] text-stone-700">{rev.customerCity}, Pakistan</p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Reusable Product Card Component
export const ProductCard: React.FC<{
  product: Product;
  onOpen: () => void;
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  isWishlisted: boolean;
}> = ({ product, onOpen, onAddToCart, onToggleWishlist, isWishlisted }) => {
  return (
    <div className="group rounded-2xl bg-white border border-stone-200/90 hover:border-emerald-700/50 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden relative">
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.discountPercentage > 0 && (
          <span className="bg-rose-600 text-white font-bold text-[10px] tracking-wide px-2 py-0.5 rounded-md shadow-xs">
            -{product.discountPercentage}% OFF
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-amber-500 text-stone-950 font-bold text-[10px] tracking-wide px-2 py-0.5 rounded-md shadow-xs">
            BEST SELLER
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist();
        }}
        className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 backdrop-blur-xs hover:bg-white text-stone-600 hover:text-rose-600 shadow-xs transition-colors"
        title="Wishlist"
      >
        <Heart
          className={`w-4 h-4 ${
            isWishlisted ? 'fill-rose-600 text-rose-600' : ''
          }`}
        />
      </button>

      {/* Image Container */}
      <div
        onClick={onOpen}
        className="w-full aspect-square bg-stone-100 overflow-hidden cursor-pointer relative"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.stockQuantity < 10 && product.stockQuantity > 0 && (
          <div className="absolute bottom-2 left-2 right-2 bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-semibold text-center py-1 rounded-md">
            Only {product.stockQuantity} left in stock!
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider block mb-1">
            {product.category}
          </span>
          <h3
            onClick={onOpen}
            className="text-xs sm:text-sm font-bold text-stone-900 hover:text-emerald-800 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-stone-800">{product.rating}</span>
            <span className="text-[11px] text-stone-700 font-medium">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-900 block leading-tight">
              Rs. {product.salePrice.toLocaleString()}
            </span>
            {product.originalPrice > product.salePrice && (
              <span className="text-[11px] text-stone-600 line-through block">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
