/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/views/HomeView';
import { ShopView } from './components/views/ShopView';
import { CategoriesView } from './components/views/CategoriesView';
import { ProductDetailView } from './components/views/ProductDetailView';
import { CartView } from './components/cart/CartView';
import { CheckoutView } from './components/views/CheckoutView';
import { OrderConfirmationView } from './components/views/OrderConfirmationView';
import { MyOrdersView } from './components/views/MyOrdersView';
import { WishlistView } from './components/views/WishlistView';
import { AboutView } from './components/views/AboutView';
import { ContactView } from './components/views/ContactView';
import { PoliciesView } from './components/views/PoliciesView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, isAdminAuthenticated } = useStore();
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin') {
        setCurrentView('admin');
      } else if (hash === 'shop') {
        setCurrentView('shop');
      } else if (hash === 'categories') {
        setCurrentView('categories');
      } else if (hash === 'cart') {
        setCurrentView('cart');
      } else if (hash === 'checkout') {
        setCurrentView('checkout');
      } else if (hash === 'my-orders' || hash === 'track') {
        setCurrentView('my-orders');
      } else if (hash === 'wishlist') {
        setCurrentView('wishlist');
      } else if (hash === 'about') {
        setCurrentView('about');
      } else if (hash === 'contact') {
        setCurrentView('contact');
      } else if (hash === 'policies') {
        setCurrentView('policies');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setCurrentView]);

  // Update hash when view changes
  useEffect(() => {
    window.location.hash = currentView;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // If view is admin
  if (currentView === 'admin') {
    if (isAdminAuthenticated) {
      return <AdminDashboard />;
    } else {
      return (
        <div className="min-h-screen bg-stone-950 flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-center p-4">
            <AdminLoginModal
              isOpen={true}
              onClose={() => setCurrentView('home')}
              onSuccess={() => setCurrentView('admin')}
            />
          </div>
        </div>
      );
    }
  }

  // Customer-facing Storefront
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 selection:bg-emerald-200 selection:text-emerald-950">
      <Navbar onOpenAdminLogin={() => setShowAdminLoginModal(true)} />

      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'categories' && <CategoriesView />}
        {currentView === 'product-detail' && <ProductDetailView />}
        {currentView === 'cart' && <CartView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'order-confirmation' && <OrderConfirmationView />}
        {currentView === 'my-orders' && <MyOrdersView />}
        {currentView === 'wishlist' && <WishlistView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'policies' && <PoliciesView />}
      </main>

      <Footer onOpenAdminLogin={() => setShowAdminLoginModal(true)} />

      {/* Admin Login Modal triggerable from secure footer/URL */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onSuccess={() => {
          setShowAdminLoginModal(false);
          setCurrentView('admin');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
