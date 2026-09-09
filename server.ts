import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';

import {
  initialCategories,
  initialCoupons,
  initialCustomers,
  initialOrders,
  initialProducts,
  initialReviews,
  initialSettings,
} from './src/data/initialData.ts';
import {
  Category,
  Coupon,
  Customer,
  Order,
  Product,
  Review,
  WebsiteSettings,
} from './src/types.ts';

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'data', 'store_db.json');

// Admin credentials - kept securely on backend only!
const ADMIN_USERNAME = 'AskariTheGreat';
const ADMIN_PASSWORD = 'Business#2';

// Active admin session tokens (persisted in memory)
const activeSessions = new Set<string>();

interface DBState {
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  reviews: Review[];
  coupons: Coupon[];
  settings: WebsiteSettings;
}

// Load DB from file or initialize
function loadDatabase(): DBState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      return {
        products: data.products || initialProducts,
        categories: data.categories || initialCategories,
        orders: data.orders || initialOrders,
        customers: data.customers || initialCustomers,
        reviews: data.reviews || initialReviews,
        coupons: data.coupons || initialCoupons,
        settings: data.settings || initialSettings,
      };
    }
  } catch (err) {
    console.error('Error reading DB_FILE, falling back to initial data:', err);
  }

  const initial: DBState = {
    products: initialProducts,
    categories: initialCategories,
    orders: initialOrders,
    customers: initialCustomers,
    reviews: initialReviews,
    coupons: initialCoupons,
    settings: initialSettings,
  };
  saveDatabase(initial);
  return initial;
}

function saveDatabase(data: DBState) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));

  // Helper middleware for admin auth validation
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    }
    const token = authHeader.split(' ')[1];
    if (!activeSessions.has(token)) {
      return res.status(401).json({ error: 'Invalid or expired admin session. Please log in again.' });
    }
    next();
  };

  // ----------------------------------------------------
  // ADMIN AUTHENTICATION ENDPOINTS
  // ----------------------------------------------------
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = 'askari_adm_' + crypto.randomBytes(24).toString('hex');
      activeSessions.add(token);
      return res.json({
        success: true,
        token,
        admin: {
          username: ADMIN_USERNAME,
          role: 'Super Admin',
        },
      });
    }

    return res.status(401).json({ error: 'Invalid admin username or password' });
  });

  app.get('/api/admin/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ authenticated: false });
    }
    const token = authHeader.split(' ')[1];
    if (activeSessions.has(token)) {
      return res.json({ authenticated: true, admin: { username: ADMIN_USERNAME, role: 'Super Admin' } });
    }
    return res.status(401).json({ authenticated: false });
  });

  app.post('/api/admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      activeSessions.delete(token);
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  });

  // ----------------------------------------------------
  // PRODUCTS APIS
  // ----------------------------------------------------
  app.get('/api/products', (req, res) => {
    const { category, search, featured, bestSeller, inStock } = req.query;
    let list = [...db.products];

    if (category && typeof category === 'string' && category !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (featured === 'true') {
      list = list.filter((p) => p.isFeatured);
    }

    if (bestSeller === 'true') {
      list = list.filter((p) => p.isBestSeller);
    }

    if (inStock === 'true') {
      list = list.filter((p) => p.stockQuantity > 0 && p.isAvailable);
    }

    res.json(list);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  // Create Product (Admin only)
  app.post('/api/products', requireAdmin, (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: req.body.id || `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      rating: req.body.rating || 5.0,
      reviewCount: req.body.reviewCount || 0,
      isAvailable: req.body.isAvailable ?? true,
      images: Array.isArray(req.body.images) && req.body.images.length > 0
        ? req.body.images
        : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80'],
    };

    db.products.unshift(newProduct);
    saveDatabase(db);
    res.status(201).json(newProduct);
  });

  // Update Product (Admin only)
  app.put('/api/products/:id', requireAdmin, (req, res) => {
    const idx = db.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });

    db.products[idx] = {
      ...db.products[idx],
      ...req.body,
      id: req.params.id,
    };

    saveDatabase(db);
    res.json(db.products[idx]);
  });

  // Delete Product (Admin only)
  app.delete('/api/products/:id', requireAdmin, (req, res) => {
    const idx = db.products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });

    const deleted = db.products.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ success: true, deletedProduct: deleted });
  });

  // Quick stock update (Admin only)
  app.patch('/api/products/:id/stock', requireAdmin, (req, res) => {
    const product = db.products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { stockQuantity } = req.body;
    if (typeof stockQuantity === 'number') {
      product.stockQuantity = Math.max(0, stockQuantity);
      product.isAvailable = product.stockQuantity > 0;
      saveDatabase(db);
      return res.json(product);
    }
    return res.status(400).json({ error: 'stockQuantity number required' });
  });

  // ----------------------------------------------------
  // CATEGORIES APIS
  // ----------------------------------------------------
  app.get('/api/categories', (req, res) => {
    // Update product counts dynamically
    const categoriesWithCount = db.categories.map((c) => {
      const count = db.products.filter((p) => p.category.toLowerCase() === c.name.toLowerCase()).length;
      return { ...c, itemCount: count };
    });
    res.json(categoriesWithCount);
  });

  app.post('/api/categories', requireAdmin, (req, res) => {
    const newCategory: Category = {
      ...req.body,
      id: req.body.id || `cat-${Date.now()}`,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/\s+/g, '-'),
      itemCount: 0,
      isActive: req.body.isActive ?? true,
      image: req.body.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    };
    db.categories.push(newCategory);
    saveDatabase(db);
    res.status(201).json(newCategory);
  });

  app.put('/api/categories/:id', requireAdmin, (req, res) => {
    const idx = db.categories.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });

    db.categories[idx] = { ...db.categories[idx], ...req.body, id: req.params.id };
    saveDatabase(db);
    res.json(db.categories[idx]);
  });

  app.delete('/api/categories/:id', requireAdmin, (req, res) => {
    const idx = db.categories.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Category not found' });

    db.categories.splice(idx, 1);
    saveDatabase(db);
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // ORDERS APIS
  // ----------------------------------------------------
  app.get('/api/orders', (req, res) => {
    // If orderId or phone query is passed, allow customer lookup
    const { orderId, phone } = req.query;
    if (orderId) {
      const found = db.orders.find((o) => o.id.toLowerCase() === String(orderId).trim().toLowerCase());
      if (!found) return res.status(404).json({ error: 'Order not found' });
      return res.json([found]);
    }
    if (phone) {
      const cleanPhone = String(phone).replace(/\D/g, '');
      const filtered = db.orders.filter((o) => o.customer.phoneNumber.replace(/\D/g, '').includes(cleanPhone));
      return res.json(filtered);
    }

    // Default returns all orders (for admin)
    res.json(db.orders);
  });

  // Customer places order
  app.post('/api/orders', (req, res) => {
    const { customer, items, subtotal, discount, shippingFee, totalAmount, paymentMethod, transactionId } = req.body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order data: customer details and items required.' });
    }

    const orderId = 'ASK-' + Math.floor(10000 + Math.random() * 90000);
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      customer,
      items,
      subtotal: subtotal || 0,
      discount: discount || 0,
      shippingFee: shippingFee || 0,
      totalAmount: totalAmount || 0,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Unpaid' : 'Paid',
      transactionId: transactionId || (paymentMethod === 'Cash on Delivery' ? undefined : 'TXN-' + Math.floor(100000 + Math.random() * 900000)),
      orderStatus: 'Pending',
      createdAt: now,
      updatedAt: now,
    };

    // Deduct stock
    for (const item of items) {
      const product = db.products.find((p) => p.id === item.productId);
      if (product) {
        product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
        if (product.stockQuantity === 0) {
          product.isAvailable = false;
        }
      }
    }

    // Record or update customer
    let existingCustomer = db.customers.find(
      (c) => c.phoneNumber.replace(/\D/g, '') === customer.phoneNumber.replace(/\D/g, '') ||
             (customer.email && c.email.toLowerCase() === customer.email.toLowerCase())
    );

    if (existingCustomer) {
      existingCustomer.totalOrders += 1;
      existingCustomer.totalSpent += newOrder.totalAmount;
      existingCustomer.address = customer.address;
      existingCustomer.city = customer.city;
      existingCustomer.province = customer.province;
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        fullName: customer.fullName,
        email: customer.email || 'customer@askarilimited.pk',
        phoneNumber: customer.phoneNumber,
        city: customer.city,
        province: customer.province,
        address: customer.address,
        totalOrders: 1,
        totalSpent: newOrder.totalAmount,
        createdAt: now,
      };
      db.customers.unshift(newCust);
    }

    db.orders.unshift(newOrder);
    saveDatabase(db);

    res.status(201).json(newOrder);
  });

  // Admin updates order status
  app.put('/api/orders/:id/status', requireAdmin, (req, res) => {
    const { status, paymentStatus } = req.body;
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (status) order.orderStatus = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.updatedAt = new Date().toISOString();

    saveDatabase(db);
    res.json(order);
  });

  // ----------------------------------------------------
  // CUSTOMERS APIS (Admin only)
  // ----------------------------------------------------
  app.get('/api/customers', requireAdmin, (req, res) => {
    res.json(db.customers);
  });

  // ----------------------------------------------------
  // REVIEWS APIS
  // ----------------------------------------------------
  app.get('/api/reviews', (req, res) => {
    const { productId } = req.query;
    if (productId) {
      const filtered = db.reviews.filter((r) => r.productId === productId && r.status === 'Approved');
      return res.json(filtered);
    }
    res.json(db.reviews);
  });

  app.post('/api/reviews', (req, res) => {
    const { productId, productName, customerName, customerCity, rating, comment } = req.body;
    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      productName: productName || 'Askari Product',
      customerName,
      customerCity: customerCity || 'Pakistan',
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      status: 'Approved',
    };

    db.reviews.unshift(newRev);

    // Update product rating
    const prod = db.products.find((p) => p.id === productId);
    if (prod) {
      prod.reviewCount += 1;
      const productReviews = db.reviews.filter((r) => r.productId === productId && r.status === 'Approved');
      const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
      prod.rating = Number((sum / productReviews.length).toFixed(1));
    }

    saveDatabase(db);
    res.status(201).json(newRev);
  });

  app.delete('/api/reviews/:id', requireAdmin, (req, res) => {
    const idx = db.reviews.findIndex((r) => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Review not found' });
    db.reviews.splice(idx, 1);
    saveDatabase(db);
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // COUPONS APIS
  // ----------------------------------------------------
  app.get('/api/coupons', (req, res) => {
    res.json(db.coupons);
  });

  app.post('/api/coupons/validate', (req, res) => {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ valid: false, error: 'Coupon code required' });

    const coupon = db.coupons.find((c) => c.code.toUpperCase() === String(code).trim().toUpperCase() && c.isActive);
    if (!coupon) {
      return res.status(404).json({ valid: false, error: 'Invalid or expired coupon code.' });
    }

    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        valid: false,
        error: `Coupon requires minimum order of Rs. ${coupon.minOrderAmount.toLocaleString()}`,
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((cartTotal * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      valid: true,
      coupon,
      discountAmount: discount,
      message: `Coupon ${coupon.code} applied! Saved Rs. ${discount.toLocaleString()}`,
    });
  });

  app.post('/api/coupons', requireAdmin, (req, res) => {
    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: req.body.code.toUpperCase().trim(),
      discountType: req.body.discountType || 'percentage',
      discountValue: Number(req.body.discountValue) || 10,
      minOrderAmount: Number(req.body.minOrderAmount) || 1000,
      isActive: req.body.isActive ?? true,
      expiryDate: req.body.expiryDate,
    };
    db.coupons.push(newCoupon);
    saveDatabase(db);
    res.status(201).json(newCoupon);
  });

  app.delete('/api/coupons/:id', requireAdmin, (req, res) => {
    const idx = db.coupons.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Coupon not found' });
    db.coupons.splice(idx, 1);
    saveDatabase(db);
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // WEBSITE SETTINGS APIS
  // ----------------------------------------------------
  app.get('/api/settings', (req, res) => {
    res.json(db.settings);
  });

  app.put('/api/settings', requireAdmin, (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    saveDatabase(db);
    res.json(db.settings);
  });

  // ----------------------------------------------------
  // STATS & DASHBOARD OVERVIEW API (Admin only)
  // ----------------------------------------------------
  app.get('/api/admin/overview', requireAdmin, (req, res) => {
    const totalSales = db.orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((acc, o) => acc + o.totalAmount, 0);

    const totalOrders = db.orders.length;
    const pendingOrders = db.orders.filter((o) => o.orderStatus === 'Pending').length;
    const deliveredOrders = db.orders.filter((o) => o.orderStatus === 'Delivered').length;
    const totalProducts = db.products.length;
    const lowStockProducts = db.products.filter((p) => p.stockQuantity < 15).length;
    const totalCustomers = db.customers.length;

    const recentOrders = db.orders.slice(0, 8);

    res.json({
      totalSales,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      recentOrders,
    });
  });

  // ----------------------------------------------------
  // VITE DEV SERVER / PRODUCTION STATIC SERVING
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ASKARI LIMITED server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
