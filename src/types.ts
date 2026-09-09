export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod =
  | 'Cash on Delivery'
  | 'EasyPaisa'
  | 'JazzCash'
  | 'Bank Transfer';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size: M", "Color: Midnight Blue"
  sku?: string;
  priceModifier?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  originalPrice: number; // in PKR
  salePrice: number; // in PKR
  discountPercentage: number;
  stockQuantity: number;
  sku: string;
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  tags?: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerDetails {
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. ASK-84920
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Unpaid' | 'Paid' | 'Pending Verification';
  transactionId?: string;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  province: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerCity: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  status: 'Approved' | 'Pending';
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
  expiryDate?: string;
}

export interface WebsiteSettings {
  storeName: string;
  tagline: string;
  logoText: string;
  logoUrl?: string;
  faviconUrl?: string;
  announcementText: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBadge: string;
  heroImageUrl: string;
  supportPhone: string;
  whatsappNumber: string;
  supportEmail: string;
  businessAddress: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    youtube?: string;
  };
  shippingCharges: number; // in PKR, default 250
  freeShippingThreshold: number; // in PKR, default 3000
  aboutUsText: string;
  privacyPolicy: string;
  termsConditions: string;
  returnPolicy: string;
  shippingPolicy: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}
