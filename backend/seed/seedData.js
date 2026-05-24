const { client, connectValkey } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const categories = [
  { slug: 'mobile-accessories', name: 'Mobile & Accessories', icon: 'ph-device-mobile' },
  { slug: 'laptop', name: 'Laptop', icon: 'ph-laptop' },
  { slug: 'electronics', name: 'Electronics', icon: 'ph-plug' },
  { slug: 'smart-watch', name: 'Smart Watch', icon: 'ph-watch' },
  { slug: 'storage', name: 'Storage', icon: 'ph-hard-drives' },
  { slug: 'camera', name: 'Camera', icon: 'ph-camera' },
  { slug: 'grocery', name: 'Grocery', icon: 'ph-shopping-cart' },
  { slug: 'fruits', name: 'Fruits', icon: 'ph-apple-logo' },
  { slug: 'vegetables', name: 'Vegetables', icon: 'ph-carrot' }
];

const vendors = [
  { id: 'vendor_lucky', name: 'Lucky Supermarket', rating: 4.8, reviews: 12500, joinedAt: new Date().toISOString() },
  { id: 'vendor_tech', name: 'Tech Store Pro', rating: 4.9, reviews: 3400, joinedAt: new Date().toISOString() },
  { id: 'vendor_organic', name: 'Organic Farms', rating: 4.7, reviews: 890, joinedAt: new Date().toISOString() }
];

const products = [
  {
    id: 'prod_broccoli',
    name: "Taylor Farms Broccoli Florets Vegetables",
    price: 14.99,
    originalPrice: 28.99,
    rating: 4.8,
    reviews: 17000,
    category: "vegetables",
    brand: "Taylor Farms",
    vendorId: 'vendor_organic',
    stock: 35,
    sold: 18,
    images: ["/assets/images/thumbs/product-two-img1.png", "/assets/images/thumbs/product-two-img2.png"],
    status: ["Sale 50%", "Best Seller"],
    description: "Fresh and crisp broccoli florets.",
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_camera',
    name: "Instax Mini 12 Instant Film Camera - Green",
    price: 69.99,
    originalPrice: 79.99,
    rating: 4.8,
    reviews: 12000,
    category: "camera",
    brand: "Instax",
    vendorId: 'vendor_tech',
    stock: 100,
    sold: 45,
    images: ["/assets/images/thumbs/product-two-img3.png", "/assets/images/thumbs/product-two-img4.png"],
    status: ["New"],
    discount: "19%OFF",
    description: "Capture moments instantly.",
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_chromebook',
    name: "HP Chromebook With Intel Celeron",
    price: 250.00,
    originalPrice: 300.00,
    rating: 4.5,
    reviews: 800,
    category: "laptop",
    brand: "HP",
    vendorId: 'vendor_tech',
    stock: 50,
    sold: 10,
    images: ["/assets/images/thumbs/product-two-img14.png"],
    status: [],
    description: "A reliable chromebook for everyday use.",
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_milk',
    name: "O Organics Milk, Whole, Vitamin D",
    price: 4.99,
    originalPrice: 6.99,
    rating: 4.9,
    reviews: 500,
    category: "grocery",
    brand: "O Organics",
    vendorId: 'vendor_lucky',
    stock: 200,
    sold: 150,
    images: ["/assets/images/thumbs/product-img11.png"],
    status: ["Sale 50%"],
    description: "Organic whole milk.",
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod_airpods',
    name: "Apple AirPods Max, Over Ear Headphones",
    price: 450.00,
    originalPrice: 549.00,
    rating: 4.7,
    reviews: 2500,
    category: "mobile-accessories",
    brand: "Apple",
    vendorId: 'vendor_tech',
    stock: 20,
    sold: 8,
    images: ["/assets/images/thumbs/week-deal-img1.png", "/assets/images/thumbs/week-deal-img2.png"],
    status: ["HOT"],
    discount: "-29%",
    description: "High fidelity audio.",
    createdAt: new Date().toISOString()
  }
];

async function seed() {
  await connectValkey();
  console.log('Seeding data to Valkey...');

  try {
    // Clear existing data (optional, but good for idempotent seeding in this demo)
    await client.flushDb();

    // 1. Categories
    const categoryHash = {};
    for (const cat of categories) {
      categoryHash[cat.slug] = cat.name;
      await client.json.set(`category:${cat.slug}`, '$', cat);
    }
    await client.hSet('categories', categoryHash);

    // 2. Vendors
    for (const vendor of vendors) {
      await client.json.set(`vendor:${vendor.id}`, '$', vendor);
      await client.zAdd('vendors', { score: vendor.rating, value: vendor.id });
    }

    // 3. Products
    let i = 0;
    for (const product of products) {
      await client.json.set(`product:${product.id}`, '$', product);
      // Index by creation time (for new arrivals)
      await client.zAdd('product_index', { score: Date.now() + i++, value: product.id });
      // Index by category
      await client.sAdd(`category:${product.category}:products`, product.id);
      
      // Additional simple indexes for sorting/filtering
      await client.zAdd('products_by_sales', { score: product.sold, value: product.id });
      await client.zAdd('products_by_views', { score: Math.floor(Math.random() * 1000), value: product.id }); // Mock views
      
      if (product.status.includes('HOT') || product.status.includes('Sale 50%') || product.discount) {
        await client.sAdd('deals_products', product.id);
      }
      if (product.status.includes('Best Seller')) {
        await client.sAdd('best_sellers', product.id);
      }
    }
    
    // Add all products to search hash for simple searching
    for (const product of products) {
        await client.hSet('product_names', product.name, product.id);
    }

    // 4. Seeding Product Reviews & Analytics
    const productReviews = {
      'prod_broccoli': [
        { author: "Sarah M.", rating: 5, date: "2026-05-10", comment: "This broccoli was incredibly fresh and crisp when it arrived! Excellent quality." },
        { author: "Jason K.", rating: 4, date: "2026-05-12", comment: "A bit overpriced for the portion size, but the organic taste is worth it." },
        { author: "Emma L.", rating: 2, date: "2026-05-14", comment: "Arrived wilted and turning yellow. Very disappointed with this batch." },
        { author: "DealHunter99", rating: 5, date: "2026-05-18", comment: "BEST BROCCOLI IN THE WORLD BUY NOW BUY NOW CHEAPEST PRICE AT HTTPS://SPAM.COM!!!" }
      ],
      'prod_camera': [
        { author: "Elena R.", rating: 5, date: "2026-05-01", comment: "The green color is absolutely gorgeous, and it prints fast! Super fun for parties." },
        { author: "Mark D.", rating: 3, date: "2026-05-03", comment: "Photo quality is mediocre in low light, but that is expected for instant film. Film is expensive." },
        { author: "Chloe S.", rating: 5, date: "2026-05-08", comment: "Simple to use, my kids loved it. Good build quality." },
        { author: "PromoSpammer", rating: 5, date: "2026-05-12", comment: "Instax Mini 12 is the ultimate camera. I buy 10 of these every day. Amazing amazing!!!" }
      ],
      'prod_chromebook': [
        { author: "David T.", rating: 5, date: "2026-05-02", comment: "Perfect laptop for school and typing documents. The ChromeOS battery life is incredible!" },
        { author: "Aria P.", rating: 4, date: "2026-05-04", comment: "Gets slightly warm when playing simple browser games, but otherwise completely silent." },
        { author: "Robert G.", rating: 2, date: "2026-05-06", comment: "Very slow if you try to open more than 10 tabs. The celeron processor shows its limits." },
        { author: "GamerKid", rating: 1, date: "2026-05-08", comment: "I bought this for heavy video editing and 3D gaming. Totally useless, don't buy!" },
        { author: "AffiliateGuru", rating: 5, date: "2026-05-10", comment: "EXCELLENT PRODUCT WORK FROM HOME BEST OFFER CLICK HERE FOR DISCOUNT!!!" }
      ],
      'prod_milk': [
        { author: "Karen B.", rating: 5, date: "2026-05-05", comment: "Great tasting organic whole milk. Smooth and rich creaminess." },
        { author: "John S.", rating: 2, date: "2026-05-06", comment: "Expiration date was only 3 days away when delivered. Disappointed." },
        { author: "Lily M.", rating: 5, date: "2026-05-07", comment: "Always buy this brand, never lets us down. High quality." },
        { author: "MiracleCureSpam", rating: 5, date: "2026-05-08", comment: "This milk changed my life, I cured my baldness with this milk. 10/10 stars!" }
      ],
      'prod_airpods': [
        { author: "Nolan H.", rating: 5, date: "2026-05-01", comment: "Incredible soundstage and active noise cancellation is top tier! Premium materials." },
        { author: "Tanya C.", rating: 3, date: "2026-05-03", comment: "Extremely heavy on the head after wearing for 2 hours. Gives me a headache." },
        { author: "Oliver J.", rating: 2, date: "2026-05-05", comment: "The smart case is absolute garbage, it protects nothing. Sound is decent but way overpriced." },
        { author: "ReplicaSeller", rating: 5, date: "2026-05-07", comment: "CHEAPEST AIRPODS MAX HERE! GENUINE APPLE 100% DISCOUNTED PRICE!!!" }
      ]
    };

    for (const [productId, reviews] of Object.entries(productReviews)) {
      await client.json.set(`reviews:${productId}`, '$', reviews);
      
      await client.hSet(`sentiment_tracking:${productId}`, {
        positiveCount: '0',
        negativeCount: '0',
        suspiciousCount: '0',
        verifiedCount: '0'
      });

      await client.zAdd('product_trust_scores', { score: 90, value: productId });
    }

    console.log(`Seeded ${categories.length} categories, ${vendors.length} vendors, ${products.length} products, and custom reviews.`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await client.quit();
    process.exit(0);
  }
}

seed();
