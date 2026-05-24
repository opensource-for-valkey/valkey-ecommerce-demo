export type OrderStatus =
  | "pending_reservation"
  | "pending_payment"
  | "payment_authorized"
  | "payment_failed"
  | "confirmed"
  | "cancelled"
  | "released"
  | "inventory_reserve_failed";

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: "customer" | "vendor" | "admin";
  addresses: Address[];
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
  };
  createdAt: string;
  lastLoginAt: string | null;
}

export type PublicUser = Omit<User, "passwordHash">;

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  parentId: string | null;
  children: string[];
}

export interface CategoryNode extends Category {
  childNodes: CategoryNode[];
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  logo: string;
  rating: number;
  totalProducts: number;
  totalSales: number;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    lat?: number;
    lng?: number;
  };
  verified: boolean;
  joinedAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  vendorId: string;
  brand: string;
  price: {
    amount: number;
    currency: string;
    compareAt?: number;
  };
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  attributes: Record<string, string | number | boolean>;
  tags: string[];
  inventory: {
    quantity: number;
    reserved: number;
    warehouse: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  embedding?: number[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface AdCreative {
  id: string;
  vendorId: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  targetCategories: string[];
  targetKeywords: string[];
  bidAmount: number;
  dailyBudget: number;
  status: "active" | "paused";
}

export interface SemanticSearchResult {
  product: Product;
  score: number;
}

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  vendorId: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Record<string, unknown>;
  payment: {
    method: string;
    transactionId: string | null;
    status: "pending" | "authorized" | "declined" | "error";
  };
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  applicableCategories: string[];
  active: boolean;
}

export interface CartLine {
  productId: string;
  quantity: number;
  product: Product;
  lineTotal: number;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
  count: number;
}

export interface CartSummary {
  principalId: string;
  isGuest: boolean;
  items: CartLine[];
  coupon: Coupon | null;
  couponError?: string;
  totals: CartTotals;
}

export type DeliveryStatus =
  | "created"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "failed";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface DeliveryHistoryEntry extends GeoPoint {
  status: DeliveryStatus;
  timestamp: string;
}

export interface DeliveryTracking {
  trackingId: string;
  orderId: string;
  agentId: string;
  status: DeliveryStatus;
  pickupLocation: GeoPoint;
  dropLocation: GeoPoint;
  currentLocation: GeoPoint;
  estimatedArrival: string;
  history: DeliveryHistoryEntry[];
}

export interface ApiEnvelope {
  status: number;
  body: unknown;
}

export interface OrderEvent {
  orderId: string;
  userId: string;
  from: string;
  to: string;
  at: string;
}
