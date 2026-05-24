// Nocturne & Co. catalogue categories — mirrors frontend/src/data/products.js.
// Slug is the canonical id used in API + Valkey indexes.

const categories = [
  { slug: 'fashion',                label: 'Fashion',                tagline: 'Cut, weight, and silhouette.',          icon: 'ph-coat-hanger' },
  { slug: 'gaming',                 label: 'Gaming',                 tagline: 'After-hours arsenal.',                  icon: 'ph-game-controller' },
  { slug: 'study-setup',            label: 'Study Setup',            tagline: 'Calm desks, quiet light.',              icon: 'ph-desk' },
  { slug: 'tech-accessories',       label: 'Tech Accessories',       tagline: 'Small objects, considered.',            icon: 'ph-plugs-connected' },
  { slug: 'footwear',               label: 'Footwear',               tagline: 'Soles for slow walking.',               icon: 'ph-sneaker' },
  { slug: 'streetwear',             label: 'Streetwear',             tagline: 'City-cut, drop-numbered.',              icon: 'ph-baseball-cap' },
  { slug: 'gift-ideas',             label: 'Gift Ideas',             tagline: 'For someone who reads after midnight.', icon: 'ph-gift' },
  { slug: 'monochrome-collection',  label: 'Monochrome Collection',  tagline: 'One colour, repeated.',                 icon: 'ph-circle-half' },
  { slug: 'pantry',                 label: 'Pantry',                 tagline: 'Small jars, slow afternoons.',          icon: 'ph-coffee' },
];

const brands = ['Nocturne & Co.', 'Maison Nocturne', 'After-Hours', 'Bridle', 'Maison Atelier'];

const colors = ['Oxblood', 'Black', 'Tobacco', 'Brass', 'Walnut', 'Ivory', 'Charcoal'];

module.exports = { categories, brands, colors };
