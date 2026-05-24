/**
 * Valkey data layer (Challenge 14) — all persistence goes to Valkey.
 */
const { createClient } = require('redis');
const valkeyMetrics = require('./valkeyMetrics');

const METRICS_KEY = 'valkey:metrics:stats';
const EVENTS_KEY = 'valkey:metrics:events';

class ValkeyService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  resolveConnectionUrl() {
    const raw =
      process.env.VALKEY_URL || 'redis://localhost:6379';
    // node client speaks Valkey protocol; normalize valkey:// → redis:// URI
    if (raw.startsWith('valkey://')) {
      return raw.replace('valkey://', 'redis://');
    }
    return raw;
  }

  async connect() {
    const valkeyUrl = this.resolveConnectionUrl();

    this.client = createClient({
      url: valkeyUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) return new Error('Max retries exceeded');
          return retries * 50;
        }
      }
    });

    this.client.on('error', (err) =>
      console.error('Valkey Client Error', err)
    );
    this.client.on('connect', () => {
      this.connected = true;
      console.log('Valkey connected');
    });

    await this.client.connect();
    await this.persistMetricsSnapshot();
  }

  async track(type, key, extra = {}) {
    const event = valkeyMetrics.record(type, key, extra);
    try {
      await this.client.lPush(EVENTS_KEY, JSON.stringify(event));
      await this.client.lTrim(EVENTS_KEY, 0, 149);
    } catch {
      /* metrics list is best-effort */
    }
    return event;
  }

  async persistMetricsSnapshot() {
    if (!this.client) return;
    try {
      const snap = valkeyMetrics.getSnapshot();
      await this.client.json.set(METRICS_KEY, '$', snap.stats);
    } catch {
      /* JSON module required */
    }
  }

  async scanKeyCounts() {
    const prefixes = {
      conversations: 0,
      agent_cache: 0,
      user_preferences: 0,
      feedback: 0,
      metrics: 0,
      other: 0
    };

    if (!this.client) return prefixes;

    try {
      for await (const key of this.client.scanIterator({ COUNT: 200 })) {
        if (key.startsWith('conversation:')) prefixes.conversations += 1;
        else if (key.startsWith('agent_cache:')) prefixes.agent_cache += 1;
        else if (key.startsWith('user_preferences:')) prefixes.user_preferences += 1;
        else if (key.startsWith('feedback:')) prefixes.feedback += 1;
        else if (key.startsWith('valkey:metrics')) prefixes.metrics += 1;
        else prefixes.other += 1;
      }
    } catch (err) {
      console.error('Valkey SCAN error:', err.message);
    }

    return prefixes;
  }

  async getServerInfo() {
    if (!this.client) return null;
    try {
      const info = await this.client.info('memory');
      const lines = info.split('\r\n');
      const memory = {};
      lines.forEach((line) => {
        const [k, v] = line.split(':');
        if (k && v) memory[k] = v;
      });
      return {
        usedMemoryHuman: memory.used_memory_human || '—',
        usedMemoryPeakHuman: memory.used_memory_peak_human || '—'
      };
    } catch {
      return null;
    }
  }

  async getDashboardData() {
    const keyCounts = await this.scanKeyCounts();
    const serverInfo = await this.getServerInfo();
    let valkeyStoredEvents = [];

    try {
      const raw = await this.client.lRange(EVENTS_KEY, 0, 49);
      valkeyStoredEvents = raw.map((r) => JSON.parse(r));
    } catch {
      /* ignore */
    }

    const snapshot = valkeyMetrics.getSnapshot(keyCounts);

    return {
      connected: this.connected,
      serverInfo,
      ...snapshot,
      valkeyStoredEvents,
      keyPatterns: {
        'conversation:{sessionId}': 'JSON — chat history (TTL 30 min)',
        'agent_cache:{queryHash}': 'STRING — optional search cache (TTL 5 min)',
        'user_preferences:{userId}': 'JSON — long-term prefs',
        'feedback:{sessionId}:{productId}': 'JSON — thumbs up/down',
        'valkey:metrics:events': 'LIST — live operation log'
      }
    };
  }

  async setConversation(sessionId, conversationData) {
    const key = `conversation:${sessionId}`;
    const start = Date.now();
    try {
      await this.client.json.set(key, '$', conversationData);
      await this.client.expire(key, 1800);
      await this.track('CONVERSATION_SET', key, {
        success: true,
        ms: Date.now() - start,
        turnCount: conversationData.turns?.length || 0
      });
      await this.persistMetricsSnapshot();
      return true;
    } catch (err) {
      await this.track('CONVERSATION_SET', key, {
        success: false,
        ms: Date.now() - start,
        error: err.message
      });
      throw err;
    }
  }

  async getConversation(sessionId) {
    const key = `conversation:${sessionId}`;
    const start = Date.now();
    try {
      const data = await this.client.json.get(key);
      await this.track('CONVERSATION_GET', key, {
        success: true,
        ms: Date.now() - start,
        found: !!data
      });
      return data;
    } catch (err) {
      await this.track('CONVERSATION_GET', key, {
        success: false,
        ms: Date.now() - start,
        error: err.message
      });
      return null;
    }
  }

  async setCacheResult(queryHash, result, ttl = 300) {
    const key = `agent_cache:${queryHash}`;
    const start = Date.now();
    try {
      await this.client.setEx(key, ttl, JSON.stringify(result));
      await this.track('CACHE_SET', key, {
        success: true,
        ms: Date.now() - start,
        ttl
      });
      await this.persistMetricsSnapshot();
      return true;
    } catch (err) {
      await this.track('CACHE_SET', key, {
        success: false,
        ms: Date.now() - start,
        error: err.message
      });
      throw err;
    }
  }

  async getCacheResult(queryHash) {
    const key = `agent_cache:${queryHash}`;
    const start = Date.now();
    try {
      const data = await this.client.get(key);
      const hit = !!data;
      await this.track(hit ? 'CACHE_GET_HIT' : 'CACHE_GET_MISS', key, {
        success: true,
        ms: Date.now() - start
      });
      await this.persistMetricsSnapshot();
      return data ? JSON.parse(data) : null;
    } catch (err) {
      await this.track('CACHE_GET_MISS', key, {
        success: false,
        ms: Date.now() - start,
        error: err.message
      });
      return null;
    }
  }

  async setUserPreferences(userId, preferences) {
    const key = `user_preferences:${userId}`;
    await this.client.json.set(key, '$', preferences);
    await this.track('PREFERENCES_SET', key, { success: true });
    return true;
  }

  async getUserPreferences(userId) {
    const key = `user_preferences:${userId}`;
    const data = await this.client.json.get(key);
    await this.track('PREFERENCES_GET', key, { success: true, found: !!data });
    return data;
  }

  getMockProducts() {
    return [
      {
        id: 'product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f',
        name: 'National Geographic Science Kit',
        price: 2499,
        category: 'science',
        tags: ['science', 'educational', 'kids', 'experiment'],
        rating: 4.8,
        reviews: 156,
        description: 'Complete science experiment kit for ages 8-12'
      },
      {
        id: 'product:0192d4e6-3d5f-7b8c-9e0a-1b2c3d4e5f6a',
        name: 'Kids Starter Telescope',
        price: 3999,
        category: 'science',
        tags: ['astronomy', 'educational', 'kids', 'science'],
        rating: 4.6,
        reviews: 89,
        description: 'Perfect telescope for young astronomers'
      },
      {
        id: 'product:0192d4e6-4e6a-7c9d-8f1b-2c3d4e5f6a7b',
        name: 'LEGO Robotics Set',
        price: 4299,
        category: 'stem',
        tags: ['robotics', 'coding', 'kids', 'educational'],
        rating: 4.9,
        reviews: 234,
        description: 'Build and program your own robots'
      },
      {
        id: 'product:0192d4e6-5f7b-7d0e-8a2c-3d4e5f6a7b8c',
        name: 'Chemistry Laboratory Set',
        price: 1999,
        category: 'science',
        tags: ['chemistry', 'educational', 'kids', 'experiment'],
        rating: 4.5,
        reviews: 67,
        description: 'Safe chemistry experiments for young scientists'
      },
      {
        id: 'product:0192d4e6-6a8c-7e1f-9b3d-4e5f6a7b8c9d',
        name: 'Crystal Growing Kit',
        price: 1499,
        category: 'science',
        tags: ['crystal', 'experiment', 'educational', 'kids'],
        rating: 4.7,
        reviews: 145,
        description: 'Grow beautiful crystals at home'
      }
    ];
  }

  async searchProducts(query, filters = {}) {
    const start = Date.now();
    let results = [...this.getMockProducts()];
    const q = (query || '').toLowerCase().trim();

    if (q) {
      const tokens = q.split(/\s+/).filter((t) => t.length > 2);
      const tokenFiltered = results.filter((p) => {
        const text =
          `${p.name} ${p.description} ${p.category} ${p.tags.join(' ')}`.toLowerCase();
        return tokens.some((t) => text.includes(t));
      });
      // If structured filters exist, keep filter-only results when tokens are refinement words
      if (tokenFiltered.length > 0 || !filters.categories?.length) {
        results = tokenFiltered;
      }
    }

    if (filters.minPrice != null) {
      results = results.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice != null) {
      results = results.filter((p) => p.price <= filters.maxPrice);
    }
    if (filters.minRating != null) {
      results = results.filter((p) => p.rating >= filters.minRating);
    }
    if (filters.categories?.length > 0) {
      results = results.filter((p) =>
        filters.categories.some(
          (c) => p.category === c || p.tags.includes(c)
        )
      );
    }
    if (filters.tags?.length > 0) {
      results = results.filter((p) =>
        filters.tags.some(
          (tag) =>
            p.tags.includes(tag) ||
            p.category === tag ||
            p.name.toLowerCase().includes(tag)
        )
      );
    }

    const sorted = results.sort((a, b) => b.rating - a.rating);
    await this.track('SEARCH_LIVE', 'catalog:search', {
      success: true,
      ms: Date.now() - start,
      query: q || '(filters only)',
      resultCount: sorted.length
    });
    return sorted;
  }

  async semanticSearch(naturalLanguageQuery, limit = 10) {
    const start = Date.now();
    const q = naturalLanguageQuery.toLowerCase();
    const scored = this.getMockProducts().map((p) => {
      const text =
        `${p.name} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
      const tokens = q.split(/\s+/).filter((t) => t.length > 2);
      const hits = tokens.filter((t) => text.includes(t)).length;
      return { product: p, score: hits / Math.max(tokens.length, 1) };
    });

    const results = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.product);

    await this.track('SEARCH_LIVE', 'catalog:semantic', {
      success: true,
      ms: Date.now() - start,
      query: q.slice(0, 80),
      resultCount: results.length
    });
    return results;
  }

  async getProductDetails(productId) {
    const products = {
      'product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f': {
        id: 'product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f',
        name: 'National Geographic Science Kit',
        price: 2499,
        category: 'science',
        tags: ['science', 'educational', 'kids', 'experiment'],
        rating: 4.8,
        reviews: 156,
        description: 'Complete science experiment kit for ages 8-12',
        inStock: true,
        reviews_list: [
          {
            author: 'Priya S.',
            rating: 5,
            text: 'My son loved this! Great quality.'
          },
          {
            author: 'Amit K.',
            rating: 4,
            text: 'Good value for money, very educational.'
          }
        ]
      }
    };
    return products[productId] || null;
  }

  async findSimilarProducts(productId, limit = 5) {
    const products = await this.searchProducts('');
    const currentProduct = products.find((p) => p.id === productId);
    if (!currentProduct) return [];

    return products
      .filter(
        (p) => p.id !== productId && p.category === currentProduct.category
      )
      .slice(0, limit);
  }

  async checkAvailability(productId) {
    return {
      productId,
      inStock: true,
      quantity: Math.floor(Math.random() * 100) + 1,
      deliveryDays: Math.floor(Math.random() * 5) + 1,
      deliveryDate: new Date(
        Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000
      ).toISOString()
    };
  }

  async disconnect() {
    if (this.client) await this.client.quit();
  }
}

module.exports = new ValkeyService();
