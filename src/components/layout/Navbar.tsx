import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  PackageCheck,
  ShieldCheck,
  PhoneCall,
  User,
  ChevronDown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Navbar: React.FC = () => {
  const {
    settings,
    currentView,
    setCurrentView,
    cartCount,
    wishlist,
    searchQuery,
    setSearchQuery,
    categories,
    setSelectedCategorySlug,
    setSelectedProductId,
    products,
    isAdminAuthenticated,
    adminLogout,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Filtered search preview
  const searchResults =
    searchQuery.trim().length > 1
      ? products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5)
      : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('shop');
      setSearchFocused(false);
    }
  };

  const navigateToCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setCurrentView('shop');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{settings.announcementText}</span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-emerald-200/90 text-xs">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => setCurrentView('my-orders')}>
              <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Track Live Order</span>
            </span>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                'Hi ASKARI LIMITED, I need assistance with an order.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: {settings.whatsappNumber}</span>
            </a>
            {isAdminAuthenticated && (
              <div className="flex items-center gap-2 pl-3 border-l border-emerald-800">
                <span className="bg-emerald-800 text-white px-2 py-0.5 rounded text-[11px] font-semibold">
                  Admin Logged In
                </span>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="text-amber-300 hover:text-amber-200 font-semibold underline text-[11px]"
                >
                  Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <div
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer flex items-center gap-3 select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-950 flex items-center justify-center text-amber-400 font-extrabold text-xl shadow-md border border-amber-500/30">
              A
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-emerald-950 block leading-tight">
                {settings.storeName || 'ASKARI LIMITED'}
              </span>
              <span className="text-[10px] sm:text-[11px] tracking-widest uppercase font-semibold text-stone-700 block">
                {settings.tagline || "Pakistan's Online Store"}
              </span>
            </div>
          </div>

          {/* Desktop Search Bar with live search dropdown */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                placeholder="Search watches, kurtas, earbuds, air fryers, attar..."
                className="w-full bg-stone-100/90 border border-stone-300 rounded-full pl-11 pr-24 py-2.5 text-sm text-stone-900 placeholder:text-stone-700 focus:outline-hidden focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/20 transition-all"
              />
              <Search className="w-4 h-4 text-stone-600 absolute left-4 top-3.5 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold tracking-wide transition-colors"
              >
                Search
              </button>
            </form>

            {/* Live Autocomplete Suggestions */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200/80 overflow-hidden z-50">
                <div className="p-2 text-xs font-semibold uppercase tracking-wider text-stone-700 border-b border-stone-100 bg-stone-50/50">
                  Products matching "{searchQuery}"
                </div>
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onMouseDown={() => {
                      setSelectedProductId(item.id);
                      setCurrentView('product-detail');
                    }}
                    className="p-3 hover:bg-stone-50 flex items-center gap-3 cursor-pointer transition-colors border-b border-stone-100 last:border-0"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate">{item.name}</p>
                      <p className="text-xs text-stone-700">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-800">
                        Rs. {item.salePrice.toLocaleString()}
                      </p>
                      {item.originalPrice > item.salePrice && (
                        <p className="text-xs text-stone-600 line-through">
                          Rs. {item.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist Icon */}
            <button
              id="header-wishlist-btn"
              onClick={() => setCurrentView('wishlist')}
              className="relative p-2.5 rounded-full text-stone-700 hover:text-emerald-800 hover:bg-stone-100 transition-colors"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Track Orders Icon */}
            <button
              id="header-my-orders-btn"
              onClick={() => setCurrentView('my-orders')}
              className="p-2.5 rounded-full text-stone-700 hover:text-emerald-800 hover:bg-stone-100 transition-colors hidden sm:flex items-center"
              title="Track Orders"
            >
              <PackageCheck className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setCurrentView('cart')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white transition-all shadow-xs"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs font-bold sm:inline">{cartCount}</span>
              <span className="hidden sm:inline text-xs font-medium border-l border-emerald-700 pl-2">
                Cart
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products across Pakistan..."
              className="w-full bg-stone-100 border border-stone-300 rounded-full pl-10 pr-20 py-2 text-xs text-stone-900 placeholder:text-stone-700 focus:outline-hidden focus:border-emerald-700"
            />
            <Search className="w-4 h-4 text-stone-600 absolute left-3.5 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 rounded-full bg-emerald-800 text-white text-[11px] font-medium"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Navigation Bar / Category Strip */}
      <nav className="hidden md:block bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 text-xs font-semibold tracking-wide">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setCurrentView('home')}
                className={`py-1.5 transition-colors ${
                  currentView === 'home'
                    ? 'text-emerald-800 border-b-2 border-emerald-800'
                    : 'text-stone-700 hover:text-emerald-800'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  setSelectedCategorySlug(null);
                  setCurrentView('shop');
                }}
                className={`py-1.5 transition-colors ${
                  currentView === 'shop' && !currentView.includes('categories')
                    ? 'text-emerald-800 border-b-2 border-emerald-800'
                    : 'text-stone-700 hover:text-emerald-800'
                }`}
              >
                Shop All
              </button>
              <button
                onClick={() => setCurrentView('categories')}
                className={`py-1.5 transition-colors ${
                  currentView === 'categories'
                    ? 'text-emerald-800 border-b-2 border-emerald-800'
                    : 'text-stone-700 hover:text-emerald-800'
                }`}
              >
                Categories
              </button>

              {/* Dynamic Categories */}
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigateToCategory(cat.slug)}
                  className="py-1.5 text-stone-700 hover:text-emerald-800 transition-colors"
                >
                  {cat.name}
                </button>
              ))}

              <button
                onClick={() => setCurrentView('about')}
                className="py-1.5 text-stone-700 hover:text-emerald-800 transition-colors"
              >
                About Us
              </button>
              <button
                onClick={() => setCurrentView('contact')}
                className="py-1.5 text-stone-700 hover:text-emerald-800 transition-colors"
              >
                Contact
              </button>
            </div>

            <div className="flex items-center gap-3 text-stone-600">
              <span className="flex items-center gap-1 text-emerald-800 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Cash on Delivery Available</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-900 text-amber-400 font-bold flex items-center justify-center">
                    A
                  </div>
                  <span className="font-extrabold text-stone-900">ASKARI LIMITED</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-stone-500 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-1">
                <button
                  onClick={() => {
                    setCurrentView('home');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-100"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setSelectedCategorySlug(null);
                    setCurrentView('shop');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-100"
                >
                  Shop All Products
                </button>
                <button
                  onClick={() => {
                    setCurrentView('categories');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-100"
                >
                  Browse Categories
                </button>

                <div className="my-2 border-t border-stone-100 pt-2">
                  <p className="px-3 text-xs font-bold uppercase text-stone-700 tracking-wider mb-1">
                    Featured Categories
                  </p>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => navigateToCategory(cat.slug)}
                      className="w-full text-left px-3 py-2 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                <div className="my-2 border-t border-stone-100 pt-2">
                  <button
                    onClick={() => {
                      setCurrentView('my-orders');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-100 flex items-center justify-between"
                  >
                    <span>Track My Order</span>
                    <PackageCheck className="w-4 h-4 text-emerald-800" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('wishlist');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-100 flex items-center justify-between"
                  >
                    <span>My Wishlist ({wishlist.length})</span>
                    <Heart className="w-4 h-4 text-rose-600" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('about');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-100"
                  >
                    About Us
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('contact');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-stone-800 hover:bg-stone-100"
                  >
                    Contact & Support
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200">
              <p className="text-xs text-stone-700">Need help with an order?</p>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                className="mt-1 flex items-center justify-center gap-2 w-full py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                WhatsApp: {settings.whatsappNumber}
              </a>

              {/* Admin Portal access link */}
              <div className="mt-3 pt-3 border-t border-stone-200 text-center">
                <button
                  onClick={() => {
                    setCurrentView('admin-login');
                    setMobileMenuOpen(false);
                  }}
                  className="text-stone-600 hover:text-stone-800 text-[11px] font-medium underline"
                >
                  Store Staff & Admin Portal
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
