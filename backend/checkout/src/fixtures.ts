import type { Product } from "./types";

const now = "2026-05-24T00:00:00.000Z";
const categoryId = "category:0192d4e2-3a7b-7e1f-8c4d-2b6a9f0e5d7c";
const vendorId = "vendor:0192d4e7-4d5e-7b7c-9e9f-1a2b3c4d5e6f";

function product(index: number, name: string, price: number, quantity: number): Product {
  const suffix = String(index).padStart(12, "0");

  return {
    id: `product:0192d4e6-2c4e-7a6b-8d8f-${suffix}`,
    sku: `VALKEY-DEMO-${String(index).padStart(3, "0")}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    description: `${name} seeded for the BullMQ checkout integration demo.`,
    shortDescription: "Valkey checkout demo product",
    categoryId,
    vendorId,
    brand: "Valkey Demo",
    price: {
      amount: price,
      currency: "INR",
      compareAt: Math.round(price * 1.12),
    },
    images: [
      {
        url: "/assets/images/thumbs/product-img1.png",
        alt: name,
        isPrimary: true,
      },
    ],
    attributes: {
      color: "Green",
      integration: "BullMQ",
    },
    tags: ["valkey", "checkout", "demo"],
    inventory: {
      quantity,
      reserved: 0,
      warehouse: "HYD-WH-01",
    },
    ratings: {
      average: 4.6,
      count: 100 + index,
    },
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
}

export const PRODUCT_FIXTURES: Product[] = [
  product(1, "Valkey Wireless Keyboard", 2499, 25),
  product(2, "Valkey Ergonomic Mouse", 1499, 30),
  product(3, "Valkey USB-C Hub", 3299, 18),
  product(4, "Valkey Studio Headphones", 5499, 12),
  product(5, "Valkey Desk Lamp", 1999, 20),
  product(6, "Valkey Smart Bottle", 1199, 35),
  product(7, "Valkey Laptop Stand", 2799, 22),
  product(8, "Valkey Travel Charger", 1899, 28),
  product(9, "Valkey Notebook Set", 699, 45),
  product(10, "Valkey Backpack", 3999, 16),
];
