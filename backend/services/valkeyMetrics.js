/**
 * In-process + Valkey-backed metrics for the observability dashboard.
 */
const MAX_EVENTS = 150;

class ValkeyMetrics {
  constructor() {
    this.stats = {
      totalCommands: 0,
      conversationReads: 0,
      conversationWrites: 0,
      cacheReads: 0,
      cacheHits: 0,
      cacheMisses: 0,
      cacheWrites: 0,
      searchRuns: 0,
      feedbackWrites: 0,
      errors: 0
    };
    this.recentEvents = [];
  }

  record(type, key, extra = {}) {
    const event = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      key: key || null,
      timestamp: new Date().toISOString(),
      ...extra
    };

    this.stats.totalCommands += 1;
    if (type === 'CONVERSATION_GET') this.stats.conversationReads += 1;
    if (type === 'CONVERSATION_SET') this.stats.conversationWrites += 1;
    if (type === 'CACHE_GET_HIT') {
      this.stats.cacheReads += 1;
      this.stats.cacheHits += 1;
    }
    if (type === 'CACHE_GET_MISS') {
      this.stats.cacheReads += 1;
      this.stats.cacheMisses += 1;
    }
    if (type === 'CACHE_SET') this.stats.cacheWrites += 1;
    if (type === 'SEARCH_LIVE') this.stats.searchRuns += 1;
    if (type === 'FEEDBACK_SET') this.stats.feedbackWrites += 1;
    if (extra.success === false) this.stats.errors += 1;

    this.recentEvents.unshift(event);
    if (this.recentEvents.length > MAX_EVENTS) {
      this.recentEvents.length = MAX_EVENTS;
    }

    return event;
  }

  getSnapshot(keyCounts = {}) {
    const hitRate =
      this.stats.cacheReads > 0
        ? Math.round((this.stats.cacheHits / this.stats.cacheReads) * 100)
        : 0;

    return {
      stats: { ...this.stats, cacheHitRatePercent: hitRate },
      recentEvents: [...this.recentEvents],
      keyCounts,
      updatedAt: new Date().toISOString()
    };
  }
}

module.exports = new ValkeyMetrics();
