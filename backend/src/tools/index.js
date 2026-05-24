const { searchProducts } = require('./search_products');
const { semanticSearch } = require('./semantic_search');
const { getProductDetails } = require('./get_product_details');
const { checkAvailability } = require('./check_availability');
const { findSimilar } = require('./find_similar');
const { askClarification } = require('./ask_clarification');

const TOOLS = {
  search_products: {
    fn: searchProducts,
    description: 'Search products by keywords, category, tags, price range, rating, age group.',
    params: ['query', 'categories', 'tags', 'minPrice', 'maxPrice', 'minRating', 'ageGroup', 'limit'],
  },
  semantic_search: {
    fn: semanticSearch,
    description: 'Find products by meaning using vector similarity.',
    params: ['naturalLanguageQuery', 'limit'],
  },
  get_product_details: {
    fn: getProductDetails,
    description: 'Get full details including reviews for a specific product.',
    params: ['productId'],
  },
  check_availability: {
    fn: checkAvailability,
    description: 'Check if product is in stock and deliverable to a postal code.',
    params: ['productId', 'postalCode'],
  },
  find_similar: {
    fn: findSimilar,
    description: 'Find products similar to a given product.',
    params: ['productId', 'limit'],
  },
  ask_clarification: {
    fn: askClarification,
    description: 'Ask the user a clarifying question with optional choices.',
    params: ['question', 'options'],
  },
};

async function runTool(name, args) {
  const tool = TOOLS[name];
  if (!tool) throw new Error(`unknown tool: ${name}`);
  const started = Date.now();
  const result = await tool.fn(args || {});
  return { name, args, result, ms: Date.now() - started };
}

module.exports = { TOOLS, runTool };
