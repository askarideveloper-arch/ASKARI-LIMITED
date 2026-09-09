import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { pakistaniCities, pakistaniProvinces } from '../../data/initialData';
import { PaymentMethod } from '../../types';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    shippingFee,
    cartTotal,
    discountAmount,
    createOrder,
    setCurrentView,
    settings,
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(pakistaniCities[0] || 'Karachi');
  const [province, setProvince] = useState(pakistaniProvinces[0] || 'Punjab');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If cart is empty, redirect to shop
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-stone-50 text-center">
        <p className="text-stone-600 mb-4">No items in your cart to checkout.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl font-bold text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic validation
    if (!fullName.trim() || !phoneNumber.trim() || !address.trim() || !city || !province) {
      setErrorMessage('Please fill in all required shipping fields.');
      return;
    }

    if (
      (paymentMethod === 'EasyPaisa' ||
        paymentMethod === 'JazzCash' ||
        paymentMethod === 'Bank Transfer') &&
      !transactionId.trim()
    ) {
      setErrorMessage(
        `Please enter the Transaction ID / Reference number received from ${paymentMethod}.`
      );
      return;
    }

    setSubmitting(true);

    const res = await createOrder({
      customer: {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber.trim() || phoneNumber.trim(),
        email: email.trim(),
        address: address.trim(),
        city,
        province,
        postalCode: postalCode.trim(),
        notes: notes.trim(),
      },
      paymentMethod,
      transactionId: transactionId.trim() || undefined,
    });

    setSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Checkout & Shipping
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Complete your shipping address for fast nationwide courier delivery across Pakistan.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Contact Details */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
                <h2 className="text-base font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <span>Contact Information</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Muhammad Tariq Khan"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Phone Number (For Courier Call) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="03001234567"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      WhatsApp Number (For Tracking Updates)
                    </label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="03001234567"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tariq@gmail.com"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
                <h2 className="text-base font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <span>Delivery Address in Pakistan</span>
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Complete Street Address (House/Shop #, Street, Sector/Area) *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House # 45, Street 12, Sector F-10/2"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        City *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                      >
                        {pakistaniCities.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Province *
                      </label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                      >
                        {pakistaniProvinces.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-700 block mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 54000"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Delivery Instructions / Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Near Al-Fateh Mall, call on arrival"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
                <h2 className="text-base font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <span>Select Payment Method</span>
                </h2>

                <div className="space-y-3">
                  {/* Option 1: Cash on Delivery */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-emerald-800 bg-emerald-50/70 ring-1 ring-emerald-800'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="mt-1 accent-emerald-800"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-800" />
                          <span>Cash on Delivery (COD)</span>
                        </span>
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        Pay cash directly to the TCS / Leopards courier rider when your package arrives at your doorstep. No advance fee.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: EasyPaisa */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'EasyPaisa'
                        ? 'border-emerald-800 bg-emerald-50/70 ring-1 ring-emerald-800'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'EasyPaisa'}
                      onChange={() => setPaymentMethod('EasyPaisa')}
                      className="mt-1 accent-emerald-800"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-emerald-600" />
                          <span>EasyPaisa Mobile Wallet</span>
                        </span>
                        <span className="text-[11px] font-semibold text-stone-500">
                          Instant Transfer
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        Send payment directly from your EasyPaisa app.
                      </p>

                      {paymentMethod === 'EasyPaisa' && (
                        <div className="mt-3 p-3 rounded-xl bg-white border border-emerald-200 text-xs space-y-2">
                          <p className="font-semibold text-emerald-950">
                            Transfer <strong>Rs. {cartTotal.toLocaleString()}</strong> to:
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700 bg-stone-50 p-2.5 rounded-lg">
                            <div>
                              <span className="text-stone-500 block">Account Title:</span>
                              <strong className="text-stone-900">ASKARI LIMITED</strong>
                            </div>
                            <div>
                              <span className="text-stone-500 block">EasyPaisa Mobile #:</span>
                              <strong className="text-stone-900">{settings.whatsappNumber}</strong>
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-stone-800 block mb-1">
                              Enter EasyPaisa Transaction ID (TID) from SMS *:
                            </label>
                            <input
                              type="text"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              placeholder="e.g. 19284729103"
                              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 3: JazzCash */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'JazzCash'
                        ? 'border-emerald-800 bg-emerald-50/70 ring-1 ring-emerald-800'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'JazzCash'}
                      onChange={() => setPaymentMethod('JazzCash')}
                      className="mt-1 accent-emerald-800"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-rose-600" />
                          <span>JazzCash Mobile Wallet</span>
                        </span>
                        <span className="text-[11px] font-semibold text-stone-500">
                          Instant Transfer
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        Send payment directly from your JazzCash app.
                      </p>

                      {paymentMethod === 'JazzCash' && (
                        <div className="mt-3 p-3 rounded-xl bg-white border border-rose-200 text-xs space-y-2">
                          <p className="font-semibold text-stone-900">
                            Transfer <strong>Rs. {cartTotal.toLocaleString()}</strong> to:
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700 bg-stone-50 p-2.5 rounded-lg">
                            <div>
                              <span className="text-stone-500 block">Account Title:</span>
                              <strong className="text-stone-900">ASKARI LIMITED</strong>
                            </div>
                            <div>
                              <span className="text-stone-500 block">JazzCash Mobile #:</span>
                              <strong className="text-stone-900">{settings.whatsappNumber}</strong>
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-stone-800 block mb-1">
                              Enter JazzCash Transaction ID (TID) *:
                            </label>
                            <input
                              type="text"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              placeholder="e.g. 7839210492"
                              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 4: Direct Bank Transfer */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'Bank Transfer'
                        ? 'border-emerald-800 bg-emerald-50/70 ring-1 ring-emerald-800'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Bank Transfer'}
                      onChange={() => setPaymentMethod('Bank Transfer')}
                      className="mt-1 accent-emerald-800"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-cyan-700" />
                          <span>Direct Bank Transfer (Meezan / HBL)</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        Transfer to our official Pakistani corporate bank account.
                      </p>

                      {paymentMethod === 'Bank Transfer' && (
                        <div className="mt-3 p-3 rounded-xl bg-white border border-stone-200 text-xs space-y-2">
                          <div className="text-[11px] text-stone-700 bg-stone-50 p-2.5 rounded-lg space-y-1">
                            <p><strong>Bank:</strong> Meezan Bank Ltd (Islamic Banking)</p>
                            <p><strong>Account Title:</strong> ASKARI LIMITED PRIVATE</p>
                            <p><strong>IBAN:</strong> PK59MEZN0001092837465920</p>
                            <p><strong>Branch:</strong> Main Boulevard Gulberg III, Lahore</p>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-stone-800 block mb-1">
                              Enter Bank Reference / Transaction ID *:
                            </label>
                            <input
                              type="text"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              placeholder="e.g. FT2606894021"
                              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Review Sidebar (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
                <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100">
                  Review Your Order ({cart.length} items)
                </h3>

                {/* Items preview list */}
                <div className="py-3 max-h-60 overflow-y-auto divide-y divide-stone-100">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center gap-3 text-xs">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg bg-stone-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-stone-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Qty: {item.quantity} {item.selectedSize ? `| ${item.selectedSize}` : ''}
                        </p>
                      </div>
                      <span className="font-bold text-stone-900">
                        Rs. {(item.product.salePrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-stone-900">
                      Rs. {cartSubtotal.toLocaleString()}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-semibold">
                      <span>Discount:</span>
                      <span>-Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Charges:</span>
                    <span className="font-semibold text-stone-900">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-800 font-bold">FREE (Promotion)</span>
                      ) : (
                        `Rs. ${shippingFee.toLocaleString()}`
                      )}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 mt-3 border-t border-stone-200 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-stone-900">Grand Total (PKR):</span>
                  <span className="text-2xl font-extrabold text-emerald-950">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>

                {/* Complete Order Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-400 text-white font-extrabold text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-emerald-300" />
                  <span>
                    {submitting
                      ? 'Processing Order...'
                      : `Place Order (Rs. ${cartTotal.toLocaleString()})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-stone-400 text-center mt-3">
                  By clicking Place Order, you confirm your order details and agreement to our 7-day inspection return policy.
                </p>
              </div>

              {/* Safety Badges */}
              <div className="p-4 bg-emerald-950/90 text-emerald-100 rounded-2xl text-xs space-y-2 border border-emerald-900">
                <div className="flex items-center gap-2 font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>100% Genuine Pakistani Delivery Guarantee</span>
                </div>
                <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                  Every order is packaged with security seals and shipped with automated parcel tracking. Support is available anytime on WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
