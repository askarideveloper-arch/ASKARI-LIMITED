import React, { useState } from 'react';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    shippingFee,
    cartTotal,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    setCurrentView,
    settings,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [applying, setApplying] = useState(false);

  const amountNeededForFreeShipping = Math.max(
    0,
    settings.freeShippingThreshold - cartSubtotal
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / settings.freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setApplying(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponInput.trim());
    setApplying(false);

    if (res.success) {
      setCouponMsg({ text: res.message, isError: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-stone-50 text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-5 border border-emerald-100 shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-sm">
          Looks like you haven't added any items to your bag yet. Explore our top Pakistani collection now.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-6 px-7 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center gap-2"
        >
          <span>Explore Shop</span>
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
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              You have {cart.reduce((sum, i) => sum + i.quantity, 0)} items in your basket
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Meter */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-stone-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-800" />
                  {amountNeededForFreeShipping === 0 ? (
                    <span className="text-emerald-800 font-extrabold">
                      🎉 Congratulations! You have qualified for FREE Express Delivery!
                    </span>
                  ) : (
                    <span>
                      Add{' '}
                      <strong className="text-emerald-900">
                        Rs. {amountNeededForFreeShipping.toLocaleString()}
                      </strong>{' '}
                      more to get FREE Express Shipping!
                    </span>
                  )}
                </span>
                <span className="text-emerald-900">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-800 rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Item Rows */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden divide-y divide-stone-100">
              {cart.map((item, idx) => (
                <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-stone-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                      {item.product.category}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 truncate">
                      {item.product.name}
                    </h3>

                    {/* Selected Variant Tags */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1 text-xs text-stone-500">
                      {item.selectedSize && (
                        <span className="bg-stone-100 px-2 py-0.5 rounded text-[11px] font-medium text-stone-700">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="bg-stone-100 px-2 py-0.5 rounded text-[11px] font-medium text-stone-700">
                          Color: {item.selectedColor}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 text-xs font-extrabold text-emerald-900">
                      Rs. {item.product.salePrice.toLocaleString()}{' '}
                      <span className="text-[11px] font-normal text-stone-500">each</span>
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-2xs">
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                        className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 rounded-l-xl text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                        className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 rounded-r-xl text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="text-sm font-extrabold text-stone-900 block">
                        Rs. {(item.product.salePrice * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(idx)}
                      className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Coupon Code Input */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
                <Tag className="w-4 h-4 text-emerald-800" />
                <span>Discount Promo Code</span>
              </span>

              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-emerald-950 block">
                      Code: {appliedCoupon.code}
                    </span>
                    <span className="text-emerald-700 text-[11px]">
                      Discount: Rs. {discountAmount.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 font-bold underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. ASKARI10"
                      className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs uppercase text-stone-900 focus:outline-hidden focus:border-emerald-700"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      {applying ? 'Applying...' : 'Apply'}
                    </button>
                  </div>

                  {couponMsg && (
                    <p
                      className={`text-[11px] font-medium ${
                        couponMsg.isError ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {couponMsg.text}
                    </p>
                  )}

                  <p className="text-[11px] text-stone-600 italic">
                    Try using code <strong className="text-stone-800">ASKARI10</strong> or <strong className="text-stone-800">WELCOME500</strong>
                  </p>
                </form>
              )}
            </div>

            {/* Financial Summary */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100">
                Order Summary
              </h3>

              <div className="py-4 space-y-2.5 text-xs text-stone-600 border-b border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900">
                    Rs. {cartSubtotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Coupon Savings:</span>
                    <span>-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Nationwide Shipping:</span>
                  <span className="font-semibold text-stone-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-800 font-bold">FREE</span>
                    ) : (
                      `Rs. ${shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 flex items-baseline justify-between">
                <span className="text-sm font-bold text-stone-900">Total (PKR):</span>
                <span className="text-2xl font-extrabold text-emerald-950">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>

              <button
                id="cart-checkout-btn"
                onClick={() => {
                  setCurrentView('checkout');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-6 w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                  <span>100% Cash on Delivery Supported</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Delivery in 2-4 working days across Pakistan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
