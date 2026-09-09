import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './HomeView';

export const WishlistView: React.FC = () => {
  const {
    wishlist,
    products,
    setCurrentView,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useStore();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-stone-50 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-sm">
          Save your favorite products to buy later or monitor for special price drops.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-6 px-6 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center gap-2"
        >
          <span>Explore Products</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-stone-200 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              My Saved Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              You have saved {wishlistedProducts.length} items
            </p>
          </div>
          <button
            onClick={() => setCurrentView('shop')}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-bold"
          >
            Continue Shopping &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => {
                setSelectedProductId(product.id);
                setCurrentView('product-detail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddToCart={() => addToCart(product, 1)}
              onToggleWishlist={() => toggleWishlist(product.id)}
              isWishlisted={isWishlisted(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
