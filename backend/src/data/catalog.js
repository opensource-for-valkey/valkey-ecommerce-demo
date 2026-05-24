export const categories = [
  "Smartphones",
  "Laptops & Computing",
  "Audio",
  "Gaming",
  "Fashion",
  "Footwear",
  "Watches & Accessories",
  "Home & Living",
  "Fitness & Wellness",
  "Beauty"
];

export const coupons = [
  {
    code: "VALKEY10",
    type: "percent",
    value: 10,
    description: "10% off your cart",
    minimumSubtotal: 40
  },
  {
    code: "FREESHIP",
    type: "shipping",
    value: 7.99,
    description: "Free standard delivery",
    minimumSubtotal: 60
  },
  {
    code: "LAUNCH20",
    type: "percent",
    value: 20,
    description: "Launch week savings",
    minimumSubtotal: 120
  }
];

const productAsset = (id, shot = "studio") =>
  `assets/images/commerce/${id}-${shot}.png`;

const productGallery = (id) => [
  productAsset(id, "studio"),
  productAsset(id, "angle"),
  productAsset(id, "lifestyle")
];

const makeProduct = ({
  id,
  sku,
  name,
  category,
  subcategory,
  brand,
  vendor = brand,
  price,
  originalPrice,
  rating,
  reviewCount,
  stock,
  sold,
  badges,
  tags,
  description,
  variants,
  specs
}) => ({
  id,
  sku,
  name,
  category,
  subcategory,
  brand,
  vendor,
  price,
  originalPrice,
  rating,
  reviewCount,
  stock,
  sold,
  image: productAsset(id),
  hoverImage: productAsset(id, "angle"),
  gallery: productGallery(id),
  badges,
  tags,
  description,
  variants,
  specs
});

export const products = [
  makeProduct({
    id: "astra-nova-x1-smartphone",
    sku: "PHN-AST-X1",
    name: "Astra Nova X1 Smartphone",
    category: "Smartphones",
    subcategory: "Flagship phones",
    brand: "Astra",
    price: 899,
    originalPrice: 1099,
    rating: 4.9,
    reviewCount: 8420,
    stock: 32,
    sold: 5120,
    badges: ["Featured", "Best seller"],
    tags: ["phone", "5g", "camera", "electronics", "premium"],
    description:
      "A polished 5G smartphone with a bright edge-to-edge display, AI camera system, and all-day battery.",
    variants: [
      { id: "graphite-256", label: "Graphite / 256 GB", stock: 14 },
      { id: "silver-256", label: "Silver / 256 GB", stock: 10 },
      { id: "graphite-512", label: "Graphite / 512 GB", stock: 8 }
    ],
    specs: {
      display: "6.7 inch OLED, 120 Hz",
      storage: "256 GB or 512 GB",
      camera: "48 MP triple lens",
      battery: "Up to 29 hours video"
    }
  }),
  makeProduct({
    id: "luma-pixel-pro-smartphone",
    sku: "PHN-LUM-PRO",
    name: "Luma Pixel Pro Smartphone",
    category: "Smartphones",
    subcategory: "Camera phones",
    brand: "Luma",
    price: 749,
    originalPrice: 899,
    rating: 4.8,
    reviewCount: 6284,
    stock: 41,
    sold: 4310,
    badges: ["New arrival", "Deal"],
    tags: ["phone", "camera", "android", "5g", "travel"],
    description:
      "A photography-first smartphone tuned for low-light portraits, fast charging, and durable daily use.",
    variants: [
      { id: "sage-128", label: "Sage / 128 GB", stock: 16 },
      { id: "cream-256", label: "Cream / 256 GB", stock: 15 },
      { id: "black-256", label: "Black / 256 GB", stock: 10 }
    ],
    specs: {
      display: "6.4 inch AMOLED",
      camera: "50 MP wide and 12 MP ultra-wide",
      charging: "50% in 28 minutes",
      waterResistance: "IP68"
    }
  }),
  makeProduct({
    id: "nebula-fold-mini-phone",
    sku: "PHN-NEB-FLD",
    name: "Nebula Fold Mini",
    category: "Smartphones",
    subcategory: "Foldables",
    brand: "Nebula",
    price: 1199,
    originalPrice: 1399,
    rating: 4.7,
    reviewCount: 2218,
    stock: 18,
    sold: 1540,
    badges: ["Featured", "Low stock"],
    tags: ["phone", "foldable", "5g", "productivity", "premium"],
    description:
      "A compact foldable phone with a pocketable outer screen and a tablet-like inner canvas.",
    variants: [
      { id: "violet-512", label: "Violet / 512 GB", stock: 7 },
      { id: "midnight-512", label: "Midnight / 512 GB", stock: 11 }
    ],
    specs: {
      innerDisplay: "7.1 inch folding OLED",
      outerDisplay: "4.2 inch OLED",
      hinge: "Tested to 250k folds",
      warranty: "2 years"
    }
  }),
  makeProduct({
    id: "astrabook-air-14",
    sku: "LAP-AST-A14",
    name: "AstraBook Air 14",
    category: "Laptops & Computing",
    subcategory: "Ultrabooks",
    brand: "Astra",
    price: 999,
    originalPrice: 1199,
    rating: 4.8,
    reviewCount: 3196,
    stock: 24,
    sold: 2280,
    badges: ["Featured", "Free returns"],
    tags: ["laptop", "work", "travel", "computer", "ultrabook"],
    description:
      "A slim 14-inch productivity laptop with a vivid display, quiet keyboard, and long battery life.",
    variants: [
      { id: "16-512", label: "16 GB / 512 GB", stock: 13 },
      { id: "24-1tb", label: "24 GB / 1 TB", stock: 11 }
    ],
    specs: {
      processor: "12-core hybrid CPU",
      display: "14 inch 2.8K matte",
      weight: "2.4 lb",
      battery: "Up to 18 hours"
    }
  }),
  makeProduct({
    id: "forgebook-pro-16",
    sku: "LAP-FRG-P16",
    name: "ForgeBook Pro 16",
    category: "Laptops & Computing",
    subcategory: "Creator laptops",
    brand: "Forge",
    price: 1899,
    originalPrice: 2199,
    rating: 4.7,
    reviewCount: 1742,
    stock: 13,
    sold: 920,
    badges: ["Creator pick", "Low stock"],
    tags: ["laptop", "creator", "video", "workstation", "performance"],
    description:
      "A high-performance 16-inch laptop for design, video editing, and demanding multitasking.",
    variants: [
      { id: "32-1tb", label: "32 GB / 1 TB", stock: 8 },
      { id: "64-2tb", label: "64 GB / 2 TB", stock: 5 }
    ],
    specs: {
      processor: "16-core performance CPU",
      graphics: "Dedicated creator GPU",
      display: "16 inch mini-LED",
      ports: "Thunderbolt, HDMI, SD"
    }
  }),
  makeProduct({
    id: "creator-studio-tablet",
    sku: "CMP-CRT-TAB",
    name: "Creator Studio Tablet",
    category: "Laptops & Computing",
    subcategory: "Tablets",
    brand: "Canvas",
    price: 679,
    originalPrice: 799,
    rating: 4.6,
    reviewCount: 1940,
    stock: 37,
    sold: 1715,
    badges: ["New arrival"],
    tags: ["tablet", "stylus", "creative", "display", "work"],
    description:
      "A portable creative tablet with a laminated display, responsive stylus, and desktop-class apps.",
    variants: [
      { id: "blue-256", label: "Blue / 256 GB", stock: 20 },
      { id: "gray-512", label: "Gray / 512 GB", stock: 17 }
    ],
    specs: {
      display: "12.9 inch laminated LCD",
      stylus: "Included",
      storage: "256 GB or 512 GB",
      battery: "Up to 12 hours"
    }
  }),
  makeProduct({
    id: "pulse-anc-earbuds-pro",
    sku: "AUD-PLS-ANC",
    name: "Pulse ANC Earbuds Pro",
    category: "Audio",
    subcategory: "Earbuds",
    brand: "Pulse Labs",
    price: 129,
    originalPrice: 179,
    rating: 4.9,
    reviewCount: 11320,
    stock: 56,
    sold: 8420,
    badges: ["Best seller", "Deal"],
    tags: ["audio", "wireless", "earbuds", "noise canceling", "travel"],
    description:
      "Adaptive noise cancellation, multipoint pairing, and a compact wireless charging case.",
    variants: [
      { id: "graphite", label: "Graphite", stock: 26 },
      { id: "stone", label: "Stone", stock: 18 },
      { id: "sage", label: "Sage", stock: 12 }
    ],
    specs: {
      battery: "36 hours with case",
      connectivity: "Bluetooth 5.4",
      charging: "Wireless and USB-C",
      warranty: "1 year"
    }
  }),
  makeProduct({
    id: "sonicwave-over-ear-headphones",
    sku: "AUD-SNC-OE",
    name: "SonicWave Over-Ear Headphones",
    category: "Audio",
    subcategory: "Headphones",
    brand: "SonicWave",
    price: 249,
    originalPrice: 329,
    rating: 4.7,
    reviewCount: 5486,
    stock: 29,
    sold: 3024,
    badges: ["Top rated"],
    tags: ["audio", "headphones", "noise canceling", "studio", "travel"],
    description:
      "Soft over-ear headphones with spatial audio, deep noise cancellation, and premium cushions.",
    variants: [
      { id: "black", label: "Matte Black", stock: 14 },
      { id: "sand", label: "Sand", stock: 9 },
      { id: "navy", label: "Navy", stock: 6 }
    ],
    specs: {
      battery: "42 hours",
      drivers: "40 mm dynamic",
      microphones: "8 beamforming mics",
      weight: "258 g"
    }
  }),
  makeProduct({
    id: "roam-mini-bluetooth-speaker",
    sku: "AUD-ROM-SPK",
    name: "Roam Mini Bluetooth Speaker",
    category: "Audio",
    subcategory: "Speakers",
    brand: "Roam",
    price: 79,
    originalPrice: 99,
    rating: 4.6,
    reviewCount: 3175,
    stock: 68,
    sold: 4100,
    badges: ["Trending"],
    tags: ["audio", "speaker", "portable", "waterproof", "outdoor"],
    description:
      "A rugged compact speaker with rich bass, stereo pairing, and poolside water resistance.",
    variants: [
      { id: "teal", label: "Teal", stock: 25 },
      { id: "black", label: "Black", stock: 28 },
      { id: "clay", label: "Clay", stock: 15 }
    ],
    specs: {
      battery: "18 hours",
      waterResistance: "IP67",
      pairing: "Stereo pair ready",
      weight: "0.9 lb"
    }
  }),
  makeProduct({
    id: "axis-pro-smartwatch",
    sku: "WAT-AXS-PRO",
    name: "Axis Pro Smartwatch",
    category: "Watches & Accessories",
    subcategory: "Smartwatches",
    brand: "Axis",
    price: 329,
    originalPrice: 399,
    rating: 4.8,
    reviewCount: 4278,
    stock: 39,
    sold: 3610,
    badges: ["Featured", "Trending"],
    tags: ["watch", "smartwatch", "fitness", "wearable", "health"],
    description:
      "A polished smartwatch with recovery insights, safety alerts, NFC payments, and bright outdoor visibility.",
    variants: [
      { id: "black-44", label: "Black / 44 mm", stock: 18 },
      { id: "silver-44", label: "Silver / 44 mm", stock: 12 },
      { id: "black-40", label: "Black / 40 mm", stock: 9 }
    ],
    specs: {
      battery: "Up to 5 days",
      waterResistance: "5 ATM",
      sensors: "ECG, SpO2, temperature",
      connectivity: "GPS and LTE ready"
    }
  }),
  makeProduct({
    id: "mono-steel-chronograph",
    sku: "WAT-MON-CHR",
    name: "Mono Steel Chronograph",
    category: "Watches & Accessories",
    subcategory: "Analog watches",
    brand: "Mono",
    price: 219,
    originalPrice: 289,
    rating: 4.6,
    reviewCount: 1296,
    stock: 31,
    sold: 980,
    badges: ["Gift pick"],
    tags: ["watch", "chronograph", "accessory", "steel", "minimal"],
    description:
      "A clean stainless-steel chronograph with sapphire-coated glass and a refined bracelet.",
    variants: [
      { id: "steel", label: "Brushed Steel", stock: 19 },
      { id: "black", label: "Black Steel", stock: 12 }
    ],
    specs: {
      case: "42 mm stainless steel",
      movement: "Quartz chronograph",
      glass: "Sapphire-coated mineral",
      resistance: "50 m water resistant"
    }
  }),
  makeProduct({
    id: "arc-smart-fitness-band",
    sku: "FIT-ARC-BND",
    name: "Arc Smart Fitness Band",
    category: "Fitness & Wellness",
    subcategory: "Fitness trackers",
    brand: "Arc",
    price: 69,
    originalPrice: 89,
    rating: 4.5,
    reviewCount: 4052,
    stock: 72,
    sold: 4620,
    badges: ["Trending"],
    tags: ["fitness", "wearable", "health", "sleep", "tracker"],
    description:
      "A lightweight health band for sleep, heart rate, workouts, and recovery tracking.",
    variants: [
      { id: "black", label: "Black", stock: 31 },
      { id: "blue", label: "Blue", stock: 24 },
      { id: "mint", label: "Mint", stock: 17 }
    ],
    specs: {
      battery: "10 days",
      waterResistance: "5 ATM",
      sensors: "Heart rate, SpO2, accelerometer",
      app: "iOS and Android"
    }
  }),
  makeProduct({
    id: "aero-runner-knit-shoes",
    sku: "FTW-AER-RUN",
    name: "Aero Runner Knit Shoes",
    category: "Footwear",
    subcategory: "Running shoes",
    brand: "Aero",
    price: 128,
    originalPrice: 158,
    rating: 4.7,
    reviewCount: 5190,
    stock: 64,
    sold: 6028,
    badges: ["Best seller"],
    tags: ["shoes", "running", "training", "fashion", "footwear"],
    description:
      "Responsive knit running shoes with a breathable upper and cushioned road-ready midsole.",
    variants: [
      { id: "red-9", label: "Red / US 9", stock: 13 },
      { id: "red-10", label: "Red / US 10", stock: 16 },
      { id: "black-10", label: "Black / US 10", stock: 19 },
      { id: "black-11", label: "Black / US 11", stock: 16 }
    ],
    specs: {
      upper: "Engineered knit",
      midsole: "Responsive foam",
      drop: "8 mm",
      use: "Road running"
    }
  }),
  makeProduct({
    id: "court-premium-leather-sneakers",
    sku: "FTW-CRT-LTH",
    name: "Court Premium Leather Sneakers",
    category: "Footwear",
    subcategory: "Lifestyle sneakers",
    brand: "Courtline",
    price: 112,
    originalPrice: 145,
    rating: 4.6,
    reviewCount: 3384,
    stock: 58,
    sold: 2860,
    badges: ["Top rated"],
    tags: ["shoes", "sneakers", "leather", "fashion", "minimal"],
    description:
      "Soft leather everyday sneakers with a low profile, padded collar, and durable cupsole.",
    variants: [
      { id: "white-8", label: "White / US 8", stock: 12 },
      { id: "white-9", label: "White / US 9", stock: 18 },
      { id: "white-10", label: "White / US 10", stock: 15 },
      { id: "black-10", label: "Black / US 10", stock: 13 }
    ],
    specs: {
      upper: "Full-grain leather",
      lining: "Recycled textile",
      sole: "Rubber cupsole",
      care: "Wipe clean"
    }
  }),
  makeProduct({
    id: "terra-trail-hiking-shoes",
    sku: "FTW-TER-TRL",
    name: "Terra Trail Hiking Shoes",
    category: "Footwear",
    subcategory: "Outdoor shoes",
    brand: "Terra",
    price: 149,
    originalPrice: 189,
    rating: 4.7,
    reviewCount: 2468,
    stock: 43,
    sold: 1976,
    badges: ["Outdoor pick"],
    tags: ["shoes", "hiking", "trail", "waterproof", "outdoor"],
    description:
      "Stable trail shoes with waterproof lining, grippy lugs, and reinforced toe protection.",
    variants: [
      { id: "olive-9", label: "Olive / US 9", stock: 14 },
      { id: "olive-10", label: "Olive / US 10", stock: 11 },
      { id: "brown-10", label: "Brown / US 10", stock: 10 },
      { id: "brown-11", label: "Brown / US 11", stock: 8 }
    ],
    specs: {
      membrane: "Waterproof breathable",
      outsole: "Multi-directional trail lugs",
      weight: "13.8 oz",
      use: "Day hiking"
    }
  }),
  makeProduct({
    id: "studio-performance-hoodie",
    sku: "FAS-STU-HDY",
    name: "Studio Performance Hoodie",
    category: "Fashion",
    subcategory: "Hoodies",
    brand: "StudioForm",
    price: 78,
    originalPrice: 98,
    rating: 4.6,
    reviewCount: 2842,
    stock: 87,
    sold: 3420,
    badges: ["New arrival"],
    tags: ["hoodie", "fashion", "activewear", "cotton", "comfort"],
    description:
      "A premium midweight hoodie with a structured fit, hidden phone pocket, and soft fleece interior.",
    variants: [
      { id: "slate-m", label: "Slate / M", stock: 19 },
      { id: "slate-l", label: "Slate / L", stock: 23 },
      { id: "forest-m", label: "Forest / M", stock: 20 },
      { id: "forest-l", label: "Forest / L", stock: 25 }
    ],
    specs: {
      material: "Organic cotton blend",
      fit: "Relaxed athletic",
      pockets: "Kangaroo and hidden media",
      care: "Machine washable"
    }
  }),
  makeProduct({
    id: "tailored-utility-jacket",
    sku: "FAS-UTL-JKT",
    name: "Tailored Utility Jacket",
    category: "Fashion",
    subcategory: "Outerwear",
    brand: "North & Loom",
    price: 168,
    originalPrice: 220,
    rating: 4.7,
    reviewCount: 1746,
    stock: 34,
    sold: 1320,
    badges: ["Featured"],
    tags: ["jacket", "outerwear", "fashion", "travel", "utility"],
    description:
      "A refined utility jacket with weather-ready fabric, clean lines, and organized interior pockets.",
    variants: [
      { id: "olive-m", label: "Olive / M", stock: 9 },
      { id: "olive-l", label: "Olive / L", stock: 11 },
      { id: "navy-m", label: "Navy / M", stock: 8 },
      { id: "navy-l", label: "Navy / L", stock: 6 }
    ],
    specs: {
      shell: "Water-resistant cotton nylon",
      lining: "Recycled poly twill",
      pockets: "7 total",
      fit: "Tailored regular"
    }
  }),
  makeProduct({
    id: "everyday-merino-tee-pack",
    sku: "FAS-MER-TEE",
    name: "Everyday Merino Tee 3-Pack",
    category: "Fashion",
    subcategory: "Tees",
    brand: "North & Loom",
    price: 96,
    originalPrice: 126,
    rating: 4.5,
    reviewCount: 2120,
    stock: 76,
    sold: 2510,
    badges: ["Bundle"],
    tags: ["shirt", "tee", "fashion", "merino", "travel"],
    description:
      "Soft merino-blend tees designed for daily wear, travel, and temperature regulation.",
    variants: [
      { id: "neutral-m", label: "Neutral / M", stock: 22 },
      { id: "neutral-l", label: "Neutral / L", stock: 24 },
      { id: "dark-m", label: "Dark / M", stock: 16 },
      { id: "dark-l", label: "Dark / L", stock: 14 }
    ],
    specs: {
      material: "Merino and Tencel blend",
      pack: "3 tees",
      fit: "Modern regular",
      care: "Cold wash"
    }
  }),
  makeProduct({
    id: "velocity-gaming-console",
    sku: "GAM-VEL-CNS",
    name: "Velocity Gaming Console",
    category: "Gaming",
    subcategory: "Consoles",
    brand: "Velocity",
    price: 499,
    originalPrice: 549,
    rating: 4.8,
    reviewCount: 8914,
    stock: 21,
    sold: 6120,
    badges: ["Best seller", "Low stock"],
    tags: ["gaming", "console", "entertainment", "4k", "controller"],
    description:
      "A compact 4K gaming console with fast loading, quiet cooling, and a wireless controller.",
    variants: [
      { id: "1tb", label: "1 TB Console", stock: 13 },
      { id: "2tb", label: "2 TB Console Bundle", stock: 8 }
    ],
    specs: {
      resolution: "Up to 4K 120 FPS",
      storage: "1 TB NVMe",
      controller: "Included",
      compatibility: "Cloud save ready"
    }
  }),
  makeProduct({
    id: "nova-mechanical-keyboard",
    sku: "GAM-NOV-KEY",
    name: "Nova Mechanical Keyboard",
    category: "Gaming",
    subcategory: "Keyboards",
    brand: "Nova Gear",
    price: 139,
    originalPrice: 179,
    rating: 4.7,
    reviewCount: 4328,
    stock: 52,
    sold: 3860,
    badges: ["Top rated"],
    tags: ["gaming", "keyboard", "mechanical", "rgb", "desk"],
    description:
      "A compact mechanical keyboard with hot-swap switches, damped acoustics, and per-key lighting.",
    variants: [
      { id: "linear", label: "Linear switches", stock: 22 },
      { id: "tactile", label: "Tactile switches", stock: 18 },
      { id: "silent", label: "Silent switches", stock: 12 }
    ],
    specs: {
      layout: "75%",
      switches: "Hot-swap mechanical",
      connection: "USB-C and Bluetooth",
      lighting: "Per-key RGB"
    }
  }),
  makeProduct({
    id: "glide-pro-gaming-mouse",
    sku: "GAM-GLD-MSE",
    name: "Glide Pro Gaming Mouse",
    category: "Gaming",
    subcategory: "Mice",
    brand: "Nova Gear",
    price: 89,
    originalPrice: 119,
    rating: 4.6,
    reviewCount: 3920,
    stock: 66,
    sold: 4198,
    badges: ["Deal"],
    tags: ["gaming", "mouse", "wireless", "desk", "esports"],
    description:
      "An ultralight wireless mouse with precise tracking, textured side grips, and rapid charging.",
    variants: [
      { id: "black", label: "Black", stock: 34 },
      { id: "white", label: "White", stock: 21 },
      { id: "blue", label: "Blue", stock: 11 }
    ],
    specs: {
      sensor: "26K DPI optical",
      weight: "59 g",
      battery: "90 hours",
      charging: "USB-C"
    }
  }),
  makeProduct({
    id: "arcade-wireless-controller",
    sku: "GAM-ARC-CTL",
    name: "Arcade Wireless Controller",
    category: "Gaming",
    subcategory: "Controllers",
    brand: "Velocity",
    price: 69,
    originalPrice: 89,
    rating: 4.5,
    reviewCount: 2870,
    stock: 74,
    sold: 3280,
    badges: ["Player favorite"],
    tags: ["gaming", "controller", "wireless", "console", "pc"],
    description:
      "A responsive wireless controller with textured grips, motion support, and programmable buttons.",
    variants: [
      { id: "black", label: "Black", stock: 30 },
      { id: "white", label: "White", stock: 24 },
      { id: "coral", label: "Coral", stock: 20 }
    ],
    specs: {
      battery: "30 hours",
      connection: "Bluetooth and USB-C",
      rumble: "Dual haptic motors",
      platforms: "Console, PC, mobile"
    }
  }),
  makeProduct({
    id: "vista-4k-27-monitor",
    sku: "CMP-VST-4K",
    name: "Vista 4K 27 Monitor",
    category: "Laptops & Computing",
    subcategory: "Monitors",
    brand: "Vista",
    price: 389,
    originalPrice: 489,
    rating: 4.6,
    reviewCount: 2516,
    stock: 27,
    sold: 1210,
    badges: ["Creator pick"],
    tags: ["monitor", "4k", "desk", "work", "computer"],
    description:
      "A color-accurate 27-inch 4K monitor with USB-C power delivery and a height-adjustable stand.",
    variants: [
      { id: "silver", label: "Silver", stock: 15 },
      { id: "black", label: "Black", stock: 12 }
    ],
    specs: {
      resolution: "3840 x 2160",
      color: "98% DCI-P3",
      refreshRate: "75 Hz",
      usbC: "90 W power delivery"
    }
  }),
  makeProduct({
    id: "lumi-task-desk-lamp",
    sku: "HOM-LUM-LMP",
    name: "Lumi Task Desk Lamp",
    category: "Home & Living",
    subcategory: "Lighting",
    brand: "Lumi",
    price: 86,
    originalPrice: 118,
    rating: 4.7,
    reviewCount: 1654,
    stock: 48,
    sold: 2090,
    badges: ["Design pick"],
    tags: ["lamp", "desk", "home", "lighting", "work"],
    description:
      "A sculptural LED desk lamp with touch dimming, warm-to-cool light, and a weighted base.",
    variants: [
      { id: "graphite", label: "Graphite", stock: 18 },
      { id: "white", label: "White", stock: 17 },
      { id: "brass", label: "Brass", stock: 13 }
    ],
    specs: {
      brightness: "900 lumens",
      colorTemperature: "2700K to 5000K",
      controls: "Touch dimmer",
      warranty: "2 years"
    }
  }),
  makeProduct({
    id: "soft-harbor-linen-sheet-set",
    sku: "HOM-SFT-LIN",
    name: "Soft Harbor Linen Sheet Set",
    category: "Home & Living",
    subcategory: "Bedding",
    brand: "Soft Harbor",
    price: 128,
    originalPrice: 168,
    rating: 4.6,
    reviewCount: 3120,
    stock: 55,
    sold: 2740,
    badges: ["Top rated"],
    tags: ["bedding", "linen", "home", "bedroom", "comfort"],
    description:
      "Breathable washed linen sheets that feel relaxed out of the box and soften with every wash.",
    variants: [
      { id: "queen-oat", label: "Queen / Oat", stock: 18 },
      { id: "queen-sage", label: "Queen / Sage", stock: 16 },
      { id: "king-oat", label: "King / Oat", stock: 11 },
      { id: "king-sage", label: "King / Sage", stock: 10 }
    ],
    specs: {
      material: "European flax linen",
      included: "Flat sheet, fitted sheet, 2 pillowcases",
      care: "Machine washable",
      feel: "Washed and breathable"
    }
  }),
  makeProduct({
    id: "maison-ceramic-cookware-set",
    sku: "HOM-MAI-CKW",
    name: "Maison Ceramic Cookware Set",
    category: "Home & Living",
    subcategory: "Kitchen",
    brand: "Maison Pro",
    price: 149,
    originalPrice: 199,
    rating: 4.5,
    reviewCount: 2184,
    stock: 28,
    sold: 1080,
    badges: ["Bundle"],
    tags: ["cookware", "kitchen", "home", "ceramic", "bundle"],
    description:
      "A PFAS-free ceramic cookware bundle with everyday pans, vented lids, and induction-ready bases.",
    variants: [
      { id: "sage", label: "Sage", stock: 14 },
      { id: "cream", label: "Cream", stock: 8 },
      { id: "charcoal", label: "Charcoal", stock: 6 }
    ],
    specs: {
      pieces: "8",
      coating: "Ceramic nonstick",
      inductionReady: "Yes",
      dishwasherSafe: "Yes"
    }
  }),
  makeProduct({
    id: "liftline-adjustable-dumbbell-pair",
    sku: "FIT-LFT-DBL",
    name: "Liftline Adjustable Dumbbell Pair",
    category: "Fitness & Wellness",
    subcategory: "Strength training",
    brand: "Liftline",
    price: 249,
    originalPrice: 319,
    rating: 4.8,
    reviewCount: 1528,
    stock: 19,
    sold: 812,
    badges: ["Heavy item", "Low stock"],
    tags: ["fitness", "strength", "home gym", "dumbbell", "training"],
    description:
      "Space-saving dumbbells with quick weight changes for compact home strength training.",
    variants: [
      { id: "50lb", label: "5 to 50 lb", stock: 12 },
      { id: "70lb", label: "10 to 70 lb", stock: 7 }
    ],
    specs: {
      increments: "5 lb",
      pair: "Two dumbbells included",
      material: "Steel and composite",
      warranty: "2 years"
    }
  }),
  makeProduct({
    id: "flow-yoga-mat-kit",
    sku: "FIT-FLW-YGA",
    name: "Flow Yoga Mat Kit",
    category: "Fitness & Wellness",
    subcategory: "Yoga",
    brand: "Flow",
    price: 74,
    originalPrice: 99,
    rating: 4.6,
    reviewCount: 2318,
    stock: 73,
    sold: 3360,
    badges: ["Wellness pick"],
    tags: ["fitness", "yoga", "mat", "wellness", "home gym"],
    description:
      "A grippy mat kit with alignment marks, blocks, and a carry strap for home or studio practice.",
    variants: [
      { id: "lavender", label: "Lavender", stock: 25 },
      { id: "midnight", label: "Midnight", stock: 24 },
      { id: "sage", label: "Sage", stock: 24 }
    ],
    specs: {
      thickness: "5 mm",
      material: "Natural rubber blend",
      included: "Mat, blocks, strap",
      surface: "Non-slip textured"
    }
  }),
  makeProduct({
    id: "luma-vitamin-c-serum",
    sku: "BEA-LUM-VCS",
    name: "Luma Vitamin C Serum",
    category: "Beauty",
    subcategory: "Skin care",
    brand: "Luma Skin",
    price: 36,
    originalPrice: 48,
    rating: 4.7,
    reviewCount: 4120,
    stock: 96,
    sold: 7210,
    badges: ["Clean formula", "Best seller"],
    tags: ["beauty", "skin care", "serum", "vitamin c", "glow"],
    description:
      "A lightweight daily serum formulated with stabilized vitamin C to brighten and even skin tone.",
    variants: [
      { id: "30ml", label: "30 ml", stock: 62 },
      { id: "50ml", label: "50 ml", stock: 34 }
    ],
    specs: {
      skinType: "All skin types",
      fragrance: "Fragrance free",
      use: "Morning",
      formula: "Vegan and cruelty free"
    }
  }),
  makeProduct({
    id: "mineral-sunscreen-spf50",
    sku: "BEA-LUM-SPF",
    name: "Mineral Sunscreen SPF 50",
    category: "Beauty",
    subcategory: "Sun care",
    brand: "Luma Skin",
    price: 28,
    originalPrice: 36,
    rating: 4.5,
    reviewCount: 2860,
    stock: 110,
    sold: 5140,
    badges: ["Broad spectrum"],
    tags: ["beauty", "sunscreen", "spf", "skin care", "daily"],
    description:
      "A sheer mineral sunscreen with SPF 50 protection, a moisturizing base, and no heavy cast.",
    variants: [
      { id: "tube", label: "Standard tube", stock: 76 },
      { id: "travel", label: "Travel size", stock: 34 }
    ],
    specs: {
      protection: "SPF 50 broad spectrum",
      waterResistance: "80 minutes",
      finish: "Sheer natural",
      reefSafe: "Yes"
    }
  }),
  makeProduct({
    id: "orbit-smart-home-hub",
    sku: "HOM-ORB-HUB",
    name: "Orbit Smart Home Hub",
    category: "Home & Living",
    subcategory: "Smart home",
    brand: "Orbit",
    price: 119,
    originalPrice: 159,
    rating: 4.6,
    reviewCount: 1986,
    stock: 44,
    sold: 2260,
    badges: ["Smart gadget"],
    tags: ["smart home", "hub", "automation", "gadgets", "home"],
    description:
      "A compact smart home hub that connects lighting, sensors, routines, and voice assistants.",
    variants: [
      { id: "white", label: "White", stock: 24 },
      { id: "graphite", label: "Graphite", stock: 20 }
    ],
    specs: {
      protocols: "Matter, Thread, Zigbee",
      assistants: "Voice assistant ready",
      connectivity: "Wi-Fi 6 and Ethernet",
      privacy: "Local automation support"
    }
  }),
  makeProduct({
    id: "nomad-sling-tech-bag",
    sku: "ACC-NOM-SLG",
    name: "Nomad Sling Tech Bag",
    category: "Watches & Accessories",
    subcategory: "Bags",
    brand: "Nomad Goods",
    price: 94,
    originalPrice: 128,
    rating: 4.7,
    reviewCount: 2840,
    stock: 47,
    sold: 2190,
    badges: ["Travel pick"],
    tags: ["bag", "accessory", "travel", "tech", "organizer"],
    description:
      "A compact crossbody sling with weather-resistant fabric, padded tech storage, and clean organization.",
    variants: [
      { id: "black", label: "Black", stock: 21 },
      { id: "olive", label: "Olive", stock: 15 },
      { id: "sand", label: "Sand", stock: 11 }
    ],
    specs: {
      capacity: "6 L",
      material: "Water-resistant recycled nylon",
      laptop: "Fits compact tablet",
      strap: "Ambidextrous padded strap"
    }
  })
];

export const reviews = [
  {
    id: "review-1",
    productId: "astra-nova-x1-smartphone",
    user: "Maya Chen",
    rating: 5,
    title: "Feels genuinely premium",
    body: "The display is bright outdoors and the camera system handles travel photos beautifully.",
    createdAt: "2026-04-18T10:12:00.000Z"
  },
  {
    id: "review-2",
    productId: "pulse-anc-earbuds-pro",
    user: "Jordan Miles",
    rating: 5,
    title: "Great commuter pair",
    body: "Pairing is fast, the case is small, and the noise cancellation is strong for the price.",
    createdAt: "2026-04-22T14:30:00.000Z"
  },
  {
    id: "review-3",
    productId: "astrabook-air-14",
    user: "Ari Kapoor",
    rating: 4,
    title: "Light and fast",
    body: "Exactly the kind of portable laptop I needed for travel and client work.",
    createdAt: "2026-05-01T09:00:00.000Z"
  },
  {
    id: "review-4",
    productId: "aero-runner-knit-shoes",
    user: "Elena Brooks",
    rating: 5,
    title: "Comfortable from day one",
    body: "The knit upper breathes well and the cushioning feels lively on daily runs.",
    createdAt: "2026-05-08T16:45:00.000Z"
  },
  {
    id: "review-5",
    productId: "velocity-gaming-console",
    user: "Sam Patel",
    rating: 5,
    title: "Fast loading, quiet fan",
    body: "Setup was simple and games load much faster than my old console.",
    createdAt: "2026-05-12T18:20:00.000Z"
  },
  {
    id: "review-6",
    productId: "soft-harbor-linen-sheet-set",
    user: "Nora Fields",
    rating: 4,
    title: "Great texture",
    body: "The linen has that relaxed premium feel without being rough.",
    createdAt: "2026-05-14T11:05:00.000Z"
  }
];
