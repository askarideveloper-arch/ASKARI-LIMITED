import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  X,
  Search,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './HomeView';

export const ShopView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    setSelectedProductId,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isWishlisted,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    selectedCategorySlug
      ? categories.find((c) => c.slug === selectedCategorySlug)?.name || 'all'
      : 'all'
  );
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'best-selling' | 'rating'>('featured');

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // Price range
    result = result.filter((p) => p.salePrice <= maxPrice);

    // Stock
    if (inStockOnly) {
      result = result.filter((p) => p.stockQuantity > 0 && p.isAvailable);
    }

    // Featured
    if (featuredOnly) {
      result = result.filter((p) => p.isFeatured);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.salePrice - b.salePrice);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.salePrice - a.salePrice);
    } else if (sortBy === 'best-selling') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, searchQuery, maxPrice, inStockOnly, featuredOnly, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedCategorySlug(null);
    setMaxPrice(30000);
    setInStockOnly(false);
    setFeaturedOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const openProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <button
              onClick={() => setCurrentView('home')}
              className="hover:text-emerald-800"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Shop Catalog</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {selectedCategory === 'all' ? 'All Products' : selectedCategory}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Showing {filteredProducts.length} items with Cash on Delivery nationwide.
              </p>
            </div>

            {/* Filter Toggle on Mobile & Sort Selector */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-stone-700 shadow-xs"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                <span className="hidden sm:inline text-stone-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-hidden focus:border-emerald-700 shadow-xs"
                >
                  <option value="featured">Featured First</option>
                  <option value="best-selling">Best Sellers</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs shrink-0">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <span className="font-bold text-sm text-stone-900">Filters</span>
              <button
                onClick={clearFilters}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="py-4 border-b border-stone-100">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2.5">
                Categories
              </span>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span>{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span>{products.filter((p) => p.category === cat.name).length}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="py-4 border-b border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Max Price
                </span>
                <span className="text-xs font-bold text-emerald-900">
                  Rs. {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="30000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                <span>Rs. 1,000</span>
                <span>Rs. 30,000+</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="py-4 space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-700"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => setFeaturedOnly(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-700"
                />
                <span>Featured Collection</span>
              </label>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 mx-auto flex items-center justify-center mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900">No products match your criteria</h3>
                <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                  Try adjusting your price range, searching for different keywords, or resetting filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
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
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="font-bold text-sm text-stone-900">Filter Products</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-md text-stone-500 hover:bg-stone-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="py-4 border-b border-stone-100">
                <span className="text-xs font-bold uppercase text-stone-700 block mb-2">Category</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="py-4 border-b border-stone-100">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Max Price:</span>
                  <span className="text-emerald-900">Rs. {maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="30000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-emerald-800"
                />
              </div>

              {/* In Stock */}
              <div className="py-4 space-y-3 text-xs">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-emerald-800"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                    className="rounded text-emerald-800"
                  />
                  <span>Featured Items</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex gap-2">
              <button
                onClick={clearFilters}
                className="flex-1 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 rounded-lg bg-emerald-800 text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileFilterOpen(false)} />
        </div>
      )}
    </div>
  );
};
