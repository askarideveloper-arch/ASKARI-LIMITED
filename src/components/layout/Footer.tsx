import React from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, setCurrentView, setActivePolicy, categories, setSelectedCategorySlug } = useStore();

  const openPolicy = (policy: 'about' | 'privacy' | 'terms' | 'return' | 'shipping') => {
    setActivePolicy(policy);
    setCurrentView('policies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-14 pb-8 border-t border-stone-800">
      {/* Trust Highlights Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-stone-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-900/60 border border-stone-800/60">
            <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Nationwide Delivery</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Fast courier delivery via TCS, Leopards & Trax to all Pakistani cities within 2-4 days.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-900/60 border border-stone-800/60">
            <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Cash on Delivery</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                100% Cash on Delivery available across Pakistan. Inspect your parcel at your doorstep.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-900/60 border border-stone-800/60">
            <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">7-Day Easy Returns</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Hassle-free replacement and money-back guarantee for damaged or defective items.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-900/60 border border-stone-800/60">
            <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Dedicated Pakistani Support</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Urdu & English WhatsApp helpline available Monday through Saturday.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-stone-950 flex items-center justify-center text-amber-400 font-extrabold text-xl shadow-md border border-amber-500/30">
                A
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                {settings.storeName || 'ASKARI LIMITED'}
              </span>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-stone-400 leading-relaxed max-w-md">
              {settings.aboutUsText.slice(0, 190)}...
            </p>

            <div className="mt-6 flex flex-col gap-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{settings.businessAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Helpline: {settings.supportPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Email: {settings.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-4">
              Top Categories
            </h5>
            <ul className="space-y-2 text-xs">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategorySlug(cat.slug);
                      setCurrentView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-4">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('my-orders');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Track Live Order
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('shipping')} className="hover:text-amber-400 transition-colors">
                  Shipping & Delivery Info
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('return')} className="hover:text-amber-400 transition-colors">
                  Return & Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => openPolicy('about')} className="hover:text-amber-400 transition-colors">
                  About ASKARI LIMITED
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-4">
              Payment & Security
            </h5>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              We offer trusted Pakistani payment methods for safe transactions:
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
              <span className="px-2.5 py-1 bg-stone-900 border border-stone-700/80 rounded-md text-emerald-400">
                Cash on Delivery
              </span>
              <span className="px-2.5 py-1 bg-stone-900 border border-stone-700/80 rounded-md text-rose-400">
                JazzCash
              </span>
              <span className="px-2.5 py-1 bg-stone-900 border border-stone-700/80 rounded-md text-emerald-400">
                EasyPaisa
              </span>
              <span className="px-2.5 py-1 bg-stone-900 border border-stone-700/80 rounded-md text-cyan-400">
                Bank Transfer
              </span>
            </div>

            <div className="mt-5 p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pakistan SSL Secured</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Your order information is encrypted and processed securely.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <p>
          &copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved. Registered in Pakistan.
        </p>

        <div className="flex items-center gap-4 flex-wrap text-stone-400">
          <button onClick={() => openPolicy('privacy')} className="hover:text-white transition-colors">
            Privacy Policy
          </button>
          <span>&bull;</span>
          <button onClick={() => openPolicy('terms')} className="hover:text-white transition-colors">
            Terms of Service
          </button>
          <span>&bull;</span>
          {/* Discreet Admin Portal Link */}
          <button
            id="footer-staff-portal-btn"
            onClick={() => {
              setCurrentView('admin-login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1 text-stone-500 hover:text-stone-300 transition-colors"
            title="Authorized Personnel Access"
          >
            <Lock className="w-3 h-3" />
            <span>Staff Portal</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
