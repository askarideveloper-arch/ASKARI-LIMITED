import React, { useState } from 'react';
import {
  PackageSearch,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  PhoneCall,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

export const MyOrdersView: React.FC = () => {
  const { orders, settings } = useStore();

  const [searchType, setSearchType] = useState<'id' | 'phone'>('id');
  const [query, setQuery] = useState('');
  const [foundOrders, setFoundOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const param =
        searchType === 'id'
          ? `orderId=${encodeURIComponent(query.trim())}`
          : `phone=${encodeURIComponent(query.trim())}`;
      const res = await fetch(`/api/orders?${param}`);
      if (res.ok) {
        const data = await res.json();
        setFoundOrders(Array.isArray(data) ? data : []);
      } else {
        // Fallback local lookup
        const clean = query.trim().toLowerCase();
        const local = orders.filter((o) =>
          searchType === 'id'
            ? o.id.toLowerCase().includes(clean)
            : o.customer.phoneNumber.includes(clean)
        );
        setFoundOrders(local);
      }
    } catch {
      const clean = query.trim().toLowerCase();
      const local = orders.filter((o) =>
        searchType === 'id'
          ? o.id.toLowerCase().includes(clean)
          : o.customer.phoneNumber.includes(clean)
      );
      setFoundOrders(local);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <PackageSearch className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Check real-time delivery status, courier dispatch details, and order history across Pakistan.
          </p>
        </div>

        {/* Tracking Search Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs mb-8">
          <div className="flex gap-4 mb-4 text-xs font-semibold">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="trackType"
                checked={searchType === 'id'}
                onChange={() => setSearchType('id')}
                className="accent-emerald-800"
              />
              <span>Track by Order ID (e.g. ASK-92041)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="trackType"
                checked={searchType === 'phone'}
                onChange={() => setSearchType('phone')}
                className="accent-emerald-800"
              />
              <span>Track by Phone Number</span>
            </label>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchType === 'id' ? 'Enter Order ID (e.g. ASK-92041)' : 'Enter Phone # (e.g. 03008451294)'
              }
              className="flex-1 bg-stone-50 border border-stone-300 rounded-2xl px-4 py-3 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs tracking-wider transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Track'}</span>
            </button>
          </form>
        </div>

        {/* Search Results */}
        {searched && (
          <div className="space-y-6">
            {!foundOrders || foundOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-stone-900">No Orders Found</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  We couldn't find any orders matching "{query}". Please check the spelling or reach out to our WhatsApp support team.
                </p>
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Ask Support on WhatsApp</span>
                </a>
              </div>
            ) : (
              foundOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-extrabold text-stone-900 text-base">
                          #{order.id}
                        </span>
                        <span
                          className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-emerald-950 block">
                        Rs. {order.totalAmount.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">
                        Payment: {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </div>
                  </div>

                  {/* Customer and Shipping Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
                    <div>
                      <span className="text-stone-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">
                        Recipient
                      </span>
                      <p className="font-bold text-stone-900">{order.customer.fullName}</p>
                      <p className="text-stone-600">Phone: {order.customer.phoneNumber}</p>
                    </div>

                    <div>
                      <span className="text-stone-500 block text-[10px] font-bold uppercase tracking-wider mb-0.5">
                        Delivery Destination
                      </span>
                      <p className="text-stone-700">{order.customer.address}</p>
                      <p className="text-stone-700">
                        {order.customer.city}, {order.customer.province}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <span className="text-xs font-bold text-stone-800 block mb-2">
                      Parcel Items ({order.items.length}):
                    </span>
                    <div className="divide-y divide-stone-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                            />
                            <div>
                              <p className="font-semibold text-stone-900">{item.productName}</p>
                              <p className="text-[11px] text-stone-500">
                                Qty: {item.quantity}{' '}
                                {item.selectedSize ? `| ${item.selectedSize}` : ''}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-stone-800">
                            Rs. {item.totalPrice.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
