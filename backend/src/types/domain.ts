export type Role = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  phone?: string;
  addresses: Address[];
  preferences: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  name: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  vendorId: string;
  price: number;
  mrp: number;
  currency: "INR";
  rating: number;
  reviewCount: number;
  description: string;
  aiDescription: string;
  tags: string[];
  keywords: string[];
  attributes: Record<string, string | number | boolean>;
  images: string[];
  inventoryId: string;
  embedding: number[];
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  image: string;
  sortOrder: number;
}

export interface Inventory {
  productId: string;
  stock: number;
  reserved: number;
  available: number;
  warehouseId: string;
  lowStockThreshold: number;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface Cart {
  id: string;
  userId?: string;
  guestId?: string;
  items: CartItem[];
  couponCode?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minCartValue: number;
  categories: string[];
  products: string[];
  usageLimit: number;
  expiresAt: string;
  status: "active" | "inactive";
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  address: Address;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "created" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
  totals: Pick<Cart, "subtotal" | "discount" | "tax" | "total">;
  trackingId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "order" | "inventory" | "coupon" | "flash-sale" | "recommendation";
  title: string;
  body: string;
  read: boolean;
  metadata: Record<string, unknown>;
  createdAt: string;
}
