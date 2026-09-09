import React from 'react';
import {
  CheckCircle,
  Package,
  Truck,
  PhoneCall,
  Printer,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderConfirmationView: React.FC = () => {
  const { placedOrder, settings, setCurrentView } = useStore();

  if (!placedOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-stone-50 text-center">
        <p className="text-stone-600 mb-4">No recent order found.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const whatsappTrackingMessage = encodeURIComponent(
    `Hello ASKARI LIMITED, I placed Order #${placedOrder.id} for Rs. ${placedOrder.totalAmount.toLocaleString()}. Please confirm parcel dispatch.`
  );

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-10 text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            Order Placed Successfully
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3 tracking-tight">
            Thank You, {placedOrder.customer.fullName}!
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-lg mx-auto">
            Your order has been recorded in our Pakistani fulfillment system. Our dispatch team is preparing your package for courier handoff.
          </p>

          <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
            <span className="text-stone-500">Official Tracking Order ID:</span>
            <span className="font-extrabold text-emerald-950 text-sm tracking-wider font-mono">
              #{placedOrder.id}
            </span>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${whatsappTrackingMessage}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Track via WhatsApp</span>
            </a>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Live Order Timeline */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 mb-8">
          <h2 className="text-sm font-bold text-stone-900 mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-800" />
            <span>Order Progress Timeline</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center mx-auto mb-1">
                ✓
              </span>
              <span className="text-xs font-bold text-emerald-950 block">Received</span>
              <span className="text-[10px] text-stone-500">Order recorded</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="w-6 h-6 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center mx-auto mb-1">
                2
              </span>
              <span className="text-xs font-bold text-emerald-950 block">Confirmed</span>
              <span className="text-[10px] text-stone-500">Stock reserved</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center mx-auto mb-1">
                3
              </span>
              <span className="text-xs font-bold text-stone-800 block">Shipped (TCS)</span>
              <span className="text-[10px] text-stone-500">Tracking active</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center mx-auto mb-1">
                4
              </span>
              <span className="text-xs font-bold text-stone-800 block">Delivered</span>
              <span className="text-[10px] text-stone-500">Doorstep arrival</span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-stone-100 text-xs">
            <div>
              <h3 className="font-bold text-stone-900 mb-2 uppercase tracking-wider text-[11px]">
                Shipping Details
              </h3>
              <p className="font-semibold text-stone-900">{placedOrder.customer.fullName}</p>
              <p className="text-stone-600 mt-1">{placedOrder.customer.address}</p>
              <p className="text-stone-600">
                {placedOrder.customer.city}, {placedOrder.customer.province}{' '}
                {placedOrder.customer.postalCode}
              </p>
              <p className="text-stone-600 mt-1">Phone: {placedOrder.customer.phoneNumber}</p>
              {placedOrder.customer.notes && (
                <p className="text-stone-500 italic mt-1">Note: {placedOrder.customer.notes}</p>
              )}
            </div>

            <div>
              <h3 className="font-bold text-stone-900 mb-2 uppercase tracking-wider text-[11px]">
                Payment Information
              </h3>
              <p className="text-stone-600">
                Payment Method:{' '}
                <strong className="text-stone-900">{placedOrder.paymentMethod}</strong>
              </p>
              <p className="text-stone-600">
                Status:{' '}
                <span className="font-bold text-emerald-800">{placedOrder.paymentStatus}</span>
              </p>
              {placedOrder.transactionId && (
                <p className="text-stone-600 font-mono text-[11px] mt-1">
                  Ref / TID: {placedOrder.transactionId}
                </p>
              )}
              <p className="text-stone-600 mt-1">
                Date: {new Date(placedOrder.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Ordered Products Table */}
          <div>
            <h3 className="font-bold text-stone-900 mb-3 text-xs uppercase tracking-wider">
              Ordered Items
            </h3>
            <div className="divide-y divide-stone-100">
              {placedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-stone-900">{item.productName}</p>
                      <p className="text-[11px] text-stone-500">
                        Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">
                    Rs. {item.totalPrice.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Total */}
          <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs. {placedOrder.subtotal.toLocaleString()}</span>
            </div>
            {placedOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Discount Applied:</span>
                <span>-Rs. {placedOrder.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span>
                {placedOrder.shippingFee === 0
                  ? 'FREE'
                  : `Rs. ${placedOrder.shippingFee.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-stone-900 pt-2 border-t border-stone-200">
              <span>Grand Total:</span>
              <span className="text-emerald-950">
                Rs. {placedOrder.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 text-center">
            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs tracking-wide shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
