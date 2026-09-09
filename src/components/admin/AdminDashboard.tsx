import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Star,
  Boxes,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Save,
  Printer,
  ChevronRight,
  TrendingUp,
  X,
  PhoneCall,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, Category, Order, Coupon, WebsiteSettings } from '../../types';

type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'reviews'
  | 'inventory'
  | 'coupons'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    coupons,
    reviews,
    settings,
    adminLogout,
    setCurrentView,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateOrderStatus,
    updatePaymentStatus,
    updateReviewStatus,
    deleteReview,
    addCoupon,
    deleteCoupon,
    updateSettings,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [orderModalOrder, setOrderModalOrder] = useState<Order | null>(null);

  const [couponModalOpen, setCouponModalOpen] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>({ ...settings });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Order filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Product filters
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  // Calculations for overview
  const totalSales = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending');
  const lowStockProducts = products.filter((p) => p.stockQuantity < 10);

  // Unique customers derived from orders
  const customerMap = new Map<string, {
    name: string;
    phone: string;
    whatsapp: string;
    city: string;
    province: string;
    totalOrders: number;
    totalSpent: number;
  }>();

  orders.forEach((o) => {
    const key = o.customer.phoneNumber || o.customer.fullName;
    const existing = customerMap.get(key);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += o.totalAmount;
    } else {
      customerMap.set(key, {
        name: o.customer.fullName,
        phone: o.customer.phoneNumber,
        whatsapp: o.customer.whatsappNumber,
        city: o.customer.city,
        province: o.customer.province,
        totalOrders: 1,
        totalSpent: o.totalAmount,
      });
    }
  });

  const customerList = Array.from(customerMap.values());

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Admin Top Navbar */}
      <header className="bg-stone-900 text-white border-b border-stone-800 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm shadow-xs">
            A
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white block leading-tight">
              ASKARI LIMITED
            </span>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Management Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Store</span>
          </button>

          <button
            onClick={() => {
              adminLogout();
              setCurrentView('home');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout: Sidebar + View Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-stone-900 text-stone-300 p-4 border-r border-stone-800 shrink-0">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'hover:bg-stone-800 text-stone-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'products'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'hover:bg-stone-800 text-stone-300'
              }`}
            >
              <span className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products</span>
              </span>
              <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-stone-400">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'categories'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'hover:bg-stone-800 text-stone-300'
              }`}
            >
              <span className="flex items-center gap-3">
                <FolderTree className="w-4 h-4" />
                <span>Categories</span>
              </span>
              <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-stone-400">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'hover:bg-stone-800 text-stone-300'
              }`}
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders</span>
              </span>
              {pendingOrders.length > 0 && (
                <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded-full">
                  {pendingOrders.length} new
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'customers'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'hover:bg-stone-800 text-stone-300'
              }`}
            >
              <span className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </span>
              <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-stone-400">
                {customerList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'hover:bg-stone-800 text-stone-300'
              }`}
            >
              <span className="flex items-center gap-3">
                <Star className="w-4 h-4" />
                <span>Reviews</span>
              </span>
              <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-stone-400">
                {reviews.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'inventory'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'hover:bg-stone-800 text-stone-300'
              }`}
            >
              <span className="flex items-center gap-3">
                <Boxes className="w-4 h-4" />
                <span>Inventory Alerts</span>
              </span>
              {lowStockProducts.length > 0 && (
                <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                  {lowStockProducts.length} low
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'coupons'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'hover:bg-stone-800 text-stone-300'
              }`}
            >
              <span className="flex items-center gap-3">
                <Tag className="w-4 h-4" />
                <span>Promo Coupons</span>
              </span>
              <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-stone-400">
                {coupons.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'hover:bg-stone-800 text-stone-300'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store Settings</span>
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                  Store Performance & Overview
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Real-time sales, order fulfillment, and Pakistani customer stats.
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold text-stone-500 block">
                    Total Revenue (PKR)
                  </span>
                  <p className="text-2xl font-extrabold text-emerald-950 mt-1">
                    Rs. {totalSales.toLocaleString()}
                  </p>
                  <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Nationwide sales</span>
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold text-stone-500 block">
                    Total Orders Placed
                  </span>
                  <p className="text-2xl font-extrabold text-stone-900 mt-1">
                    {orders.length}
                  </p>
                  <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1 mt-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pendingOrders.length} pending dispatch</span>
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold text-stone-500 block">
                    Active Catalog Items
                  </span>
                  <p className="text-2xl font-extrabold text-stone-900 mt-1">
                    {products.length}
                  </p>
                  <span className="text-[11px] text-stone-600 font-medium mt-2 block">
                    Across {categories.length} departments
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <span className="text-xs font-semibold text-stone-500 block">
                    Total Pakistani Buyers
                  </span>
                  <p className="text-2xl font-extrabold text-stone-900 mt-1">
                    {customerList.length}
                  </p>
                  <span className="text-[11px] text-emerald-700 font-medium mt-2 block">
                    Verified contact phone numbers
                  </span>
                </div>
              </div>

              {/* Low Stock Warning */}
              {lowStockProducts.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">
                        Low Stock Alert: {lowStockProducts.length} product(s) have fewer than 10 units!
                      </p>
                      <p className="text-[11px] text-amber-700">
                        Restock quickly to avoid stockouts on customer favorites.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
                  >
                    View Inventory
                  </button>
                </div>
              )}

              {/* Recent Orders Table */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-stone-900">Recent Customer Orders</h2>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px] font-bold">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">City</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-stone-50/60">
                          <td className="py-3 font-mono font-bold text-stone-900">#{order.id}</td>
                          <td className="py-3">
                            <p className="font-bold text-stone-900">{order.customer.fullName}</p>
                            <p className="text-[11px] text-stone-500">{order.customer.phoneNumber}</p>
                          </td>
                          <td className="py-3 text-stone-600">{order.customer.city}</td>
                          <td className="py-3 font-bold text-emerald-950">
                            Rs. {order.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span className="text-[11px] font-semibold text-stone-700">
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                order.orderStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.orderStatus === 'Shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setOrderModalOrder(order)}
                              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px]"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                    Product Catalog
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Manage inventory, variants, prices in PKR, and images.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-stone-200">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by title, SKU or category..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-hidden"
                  />
                </div>

                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-medium"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px] font-bold">
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (PKR)</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products
                      .filter((p) => {
                        const matchCat =
                          productCatFilter === 'all' || p.category === productCatFilter;
                        const matchQuery =
                          !productSearch.trim() ||
                          p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.sku.toLowerCase().includes(productSearch.toLowerCase());
                        return matchCat && matchQuery;
                      })
                      .map((product) => (
                        <tr key={product.id} className="hover:bg-stone-50/60">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-12 h-12 object-cover rounded-xl bg-stone-100 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-stone-900 line-clamp-1">{product.name}</p>
                              <span className="text-[10px] text-stone-400 font-mono">
                                SKU: {product.sku}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-stone-600 font-medium">{product.category}</td>
                          <td className="p-4">
                            <span className="font-bold text-emerald-950 block">
                              Rs. {product.salePrice.toLocaleString()}
                            </span>
                            {product.originalPrice > product.salePrice && (
                              <span className="text-[11px] text-stone-400 line-through">
                                Rs. {product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                                product.stockQuantity <= 5
                                  ? 'bg-rose-100 text-rose-800'
                                  : product.stockQuantity < 15
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {product.stockQuantity} units
                            </span>
                          </td>
                          <td className="p-4 space-y-1">
                            {product.isFeatured && (
                              <span className="inline-block bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded mr-1">
                                Featured
                              </span>
                            )}
                            {product.isBestSeller && (
                              <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                Best Seller
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setProductModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete "${product.name}"?`
                                  )
                                ) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                    Product Categories
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Organize your store collections and navigation taxonomy.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category === cat.name).length;
                  return (
                    <div
                      key={cat.id}
                      className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative aspect-video bg-stone-100">
                        <img src={cat.image} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-3 right-3 bg-white/90 text-stone-900 font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                          {count} Products
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-sm text-stone-900">{cat.name}</h3>
                          <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                            {cat.description}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              cat.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {cat.isActive ? 'Active' : 'Hidden'}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingCategory(cat);
                                setCategoryModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(`Delete category "${cat.name}"?`)
                                ) {
                                  deleteCategory(cat.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                    Order Management
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Fulfill customer parcels, update status, track payments, and generate shipping invoices.
                  </p>
                </div>
              </div>

              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-stone-200">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order ID, Customer Name, Phone #, or City..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-hidden"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px] font-bold">
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Destination</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders
                      .filter((o) => {
                        const matchStatus =
                          orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
                        const matchQuery =
                          !orderSearch.trim() ||
                          o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer.phoneNumber.includes(orderSearch) ||
                          o.customer.city.toLowerCase().includes(orderSearch.toLowerCase());
                        return matchStatus && matchQuery;
                      })
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-stone-50/60">
                          <td className="p-4">
                            <span className="font-mono font-extrabold text-stone-900 block">
                              #{order.id}
                            </span>
                            <span className="text-[11px] text-stone-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-stone-900">{order.customer.fullName}</p>
                            <p className="text-[11px] text-stone-500">{order.customer.phoneNumber}</p>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-stone-800 block">
                              {order.customer.city}
                            </span>
                            <span className="text-[10px] text-stone-400 block truncate max-w-xs">
                              {order.customer.address}
                            </span>
                          </td>
                          <td className="p-4 text-stone-600 font-medium">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} items
                          </td>
                          <td className="p-4 font-extrabold text-emerald-950">
                            Rs. {order.totalAmount.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span className="text-[11px] font-semibold text-stone-800 block">
                              {order.paymentMethod}
                            </span>
                            <span
                              className={`text-[10px] font-bold ${
                                order.paymentStatus === 'Paid'
                                  ? 'text-emerald-700'
                                  : 'text-amber-700'
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={order.orderStatus}
                              onChange={(e: any) =>
                                updateOrderStatus(order.id, e.target.value)
                              }
                              className="bg-stone-100 border border-stone-300 rounded-lg px-2 py-1 text-[11px] font-bold text-stone-800 focus:outline-hidden"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setOrderModalOrder(order)}
                              className="px-3 py-1.5 rounded-xl bg-stone-900 text-white font-bold text-[11px] hover:bg-stone-800"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                  Customer Directory
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Registered shoppers across Pakistan with lifetime order stats.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px] font-bold">
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Phone / WhatsApp</th>
                      <th className="p-4">City / Region</th>
                      <th className="p-4">Total Orders</th>
                      <th className="p-4">Total Spent (PKR)</th>
                      <th className="p-4 text-right">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {customerList.map((c, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/60">
                        <td className="p-4 font-bold text-stone-900">{c.name}</td>
                        <td className="p-4 font-mono text-stone-600">{c.phone}</td>
                        <td className="p-4 text-stone-700 font-medium">
                          {c.city}, {c.province}
                        </td>
                        <td className="p-4 font-bold text-stone-900">{c.totalOrders}</td>
                        <td className="p-4 font-extrabold text-emerald-950">
                          Rs. {c.totalSpent.toLocaleString()}
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-[11px]"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                  Review Moderation
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Approve or reject customer product ratings and reviews.
                </p>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-stone-900">{rev.customerName}</span>
                        <span className="text-xs text-stone-500">
                          from {rev.customerCity}, Pakistan
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            rev.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rev.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {rev.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400' : 'text-stone-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-stone-700 ml-1">
                          Product: {rev.productName}
                        </span>
                      </div>

                      <p className="text-xs text-stone-700 italic">"{rev.comment}"</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {rev.status !== 'Approved' && (
                        <button
                          onClick={() => updateReviewStatus(rev.id, 'Approved')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-xs"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== 'Rejected' && (
                        <button
                          onClick={() => updateReviewStatus(rev.id, 'Rejected')}
                          className="px-3 py-1.5 rounded-lg bg-stone-200 text-stone-800 font-bold text-xs"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                  Inventory & Stock Levels
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Adjust product warehouse quantities and monitor critical stock thresholds.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px] font-bold">
                      <th className="p-4">Product Name</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Current Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Quick Stock Adjustment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/60">
                        <td className="p-4 font-bold text-stone-900 flex items-center gap-2">
                          <img
                            src={p.images[0]}
                            alt=""
                            className="w-8 h-8 rounded object-cover bg-stone-100"
                          />
                          <span>{p.name}</span>
                        </td>
                        <td className="p-4 font-mono text-stone-500">{p.sku}</td>
                        <td className="p-4 font-bold text-stone-900">{p.stockQuantity} units</td>
                        <td className="p-4">
                          {p.stockQuantity <= 5 ? (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              Critical Low
                            </span>
                          ) : p.stockQuantity < 15 ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              Low Stock
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              Healthy
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            onClick={() =>
                              updateProduct({
                                ...p,
                                stockQuantity: Math.max(0, p.stockQuantity - 5),
                              })
                            }
                            className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 font-bold"
                          >
                            -5
                          </button>
                          <button
                            onClick={() =>
                              updateProduct({
                                ...p,
                                stockQuantity: p.stockQuantity + 5,
                              })
                            }
                            className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 font-bold"
                          >
                            +5
                          </button>
                          <button
                            onClick={() =>
                              updateProduct({
                                ...p,
                                stockQuantity: p.stockQuantity + 25,
                              })
                            }
                            className="px-2.5 py-1 rounded bg-emerald-800 text-white hover:bg-emerald-900 font-bold"
                          >
                            +25 Restock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                    Discount Promo Coupons
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    Manage promotional codes for Pakistani marketing campaigns.
                  </p>
                </div>
                <button
                  onClick={() => setCouponModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-extrabold text-base text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                          {c.code}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            c.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {c.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-emerald-900">
                        {c.discountType === 'percentage'
                          ? `${c.discountValue}% OFF`
                          : `Rs. ${c.discountValue} OFF`}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        Min. Cart Value: Rs. {c.minOrderValue.toLocaleString()}
                      </p>
                      <p className="text-xs text-stone-500">Times Used: {c.usageCount}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-400">Expires: {c.expiryDate}</span>
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="text-rose-600 font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
                  Website Settings
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Customize contact details, Pakistani delivery fees, and hero banner announcements.
                </p>
              </div>

              {settingsSavedToast && (
                <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-800" />
                  <span>Store settings updated and applied successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-3 pb-2 border-b border-stone-100">
                    Store Identity & Announcements
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Store Name</label>
                      <input
                        type="text"
                        value={settingsForm.storeName}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, storeName: e.target.value })
                        }
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Top Announcement Ribbon Text
                      </label>
                      <input
                        type="text"
                        value={settingsForm.topBannerText}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, topBannerText: e.target.value })
                        }
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Hero Headline</label>
                      <input
                        type="text"
                        value={settingsForm.heroHeadline}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })
                        }
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Hero Subheadline
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.heroSubheadline}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, heroSubheadline: e.target.value })
                        }
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-3 pb-2 border-b border-stone-100">
                    Pakistani Shipping & Thresholds
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Standard Shipping Fee (PKR)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.shippingFee}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            shippingFee: Number(e.target.value),
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Free Shipping Threshold (PKR)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.freeShippingThreshold}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            freeShippingThreshold: Number(e.target.value),
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-3 pb-2 border-b border-stone-100">
                    Contact Channels & Pakistani Office
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                        }
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Customer Support Phone
                      </label>
                      <input
                        type="text"
                        value={settingsForm.contactPhone}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, contactPhone: e.target.value })
                        }
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Support Email</label>
                      <input
                        type="email"
                        value={settingsForm.contactEmail}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                        }
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Physical Office Address
                      </label>
                      <input
                        type="text"
                        value={settingsForm.storeAddress}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, storeAddress: e.target.value })
                        }
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Product Add/Edit Modal */}
      {productModalOpen && (
        <ProductModal
          isOpen={productModalOpen}
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setProductModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={async (prodData) => {
            if (editingProduct) {
              await updateProduct({ ...editingProduct, ...prodData });
            } else {
              await addProduct(prodData);
            }
            setProductModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Category Modal */}
      {categoryModalOpen && (
        <CategoryModal
          isOpen={categoryModalOpen}
          category={editingCategory}
          onClose={() => {
            setCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={async (catData) => {
            if (editingCategory) {
              await updateCategory({ ...editingCategory, ...catData });
            } else {
              await addCategory(catData);
            }
            setCategoryModalOpen(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* Order Inspect Modal */}
      {orderModalOrder && (
        <OrderDetailsModal
          order={orderModalOrder}
          onClose={() => setOrderModalOrder(null)}
          onStatusChange={(status) => {
            updateOrderStatus(orderModalOrder.id, status);
            setOrderModalOrder({ ...orderModalOrder, orderStatus: status });
          }}
          onPaymentChange={(pStatus) => {
            updatePaymentStatus(orderModalOrder.id, pStatus);
            setOrderModalOrder({ ...orderModalOrder, paymentStatus: pStatus });
          }}
        />
      )}

      {/* Coupon Modal */}
      {couponModalOpen && (
        <CouponModal
          isOpen={couponModalOpen}
          onClose={() => setCouponModalOpen(false)}
          onSave={async (couponData) => {
            await addCoupon(couponData);
            setCouponModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// Sub-components for Modals
const ProductModal: React.FC<{
  isOpen: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (p: any) => Promise<void>;
}> = ({ isOpen, product, categories, onClose, onSave }) => {
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || categories[0]?.name || '');
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice || 2999);
  const [salePrice, setSalePrice] = useState(product?.salePrice || 2499);
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity || 25);
  const [sku, setSku] = useState(product?.sku || `ASK-${Math.floor(1000 + Math.random() * 9000)}`);
  const [imageUrl, setImageUrl] = useState(
    product?.images[0] ||
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
  );
  const [description, setDescription] = useState(product?.description || '');
  const [sizesStr, setSizesStr] = useState(product?.sizes ? product.sizes.join(', ') : '');
  const [colorsStr, setColorsStr] = useState(product?.colors ? product.colors.join(', ') : '');
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller || false);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const discountPercentage =
      originalPrice > salePrice
        ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
        : 0;

    await onSave({
      name,
      category,
      originalPrice: Number(originalPrice),
      salePrice: Number(salePrice),
      discountPercentage,
      stockQuantity: Number(stockQuantity),
      sku,
      images: [imageUrl],
      description,
      sizes: sizesStr
        ? sizesStr.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      colors: colorsStr
        ? colorsStr.split(',').map((c) => c.trim()).filter(Boolean)
        : [],
      isFeatured,
      isBestSeller,
      isAvailable: Number(stockQuantity) > 0,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <h2 className="text-lg font-bold text-stone-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 text-stone-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Original Price (PKR) *</label>
              <input
                type="number"
                required
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Sale Price (PKR) *</label>
              <input
                type="number"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Product Image URL *</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Sizes (Comma separated, e.g. Small, Medium, Large)
              </label>
              <input
                type="text"
                value={sizesStr}
                onChange={(e) => setSizesStr(e.target.value)}
                placeholder="Small, Medium, Large"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Colors (Comma separated, e.g. Black, Navy Blue, Olive)
              </label>
              <input
                type="text"
                value={colorsStr}
                onChange={(e) => setColorsStr(e.target.value)}
                placeholder="Black, Navy Blue"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Product Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
            />
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded accent-emerald-800"
              />
              <span>Mark as Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded accent-emerald-800"
              />
              <span>Mark as Best Seller</span>
            </label>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 font-semibold text-stone-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
            >
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CategoryModal: React.FC<{
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (c: any) => Promise<void>;
}> = ({ isOpen, category, onClose, onSave }) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [image, setImage] = useState(category?.image || '');
  const [isActive, setIsActive] = useState(category ? category.isActive : true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description,
      image,
      isActive,
      itemCount: category?.itemCount || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <h2 className="text-base font-bold text-stone-900">
            {category ? 'Edit Category' : 'Create Category'}
          </h2>
          <button onClick={onClose} className="p-1 text-stone-500 hover:bg-stone-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <div>
            <label className="font-bold text-stone-700 block mb-1">Category Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
            />
          </div>
          <div>
            <label className="font-bold text-stone-700 block mb-1">Image URL</label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
            />
          </div>
          <div>
            <label className="font-bold text-stone-700 block mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded accent-emerald-800"
            />
            <span className="font-semibold text-stone-800">Active and Visible on Store</span>
          </label>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
            >
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrderDetailsModal: React.FC<{
  order: Order;
  onClose: () => void;
  onStatusChange: (status: any) => void;
  onPaymentChange: (status: any) => void;
}> = ({ order, onClose, onStatusChange, onPaymentChange }) => {
  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-mono">
              Order #{order.id}
            </h2>
            <span className="text-xs text-stone-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6 text-xs">
          {/* Status Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Fulfillment Status</label>
              <select
                value={order.orderStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl p-2 font-bold text-stone-900"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Payment Status</label>
              <select
                value={order.paymentStatus}
                onChange={(e) => onPaymentChange(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl p-2 font-bold text-stone-900"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid (Verified)</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Pakistani Customer Shipping Information */}
          <div>
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2">
              Pakistani Courier Delivery Address
            </h3>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-1 text-stone-700">
              <p>
                <strong>Full Name:</strong> {order.customer.fullName}
              </p>
              <p>
                <strong>Phone Number:</strong> {order.customer.phoneNumber}
              </p>
              <p>
                <strong>WhatsApp:</strong> {order.customer.whatsappNumber}
              </p>
              {order.customer.email && (
                <p>
                  <strong>Email:</strong> {order.customer.email}
                </p>
              )}
              <p>
                <strong>Street Address:</strong> {order.customer.address}
              </p>
              <p>
                <strong>City & Province:</strong> {order.customer.city}, {order.customer.province} ({order.customer.postalCode || 'N/A'})
              </p>
              {order.customer.notes && (
                <p className="text-stone-500 italic mt-1">
                  <strong>Notes:</strong> {order.customer.notes}
                </p>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2">
              Payment Gateway Information
            </h3>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-1">
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              {order.transactionId && (
                <p>
                  <strong>Transaction ID / Reference:</strong>{' '}
                  <span className="font-mono font-bold text-emerald-900">
                    {order.transactionId}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Ordered Products */}
          <div>
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-2">
              Items Breakdown
            </h3>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl p-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                    />
                    <div>
                      <p className="font-bold text-stone-900">{item.productName}</p>
                      <p className="text-[11px] text-stone-500">
                        Qty: {item.quantity} {item.selectedSize ? `| ${item.selectedSize}` : ''}
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

          {/* Financial Breakdown */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span>-Rs. {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>
                {order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-stone-900 pt-2 border-t border-stone-200">
              <span>Total Amount:</span>
              <span className="text-emerald-950">Rs. {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const CouponModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (c: any) => Promise<void>;
}> = ({ isOpen, onClose, onSave }) => {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(2000);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue),
      expiryDate,
      isActive: true,
      usageCount: 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <h2 className="text-base font-bold text-stone-900">Create Discount Promo Code</h2>
          <button onClick={onClose} className="p-1 text-stone-500 hover:bg-stone-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <div>
            <label className="font-bold text-stone-700 block mb-1">Coupon Code (Uppercase)</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. FLASH15"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 uppercase font-mono text-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e: any) => setDiscountType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed PKR (Rs.)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Value {discountType === 'percentage' ? '(%)' : '(PKR)'}
              </label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Minimum Order Value (PKR)</label>
            <input
              type="number"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(Number(e.target.value))}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900"
            />
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
            >
              Save Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
