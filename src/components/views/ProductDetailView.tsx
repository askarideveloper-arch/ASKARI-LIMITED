import React, { useState } from 'react';
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Heart,
  ShoppingCart,
  PhoneCall,
  Share2,
  ChevronRight,
  Package,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './HomeView';

export const ProductDetailView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isWishlisted,
    settings,
    reviews,
    submitReview,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes?.length > 0 ? product.sizes[0] : ''
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors?.length > 0 ? product.colors[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState(false);

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-stone-50">
        <div className="text-center">
          <p className="text-stone-600 mb-4">Product not found.</p>
          <button
            onClick={() => setCurrentView('shop')}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Reviews for this specific product
  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.status === 'Approved'
  );

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    setReviewSubmitting(true);
    await submitReview({
      productId: product.id,
      productName: product.name,
      customerName: reviewName.trim(),
      customerCity: reviewCity.trim() || 'Pakistan',
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewSubmitting(false);
    setReviewSubmitted(true);
    setReviewName('');
    setReviewCity('');
    setReviewComment('');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6 flex-wrap">
          <button onClick={() => setCurrentView('home')} className="hover:text-emerald-800">
            Home
          </button>
          <span>/</span>
          <button onClick={() => setCurrentView('shop')} className="hover:text-emerald-800">
            {product.category}
          </button>
          <span>/</span>
          <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Main Container */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Gallery Column (5 cols on lg) */}
            <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] shrink-0 pb-2 sm:pb-0">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-emerald-800 ring-2 ring-emerald-800/20'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1 relative aspect-square bg-stone-100 rounded-2xl overflow-hidden border border-stone-100">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {product.discountPercentage > 0 && (
                  <span className="absolute top-4 left-4 bg-rose-600 text-white font-bold text-xs px-3 py-1 rounded-md shadow-xs">
                    SAVE {product.discountPercentage}%
                  </span>
                )}

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 shadow-md transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted(product.id) ? 'fill-rose-600 text-rose-600' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Details Column (6 cols on lg) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* SKU and Category */}
                <div className="flex items-center justify-between gap-2 text-xs font-semibold text-stone-500 mb-2">
                  <span className="uppercase tracking-wider text-emerald-800 font-bold">
                    {product.category}
                  </span>
                  <span>SKU: {product.sku}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Stock Badges */}
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-sm font-bold text-stone-900">{product.rating}</span>
                    <span className="text-xs text-stone-500">
                      ({product.reviewCount} customer reviews)
                    </span>
                  </div>

                  <span className="text-stone-300">|</span>

                  {product.stockQuantity > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        In Stock {product.stockQuantity < 10 ? `(${product.stockQuantity} left!)` : ''}
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Out of Stock</span>
                    </span>
                  )}
                </div>

                {/* Price Box */}
                <div className="mt-5 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-emerald-950">
                    Rs. {product.salePrice.toLocaleString()}
                  </span>
                  {product.originalPrice > product.salePrice && (
                    <span className="text-sm font-semibold text-stone-400 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      Save Rs. {(product.originalPrice - product.salePrice).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="mt-5 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Size Variants */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
                      <span>Select Size:</span>
                      <span className="text-stone-500 font-normal">{selectedSize}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            selectedSize === s
                              ? 'border-emerald-800 bg-emerald-800 text-white shadow-xs'
                              : 'border-stone-300 bg-white text-stone-800 hover:border-stone-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Variants */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-2">
                      <span>Select Color / Edition:</span>
                      <span className="text-stone-500 font-normal">{selectedColor}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            selectedColor === c
                              ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-800'
                              : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-xs font-bold text-stone-800">Quantity:</span>
                  <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-2xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-l-xl font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stockQuantity || 99, q + 1))
                      }
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-r-xl font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions & Buttons */}
              <div className="mt-8 pt-6 border-t border-stone-100 space-y-3">
                {addedToast && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      Added to your shopping cart!
                    </span>
                    <button
                      onClick={() => setCurrentView('cart')}
                      className="underline font-bold text-emerald-950"
                    >
                      View Cart &rarr;
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity <= 0}
                    className="w-full py-3.5 px-5 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-xs font-bold tracking-wide transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stockQuantity <= 0}
                    className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-stone-300 text-stone-950 text-xs font-extrabold tracking-wide transition-all shadow-md hover:shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Buy Now (Cash on Delivery)</span>
                  </button>
                </div>

                {/* Pakistani Shopping Guarantees */}
                <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-stone-600">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>2-4 Day TCS Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Pay Cash on Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>7-Day Return Policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews & Write Review Tab */}
        <div className="mt-12 bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                Customer Reviews
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Verified reviews from customers across Pakistan.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-stone-900">{product.rating}</span>
              <span className="text-xs text-stone-500">({product.reviewCount} total)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            {/* Reviews List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {productReviews.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200/80">
                  <MessageSquare className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-stone-800">No reviews yet for this product</p>
                  <p className="text-xs text-stone-500 mt-1">
                    Be the first Pakistani customer to leave a review!
                  </p>
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-stone-900">
                          {rev.customerName}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          ({rev.customerCity}, PK)
                        </span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-amber-400' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed">"{rev.comment}"</p>
                    <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-between">
                      <span>{rev.date}</span>
                      <span className="text-emerald-700 font-semibold">Verified Purchase</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Form (5 cols) */}
            <div className="lg:col-span-5 bg-stone-50 p-6 rounded-2xl border border-stone-200/80">
              <h3 className="text-sm font-bold text-stone-900 mb-1">Write a Review</h3>
              <p className="text-xs text-stone-500 mb-4">
                Share your experience to help fellow shoppers across Pakistan.
              </p>

              {reviewSubmitted ? (
                <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold">
                  Thank you! Your verified review has been published.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Your Rating:
                    </label>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating ? 'fill-amber-400' : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Your Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Asad Siddiqui"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      City in Pakistan:
                    </label>
                    <input
                      type="text"
                      value={reviewCity}
                      onChange={(e) => setReviewCity(e.target.value)}
                      placeholder="e.g. Lahore, Karachi, Islamabad"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Review Comments:
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Describe the fabric, build quality, delivery speed..."
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    {reviewSubmitting ? 'Posting Review...' : 'Submit Verified Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mb-6 tracking-tight">
              Related Products You May Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onOpen={() => {
                    setSelectedProductId(rel.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onAddToCart={() => addToCart(rel, 1)}
                  onToggleWishlist={() => toggleWishlist(rel.id)}
                  isWishlisted={isWishlisted(rel.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
