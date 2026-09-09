import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ContactView: React.FC = () => {
  const { settings } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Order Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 600);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ASKARI LIMITED, I need assistance with an inquiry on your store.`
  );

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3.5 py-1 rounded-full">
            Customer Care
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-4 tracking-tight">
            Contact ASKARI LIMITED
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Have questions about an order, tracking, returns, or bulk wholesale inquiries? Our Pakistani support desk is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick WhatsApp Support Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white shadow-md border border-emerald-800">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2">
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Help</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">Need Quick Answers?</h3>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                Connect directly with our support team on WhatsApp for fastest order confirmation, tracking updates, and size advice.
              </p>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Chat on WhatsApp ({settings.whatsappNumber})</span>
              </a>
            </div>

            {/* Contact Info Cards */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-stone-100 text-emerald-800 shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-stone-500 font-medium block">Phone Helpline</span>
                  <a
                    href={`tel:${settings.contactPhone}`}
                    className="font-bold text-stone-900 hover:text-emerald-800 text-sm"
                  >
                    {settings.contactPhone}
                  </a>
                  <p className="text-[11px] text-stone-500 mt-0.5">Mon - Sat: 9:00 AM - 8:00 PM (PKT)</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-stone-100">
                <div className="p-2.5 rounded-xl bg-stone-100 text-emerald-800 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-stone-500 font-medium block">Email Support</span>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="font-bold text-stone-900 hover:text-emerald-800 text-sm"
                  >
                    {settings.contactEmail}
                  </a>
                  <p className="text-[11px] text-stone-500 mt-0.5">Average reply time within 4 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-stone-100">
                <div className="p-2.5 rounded-xl bg-stone-100 text-emerald-800 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-stone-500 font-medium block">Head Office</span>
                  <p className="font-bold text-stone-900">{settings.storeAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
            <h2 className="text-lg font-bold text-stone-900 mb-1">Send Us a Message</h2>
            <p className="text-xs text-stone-500 mb-6">
              Fill out the inquiry form and our representative will get back to you promptly.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-800 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-emerald-950">Message Sent Successfully!</h3>
                <p className="text-xs text-emerald-800 mt-1 max-w-sm mx-auto">
                  Thank you for reaching out. A representative from ASKARI LIMITED will respond to your inquiry within a few hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Bilal Ahmed"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03001234567"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="bilal@example.com"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                    >
                      <option value="Order Inquiry">Order Inquiry & Tracking</option>
                      <option value="Return / Exchange">7-Day Return / Exchange</option>
                      <option value="Product Details">Product or Sizing Question</option>
                      <option value="Payment Inquiry">Payment / EasyPaisa / JazzCash</option>
                      <option value="Bulk Wholesale">Corporate & Bulk Orders</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your query or mention your order ID..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:border-emerald-700 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'Sending Message...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
