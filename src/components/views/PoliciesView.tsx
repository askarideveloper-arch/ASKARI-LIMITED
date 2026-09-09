import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  FileText,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

type PolicyTab = 'shipping' | 'returns' | 'privacy' | 'terms';

export const PoliciesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PolicyTab>('shipping');
  const { settings } = useStore();

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
            Legal & Customer Protections
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 mt-3 tracking-tight">
            Store Policies & Guarantees
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Clear, transparent policies tailored for retail e-commerce in Pakistan.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'shipping'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Shipping & Delivery Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'returns'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>7-Day Return Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-10 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
          {activeTab === 'shipping' && (
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-800" />
                <span>Nationwide Courier Delivery & Shipping</span>
              </h2>

              <p className="mb-4">
                ASKARI LIMITED partners with Pakistan's premier courier networks (TCS, Leopards Courier, Trax, Call Courier) to dispatch shipments swiftly to residential and commercial addresses across Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Azad Kashmir, and Gilgit-Baltistan.
              </p>

              <h3 className="font-bold text-stone-900 text-sm mt-5 mb-2">1. Shipping Timelines</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li><strong>Major Metropolitan Areas:</strong> Karachi, Lahore, Rawalpindi, Islamabad, Faisalabad, and Multan typically receive deliveries within <strong>2 to 3 business days</strong>.</li>
                <li><strong>Secondary Cities & Remote Regions:</strong> Gujranwala, Sialkot, Peshawar, Quetta, Abbottabad, Hyderabad, and tehsils take <strong>3 to 5 business days</strong>.</li>
              </ul>

              <h3 className="font-bold text-stone-900 text-sm mt-5 mb-2">2. Cash on Delivery (COD) Rules</h3>
              <p className="text-stone-600">
                All Cash on Delivery packages must be handed over against full cash payment. Before paying, customers can inspect the external tamper-proof poly-bag seal to ensure it has not been opened in transit.
              </p>

              <h3 className="font-bold text-stone-900 text-sm mt-5 mb-2">3. Shipping Rates & Free Delivery</h3>
              <p className="text-stone-600">
                Nationwide flat shipping is standard at <strong>Rs. {settings.shippingFee}</strong>. All orders having a subtotal of <strong>Rs. {settings.freeShippingThreshold.toLocaleString()} or more</strong> automatically qualify for <strong>100% FREE shipping</strong> anywhere in Pakistan.
              </p>
            </div>
          )}

          {activeTab === 'returns' && (
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-emerald-800" />
                <span>7-Day Return & Exchange Guarantee</span>
              </h2>

              <p className="mb-4">
                We take immense pride in our quality checks. However, if you receive a product that is damaged, defective, or incorrect in size, we offer an effortless 7-day return and exchange policy.
              </p>

              <h3 className="font-bold text-stone-900 text-sm mt-5 mb-2">1. Eligibility Criteria</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li>The item must be unused, unwashed, and in the original packaging with tags intact.</li>
                <li>The request must be reported within <strong>7 days</strong> of delivery receipt.</li>
                <li>Fragrances and attars must retain at least 95% of original bottle volume for exchange.</li>
              </ul>

              <h3 className="font-bold text-stone-900 text-sm mt-5 mb-2">2. Refund Methods in Pakistan</h3>
              <p className="text-stone-600">
                Refunds can be disbursed within 24 to 48 hours of item return inspection via:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-stone-600 mt-2">
                <li><strong>EasyPaisa</strong> instant mobile wallet transfer</li>
                <li><strong>JazzCash</strong> instant mobile wallet transfer</li>
                <li><strong>Direct Online Bank Transfer</strong> (Any Pakistani Bank: HBL, Meezan, Alfalah, etc.)</li>
                <li><strong>Store Credit Voucher</strong> with 10% bonus credit</li>
              </ul>

              <h3 className="font-bold text-stone-900 text-sm mt-5 mb-2">3. How to Initiate a Return</h3>
              <p className="text-stone-600">
                Simply WhatsApp our helpline with your <strong>Order ID</strong> and a short video/photo of the item. Our logistics team will guide you on doorstep pickup or nearest courier drop-off.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-800" />
                <span>Customer Data & Privacy Policy</span>
              </h2>

              <p className="mb-4">
                ASKARI LIMITED values the confidentiality of your personal information. We never sell, lease, or rent customer names, phone numbers, or addresses to third-party telemarketers.
              </p>

              <h3 className="font-bold text-stone-900 text-sm mt-5 mb-2">Information Collected</h3>
              <p className="text-stone-600">
                We collect your shipping name, delivery address, phone number, and WhatsApp number solely to ensure accurate courier dispatch and deliver delivery confirmation updates.
              </p>

              <h3 className="font-bold text-stone-900 text-sm mt-5 mb-2">Payment Data Security</h3>
              <p className="text-stone-600">
                We do not store credit or debit card numbers on our servers. All transaction IDs from EasyPaisa, JazzCash, or bank transfers are checked purely for payment verification.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-800" />
                <span>Terms of Service</span>
              </h2>

              <p className="mb-4">
                Welcome to ASKARI LIMITED. By accessing or shopping on our platform, you agree to the following terms governed by the commercial laws of the Islamic Republic of Pakistan.
              </p>

              <h3 className="font-bold text-stone-900 text-sm mt-5 mb-2">Order Acceptance</h3>
              <p className="text-stone-600">
                Receipt of an order confirmation does not constitute final acceptance. ASKARI LIMITED reserves the right to cancel or verify orders flagged for incorrect contact details, suspicious fraudulent activities, or stock discrepancies.
              </p>

              <h3 className="font-bold text-stone-900 text-sm mt-5 mb-2">Pricing & Availability</h3>
              <p className="text-stone-600">
                All prices listed are in Pakistani Rupees (PKR) and inclusive of applicable sales taxes unless expressly stated. Prices and discounts are subject to change without prior notice.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
