// Per-product image queries → drive image.service.js resolver.
// Slug/productId keyed; queries feed loremflickr keyword lookup.

module.exports = {
  // Fashion
  'product:00000101': { queries: ['oversized blazer wool', 'wool blazer', 'tailored blazer'] },
  'product:00000102': { queries: ['black cotton shirt', 'mens black shirt', 'black poplin shirt'] },
  'product:00000103': { queries: ['cargo pants twill', 'utility trousers', 'cargo trouser'] },
  'product:00000104': { queries: ['linen overshirt', 'linen jacket', 'mens linen shirt'] },
  'product:00000105': { queries: ['merino knit tee', 'wool tshirt', 'fine knit tee'] },

  // Gaming
  'product:00000201': { queries: ['mechanical keyboard rgb', 'gaming keyboard', 'keyboard backlit'] },
  'product:00000202': { queries: ['gaming headset', 'over ear headset', 'headphones gaming'] },
  'product:00000203': { queries: ['desk mouse pad', 'gaming mouse pad', 'mousepad black'] },
  'product:00000204': { queries: ['gaming mouse wireless', 'lightweight gaming mouse', 'gaming mouse black'] },
  'product:00000205': { queries: ['monitor arm desk', 'monitor mount', 'desk monitor arm'] },

  // Study Setup
  'product:00000301': { queries: ['brass desk lamp', 'reading lamp desk', 'warm desk lamp'] },
  'product:00000302': { queries: ['walnut chair leather', 'desk chair wood', 'minimal wood chair'] },
  'product:00000303': { queries: ['oak monitor stand', 'wood monitor riser', 'monitor stand wood'] },
  'product:00000304': { queries: ['walnut bookshelf small', 'book shelf wood', 'library shelf wood'] },
  'product:00000305': { queries: ['leather blotter pad', 'desk blotter', 'writing pad desk'] },

  // Tech Accessories
  'product:00000401': { queries: ['leather cable organizer', 'leather cable wrap', 'cable tidy'] },
  'product:00000402': { queries: ['usb c hub aluminium', 'usb-c hub', 'usb hub macbook'] },
  'product:00000403': { queries: ['leather mousepad', 'leather desk mat', 'mousepad leather'] },
  'product:00000404': { queries: ['brass stylus pen', 'tablet stylus brass', 'metal stylus'] },
  'product:00000405': { queries: ['screen cleaning cloth', 'microfiber cloth linen', 'lens cloth'] },

  // Footwear
  'product:00000501': { queries: ['oxblood derby shoes', 'mens leather derby', 'burgundy dress shoes'] },
  'product:00000502': { queries: ['white leather sneaker', 'minimal sneaker', 'low top leather sneaker'] },
  'product:00000503': { queries: ['tobacco suede loafer', 'mens suede loafer', 'tan loafer'] },
  'product:00000504': { queries: ['boiled wool slipper', 'house slipper grey', 'felt slipper'] },
  'product:00000505': { queries: ['leather work boot', 'mens leather boot', 'oiled leather boot'] },

  // Streetwear
  'product:00000601': { queries: ['heavyweight hoodie', 'black hoodie cotton', 'mens hoodie heavyweight'] },
  'product:00000602': { queries: ['boxy white tshirt', 'white tee minimal', 'mens boxy tee'] },
  'product:00000603': { queries: ['black track jacket', 'nylon track jacket', 'track jacket mens'] },
  'product:00000604': { queries: ['waxed canvas cap', 'five panel cap', 'canvas cap mens'] },
  'product:00000605': { queries: ['cross body bag canvas', 'small cross body bag', 'sling bag minimal'] },

  // Gift Ideas
  'product:00000701': { queries: ['beeswax candle vessel', 'amber glass candle', 'soy candle dark glass'] },
  'product:00000702': { queries: ['loose leaf tea tin', 'single estate tea', 'black tea leaves'] },
  'product:00000703': { queries: ['brass fountain pen', 'pen ink writing set', 'writing instrument boxed'] },
  'product:00000704': { queries: ['incense sticks cedar', 'incense box wooden', 'oud incense'] },
  'product:00000705': { queries: ['gift card brass', 'gift card kraft envelope', 'luxury gift card'] },

  // Monochrome Collection
  'product:00000801': { queries: ['black tshirt minimal', 'all black tshirt', 'black tee folded'] },
  'product:00000802': { queries: ['wool flannel trousers', 'grey flannel trouser', 'pleated trouser mens'] },
  'product:00000803': { queries: ['black wool coat', 'long wool coat black', 'raglan coat charcoal'] },
  'product:00000804': { queries: ['cashmere cardigan shawl collar', 'charcoal cardigan', 'shawl collar cardigan'] },
  'product:00000805': { queries: ['wool scarf fringed', 'black wool scarf', 'charcoal scarf wool'] },
};
