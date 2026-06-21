import bcrypt from "bcryptjs";
import type { Category, Coupon, Inventory, Product, User } from "../types/domain";
import { embeddingFor } from "../valkey/searchRepository";

const now = () => new Date().toISOString();

const categoryNames = [
  "AI Laptops",
  "Gaming",
  "Running",
  "Home Office",
  "Mobiles",
  "Audio",
  "Smart Home",
  "Cameras",
  "Kitchen",
  "Fitness",
  "Travel",
  "Beauty",
  "Books",
  "Toys",
  "Fashion",
  "Footwear",
  "Monitors",
  "Accessories",
  "Storage",
  "Networking"
];

const brands = ["Astra", "ByteHive", "Nimbus", "Kinetic", "Orbit", "Terra", "Pulse", "Vector", "Zenith", "UrbanTrail"];
const productAdjectives = ["Pro", "Ultra", "Edge", "Max", "Swift", "Prime", "Neo", "Studio", "Air", "Core"];
const imagePool = [
  "/assets/images/thumbs/product-img1.png",
  "/assets/images/thumbs/product-img2.png",
  "/assets/images/thumbs/product-img3.png",
  "/assets/images/thumbs/product-img5.png",
  "/assets/images/thumbs/product-img6.png",
  "/assets/images/thumbs/product-img7.png",
  "/assets/images/thumbs/product-two-img1.png",
  "/assets/images/thumbs/product-two-img2.png",
  "/assets/images/thumbs/popular-img1.png",
  "/assets/images/thumbs/feature-img1.png"
];

export const categories: Category[] = categoryNames.map((name, index) => ({
  id: `cat_${index + 1}`,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  image: imagePool[index % imagePool.length],
  sortOrder: index + 1
}));

const categoryTerms: Record<string, string[]> = {
  "AI Laptops": ["laptop", "ai development", "gpu", "ram", "coding", "developer"],
  Gaming: ["gaming", "setup", "keyboard", "mouse", "monitor", "fps"],
  Running: ["marathon", "running", "hydration", "shoes", "fitness"],
  "Home Office": ["desk", "chair", "productivity", "work"],
  Mobiles: ["phone", "camera", "battery", "android"],
  Audio: ["headphones", "speaker", "noise cancellation", "music"],
  "Smart Home": ["automation", "wifi", "security", "sensor"]
};

export const makeProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, index) => {
    const category = categories[index % categories.length];
    const brand = brands[index % brands.length];
    const adjective = productAdjectives[index % productAdjectives.length];
    const model = 100 + index;
    const categoryTokens = categoryTerms[category.name] ?? [category.name.toLowerCase(), "quality", "daily use"];
    const priceBase = category.name === "AI Laptops" ? 52000 : category.name === "Gaming" ? 12000 : category.name === "Running" ? 1800 : 499;
    const price = priceBase + ((index * 791) % 42000);
    const name = `${brand} ${adjective} ${category.name} ${model}`;
    const tags = [...categoryTokens.slice(0, 4), brand.toLowerCase(), adjective.toLowerCase()];
    const text = `${name} ${category.name} ${tags.join(" ")} built for ${categoryTokens.join(", ")}`;
    return {
      id: `prod_${index + 1}`,
      sku: `SM-${category.id.toUpperCase()}-${model}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      brand,
      categoryId: category.id,
      vendorId: `vendor_${(index % 12) + 1}`,
      price,
      mrp: Math.round(price * (1.08 + (index % 7) / 100)),
      currency: "INR",
      rating: Number((3.8 + (index % 12) / 10).toFixed(1)),
      reviewCount: 25 + ((index * 17) % 900),
      description: `${name} is tuned for ${categoryTokens.join(", ")} with fast delivery and dependable support.`,
      aiDescription: `AI enriched pick for shoppers looking for ${categoryTokens.slice(0, 3).join(", ")} under practical budgets.`,
      tags,
      keywords: [...tags, category.name.toLowerCase(), "shopmind"],
      attributes: {
        warranty: `${1 + (index % 3)} years`,
        popularity: (index * 13) % 100,
        ecoScore: 40 + (index % 60)
      },
      images: [imagePool[index % imagePool.length]],
      inventoryId: `prod_${index + 1}`,
      embedding: embeddingFor(text),
      status: "active",
      createdAt: now(),
      updatedAt: now()
    };
  });
};

export const makeInventory = (products: Product[]): Inventory[] =>
  products.map((product, index) => {
    const stock = 4 + ((index * 11) % 140);
    const reserved = index % 9;
    return {
      productId: product.id,
      stock,
      reserved,
      available: stock - reserved,
      warehouseId: `wh_${(index % 5) + 1}`,
      lowStockThreshold: 8,
      updatedAt: now()
    };
  });

export const coupons: Coupon[] = [
  {
    id: "coupon_1",
    code: "SHOPMIND10",
    type: "percent",
    value: 10,
    minCartValue: 999,
    categories: [],
    products: [],
    usageLimit: 500,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(),
    status: "active"
  },
  {
    id: "coupon_2",
    code: "AI5000",
    type: "fixed",
    value: 5000,
    minCartValue: 65000,
    categories: ["cat_1"],
    products: [],
    usageLimit: 100,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    status: "active"
  }
];

export const makeUsers = async (): Promise<User[]> => {
  const passwordHash = await bcrypt.hash("ShopMind@123", 10);
  return [
    {
      id: "user_admin",
      name: "ShopMind Admin",
      email: "admin@shopmind.ai",
      passwordHash,
      role: "admin",
      addresses: [],
      preferences: { categories: ["cat_1", "cat_2"] },
      createdAt: now(),
      updatedAt: now()
    },
    {
      id: "user_demo",
      name: "Demo Shopper",
      email: "demo@shopmind.ai",
      passwordHash,
      role: "customer",
      addresses: [
        {
          id: "addr_1",
          name: "Home",
          line1: "MG Road",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560001",
          country: "India",
          lat: 12.9716,
          lng: 77.5946
        }
      ],
      preferences: { budget: 80000, categories: ["cat_1", "cat_3"] },
      createdAt: now(),
      updatedAt: now()
    }
  ];
};
