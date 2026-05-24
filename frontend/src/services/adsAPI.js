const API_BASE = 'http://localhost:5000/api/ads';

export const adsAPI = {
  async getAds(placement, category) {
    const params = new URLSearchParams();
    if (placement) params.set('placement', placement);
    if (category) params.set('category', category);
    const response = await fetch(`${API_BASE}?${params.toString()}`);
    const data = await response.json();
    return data.ads || [];
  },

  async trackImpression(adId) {
    fetch(`${API_BASE}/${adId}/impression`, { method: 'POST' }).catch(() => {});
  },

  async trackClick(adId) {
    fetch(`${API_BASE}/${adId}/click`, { method: 'POST' }).catch(() => {});
  }
};
