import type { AdCreative, Category, Coupon, DeliveryTracking, Product, Vendor } from "./types";

const now = "2026-05-24T00:00:00.000Z";

export const CATEGORY_IDS = {
  workspace: "category:0192d4e2-1f5a-7c3d-9b2e-8a4f6d0c1e3b",
  input: "category:0192d4e2-3a7b-7e1f-8c4d-2b6a9f0e5d7c",
  connectivity: "category:0192d4e2-4c8d-7a2e-9f1b-3d5c7e8a0b4f",
  audio: "category:0192d4e2-5d9e-7b3f-8a2c-4e6d1f9b0c5a",
  desk: "category:0192d4e4-1a2b-7c3d-8e4f-5a6b7c8d9e0f",
  travel: "category:0192d4e5-5e6f-7a7b-8c8d-9e0f1a2b3c4d",
} as const;

export const VENDOR_IDS = {
  teamDod: "vendor:0192d4e7-4d5e-7b7c-9e9f-1a2b3c4d5e6f",
  valkeyGear: "vendor:0192d4e7-5e6f-7c8d-9a0b-2c3d4e5f6a7b",
} as const;

// Real product photos hosted on Wikimedia Commons (free license). Hotlinked live URLs.
const PRODUCT_IMAGES = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mechanical_Keyboard.jpg/960px-Mechanical_Keyboard.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/A_wireless_computer_mouse.jpg/960px-A_wireless_computer_mouse.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/2023_Hub_USB_2.0.jpg/960px-2023_Hub_USB_2.0.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Bose_QuietComfort_25_Acoustic_Noise_Cancelling_Headphones_with_Carry_Case.jpg/960px-Bose_QuietComfort_25_Acoustic_Noise_Cancelling_Headphones_with_Carry_Case.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Battery_powered_LED_desk_lamp-7420.jpg/960px-Battery_powered_LED_desk_lamp-7420.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Metal_Water_Bottles.jpeg/960px-Metal_Water_Bottles.jpeg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/IBM_Thinkpad_R51.jpg/960px-IBM_Thinkpad_R51.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/LG_FAST_CHARGER_%28AC_ADAPTER%29_LP90DGC20H-WW.jpg/960px-LG_FAST_CHARGER_%28AC_ADAPTER%29_LP90DGC20H-WW.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Stationery_Wholesale_Shop_notebooks.jpg/960px-Stationery_Wholesale_Shop_notebooks.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/A_backpack_with_trekking_poles_and_shoes.jpg/960px-A_backpack_with_trekking_poles_and_shoes.jpg",
];

function product(
  index: number,
  name: string,
  price: number,
  quantity: number,
  categoryId: string,
  vendorId: string,
  searchTerms: string[],
  attributes: Record<string, string | number | boolean> = {}
): Product {
  const suffix = String(index).padStart(12, "0");

  return {
    id: `product:0192d4e6-2c4e-7a6b-8d8f-${suffix}`,
    sku: `VALKEY-DEMO-${String(index).padStart(3, "0")}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    description: `${name} seeded for the BullMQ checkout integration demo with ${searchTerms.join(", ")}.`,
    shortDescription: searchTerms.slice(0, 4).join(" "),
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
        url: PRODUCT_IMAGES[index - 1] ?? PRODUCT_IMAGES[0],
        alt: name,
        isPrimary: true,
      },
    ],
    attributes: {
      integration: "BullMQ",
      ...attributes,
    },
    tags: ["valkey", "checkout", "demo", ...searchTerms],
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
  product(1, "Valkey Wireless Keyboard", 2499, 25, CATEGORY_IDS.input, VENDOR_IDS.teamDod, ["typing", "keys", "wireless", "desk"], { color: "Graphite" }),
  product(2, "Valkey Ergonomic Mouse", 1499, 30, CATEGORY_IDS.input, VENDOR_IDS.teamDod, ["cursor", "ergonomic", "wireless", "desk"], { color: "Green" }),
  product(3, "Valkey USB-C Hub", 3299, 18, CATEGORY_IDS.connectivity, VENDOR_IDS.teamDod, ["adapter", "ports", "dock", "usb"], { ports: 7 }),
  product(4, "Valkey Studio Headphones", 5499, 12, CATEGORY_IDS.audio, VENDOR_IDS.valkeyGear, ["audio", "sound", "music", "studio"], { color: "Black" }),
  product(5, "Valkey Desk Lamp", 1999, 20, CATEGORY_IDS.desk, VENDOR_IDS.teamDod, ["lighting", "reading", "office", "desk"], { color: "White" }),
  product(6, "Valkey Smart Bottle", 1199, 35, CATEGORY_IDS.travel, VENDOR_IDS.valkeyGear, ["hydration", "water", "smart", "travel"], { color: "Blue" }),
  product(7, "Valkey Laptop Stand", 2799, 22, CATEGORY_IDS.desk, VENDOR_IDS.teamDod, ["laptop", "stand", "ergonomic", "portable"], { color: "Silver" }),
  product(8, "Valkey Travel Charger", 1899, 28, CATEGORY_IDS.travel, VENDOR_IDS.valkeyGear, ["power", "charger", "travel", "adapter"], { watts: 65 }),
  product(9, "Valkey Notebook Set", 699, 45, CATEGORY_IDS.desk, VENDOR_IDS.teamDod, ["paper", "notes", "writing", "office"], { color: "Green" }),
  product(10, "Valkey Backpack", 3999, 16, CATEGORY_IDS.travel, VENDOR_IDS.valkeyGear, ["bag", "carry", "travel", "laptop"], { color: "Navy" }),
];

export const CATEGORY_FIXTURES: Category[] = [
  {
    id: CATEGORY_IDS.workspace,
    name: "Workspace",
    slug: "workspace",
    icon: "desktop",
    parentId: null,
    children: [CATEGORY_IDS.input, CATEGORY_IDS.connectivity, CATEGORY_IDS.audio, CATEGORY_IDS.desk],
  },
  {
    id: CATEGORY_IDS.input,
    name: "Keyboards & Mice",
    slug: "keyboards-mice",
    icon: "keyboard",
    parentId: CATEGORY_IDS.workspace,
    children: [],
  },
  {
    id: CATEGORY_IDS.connectivity,
    name: "Connectivity",
    slug: "connectivity",
    icon: "plugs",
    parentId: CATEGORY_IDS.workspace,
    children: [],
  },
  {
    id: CATEGORY_IDS.audio,
    name: "Audio",
    slug: "audio",
    icon: "headphones",
    parentId: CATEGORY_IDS.workspace,
    children: [],
  },
  {
    id: CATEGORY_IDS.desk,
    name: "Desk Setup",
    slug: "desk-setup",
    icon: "lamp",
    parentId: CATEGORY_IDS.workspace,
    children: [],
  },
  {
    id: CATEGORY_IDS.travel,
    name: "Travel",
    slug: "travel",
    icon: "backpack",
    parentId: null,
    children: [],
  },
];

export const VENDOR_FIXTURES: Vendor[] = [
  {
    id: VENDOR_IDS.teamDod,
    name: "Team DoD Workspace",
    slug: "team-dod-workspace",
    email: "workspace@team-dod.example",
    phone: "+91-4012345678",
    logo: "/assets/images/logo/logo.png",
    rating: 4.8,
    totalProducts: 6,
    totalSales: 15420,
    address: {
      street: "Plot 15, HITEC City",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500081",
      country: "IN",
      lat: 17.4435,
      lng: 78.3772,
    },
    verified: true,
    joinedAt: "2024-06-15T00:00:00.000Z",
  },
  {
    id: VENDOR_IDS.valkeyGear,
    name: "Valkey Gear Co",
    slug: "valkey-gear-co",
    email: "gear@valkey-demo.example",
    phone: "+91-4024681357",
    logo: "/assets/images/logo/logo.png",
    rating: 4.7,
    totalProducts: 4,
    totalSales: 9840,
    address: {
      street: "Innovation Road",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560001",
      country: "IN",
      lat: 12.9716,
      lng: 77.5946,
    },
    verified: true,
    joinedAt: "2024-09-01T00:00:00.000Z",
  },
];

export const COUPON_FIXTURES: Coupon[] = [
  {
    code: "VALKEY10",
    type: "percentage",
    value: 10,
    minOrderAmount: 1000,
    maxDiscount: 1000,
    validFrom: "2026-01-01T00:00:00.000Z",
    validUntil: "2026-12-31T23:59:59.000Z",
    usageLimit: 1000,
    usedCount: 0,
    applicableCategories: [CATEGORY_IDS.workspace, CATEGORY_IDS.input, CATEGORY_IDS.connectivity, CATEGORY_IDS.audio, CATEGORY_IDS.desk],
    active: true,
  },
  {
    code: "TRAVEL500",
    type: "fixed",
    value: 500,
    minOrderAmount: 2000,
    validFrom: "2026-01-01T00:00:00.000Z",
    validUntil: "2026-12-31T23:59:59.000Z",
    usageLimit: 500,
    usedCount: 0,
    applicableCategories: [CATEGORY_IDS.travel],
    active: true,
  },
];

export const AD_FIXTURES: AdCreative[] = [
  {
    id: "ad:0192d4e9-6f7a-7d8e-9b0c-3d4e5f6a7b8c",
    vendorId: VENDOR_IDS.teamDod,
    title: "Team DoD workspace bundle",
    imageUrl: PRODUCT_IMAGES[4],
    targetUrl: "/catalog",
    targetCategories: [CATEGORY_IDS.workspace, CATEGORY_IDS.input, CATEGORY_IDS.desk],
    targetKeywords: ["desk", "keyboard", "mouse", "workspace"],
    bidAmount: 850,
    dailyBudget: 50000,
    status: "active",
  },
  {
    id: "ad:0192d4e9-7a8b-7e9f-9c0d-4e5f6a7b8c9d",
    vendorId: VENDOR_IDS.valkeyGear,
    title: "Valkey travel kit",
    imageUrl: PRODUCT_IMAGES[9],
    targetUrl: "/catalog",
    targetCategories: [CATEGORY_IDS.travel],
    targetKeywords: ["travel", "charger", "bottle", "backpack"],
    bidAmount: 650,
    dailyBudget: 30000,
    status: "active",
  },
  {
    id: "ad:0192d4e9-8b9c-7f0a-9d1e-5f6a7b8c9d0e",
    vendorId: VENDOR_IDS.valkeyGear,
    title: "Studio audio upgrade",
    imageUrl: PRODUCT_IMAGES[3],
    targetUrl: "/catalog",
    targetCategories: [CATEGORY_IDS.audio],
    targetKeywords: ["audio", "headphones", "music", "studio"],
    bidAmount: 720,
    dailyBudget: 25000,
    status: "active",
  },
];

export const WAREHOUSE_FIXTURES = [
  { id: "HYD-WH-01", lat: 17.4156, lng: 78.4347 },
  { id: "HYD-WH-02", lat: 17.4435, lng: 78.3772 },
  { id: "HYD-WH-03", lat: 17.385, lng: 78.4867 },
];

export const DELIVERY_TRACKING_FIXTURES: DeliveryTracking[] = [
  {
    trackingId: "DEL-HYD-TEAM-DOD",
    orderId: "order:demo-delivery",
    agentId: "agent_raj_001",
    status: "in_transit",
    pickupLocation: { lat: 17.4156, lng: 78.4347 },
    dropLocation: { lat: 17.4300, lng: 78.4100 },
    currentLocation: { lat: 17.4200, lng: 78.4200 },
    estimatedArrival: "2026-05-24T12:00:00.000Z",
    history: [
      { status: "picked_up", timestamp: "2026-05-24T10:00:00.000Z", lat: 17.4156, lng: 78.4347 },
      { status: "in_transit", timestamp: "2026-05-24T10:15:00.000Z", lat: 17.4200, lng: 78.4200 },
    ],
  },
];
