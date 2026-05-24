const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getClient } = require('../config/valkey');

const router = express.Router();

/**
 * Seed default ads on first request if none exist
 */
async function seedAdsIfEmpty(valkey) {
  const existing = await valkey.smembers('ads:all');
  if (existing.length > 0) return;

  const defaultAds = [
    {
      id: 'ad-001',
      title: 'Summer Sale - Up to 50% Off',
      description: 'Shop the biggest deals of the season on electronics & gadgets',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      link: '/shop',
      cta: 'Shop Now',
      placement: 'homepage-banner',
      category: 'electronics',
      priority: 10,
      impressions: 0,
      clicks: 0,
      active: 'true'
    },
    {
      id: 'ad-002',
      title: 'Free Delivery on Orders $50+',
      description: 'Limited time offer - get free express delivery on all orders above $50',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      link: '/shop',
      cta: 'Order Now',
      placement: 'homepage-banner',
      category: 'general',
      priority: 8,
      impressions: 0,
      clicks: 0,
      active: 'true'
    },
    {
      id: 'ad-003',
      title: 'New Arrivals This Week',
      description: 'Check out the latest products just added to our store',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
      link: '/shop',
      cta: 'Explore',
      placement: 'shop-sidebar',
      category: 'fashion',
      priority: 7,
      impressions: 0,
      clicks: 0,
      active: 'true'
    },
    {
      id: 'ad-004',
      title: 'Premium Membership - 20% Extra Off',
      description: 'Join our premium membership and enjoy exclusive discounts',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      link: '/account',
      cta: 'Join Now',
      placement: 'homepage-mid',
      category: 'membership',
      priority: 9,
      impressions: 0,
      clicks: 0,
      active: 'true'
    },
    {
      id: 'ad-005',
      title: 'Flash Deal: Headphones 60% Off',
      description: 'Premium wireless headphones at unbeatable prices. Today only!',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      link: '/product-details',
      cta: 'Grab Deal',
      placement: 'shop-inline',
      category: 'electronics',
      priority: 10,
      impressions: 0,
      clicks: 0,
      active: 'true'
    },
    {
      id: 'ad-006',
      title: 'Organic & Fresh Groceries',
      description: 'Farm-fresh produce delivered to your doorstep every morning',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      link: '/shop',
      cta: 'Shop Fresh',
      placement: 'homepage-mid',
      category: 'grocery',
      priority: 6,
      impressions: 0,
      clicks: 0,
      active: 'true'
    }
  ];

  for (const ad of defaultAds) {
    await valkey.hset(`ad:${ad.id}`, ad);
    await valkey.sadd('ads:all', ad.id);
    await valkey.zadd(`ads:placement:${ad.placement}`, ad.priority, ad.id);
    await valkey.sadd(`ads:category:${ad.category}`, ad.id);
  }
}

/**
 * GET /api/ads?placement=homepage-banner&category=electronics
 * Get ads filtered by placement and/or category
 */
router.get('/', async (req, res) => {
  const { placement, category, limit } = req.query;
  const valkey = getClient();

  try {
    await seedAdsIfEmpty(valkey);

    let adIds = [];

    if (placement) {
      // Get ads by placement, sorted by priority (highest first)
      adIds = await valkey.zrevrange(`ads:placement:${placement}`, 0, (limit || 5) - 1);
    } else if (category) {
      adIds = await valkey.smembers(`ads:category:${category}`);
    } else {
      adIds = await valkey.smembers('ads:all');
    }

    const ads = [];
    for (const id of adIds) {
      const ad = await valkey.hgetall(`ad:${id}`);
      if (ad && ad.id && ad.active === 'true') {
        ads.push({
          id: ad.id,
          title: ad.title,
          description: ad.description,
          image: ad.image,
          link: ad.link,
          cta: ad.cta,
          placement: ad.placement,
          category: ad.category,
          impressions: parseInt(ad.impressions) || 0,
          clicks: parseInt(ad.clicks) || 0
        });
      }
    }

    res.json({ ads });
  } catch (err) {
    console.error('Fetch ads error:', err);
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

/**
 * POST /api/ads/:id/impression
 * Track an ad impression
 */
router.post('/:id/impression', async (req, res) => {
  const valkey = getClient();
  try {
    await valkey.hincrby(`ad:${req.params.id}`, 'impressions', 1);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to track impression' });
  }
});

/**
 * POST /api/ads/:id/click
 * Track an ad click
 */
router.post('/:id/click', async (req, res) => {
  const valkey = getClient();
  try {
    await valkey.hincrby(`ad:${req.params.id}`, 'clicks', 1);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to track click' });
  }
});

module.exports = router;
