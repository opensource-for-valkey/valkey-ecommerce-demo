const express = require('express');
const valkeyClient = require('../valkeyClient');

const router = express.Router();

/**
 * Helper to fetch all products from Valkey
 */
async function fetchAllProducts() {
  const keys = await valkeyClient.keys('product:*');
  if (keys.length === 0) return [];
  
  const products = [];
  for (const key of keys) {
    const data = await valkeyClient.sendCommand(['JSON.GET', key]);
    if (data) {
      products.push(JSON.parse(data));
    }
  }
  return products;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i] + 1, // deletion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Robust fuzzy matching that tokenizes and allows proportional typos.
 * Returns a score between 0 and 100. 0 means no match.
 */
function fuzzyScore(str, query) {
  if (!str || !query) return 0;
  const strLower = str.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match bonus
  if (strLower.includes(queryLower)) return 100;

  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 0);
  const strWords = strLower.split(/\s+/).filter(w => w.length > 0);

  let totalScore = 0;

  for (const qWord of queryWords) {
    let bestWordScore = 0;
    
    // Max errors allowed based on word length
    const maxErrors = qWord.length <= 3 ? 0 : qWord.length <= 5 ? 1 : 2;

    for (const sWord of strWords) {
      if (sWord.includes(qWord)) {
        bestWordScore = 100;
        break;
      }
      const dist = levenshtein(qWord, sWord);
      if (dist <= maxErrors) {
        // Calculate a score based on distance
        const score = Math.max(0, 100 - (dist / Math.max(qWord.length, sWord.length)) * 100);
        if (score > bestWordScore) {
          bestWordScore = score;
        }
      } else if (sWord.startsWith(qWord)) {
         bestWordScore = 90; // Prefix match
      }
    }

    if (bestWordScore === 0) {
      // If a significant query word doesn't match anything, penalize heavily
      return 0; 
    }
    totalScore += bestWordScore;
  }

  return totalScore / queryWords.length;
}

// GET /api/search
// Params: q, category, minPrice, maxPrice, sort, page
router.get('/', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort, page = 1 } = req.query;
    const pageSize = 20;
    
    let products = await fetchAllProducts();

    // Filters
    if (q) {
      const qLower = q.toLowerCase();
      products = products.filter(p => {
        // Full text fields: name, description, brand, tags
        return fuzzyScore(p.name, qLower) > 0 ||
               (p.description && fuzzyScore(p.description, qLower) > 0) ||
               (p.brand && fuzzyScore(p.brand, qLower) > 0) ||
               (p.tags && p.tags.some(t => fuzzyScore(t, qLower) > 0));
      });
    }

    if (category) {
      products = products.filter(p => p.categoryId === category);
    }

    if (minPrice) {
      products = products.filter(p => p.price && p.price.amount >= parseInt(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price && p.price.amount <= parseInt(maxPrice));
    }

    // Sort
    if (sort) {
      if (sort === 'price_asc') {
        products.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
      } else if (sort === 'price_desc') {
        products.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
      } else if (sort === 'rating_desc') {
        products.sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0));
      } else if (sort === 'newest') {
        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } else {
      // Default: relevance (just use name exact match sorting)
      if (q) {
        products.sort((a, b) => {
          const aName = a.name?.toLowerCase() || '';
          const bName = b.name?.toLowerCase() || '';
          const aExact = aName.includes(q.toLowerCase()) ? 1 : 0;
          const bExact = bName.includes(q.toLowerCase()) ? 1 : 0;
          return bExact - aExact;
        });
      }
    }

    // Facets computation
    const facets = {
      brands: {},
      categories: {},
      priceRanges: {
        '0-50000': 0,
        '50000-100000': 0,
        '100000+': 0
      }
    };

    products.forEach(p => {
      // Brand Facet
      if (p.brand) {
        facets.brands[p.brand] = (facets.brands[p.brand] || 0) + 1;
      }
      
      // Category Facet
      if (p.categoryId) {
        facets.categories[p.categoryId] = (facets.categories[p.categoryId] || 0) + 1;
      }

      // Price Facet
      if (p.price && p.price.amount) {
        if (p.price.amount < 50000) facets.priceRanges['0-50000']++;
        else if (p.price.amount <= 100000) facets.priceRanges['50000-100000']++;
        else facets.priceRanges['100000+']++;
      }
    });

    // Format Facets
    const formattedFacets = {
      brands: Object.entries(facets.brands).map(([name, count]) => ({ name, count })),
      categories: Object.entries(facets.categories).map(([id, count]) => ({ id, name: id.split(':').pop(), count })),
      priceRanges: Object.entries(facets.priceRanges).map(([range, count]) => ({ range, count }))
    };

    // Pagination
    const total = products.length;
    const start = (page - 1) * pageSize;
    const pagedResults = products.slice(start, start + pageSize).map(p => ({
      ...p,
      score: q ? fuzzyScore(p.name, q) : 100
    }));

    res.json({
      query: q || '',
      total,
      page: parseInt(page),
      pageSize,
      results: pagedResults,
      facets: formattedFacets
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/search/suggest
// Autocomplete suggestions
router.get('/suggest', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const products = await fetchAllProducts();
    const suggestions = [];

    for (const p of products) {
      const score = fuzzyScore(p.name, q);
      if (score > 0) {
        suggestions.push({
          id: p.id,
          term: p.name,
          image: p.images && p.images.length > 0 ? p.images[0].url : '',
          price: p.price ? p.price.amount : 0,
          score: score
        });
      }
    }

    // Deduplicate and limit
    const unique = Array.from(new Set(suggestions.map(s => s.id)))
      .map(id => suggestions.find(s => s.id === id))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json(unique);
  } catch (error) {
    console.error('Suggest error:', error);
    res.status(500).json({ error: 'Suggest failed' });
  }
});

// GET /api/search/facets
// Just facet counts
router.get('/facets', async (req, res) => {
  try {
    const { q } = req.query;
    let products = await fetchAllProducts();

    if (q) {
      products = products.filter(p => fuzzyScore(p.name, q) > 0);
    }

    const facets = {
      brands: {}
    };

    products.forEach(p => {
      if (p.brand) {
        facets.brands[p.brand] = (facets.brands[p.brand] || 0) + 1;
      }
    });

    res.json({
      facets: {
        brands: Object.entries(facets.brands)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
      }
    });
  } catch (error) {
    console.error('Facets error:', error);
    res.status(500).json({ error: 'Facets failed' });
  }
});

module.exports = router;
