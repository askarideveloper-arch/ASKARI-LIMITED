import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Category,
  Coupon,
  Customer,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  Review,
  WebsiteSettings,
  CartItem,
} from '../types';
import {
  initialCategories,
  initialCoupons,
  initialOrders,
  initialProducts,
  initialReviews,
  initialSettings,
} from '../data/initialData';

export type CurrentView =
  | 'home'
  | 'shop'
  | 'categories'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'about'
  | 'contact'
  | 'my-orders'
  | 'wishlist'
  | 'policies'
  | 'admin-login'
  | 'admin';

interface StoreContextType {
  currentView: CurrentView;
  setCurrentView: (view: CurrentView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  activePolicy: 'about' | 'privacy' | 'terms' | 'return' | 'shipping';
  setActivePolicy: (policy: 'about' | 'privacy' | 'terms' | 'return' | 'shipping') => void;

  // Data
  products: Product[];
  categories: Category[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  settings: WebsiteSettings;
  loading: boolean;
  refreshData: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  cartTotal: number;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Order Placement
  placedOrder: Order | null;
  setPlacedOrder: (order: Order | null) => void;
  createOrder: (orderData: {
    customer: Order['customer'];
    paymentMethod: PaymentMethod;
    transactionId?: string;
  }) => Promise<{ success: boolean; order?: Order; error?: string }>;

  // Reviews
  submitReview: (reviewData: {
    productId: string;
    productName: string;
    customerName: string;
    customerCity: string;
    rating: number;
    comment: string;
  }) => Promise<{ success: boolean; error?: string }>;

  // Admin Authentication
  isAdminAuthenticated: boolean;
  adminUser: { username: string; role: string } | null;
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;

  // Admin Data Management
  adminAddProduct: (product: Partial<Product>) => Promise<boolean>;
  adminEditProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  adminDeleteProduct: (id: string) => Promise<boolean>;
  adminQuickStock: (id: string, newStock: number) => Promise<boolean>;
  adminAddCategory: (category: Partial<Category>) => Promise<boolean>;
  adminEditCategory: (id: string, category: Partial<Category>) => Promise<boolean>;
  adminDeleteCategory: (id: string) => Promise<boolean>;
  adminUpdateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: Order['paymentStatus']) => Promise<boolean>;
  adminAddCoupon: (coupon: Partial<Coupon>) => Promise<boolean>;
  adminDeleteCoupon: (id: string) => Promise<boolean>;
  adminDeleteReview: (id: string) => Promise<boolean>;
  adminUpdateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<CurrentView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [activePolicy, setActivePolicy] = useState<'about' | 'privacy' | 'terms' | 'return' | 'shipping'>('about');

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [settings, setSettings] = useState<WebsiteSettings>(initialSettings);
  const [loading, setLoading] = useState(true);

  // Cart & Wishlist with local storage backup
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('askari_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('askari_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('askari_adm_token') || localStorage.getItem('askari_adm_token');
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<{ username: string; role: string } | null>(null);

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('askari_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('askari_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Handle URL hash changes for deep links like #admin, #shop, #cart
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin') {
        setCurrentView('admin-login');
      } else if (hash === 'shop') {
        setCurrentView('shop');
      } else if (hash === 'cart') {
        setCurrentView('cart');
      } else if (hash === 'categories') {
        setCurrentView('categories');
      } else if (hash === 'about') {
        setCurrentView('about');
      } else if (hash === 'contact') {
        setCurrentView('contact');
      } else if (hash === 'my-orders') {
        setCurrentView('my-orders');
      } else if (hash === 'wishlist') {
        setCurrentView('wishlist');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Fetch initial data from server
  const refreshData = async () => {
    try {
      setLoading(true);
      const [resProd, resCat, resSettings, resReviews, resCoupons] = await Promise.allSettled([
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json()),
        fetch('/api/reviews').then((r) => r.json()),
        fetch('/api/coupons').then((r) => r.json()),
      ]);

      if (resProd.status === 'fulfilled' && Array.isArray(resProd.value)) {
        setProducts(resProd.value);
      }
      if (resCat.status === 'fulfilled' && Array.isArray(resCat.value)) {
        setCategories(resCat.value);
      }
      if (resSettings.status === 'fulfilled' && resSettings.value && !resSettings.value.error) {
        setSettings(resSettings.value);
      }
      if (resReviews.status === 'fulfilled' && Array.isArray(resReviews.value)) {
        setReviews(resReviews.value);
      }
      if (resCoupons.status === 'fulfilled' && Array.isArray(resCoupons.value)) {
        setCoupons(resCoupons.value);
      }

      // If admin, also fetch orders
      if (adminToken) {
        try {
          const resOrders = await fetch('/api/orders', {
            headers: { Authorization: `Bearer ${adminToken}` },
          });
          if (resOrders.ok) {
            const data = await resOrders.json();
            if (Array.isArray(data)) setOrders(data);
          }
        } catch (e) {
          console.error(e);
        }
      }
    } catch (err) {
      console.error('Failed to load store data from server, using cached/initial data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [adminToken]);

  // Verify Admin Token on start
  useEffect(() => {
    const verify = async () => {
      if (!adminToken) {
        setIsAdminAuthenticated(false);
        setAdminUser(null);
        return;
      }
      try {
        const res = await fetch('/api/admin/verify', {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        const data = await res.json();
        if (data.authenticated) {
          setIsAdminAuthenticated(true);
          setAdminUser(data.admin || { username: 'Admin', role: 'Super Admin' });
        } else {
          setIsAdminAuthenticated(false);
          setAdminUser(null);
          sessionStorage.removeItem('askari_adm_token');
          localStorage.removeItem('askari_adm_token');
        }
      } catch {
        // Fallback: If offline / network glitch, clear token
        setIsAdminAuthenticated(false);
      }
    };
    verify();
  }, [adminToken]);

  // Admin login function
  const adminLogin = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        sessionStorage.setItem('askari_adm_token', data.token);
        setIsAdminAuthenticated(true);
        setAdminUser(data.admin);
        setCurrentView('admin');
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (err: any) {
      return { success: false, error: 'Connection error during authentication. Please try again.' };
    }
  };

  const adminLogout = async () => {
    try {
      if (adminToken) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      }
    } catch (e) {
      console.error(e);
    }
    setAdminToken(null);
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    sessionStorage.removeItem('askari_adm_token');
    localStorage.removeItem('askari_adm_token');
    setCurrentView('home');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedSize: size || (product.sizes.length > 0 ? product.sizes[0] : undefined),
          selectedColor: color || (product.colors.length > 0 ? product.colors[0] : undefined),
        },
      ];
    });
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const next = [...prev];
      next[index].quantity = quantity;
      return next;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.salePrice * item.quantity,
    0
  );

  const shippingFee =
    cartSubtotal >= settings.freeShippingThreshold || cartSubtotal === 0
      ? 0
      : settings.shippingCharges;

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Coupon validation
  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: cartSubtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data.coupon);
        setDiscountAmount(data.discountAmount);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Invalid coupon code' };
      }
    } catch {
      // Fallback local validation
      const found = coupons.find(
        (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
      );
      if (found) {
        if (cartSubtotal < found.minOrderAmount) {
          return {
            success: false,
            message: `Coupon requires minimum order of Rs. ${found.minOrderAmount.toLocaleString()}`,
          };
        }
        const disc =
          found.discountType === 'percentage'
            ? Math.round((cartSubtotal * found.discountValue) / 100)
            : found.discountValue;
        setAppliedCoupon(found);
        setDiscountAmount(disc);
        return { success: true, message: `Coupon applied! Saved Rs. ${disc.toLocaleString()}` };
      }
      return { success: false, message: 'Invalid or expired coupon code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Submit Order
  const createOrder = async (orderData: {
    customer: Order['customer'];
    paymentMethod: PaymentMethod;
    transactionId?: string;
  }) => {
    const items = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      productImage: item.product.images[0] || '',
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      quantity: item.quantity,
      unitPrice: item.product.salePrice,
      totalPrice: item.product.salePrice * item.quantity,
    }));

    const payload = {
      customer: orderData.customer,
      items,
      subtotal: cartSubtotal,
      discount: discountAmount,
      shippingFee,
      totalAmount: cartTotal,
      paymentMethod: orderData.paymentMethod,
      transactionId: orderData.transactionId,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const createdOrder: Order = await res.json();
      if (res.ok) {
        setPlacedOrder(createdOrder);
        setOrders((prev) => [createdOrder, ...prev]);
        clearCart();
        setCurrentView('order-confirmation');
        return { success: true, order: createdOrder };
      } else {
        return { success: false, error: (createdOrder as any).error || 'Failed to place order' };
      }
    } catch {
      // Offline fallback
      const offlineOrder: Order = {
        id: 'ASK-' + Math.floor(10000 + Math.random() * 90000),
        customer: orderData.customer,
        items,
        subtotal: cartSubtotal,
        discount: discountAmount,
        shippingFee,
        totalAmount: cartTotal,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentMethod === 'Cash on Delivery' ? 'Unpaid' : 'Paid',
        transactionId: orderData.transactionId,
        orderStatus: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPlacedOrder(offlineOrder);
      setOrders((prev) => [offlineOrder, ...prev]);
      clearCart();
      setCurrentView('order-confirmation');
      return { success: true, order: offlineOrder };
    }
  };

  // Submit Review
  const submitReview = async (reviewData: {
    productId: string;
    productName: string;
    customerName: string;
    customerCity: string;
    rating: number;
    comment: string;
  }) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) => [data, ...prev]);
        refreshData();
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Could not post review' };
    }
  };

  // Admin Actions with auth headers
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`,
  });

  const adminAddProduct = async (productData: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const prod = await res.json();
        setProducts((prev) => [prod, ...prev]);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const adminEditProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const adminDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const adminQuickStock = async (id: string, newStock: number) => {
    try {
      const res = await fetch(`/api/products/${id}/stock`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stockQuantity: newStock }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const adminAddCategory = async (catData: Partial<Category>) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(catData),
      });
      if (res.ok) {
        const cat = await res.json();
        setCategories((prev) => [...prev, cat]);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const adminEditCategory = async (id: string, catData: Partial<Category>) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(catData),
      });
      if (res.ok) {
        const updated = await res.json();
        setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const adminDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const adminUpdateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    paymentStatus?: Order['paymentStatus']
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, paymentStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const adminAddCoupon = async (couponData: Partial<Coupon>) => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(couponData),
      });
      if (res.ok) {
        const created = await res.json();
        setCoupons((prev) => [...prev, created]);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const adminDeleteCoupon = async (id: string) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const adminDeleteReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const adminUpdateSettings = async (newSettings: Partial<WebsiteSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedCategorySlug,
        setSelectedCategorySlug,
        activePolicy,
        setActivePolicy,
        products,
        categories,
        orders,
        reviews,
        coupons,
        settings,
        loading,
        refreshData,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        cartTotal,
        wishlist,
        toggleWishlist,
        isWishlisted,
        searchQuery,
        setSearchQuery,
        placedOrder,
        setPlacedOrder,
        createOrder,
        submitReview,
        isAdminAuthenticated,
        adminUser,
        adminLogin,
        adminLogout,
        adminAddProduct,
        adminEditProduct,
        adminDeleteProduct,
        adminQuickStock,
        adminAddCategory,
        adminEditCategory,
        adminDeleteCategory,
        adminUpdateOrderStatus,
        adminAddCoupon,
        adminDeleteCoupon,
        adminDeleteReview,
        adminUpdateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
