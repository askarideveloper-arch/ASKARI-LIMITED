import React from 'react';
import {
  ShieldCheck,
  Award,
  Truck,
  Users,
  CheckCircle2,
  Building2,
  PhoneCall,
  Mail,
  MapPin,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AboutView: React.FC = () => {
  const { settings, setCurrentView } = useStore();

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3.5 py-1 rounded-full">
            About ASKARI LIMITED
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 mt-4 tracking-tight">
            Pakistan's Premier Trusted Shopping Destination
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-stone-600 mt-4 leading-relaxed font-normal">
            Established with a vision to deliver genuine products, uncompromised craftsmanship, and doorstep reliability to millions of households across Karachi, Lahore, Islamabad, and every corner of Pakistan.
          </p>
        </div>

        {/* Brand Story */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                Our Heritage & Mission
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                At <strong>ASKARI LIMITED</strong>, we believe Pakistani shoppers deserve authentic items backed by prompt customer service and effortless returns. In an online marketplace crowded with low-grade replicas, we stand firm on three pillars: rigorous quality screening, clear pricing in Pakistani Rupees (PKR), and customer satisfaction.
              </p>
              <p className="text-xs sm:text-sm text-stone-600 mt-3 leading-relaxed">
                Whether you are ordering hand-embroidered festive kurtas, smart wearables, kitchenware, or our signature pure oud attars, each parcel is carefully packaged in our Lahore and Karachi distribution centers with secure tamper-evident seals.
              </p>

              <div className="mt-6 space-y-2 text-xs font-semibold text-stone-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>100% Genuine, tested, and inspected products</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>Nationwide Cash on Delivery coverage via TCS & Leopards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>7-Day Return and Exchange Guarantee</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 shadow-inner">
              <img
                src="https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1000&q=80"
                alt="ASKARI LIMITED team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Authenticity Guaranteed</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              We source directly from licensed brand manufacturers and accredited regional artisans, verifying every batch prior to inventory listing.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Doorstep Verification</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              With Cash on Delivery supported throughout Pakistan, you only pay the rider when your package reaches your address.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Customer First</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Our support team speaks Urdu and English, providing rapid assistance through direct WhatsApp and phone channels.
            </p>
          </div>
        </div>

        {/* Registered Pakistani Offices */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Corporate Headquarters
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                ASKARI LIMITED Pakistan
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('contact')}
              className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
            >
              Contact Support
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-xs text-stone-300">
            <div>
              <div className="flex items-center gap-2 text-white font-bold mb-1">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Lahore Office</span>
              </div>
              <p>Gulberg III, Main Boulevard, Lahore, Punjab, Pakistan</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-white font-bold mb-1">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Karachi Logistics Hub</span>
              </div>
              <p>Clifton Block 4, Karachi, Sindh, Pakistan</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-white font-bold mb-1">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Islamabad Branch</span>
              </div>
              <p>Blue Area, Sector F-7, Islamabad, Pakistan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
