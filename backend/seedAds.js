const valkeyClient = require('./valkeyClient');
const { v7: uuidv7 } = require('uuid');

async function seedAds() {
  console.log('Starting ads seed directly to Valkey...');

  try {
    await valkeyClient.connect();

    // Find a category
    const catKeys = await valkeyClient.sendCommand(['KEYS', 'category:*']);
    if (!catKeys || catKeys.length === 0) {
      console.log('No categories found. Run seed.js first.');
      process.exit(1);
    }
    const laptopCat = catKeys[0];
    const mobileCat = catKeys.length > 1 ? catKeys[1] : catKeys[0];

    // Find a vendor
    const vendorKeys = await valkeyClient.sendCommand(['KEYS', 'vendor:*']);
    let techVendor = vendorKeys && vendorKeys.length > 0 ? vendorKeys[0] : null;
    if (!techVendor) {
      techVendor = `vendor:${uuidv7()}`;
      await valkeyClient.sendCommand(['JSON.SET', techVendor, '$', JSON.stringify({id: techVendor, name: 'Tech Hub'})]);
    }

    // 3. Create Ads
    const adsToCreate = [
      {
        vendorId: techVendor,
        title: "Summer Electronics Sale",
        imageUrl: "assets/images/thumbs/promo-img1.png",
        targetUrl: "/shop?sale=summer",
        targetCategories: [laptopCat, mobileCat],
        targetKeywords: ["phone", "laptop", "gadget"],
        bidAmount: 500, // in cents
        dailyBudget: 50000 // $500/day
      },
      {
        vendorId: techVendor,
        title: "50% Off Laptops",
        imageUrl: "assets/images/thumbs/promo-img2.png",
        targetUrl: "/shop?sale=laptops",
        targetCategories: [laptopCat],
        targetKeywords: ["laptop", "pc"],
        bidAmount: 800, 
        dailyBudget: 20000 
      }
    ];

    for (const adData of adsToCreate) {
      const adId = `ad:${uuidv7()}`;
      const ad = { id: adId, ...adData, status: 'active' };

      // Save JSON
      await valkeyClient.sendCommand(['JSON.SET', adId, '$', JSON.stringify(ad)]);

      // Index by category
      for (const catId of ad.targetCategories) {
        await valkeyClient.sendCommand(['ZADD', `ads:category:${catId}`, ad.bidAmount.toString(), adId]);
      }
      console.log('Created Ad:', ad.title, ad.id);
    }

    console.log('Ads seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedAds();
