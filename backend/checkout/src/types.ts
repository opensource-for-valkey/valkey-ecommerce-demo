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
  attributes: Record<string, string>;
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
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
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
