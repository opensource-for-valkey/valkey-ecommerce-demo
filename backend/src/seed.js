// Seed script: wipes and repopulates the SQLite DB with sample categories,
// vendors, and a handful of products per leaf category.
//
// Run with: npm run seed

const { db } = require("./db");
const { createId } = require("./lib/id");

const now = () => new Date().toISOString();

// ---------------------------------------------------------------------------
// Reset tables
// ---------------------------------------------------------------------------
db.exec(`
  DELETE FROM products;
  DELETE FROM vendors;
  DELETE FROM categories;
`);

// ---------------------------------------------------------------------------
// Categories — top-level + leaf children
// ---------------------------------------------------------------------------
const categoryTree = [
    {
        name: "Electronics",
        slug: "electronics",
        icon: "desktop",
        children: [
            { name: "Smartphones", slug: "smartphones", icon: "device-mobile" },
            { name: "Laptops", slug: "laptops", icon: "laptop" },
            { name: "Audio", slug: "audio", icon: "headphones" },
        ],
    },
    {
        name: "Fashion",
        slug: "fashion",
        icon: "t-shirt",
        children: [
            { name: "Men's Clothing", slug: "mens-clothing", icon: "user" },
            { name: "Women's Clothing", slug: "womens-clothing", icon: "user" },
        ],
    },
    {
        name: "Home & Kitchen",
        slug: "home-kitchen",
        icon: "house",
        children: [
            { name: "Cookware", slug: "cookware", icon: "cooking-pot" },
            { name: "Appliances", slug: "appliances", icon: "plug" },
        ],
    },
    {
        name: "Sports & Outdoors",
        slug: "sports-outdoors",
        icon: "basketball",
        children: [
            { name: "Fitness", slug: "fitness", icon: "barbell" },
            { name: "Outdoor", slug: "outdoor", icon: "tent" },
        ],
    },
];

const insertCategory = db.prepare(`
  INSERT INTO categories (id, name, slug, icon, parent_id)
  VALUES (@id, @name, @slug, @icon, @parent_id)
`);

const categoriesBySlug = {};

for (const top of categoryTree) {
    const topId = createId("category");
    insertCategory.run({
        id: topId,
        name: top.name,
        slug: top.slug,
        icon: top.icon,
        parent_id: null,
    });
    categoriesBySlug[top.slug] = { id: topId, ...top };

    for (const child of top.children) {
        const childId = createId("category");
        insertCategory.run({
            id: childId,
            name: child.name,
            slug: child.slug,
            icon: child.icon,
            parent_id: topId,
        });
        categoriesBySlug[child.slug] = { id: childId, ...child, parentSlug: top.slug };
    }
}

// ---------------------------------------------------------------------------
// Vendors
// ---------------------------------------------------------------------------
const vendorSeed = [
    {
        slug: "techworld-electronics",
        name: "TechWorld Electronics",
        email: "support@techworld.in",
        phone: "+91-4012345678",
        logo: "/assets/images/vendor/techworld.png",
        rating: 4.7,
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
    },
    {
        slug: "urban-threads",
        name: "Urban Threads",
        email: "hello@urbanthreads.in",
        phone: "+91-2266551234",
        logo: "/assets/images/vendor/urban-threads.png",
        rating: 4.5,
        address: {
            street: "12 Linking Road, Bandra West",
            city: "Mumbai",
            state: "Maharashtra",
            postalCode: "400050",
            country: "IN",
            lat: 19.0606,
            lng: 72.8362,
        },
        verified: true,
    },
    {
        slug: "homewise-living",
        name: "HomeWise Living",
        email: "care@homewise.in",
        phone: "+91-8044778899",
        logo: "/assets/images/vendor/homewise.png",
        rating: 4.6,
        address: {
            street: "Sector 18, Indiranagar",
            city: "Bengaluru",
            state: "Karnataka",
            postalCode: "560038",
            country: "IN",
            lat: 12.9719,
            lng: 77.6412,
        },
        verified: true,
    },
    {
        slug: "peakgear",
        name: "PeakGear Outfitters",
        email: "team@peakgear.in",
        phone: "+91-1142339988",
        logo: "/assets/images/vendor/peakgear.png",
        rating: 4.4,
        address: {
            street: "Connaught Place, Block C",
            city: "New Delhi",
            state: "Delhi",
            postalCode: "110001",
            country: "IN",
            lat: 28.6328,
            lng: 77.2197,
        },
        verified: true,
    },
];

const insertVendor = db.prepare(`
  INSERT INTO vendors (id, name, slug, email, phone, logo, rating, address, verified, joined_at)
  VALUES (@id, @name, @slug, @email, @phone, @logo, @rating, @address, @verified, @joined_at)
`);

const vendorsBySlug = {};

for (const v of vendorSeed) {
    const id = createId("vendor");
    insertVendor.run({
        id,
        name: v.name,
        slug: v.slug,
        email: v.email,
        phone: v.phone,
        logo: v.logo,
        rating: v.rating,
        address: JSON.stringify(v.address),
        verified: v.verified ? 1 : 0,
        joined_at: now(),
    });
    vendorsBySlug[v.slug] = { id, ...v };
}

// ---------------------------------------------------------------------------
// Products — keyed by leaf category slug
// ---------------------------------------------------------------------------
// Prices are integers in the smallest currency unit (paise) per the contract:
// price.amount is INR paise => 8999900 = ₹89,999.00.
const productsByCategorySlug = {
    smartphones: [
        {
            vendor: "techworld-electronics",
            brand: "Samsung",
            sku: "ELEC-PHN-SAM-001",
            name: "Galaxy Ultra Pro 256GB",
            shortDescription: "200MP camera, 6.8\" AMOLED, 5000mAh",
            description:
                "Flagship smartphone with 200MP camera, 6.8\" AMOLED display, and 5000mAh battery.",
            price: 8999900,
            compareAt: 9999900,
            attributes: {
                color: "Phantom Black",
                storage: "256GB",
                ram: "12GB",
                display: "6.8 inch AMOLED",
                battery: "5000mAh",
                os: "Android 15",
            },
            tags: ["smartphone", "5g", "flagship", "camera", "samsung"],
            inventory: 150,
            ratings: { average: 4.6, count: 2341 },
        },
        {
            vendor: "techworld-electronics",
            brand: "Apple",
            sku: "ELEC-PHN-APL-002",
            name: "iPhone 16 Pro 128GB",
            shortDescription: "A18 Pro chip, ProMotion display, titanium frame",
            description:
                "Latest iPhone with A18 Pro chip, ProMotion 120Hz display, and titanium frame.",
            price: 11990000,
            compareAt: 12990000,
            attributes: {
                color: "Natural Titanium",
                storage: "128GB",
                display: "6.3 inch OLED",
                os: "iOS 18",
            },
            tags: ["smartphone", "apple", "5g", "flagship"],
            inventory: 90,
            ratings: { average: 4.8, count: 1820 },
        },
        {
            vendor: "techworld-electronics",
            brand: "OnePlus",
            sku: "ELEC-PHN-ONP-003",
            name: "OnePlus 12R 5G",
            shortDescription: "Snapdragon 8 Gen 3, 100W charging",
            description:
                "Performance flagship with Snapdragon 8 Gen 3, 100W SUPERVOOC charging, and 120Hz LTPO display.",
            price: 4499900,
            compareAt: 4999900,
            attributes: {
                color: "Iron Gray",
                storage: "256GB",
                ram: "16GB",
                display: "6.78 inch AMOLED",
                battery: "5500mAh",
                os: "Android 14",
            },
            tags: ["smartphone", "5g", "performance", "oneplus"],
            inventory: 200,
            ratings: { average: 4.5, count: 980 },
        },
        {
            vendor: "techworld-electronics",
            brand: "Xiaomi",
            sku: "ELEC-PHN-XIA-004",
            name: "Redmi Note 14 Pro",
            shortDescription: "Affordable mid-range with 200MP camera",
            description:
                "Budget-friendly flagship killer with 200MP main camera and AMOLED display.",
            price: 2299900,
            compareAt: 2599900,
            attributes: {
                color: "Lavender Purple",
                storage: "128GB",
                ram: "8GB",
                display: "6.67 inch AMOLED",
            },
            tags: ["smartphone", "budget", "xiaomi"],
            inventory: 320,
            ratings: { average: 4.3, count: 645 },
        },
        {
            vendor: "techworld-electronics",
            brand: "Google",
            sku: "ELEC-PHN-GGL-005",
            name: "Pixel 9 Pro 256GB",
            shortDescription: "Tensor G4, AI-first photography",
            description:
                "Google flagship with Tensor G4, Magic Editor, and 7 years of OS updates.",
            price: 10999900,
            compareAt: 11990000,
            attributes: {
                color: "Obsidian",
                storage: "256GB",
                ram: "16GB",
                display: "6.3 inch LTPO OLED",
                battery: "4700mAh",
                os: "Android 15",
            },
            tags: ["smartphone", "5g", "ai", "google", "camera"],
            inventory: 110,
            ratings: { average: 4.7, count: 1432 },
        },
        {
            vendor: "techworld-electronics",
            brand: "Nothing",
            sku: "ELEC-PHN-NTH-006",
            name: "Nothing Phone (2a) 5G",
            shortDescription: "Glyph interface, transparent design",
            description:
                "Mid-range with iconic Glyph LEDs, Dimensity 7200 Pro, and a clean Nothing OS.",
            price: 2499900,
            compareAt: 2799900,
            attributes: {
                color: "White",
                storage: "256GB",
                ram: "12GB",
                display: "6.7 inch AMOLED",
                battery: "5000mAh",
                os: "Nothing OS 2.5",
            },
            tags: ["smartphone", "5g", "nothing", "design"],
            inventory: 175,
            ratings: { average: 4.2, count: 412 },
        },
        {
            vendor: "techworld-electronics",
            brand: "Realme",
            sku: "ELEC-PHN-RLM-007",
            name: "Realme Narzo 70 5G",
            shortDescription: "Entry 5G with 120Hz display",
            description:
                "Wallet-friendly 5G phone with Dimensity 6300, 120Hz display, and 50MP camera.",
            price: 1399900,
            compareAt: 1599900,
            attributes: {
                color: "Mythic Gold",
                storage: "128GB",
                ram: "6GB",
                display: "6.72 inch IPS",
            },
            tags: ["smartphone", "5g", "budget", "realme"],
            inventory: 410,
            ratings: { average: 3.9, count: 280 },
        },
    ],

    laptops: [
        {
            vendor: "techworld-electronics",
            brand: "Apple",
            sku: "ELEC-LAP-APL-001",
            name: "MacBook Air 13\" M3",
            shortDescription: "M3 chip, 18hr battery, fanless design",
            description:
                "Ultra-portable laptop powered by Apple M3 silicon, 18-hour battery life.",
            price: 11490000,
            compareAt: 11990000,
            attributes: { ram: "16GB", storage: "512GB SSD", display: "13.6 inch Liquid Retina" },
            tags: ["laptop", "apple", "ultrabook"],
            inventory: 60,
            ratings: { average: 4.8, count: 521 },
        },
        {
            vendor: "techworld-electronics",
            brand: "Dell",
            sku: "ELEC-LAP-DEL-002",
            name: "Dell XPS 15 OLED",
            shortDescription: "Intel Core Ultra 9, RTX 4070, OLED display",
            description:
                "Creator laptop with OLED 3.5K display, Intel Core Ultra 9, and NVIDIA RTX 4070.",
            price: 21999900,
            compareAt: 23999900,
            attributes: { ram: "32GB", storage: "1TB SSD", display: "15.6 inch OLED" },
            tags: ["laptop", "creator", "windows"],
            inventory: 25,
            ratings: { average: 4.6, count: 210 },
        },
        {
            vendor: "techworld-electronics",
            brand: "Lenovo",
            sku: "ELEC-LAP-LEN-003",
            name: "ThinkPad X1 Carbon Gen 12",
            shortDescription: "Business ultrabook with Intel Core Ultra",
            description:
                "Premium business laptop, Intel Core Ultra, MIL-SPEC durability.",
            price: 17499900,
            attributes: { ram: "32GB", storage: "1TB SSD", display: "14 inch IPS" },
            tags: ["laptop", "business", "lenovo"],
            inventory: 40,
            ratings: { average: 4.7, count: 312 },
        },
        {
            vendor: "techworld-electronics",
            brand: "Asus",
            sku: "ELEC-LAP-ASU-004",
            name: "ASUS ROG Zephyrus G14",
            shortDescription: "Ryzen 9, RTX 4060, 14\" QHD 165Hz",
            description:
                "Compact gaming laptop with Ryzen 9 8945HS, RTX 4060, and 165Hz QHD display.",
            price: 16499900,
            compareAt: 17999900,
            attributes: { ram: "16GB", storage: "1TB SSD", display: "14 inch QHD 165Hz" },
            tags: ["laptop", "gaming", "asus", "rog"],
            inventory: 35,
            ratings: { average: 4.6, count: 412 },
        },
        {
            vendor: "techworld-electronics",
            brand: "HP",
            sku: "ELEC-LAP-HP-005",
            name: "HP Pavilion Aero 13",
            shortDescription: "Sub-1kg ultrabook, AMD Ryzen 7",
            description:
                "Lightweight magnesium-alloy ultrabook with Ryzen 7 7735U and 16:10 display.",
            price: 8499900,
            compareAt: 9499900,
            attributes: { ram: "16GB", storage: "512GB SSD", display: "13.3 inch IPS" },
            tags: ["laptop", "ultrabook", "hp"],
            inventory: 70,
            ratings: { average: 4.2, count: 188 },
        },
        {
            vendor: "techworld-electronics",
            brand: "Acer",
            sku: "ELEC-LAP-ACR-006",
            name: "Acer Aspire 5 Slim",
            shortDescription: "Budget all-rounder, Intel Core i5",
            description:
                "Reliable everyday laptop with Intel Core i5-1335U and full HD display.",
            price: 4499900,
            attributes: { ram: "8GB", storage: "512GB SSD", display: "15.6 inch FHD" },
            tags: ["laptop", "budget", "acer"],
            inventory: 95,
            ratings: { average: 3.8, count: 410 },
        },
    ],

    audio: [
        {
            vendor: "techworld-electronics",
            brand: "Sony",
            sku: "ELEC-AUD-SNY-001",
            name: "Sony WH-1000XM5",
            shortDescription: "Industry-leading noise cancellation",
            description:
                "Over-ear wireless headphones with class-leading active noise cancellation and 30h battery.",
            price: 2999900,
            compareAt: 3499900,
            attributes: { color: "Midnight Black", connectivity: "Bluetooth 5.2" },
            tags: ["headphones", "wireless", "noise-cancelling", "sony"],
            inventory: 130,
            ratings: { average: 4.7, count: 1840 },
        },
        {
            vendor: "techworld-electronics",
            brand: "Apple",
            sku: "ELEC-AUD-APL-002",
            name: "AirPods Pro (2nd Gen)",
            shortDescription: "Adaptive audio with USB-C case",
            description:
                "True wireless earbuds with adaptive audio, ANC, and USB-C charging case.",
            price: 2199900,
            attributes: { connectivity: "Bluetooth 5.3" },
            tags: ["earbuds", "apple", "wireless"],
            inventory: 220,
            ratings: { average: 4.6, count: 2410 },
        },
        {
            vendor: "techworld-electronics",
            brand: "JBL",
            sku: "ELEC-AUD-JBL-003",
            name: "JBL Flip 6 Bluetooth Speaker",
            shortDescription: "Portable, IP67 waterproof, 12hr playback",
            description:
                "Compact portable Bluetooth speaker with bold sound and waterproof design.",
            price: 999900,
            compareAt: 1199900,
            attributes: { color: "Squad", connectivity: "Bluetooth 5.1" },
            tags: ["speaker", "portable", "jbl"],
            inventory: 180,
            ratings: { average: 4.5, count: 990 },
        },
        {
            vendor: "techworld-electronics",
            brand: "Bose",
            sku: "ELEC-AUD-BOS-004",
            name: "Bose QuietComfort Ultra Headphones",
            shortDescription: "Spatial audio, world-class ANC",
            description:
                "Wireless over-ears with immersive spatial audio and Bose's signature noise cancellation.",
            price: 3499900,
            compareAt: 3899900,
            attributes: { color: "Black", connectivity: "Bluetooth 5.3" },
            tags: ["headphones", "wireless", "noise-cancelling", "bose"],
            inventory: 65,
            ratings: { average: 4.7, count: 612 },
        },
        {
            vendor: "techworld-electronics",
            brand: "Sennheiser",
            sku: "ELEC-AUD-SEN-005",
            name: "Sennheiser Momentum True Wireless 4",
            shortDescription: "Audiophile-tier earbuds, 30h total battery",
            description:
                "Audiophile earbuds with adaptive ANC, aptX Lossless, and 7.5h on a single charge.",
            price: 2599900,
            attributes: { color: "Graphite", connectivity: "Bluetooth 5.4" },
            tags: ["earbuds", "wireless", "audiophile", "sennheiser"],
            inventory: 55,
            ratings: { average: 4.4, count: 218 },
        },
        {
            vendor: "techworld-electronics",
            brand: "boAt",
            sku: "ELEC-AUD-BOT-006",
            name: "boAt Stone 350 Bluetooth Speaker",
            shortDescription: "Budget portable speaker, 12W",
            description:
                "Pocket-sized Bluetooth speaker with 12W output and IPX7 splash resistance.",
            price: 159900,
            compareAt: 249900,
            attributes: { color: "Active Black", connectivity: "Bluetooth 5.3" },
            tags: ["speaker", "portable", "boat", "budget"],
            inventory: 320,
            ratings: { average: 3.9, count: 1840 },
        },
    ],

    "mens-clothing": [
        {
            vendor: "urban-threads",
            brand: "Levi's",
            sku: "FASH-MEN-LVS-001",
            name: "Levi's 511 Slim Fit Jeans",
            shortDescription: "Classic slim fit denim",
            description: "Iconic 511 slim fit jeans with stretch denim for all-day comfort.",
            price: 299900,
            compareAt: 399900,
            attributes: { color: "Indigo", material: "98% Cotton, 2% Elastane", fit: "Slim" },
            tags: ["jeans", "menswear", "denim"],
            inventory: 240,
            ratings: { average: 4.4, count: 562 },
        },
        {
            vendor: "urban-threads",
            brand: "Nike",
            sku: "FASH-MEN-NKE-002",
            name: "Nike Sportswear Club Hoodie",
            shortDescription: "Soft fleece pullover hoodie",
            description: "Everyday fleece hoodie with kangaroo pocket and adjustable hood.",
            price: 349900,
            attributes: { color: "Heather Gray", material: "Cotton/Polyester" },
            tags: ["hoodie", "menswear", "nike"],
            inventory: 180,
            ratings: { average: 4.6, count: 312 },
        },
        {
            vendor: "urban-threads",
            brand: "Allen Solly",
            sku: "FASH-MEN-ALS-003",
            name: "Allen Solly Linen Shirt",
            shortDescription: "Lightweight linen blend",
            description: "Breathable linen-blend shirt, perfect for warm weather.",
            price: 169900,
            compareAt: 229900,
            attributes: { color: "Sky Blue", material: "Linen Blend", fit: "Regular" },
            tags: ["shirt", "menswear", "linen"],
            inventory: 300,
            ratings: { average: 4.3, count: 188 },
        },
        {
            vendor: "urban-threads",
            brand: "Adidas",
            sku: "FASH-MEN-ADD-004",
            name: "Adidas Ultraboost 22 Running Shoes",
            shortDescription: "Boost cushioning, Primeknit upper",
            description: "Energy-returning running shoes with Boost midsole and breathable Primeknit.",
            price: 1599900,
            compareAt: 1799900,
            attributes: { color: "Core Black", material: "Primeknit" },
            tags: ["shoes", "menswear", "running", "adidas"],
            inventory: 95,
            ratings: { average: 4.6, count: 740 },
        },
        {
            vendor: "urban-threads",
            brand: "U.S. Polo Assn.",
            sku: "FASH-MEN-USP-005",
            name: "U.S. Polo Assn. Cotton Polo T-Shirt",
            shortDescription: "Classic fit, embroidered logo",
            description: "Soft cotton piqué polo with ribbed collar and signature embroidered logo.",
            price: 129900,
            attributes: { color: "Navy", material: "100% Cotton", fit: "Regular" },
            tags: ["polo", "menswear", "casual"],
            inventory: 280,
            ratings: { average: 4.4, count: 522 },
        },
        {
            vendor: "urban-threads",
            brand: "Roadster",
            sku: "FASH-MEN-RDS-006",
            name: "Roadster Casual Cargo Pants",
            shortDescription: "Tapered fit, multi-pocket",
            description: "Cotton-blend cargo pants with tapered leg and six functional pockets.",
            price: 149900,
            compareAt: 199900,
            attributes: { color: "Olive", material: "Cotton Blend", fit: "Tapered" },
            tags: ["pants", "menswear", "cargo", "casual"],
            inventory: 220,
            ratings: { average: 3.8, count: 145 },
        },
    ],

    "womens-clothing": [
        {
            vendor: "urban-threads",
            brand: "H&M",
            sku: "FASH-WMN-HNM-001",
            name: "H&M A-line Midi Dress",
            shortDescription: "Floral print, summer fit",
            description: "A-line midi dress in light viscose with all-over floral print.",
            price: 199900,
            compareAt: 249900,
            attributes: { color: "Cream Floral", material: "Viscose" },
            tags: ["dress", "womenswear", "summer"],
            inventory: 210,
            ratings: { average: 4.5, count: 410 },
        },
        {
            vendor: "urban-threads",
            brand: "Zara",
            sku: "FASH-WMN-ZAR-002",
            name: "Zara Oversized Blazer",
            shortDescription: "Tailored oversized fit",
            description: "Structured oversized blazer with notched lapels, fully lined.",
            price: 599900,
            attributes: { color: "Camel", material: "Wool Blend", fit: "Oversized" },
            tags: ["blazer", "womenswear", "formal"],
            inventory: 90,
            ratings: { average: 4.7, count: 156 },
        },
        {
            vendor: "urban-threads",
            brand: "Adidas",
            sku: "FASH-WMN-ADD-003",
            name: "Adidas Originals Leggings",
            shortDescription: "Stretch leggings with 3-stripes",
            description: "High-rise leggings with classic 3-stripes branding.",
            price: 249900,
            attributes: { color: "Black", material: "Cotton/Elastane" },
            tags: ["leggings", "activewear", "adidas"],
            inventory: 260,
            ratings: { average: 4.5, count: 298 },
        },
        {
            vendor: "urban-threads",
            brand: "Forever 21",
            sku: "FASH-WMN-F21-004",
            name: "Forever 21 Cropped Denim Jacket",
            shortDescription: "Vintage-wash crop fit",
            description: "Distressed cropped denim jacket with button front and chest pockets.",
            price: 229900,
            compareAt: 299900,
            attributes: { color: "Light Blue", material: "Cotton Denim", fit: "Cropped" },
            tags: ["jacket", "womenswear", "denim"],
            inventory: 140,
            ratings: { average: 4.3, count: 218 },
        },
        {
            vendor: "urban-threads",
            brand: "FabIndia",
            sku: "FASH-WMN-FAB-005",
            name: "FabIndia Cotton Anarkali Kurta",
            shortDescription: "Hand block print, ankle length",
            description: "Hand block printed Anarkali kurta in pure cotton with delicate embroidery.",
            price: 349900,
            attributes: { color: "Indigo", material: "Cotton", fit: "Anarkali" },
            tags: ["kurta", "womenswear", "ethnic", "cotton"],
            inventory: 165,
            ratings: { average: 4.7, count: 488 },
        },
        {
            vendor: "urban-threads",
            brand: "Vero Moda",
            sku: "FASH-WMN-VRM-006",
            name: "Vero Moda Pleated Mini Skirt",
            shortDescription: "Tennis-style pleated mini",
            description: "High-rise pleated mini skirt with hidden side zip and lining.",
            price: 159900,
            compareAt: 199900,
            attributes: { color: "Black", material: "Polyester Blend" },
            tags: ["skirt", "womenswear", "casual"],
            inventory: 175,
            ratings: { average: 3.9, count: 132 },
        },
    ],

    cookware: [
        {
            vendor: "homewise-living",
            brand: "Prestige",
            sku: "HOME-CKW-PST-001",
            name: "Prestige Non-stick Frying Pan 26cm",
            shortDescription: "5-layer non-stick coating",
            description: "Durable non-stick frying pan with stay-cool handle, induction-friendly base.",
            price: 129900,
            compareAt: 179900,
            attributes: { material: "Aluminium", size: "26cm" },
            tags: ["cookware", "non-stick", "kitchen"],
            inventory: 150,
            ratings: { average: 4.4, count: 410 },
        },
        {
            vendor: "homewise-living",
            brand: "Hawkins",
            sku: "HOME-CKW-HWK-002",
            name: "Hawkins Stainless Steel Pressure Cooker 5L",
            shortDescription: "ISI-marked, induction compatible",
            description: "Triple-bottom stainless steel pressure cooker, induction & gas compatible.",
            price: 369900,
            attributes: { material: "Stainless Steel", capacity: "5L" },
            tags: ["cookware", "pressure-cooker", "kitchen"],
            inventory: 120,
            ratings: { average: 4.6, count: 532 },
        },
        {
            vendor: "homewise-living",
            brand: "Cello",
            sku: "HOME-CKW-CLO-003",
            name: "Cello Glass Storage Set (5 pcs)",
            shortDescription: "Airtight borosilicate containers",
            description: "Set of 5 airtight borosilicate glass storage containers, microwave-safe.",
            price: 149900,
            compareAt: 199900,
            attributes: { material: "Borosilicate Glass", pieces: 5 },
            tags: ["storage", "kitchen", "glass"],
            inventory: 200,
            ratings: { average: 4.3, count: 220 },
        },
        {
            vendor: "homewise-living",
            brand: "Le Creuset",
            sku: "HOME-CKW-LCR-004",
            name: "Le Creuset Cast Iron Dutch Oven 4.5L",
            shortDescription: "Enamel cast iron, lifetime warranty",
            description: "Enameled cast iron Dutch oven, oven-safe to 260°C, ideal for slow cooking.",
            price: 2899900,
            compareAt: 3299900,
            attributes: { material: "Cast Iron", capacity: "4.5L", color: "Cerise" },
            tags: ["cookware", "premium", "kitchen", "cast-iron"],
            inventory: 35,
            ratings: { average: 4.8, count: 312 },
        },
        {
            vendor: "homewise-living",
            brand: "Borosil",
            sku: "HOME-CKW-BOR-005",
            name: "Borosil Glass Mixing Bowls (Set of 4)",
            shortDescription: "Microwave-safe nesting bowls",
            description: "Set of 4 nesting glass mixing bowls, freezer-to-oven-safe borosilicate.",
            price: 89900,
            compareAt: 119900,
            attributes: { material: "Borosilicate Glass", pieces: 4 },
            tags: ["kitchen", "bowls", "borosil"],
            inventory: 240,
            ratings: { average: 4.2, count: 410 },
        },
        {
            vendor: "homewise-living",
            brand: "Vinod",
            sku: "HOME-CKW-VND-006",
            name: "Vinod Hard Anodized Kadai 2.6L",
            shortDescription: "Hard anodized, gas-friendly",
            description: "Hard anodized 2.6L kadai with stainless steel lid and stay-cool handles.",
            price: 199900,
            attributes: { material: "Hard Anodized Aluminium", capacity: "2.6L" },
            tags: ["cookware", "kadai", "kitchen"],
            inventory: 180,
            ratings: { average: 3.9, count: 165 },
        },
    ],

    appliances: [
        {
            vendor: "homewise-living",
            brand: "Philips",
            sku: "HOME-APP-PHL-001",
            name: "Philips Air Fryer HD9252",
            shortDescription: "4.1L Rapid Air technology",
            description: "Healthy fryer using Rapid Air technology, fits a whole chicken.",
            price: 899900,
            compareAt: 1099900,
            attributes: { capacity: "4.1L", power: "1400W" },
            tags: ["appliance", "kitchen", "air-fryer"],
            inventory: 80,
            ratings: { average: 4.6, count: 1212 },
        },
        {
            vendor: "homewise-living",
            brand: "Dyson",
            sku: "HOME-APP-DYS-002",
            name: "Dyson V11 Cordless Vacuum",
            shortDescription: "Up to 60 min run time",
            description: "Powerful cordless vacuum with intelligent suction and LCD screen.",
            price: 4499900,
            attributes: { runtime: "60 minutes", weight: "2.97kg" },
            tags: ["appliance", "home", "vacuum"],
            inventory: 35,
            ratings: { average: 4.7, count: 412 },
        },
        {
            vendor: "homewise-living",
            brand: "Bosch",
            sku: "HOME-APP-BSH-003",
            name: "Bosch 7kg Front Load Washing Machine",
            shortDescription: "Energy-efficient, 1200rpm",
            description: "Front-loading washing machine with EcoSilence drive and 15 wash programs.",
            price: 3499900,
            attributes: { capacity: "7kg", spin: "1200rpm" },
            tags: ["appliance", "laundry"],
            inventory: 28,
            ratings: { average: 4.5, count: 188 },
        },
        {
            vendor: "homewise-living",
            brand: "Instant Pot",
            sku: "HOME-APP-INP-004",
            name: "Instant Pot Duo 7-in-1 6L",
            shortDescription: "Pressure cook, slow cook, sauté",
            description: "7-in-1 multi-cooker: pressure, slow, sauté, rice, yogurt, steam, warm.",
            price: 999900,
            compareAt: 1299900,
            attributes: { capacity: "6L", power: "1000W" },
            tags: ["appliance", "kitchen", "multi-cooker"],
            inventory: 95,
            ratings: { average: 4.6, count: 980 },
        },
        {
            vendor: "homewise-living",
            brand: "LG",
            sku: "HOME-APP-LG-005",
            name: "LG 1.5 Ton Inverter Split AC",
            shortDescription: "5-star, dual inverter, low noise",
            description: "Dual inverter split AC with 5-star rating and copper condenser coil.",
            price: 4299900,
            compareAt: 4799900,
            attributes: { capacity: "1.5 Ton", rating: "5 Star" },
            tags: ["appliance", "ac", "lg"],
            inventory: 22,
            ratings: { average: 4.4, count: 612 },
        },
        {
            vendor: "homewise-living",
            brand: "Mi",
            sku: "HOME-APP-MI-006",
            name: "Mi Robot Vacuum-Mop 2 Pro",
            shortDescription: "LDS navigation, app control",
            description: "Self-charging robot vacuum + mop with laser navigation and 3000Pa suction.",
            price: 2499900,
            attributes: { suction: "3000Pa", battery: "5200mAh" },
            tags: ["appliance", "vacuum", "smart-home", "robot"],
            inventory: 50,
            ratings: { average: 4.0, count: 412 },
        },
    ],

    fitness: [
        {
            vendor: "peakgear",
            brand: "Decathlon",
            sku: "SPRT-FIT-DCT-001",
            name: "Decathlon Yoga Mat 8mm",
            shortDescription: "Non-slip TPE mat",
            description: "Cushioned 8mm thick TPE yoga mat with carrying strap.",
            price: 99900,
            compareAt: 129900,
            attributes: { thickness: "8mm", material: "TPE" },
            tags: ["fitness", "yoga", "mat"],
            inventory: 300,
            ratings: { average: 4.5, count: 612 },
        },
        {
            vendor: "peakgear",
            brand: "PowerMax",
            sku: "SPRT-FIT-PWX-002",
            name: "PowerMax Adjustable Dumbbells 20kg",
            shortDescription: "Quick-change weights",
            description: "Pair of adjustable dumbbells, 2.5kg to 20kg per side.",
            price: 999900,
            attributes: { weight: "20kg", type: "Adjustable" },
            tags: ["fitness", "strength", "dumbbells"],
            inventory: 75,
            ratings: { average: 4.6, count: 240 },
        },
        {
            vendor: "peakgear",
            brand: "Domyos",
            sku: "SPRT-FIT-DMS-003",
            name: "Domyos Resistance Bands Set",
            shortDescription: "5 levels of resistance",
            description: "Set of 5 resistance bands with handles, ankle straps, and door anchor.",
            price: 199900,
            attributes: { pieces: 5 },
            tags: ["fitness", "resistance", "home-workout"],
            inventory: 180,
            ratings: { average: 4.4, count: 320 },
        },
        {
            vendor: "peakgear",
            brand: "Liforme",
            sku: "SPRT-FIT-LFM-004",
            name: "Liforme Original Premium Yoga Mat",
            shortDescription: "Eco-friendly, alignment markers",
            description: "Premium grippy yoga mat with patented AlignForMe markers and biodegradable base.",
            price: 1199900,
            compareAt: 1399900,
            attributes: { thickness: "4.2mm", material: "Natural Rubber + Eco PU" },
            tags: ["fitness", "yoga", "premium"],
            inventory: 50,
            ratings: { average: 4.8, count: 410 },
        },
        {
            vendor: "peakgear",
            brand: "Cult.fit",
            sku: "SPRT-FIT-CLT-005",
            name: "Cult Sport Skipping Rope",
            shortDescription: "Steel-wire, ball bearings",
            description: "Adjustable PVC-coated steel-wire skipping rope with smooth ball-bearing handles.",
            price: 49900,
            compareAt: 79900,
            attributes: { material: "Steel Wire + PVC" },
            tags: ["fitness", "cardio", "skipping"],
            inventory: 420,
            ratings: { average: 4.1, count: 612 },
        },
        {
            vendor: "peakgear",
            brand: "Reach",
            sku: "SPRT-FIT-RCH-006",
            name: "Reach Foam Roller (High Density)",
            shortDescription: "Muscle recovery, 18 inch",
            description: "High-density EPP foam roller for myofascial release and post-workout recovery.",
            price: 79900,
            attributes: { length: "18 inch", material: "EPP Foam" },
            tags: ["fitness", "recovery", "foam-roller"],
            inventory: 220,
            ratings: { average: 3.8, count: 188 },
        },
    ],

    outdoor: [
        {
            vendor: "peakgear",
            brand: "Quechua",
            sku: "SPRT-OUT-QCH-001",
            name: "Quechua MH100 Hiking Backpack 30L",
            shortDescription: "Lightweight, water-resistant",
            description: "30L hiking backpack with hydration pocket and rain cover.",
            price: 199900,
            compareAt: 249900,
            attributes: { capacity: "30L", weight: "650g" },
            tags: ["outdoor", "hiking", "backpack"],
            inventory: 140,
            ratings: { average: 4.5, count: 410 },
        },
        {
            vendor: "peakgear",
            brand: "Coleman",
            sku: "SPRT-OUT-CLM-002",
            name: "Coleman 4-Person Tent",
            shortDescription: "Weatherproof, 5-min setup",
            description: "Family camping tent with WeatherTec system and easy setup.",
            price: 1199900,
            attributes: { capacity: "4 person", weight: "4.6kg" },
            tags: ["outdoor", "camping", "tent"],
            inventory: 45,
            ratings: { average: 4.6, count: 198 },
        },
        {
            vendor: "peakgear",
            brand: "Forclaz",
            sku: "SPRT-OUT-FCL-003",
            name: "Forclaz Trekking Poles (Pair)",
            shortDescription: "Telescopic aluminium poles",
            description: "Lightweight aluminium trekking poles with cork grips and shock absorption.",
            price: 299900,
            attributes: { material: "Aluminium", weight: "240g per pole" },
            tags: ["outdoor", "trekking", "poles"],
            inventory: 110,
            ratings: { average: 4.4, count: 145 },
        },
        {
            vendor: "peakgear",
            brand: "Wildcraft",
            sku: "SPRT-OUT-WLD-004",
            name: "Wildcraft Hypadura Trekking Shoes",
            shortDescription: "Waterproof, ankle support",
            description: "All-terrain trekking shoes with Hypadura upper, waterproof membrane and grippy outsole.",
            price: 449900,
            compareAt: 599900,
            attributes: { material: "Hypadura", color: "Brown" },
            tags: ["outdoor", "footwear", "trekking", "waterproof"],
            inventory: 130,
            ratings: { average: 4.5, count: 380 },
        },
        {
            vendor: "peakgear",
            brand: "Stanley",
            sku: "SPRT-OUT-STN-005",
            name: "Stanley Classic Vacuum Insulated Bottle 1.1L",
            shortDescription: "24h cold, 32h hot",
            description: "Iconic stainless steel insulated bottle with leak-proof lid that doubles as a cup.",
            price: 379900,
            attributes: { material: "Stainless Steel", capacity: "1.1L" },
            tags: ["outdoor", "bottle", "insulated"],
            inventory: 165,
            ratings: { average: 4.7, count: 920 },
        },
        {
            vendor: "peakgear",
            brand: "Bivouac",
            sku: "SPRT-OUT-BVQ-006",
            name: "Bivouac Inflatable Sleeping Pad",
            shortDescription: "Compact, R-value 2.5",
            description: "Lightweight inflatable sleeping pad, packs to bottle-size for backpacking.",
            price: 249900,
            compareAt: 329900,
            attributes: { weight: "490g", rValue: "2.5" },
            tags: ["outdoor", "camping", "sleeping-pad"],
            inventory: 90,
            ratings: { average: 3.9, count: 110 },
        },
    ],
};

const insertProduct = db.prepare(`
  INSERT INTO products (
    id, sku, name, slug, description, short_description,
    category_id, vendor_id, brand,
    price_amount, price_currency, price_compare_at,
    attributes, tags, images,
    inventory_quantity, inventory_reserved, inventory_warehouse,
    ratings_average, ratings_count,
    status, created_at, updated_at
  ) VALUES (
    @id, @sku, @name, @slug, @description, @short_description,
    @category_id, @vendor_id, @brand,
    @price_amount, @price_currency, @price_compare_at,
    @attributes, @tags, @images,
    @inventory_quantity, @inventory_reserved, @inventory_warehouse,
    @ratings_average, @ratings_count,
    @status, @created_at, @updated_at
  )
`);

function slugify(s) {
    return s
        .toLowerCase()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

// Bundled thumbnail filenames in frontend/public/assets/images/thumbs/.
// Note: product-img4.png is intentionally absent in the theme assets.
const AVAILABLE_THUMBS = [
    "product-img1.png", "product-img2.png", "product-img3.png",
    "product-img5.png", "product-img6.png", "product-img7.png",
    "product-img8.png", "product-img9.png", "product-img10.png",
    "product-img11.png", "product-img12.png", "product-img13.png",
    "product-img14.png", "product-img15.png", "product-img16.png",
    "product-img17.png", "product-img18.png", "product-img19.png",
    "product-img20.png", "product-img21.png", "product-img22.png",
    "product-img23.png", "product-img24.png", "product-img25.png",
];

let imageIdx = 0;
function nextImageUrl() {
    const name = AVAILABLE_THUMBS[imageIdx % AVAILABLE_THUMBS.length];
    imageIdx++;
    return `/assets/images/thumbs/${name}`;
}

let productCount = 0;
const insertMany = db.transaction(() => {
    for (const [categorySlug, products] of Object.entries(productsByCategorySlug)) {
        const cat = categoriesBySlug[categorySlug];
        if (!cat) {
            console.warn(`Skipping unknown category slug: ${categorySlug}`);
            continue;
        }

        for (const p of products) {
            const vendor = vendorsBySlug[p.vendor];
            if (!vendor) {
                console.warn(`Skipping product ${p.sku}: unknown vendor ${p.vendor}`);
                continue;
            }

            const id = createId("product");
            const created = now();
            const images = [
                {
                    url: nextImageUrl(),
                    alt: p.name,
                    isPrimary: true,
                },
            ];

            insertProduct.run({
                id,
                sku: p.sku,
                name: p.name,
                slug: slugify(p.name),
                description: p.description,
                short_description: p.shortDescription,
                category_id: cat.id,
                vendor_id: vendor.id,
                brand: p.brand,
                price_amount: p.price,
                price_currency: "INR",
                price_compare_at: p.compareAt ?? null,
                attributes: JSON.stringify(p.attributes ?? {}),
                tags: JSON.stringify(p.tags ?? []),
                images: JSON.stringify(images),
                inventory_quantity: p.inventory ?? 0,
                inventory_reserved: 0,
                inventory_warehouse: "HYD-WH-01",
                ratings_average: p.ratings?.average ?? 0,
                ratings_count: p.ratings?.count ?? 0,
                status: "active",
                created_at: created,
                updated_at: created,
            });
            productCount++;
        }
    }
});

insertMany();

console.log(
    `Seeded: ${Object.keys(categoriesBySlug).length} categories, ` +
    `${Object.keys(vendorsBySlug).length} vendors, ` +
    `${productCount} products.`
);
