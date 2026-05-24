const express = require('express');
const { v7: uuidv7 } = require('uuid');
const valkeyClient = require('../valkeyClient');

const router = express.Router();

const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// GET /api/ads/all
router.get('/all', async (req, res) => {
  try {
    const keys = await valkeyClient.sendCommand(['KEYS', 'ad:*']);
    const ads = [];
    for (const k of keys) {
      if (!k.includes('ad_') && !k.includes('ads:')) { // only pure ad keys
        const adJson = await valkeyClient.sendCommand(['JSON.GET', k]);
        if (adJson) ads.push(JSON.parse(adJson));
      }
    }
    res.json(ads);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

// GET /api/ads?context=category&value=category:0192...&sessionId=abc
router.get('/', async (req, res) => {
  try {
    const { context, value, sessionId } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId required for frequency capping' });
    }

    const date = getTodayString();
    let adsList = [];

    if (context === 'category' && value) {
      adsList = await valkeyClient.sendCommand(['ZREVRANGEBYSCORE', `ads:category:${value}`, '+inf', '-inf']);
    } else {
      // General context: Just scan for all ads and pick one
      const catKeys = await valkeyClient.sendCommand(['KEYS', 'ads:category:*']);
      if (catKeys && catKeys.length > 0) {
        adsList = await valkeyClient.sendCommand(['ZREVRANGEBYSCORE', catKeys[0], '+inf', '-inf']);
      }
    }
      
    for (const adId of adsList) {
      const adJson = await valkeyClient.sendCommand(['JSON.GET', adId]);
      if (!adJson) continue;
      
      const ad = JSON.parse(adJson);
      if (ad.status !== 'active') continue;

      // Check frequency cap
      const freq = await valkeyClient.sendCommand(['GET', `ad_freq:${sessionId}:${adId}:${date}`]);
      if (freq && parseInt(freq) >= 3) {
        continue; // Cap reached
      }

      // Check budget
      const spend = await valkeyClient.sendCommand(['GET', `ad_spend:${adId}:${date}`]);
      const currentSpend = spend ? parseInt(spend) : 0;
      
      if (currentSpend + ad.bidAmount <= ad.dailyBudget) {
        return res.json(ad);
      }
    }
    
    res.json(null); // No ad found
  } catch (error) {
    console.error('Failed to get ad:', error);
    res.status(500).json({ error: 'Failed to fetch ad' });
  }
});

// POST /api/ads/:adId/impression
router.post('/:adId/impression', async (req, res) => {
  try {
    const { adId } = req.params;
    const { sessionId, bidAmount } = req.body;
    if (!sessionId || !bidAmount) return res.status(400).json({ error: 'sessionId and bidAmount required' });

    const date = getTodayString();
    const multi = valkeyClient.multi();

    // Track impressions
    multi.incr(`ad_impressions:${adId}:${date}`);
    multi.expire(`ad_impressions:${adId}:${date}`, 86400);

    // Track frequency per user
    multi.incr(`ad_freq:${sessionId}:${adId}:${date}`);
    multi.expire(`ad_freq:${sessionId}:${adId}:${date}`, 86400);

    // Track spend
    multi.incrBy(`ad_spend:${adId}:${date}`, parseInt(bidAmount));
    multi.expire(`ad_spend:${adId}:${date}`, 86400);

    await multi.exec();

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to track impression:', error);
    res.status(500).json({ error: 'Failed to track impression' });
  }
});

// POST /api/ads/:adId/click
router.post('/:adId/click', async (req, res) => {
  try {
    const { adId } = req.params;
    const date = getTodayString();
    
    await valkeyClient.sendCommand(['INCR', `ad_clicks:${adId}:${date}`]);
    await valkeyClient.sendCommand(['EXPIRE', `ad_clicks:${adId}:${date}`, '86400']);

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to track click:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// GET /api/ads/:adId/stats
router.get('/:adId/stats', async (req, res) => {
  try {
    const { adId } = req.params;
    const date = getTodayString();

    const [impressions, clicks, spend] = await Promise.all([
      valkeyClient.sendCommand(['GET', `ad_impressions:${adId}:${date}`]),
      valkeyClient.sendCommand(['GET', `ad_clicks:${adId}:${date}`]),
      valkeyClient.sendCommand(['GET', `ad_spend:${adId}:${date}`])
    ]);

    res.json({
      adId,
      date,
      impressions: parseInt(impressions || 0),
      clicks: parseInt(clicks || 0),
      spend: parseInt(spend || 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// POST /api/ads
router.post('/', async (req, res) => {
  try {
    const adId = `ad:${uuidv7()}`;
    const ad = {
      id: adId,
      ...req.body,
      status: 'active'
    };

    // Save JSON
    await valkeyClient.sendCommand(['JSON.SET', adId, '$', JSON.stringify(ad)]);

    // Index by category
    if (ad.targetCategories && Array.isArray(ad.targetCategories)) {
      for (const catId of ad.targetCategories) {
        await valkeyClient.sendCommand(['ZADD', `ads:category:${catId}`, ad.bidAmount.toString(), adId]);
      }
    }

    res.status(201).json(ad);
  } catch (error) {
    console.error('Failed to create ad:', error);
    res.status(500).json({ error: 'Failed to create ad' });
  }
});

module.exports = router;
