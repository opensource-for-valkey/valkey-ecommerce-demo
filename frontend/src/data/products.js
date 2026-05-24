/* =========================================================================
   NOCTURNE & CO. — Product catalogue
   8 curated categories × 5–6 editions each. Real names + descriptions so
   category pages render with real content.
   ─────────────────────────────────────────────────────────────────────────
   Every product has:
     id          — stable slug, used in product detail route /product/<id>
     name        — title (Fraunces display)
     subtitle    — short italic line under the name
     category    — slug matching a category route /category/<slug>
     price       — current price string with currency symbol
     oldPrice    — optional crossed-out original price (string or null)
     badge       — optional small chip text (e.g. "Last lot", "New")
     description — paragraph copy for the product detail page
     shape       — visual hint for the bottle SVG ("tall" | "round" | "squat")
                   (we keep the apothecary visual language even for non-perfume
                   categories so the catalogue reads as one curated house)
   ========================================================================= */

export const CATEGORIES = [
  { slug: "fashion",              label: "Fashion",              tagline: "Cut, weight, and silhouette." },
  { slug: "gaming",               label: "Gaming",               tagline: "After-hours arsenal." },
  { slug: "study-setup",          label: "Study Setup",          tagline: "Calm desks, quiet light." },
  { slug: "tech-accessories",     label: "Tech Accessories",     tagline: "Small objects, considered." },
  { slug: "footwear",             label: "Footwear",             tagline: "Soles for slow walking." },
  { slug: "streetwear",           label: "Streetwear",           tagline: "City-cut, drop-numbered." },
  { slug: "gift-ideas",           label: "Gift Ideas",           tagline: "For someone who reads after midnight." },
  { slug: "monochrome-collection", label: "Monochrome Collection", tagline: "One colour, repeated." },
  { slug: "pantry",                label: "Pantry",                tagline: "Small jars, slow afternoons." },
];

export const PRODUCTS = [
  /* ── FASHION ──────────────────────────────────────────────────────── */
  { id: "oversized-blazer",        category: "fashion", name: "Oversized Blazer",          subtitle: "Hand-finished wool, double-breasted", price: "£284", oldPrice: "£340", badge: "Last lot", shape: "tall",
    description: "A roomy, single-button blazer cut from a brushed wool-cashmere blend, lined with twill, and hand-finished at the lapels. Wears well over a knit, better over nothing." },
  { id: "premium-black-shirt",     category: "fashion", name: "Premium Black Shirt",       subtitle: "Long-staple cotton poplin",         price: "£128", oldPrice: null,    badge: null,        shape: "round",
    description: "A black shirt that doesn't go bronze under the wash. Long-staple cotton poplin, mother-of-pearl buttons, a placket that lies flat without ironing." },
  { id: "cargo-pants",             category: "fashion", name: "Cargo Pants",               subtitle: "Heavyweight cotton twill",          price: "£174", oldPrice: null,    badge: "Drop 04",   shape: "squat",
    description: "Heavyweight cotton twill, six pockets, a belt-loop the right width for a real belt. Cut wider through the thigh, tapered through the calf." },
  { id: "linen-overshirt",         category: "fashion", name: "Linen Overshirt",           subtitle: "Sand-washed Belgian linen",         price: "£196", oldPrice: "£230", badge: null,        shape: "tall",
    description: "Sand-washed Belgian linen with a faint kiss of texture. Cut as an overshirt — a real second layer rather than a fashion footnote." },
  { id: "wool-knit-tee",           category: "fashion", name: "Wool Knit Tee",             subtitle: "Italian merino, fully fashioned",   price: "£146", oldPrice: null,    badge: null,        shape: "round",
    description: "A tee weight knit from Italian merino, fully fashioned at the shoulders. Reads like a t-shirt, warms like a sweater." },

  /* ── GAMING ───────────────────────────────────────────────────────── */
  { id: "rgb-keyboard",            category: "gaming",  name: "RGB Keyboard",              subtitle: "Hot-swappable, doubleshot PBT",     price: "£218", oldPrice: "£268", badge: "Top edition", shape: "tall",
    description: "Hot-swappable mechanical board, doubleshot PBT caps, a CNC aluminium plate that doesn't ping. Per-key RGB, brass weights at the corners." },
  { id: "gaming-headset",          category: "gaming",  name: "Gaming Headset",            subtitle: "Closed-back, 50mm planar",          price: "£296", oldPrice: null,    badge: null,        shape: "round",
    description: "Closed-back planar headphones tuned for late nights. Memory-foam pads that don't cook your ears, a detachable cardioid mic." },
  { id: "mouse-pad",               category: "gaming",  name: "Mouse Pad",                 subtitle: "Wide-format, hemmed canvas",        price: "£44",  oldPrice: null,    badge: null,        shape: "squat",
    description: "A wide-format desk mat in heavy canvas with a hemmed edge, a textured nap on top, and a non-slip rubber underside. 900 × 400mm." },
  { id: "wireless-mouse-pro",      category: "gaming",  name: "Wireless Mouse · Pro",      subtitle: "Hall-effect switches, 68g",         price: "£162", oldPrice: "£198", badge: "Lightweight", shape: "round",
    description: "Hall-effect main switches, 68 grams, an 8 kHz polling rate, and a battery that survives the worst weekend." },
  { id: "monitor-arm",             category: "gaming",  name: "Monitor Arm",               subtitle: "Forged steel, gas-strut",           price: "£234", oldPrice: null,    badge: null,        shape: "tall",
    description: "Forged-steel monitor arm with a gas-strut counterweight. Holds a 32-inch panel without sag, and stays where you put it." },

  /* ── STUDY SETUP ──────────────────────────────────────────────────── */
  { id: "desk-lamp",               category: "study-setup", name: "Desk Lamp",             subtitle: "Brass arm, parchment shade",        price: "£198", oldPrice: null,    badge: "New",       shape: "tall",
    description: "Solid brass armature, parchment-paper shade, a stepless dimmer. Throws a warm pool the right size for a reading book." },
  { id: "minimal-chair",           category: "study-setup", name: "Minimal Chair",         subtitle: "Oiled walnut, hide seat",           price: "£642", oldPrice: "£780", badge: "Made-to-order", shape: "squat",
    description: "Oiled walnut frame, full-grain leather seat that softens with use, dovetailed joinery, no fasteners visible. Sits squarely at a desk." },
  { id: "monitor-stand",           category: "study-setup", name: "Monitor Stand",         subtitle: "Solid oak, brass feet",             price: "£128", oldPrice: null,    badge: null,        shape: "squat",
    description: "Solid oak slab, hand-shaped underside, four brass feet. Lifts your screen six inches and your desk a class." },
  { id: "library-shelf",           category: "study-setup", name: "Library Shelf · Petite", subtitle: "Free-standing, walnut",            price: "£468", oldPrice: null,    badge: null,        shape: "tall",
    description: "A small free-standing shelf the depth of a paperback. Walnut, adjustable, with a brass rail to keep books from leaning." },
  { id: "blotter-pad",             category: "study-setup", name: "Blotter Pad",           subtitle: "Vellum on cork backing",            price: "£72",  oldPrice: null,    badge: null,        shape: "round",
    description: "A real blotter pad — vellum sheet over a cork backing, brass corner caps, replaceable insert. Catches every leak." },

  /* ── TECH ACCESSORIES ─────────────────────────────────────────────── */
  { id: "leather-cable-organizer", category: "tech-accessories", name: "Leather Cable Organiser", subtitle: "Bridle hide, brass studs", price: "£38", oldPrice: null, badge: null, shape: "squat",
    description: "Cut from a single piece of English bridle hide, finished with two brass press-studs. Holds three to six cables tidily." },
  { id: "usb-c-hub",               category: "tech-accessories", name: "USB-C Hub · Maison",   subtitle: "Milled aluminium, four ports", price: "£148", oldPrice: "£180", badge: null, shape: "round",
    description: "Milled aluminium, four ports, passive cooling, a braided pigtail cable. Sits in oxblood-bronze finish to match the rest of the desk." },
  { id: "leather-mousepad",        category: "tech-accessories", name: "Leather Mousepad",     subtitle: "Hand-stitched bridle hide",     price: "£82",  oldPrice: null, badge: null, shape: "squat",
    description: "Bridle-hide mousepad, hand-stitched perimeter, beeswax finish. Picks up a patina from real use rather than from staging." },
  { id: "writing-stylus",          category: "tech-accessories", name: "Writing Stylus",       subtitle: "Brass barrel, replaceable tip", price: "£64",  oldPrice: null, badge: "New", shape: "tall",
    description: "A weighted brass stylus with a replaceable felt tip. Balances like a fountain pen. Magnetises to a tablet edge." },
  { id: "screen-cloth-set",        category: "tech-accessories", name: "Screen Cloth · Set",   subtitle: "Linen, hand-hemmed",            price: "£28",  oldPrice: null, badge: null, shape: "round",
    description: "Three linen cloths, hand-hemmed corners, washable. Better than microfibre, and doesn't shed." },

  /* ── FOOTWEAR ─────────────────────────────────────────────────────── */
  { id: "derby-shoe-oxblood",      category: "footwear", name: "Derby · Oxblood",          subtitle: "Goodyear-welted calfskin",          price: "£428", oldPrice: null, badge: null, shape: "squat",
    description: "Goodyear-welted derby in hand-burnished oxblood calfskin. Leather sole, brass eyelets, an insole that breaks in honestly." },
  { id: "low-top-sneaker",         category: "footwear", name: "Low-top Sneaker",          subtitle: "Vegetable-tanned leather",          price: "£234", oldPrice: "£284", badge: null, shape: "round",
    description: "Hand-stitched vegetable-tanned leather upper, full-grain insole, a sole compound that quiets a floorboard." },
  { id: "loafer-tobacco",          category: "footwear", name: "Loafer · Tobacco",         subtitle: "Soft suede, leather sole",          price: "£316", oldPrice: null, badge: "Last pair", shape: "squat",
    description: "Soft tobacco suede, hand-stitched apron, full leather sole. Goes from a study to a dinner without changing." },
  { id: "house-slipper",           category: "footwear", name: "House Slipper",            subtitle: "Boiled wool, hide outsole",         price: "£148", oldPrice: null, badge: null, shape: "round",
    description: "Boiled wool, hide outsole, a sheepskin lining. The footwear for early hours and quiet floors." },
  { id: "boot-stout",              category: "footwear", name: "Boot · Stout",             subtitle: "Oiled bullhide, six-eyelet",        price: "£468", oldPrice: null, badge: null, shape: "tall",
    description: "Oiled bullhide, six eyelets, a wedge sole. The boot for one winter at a time, then another." },

  /* ── STREETWEAR ───────────────────────────────────────────────────── */
  { id: "heavyweight-hoodie",      category: "streetwear", name: "Heavyweight Hoodie",     subtitle: "500gsm, loop-back cotton",          price: "£182", oldPrice: null, badge: "Drop 04",  shape: "tall",
    description: "Five-hundred-gram loop-back cotton, two-panel hood, brass eyelets, gilet-style hem so it sits flat under a coat." },
  { id: "boxy-tee",                category: "streetwear", name: "Boxy Tee",               subtitle: "Tubular knit, raw hem",             price: "£88",  oldPrice: null, badge: null,       shape: "round",
    description: "Tubular knit so there's no side seam, a raw hem at the bottom, screen-printed maison mark at the back neck." },
  { id: "track-jacket",            category: "streetwear", name: "Track Jacket",           subtitle: "Recycled nylon, side stripe",       price: "£218", oldPrice: "£264", badge: null,    shape: "tall",
    description: "Recycled nylon shell with a brass-stripe down the side, cotton lining, a high-low hem that reads relaxed." },
  { id: "five-panel-cap",          category: "streetwear", name: "Five-panel Cap",         subtitle: "Waxed canvas, brass clip",          price: "£62",  oldPrice: null, badge: null,       shape: "round",
    description: "Waxed canvas five-panel with a brass adjustment clip and a leather-tipped strap. Wears in, doesn't wear out." },
  { id: "cross-body-bag",          category: "streetwear", name: "Cross-body Bag",         subtitle: "Coated cotton, brass hardware",     price: "£174", oldPrice: null, badge: "New",      shape: "squat",
    description: "Coated cotton, brass hardware, a webbing strap that adjusts cleanly. Big enough for a small book and a tin of pastilles." },

  /* ── GIFT IDEAS ───────────────────────────────────────────────────── */
  { id: "candle-after-dark",       category: "gift-ideas", name: "Candle · After Dark",    subtitle: "Beeswax, fig & vellum",             price: "£68",  oldPrice: null, badge: null,        shape: "squat",
    description: "Beeswax-and-soy candle in a hand-poured oxblood-glass vessel. Burns for sixty hours of night-bloom and warm fig." },
  { id: "tea-edition-iv",          category: "gift-ideas", name: "Tea · Édition iv",       subtitle: "Single-estate, oxidised",           price: "£42",  oldPrice: null, badge: null,        shape: "round",
    description: "Single-estate oxidised leaf, hand-rolled in small batches. A tea for slow afternoons and quieter conversations." },
  { id: "writing-set",             category: "gift-ideas", name: "Writing Set",            subtitle: "Brass pen, two inks",               price: "£148", oldPrice: "£174", badge: "Boxed",  shape: "tall",
    description: "A brass pen, a glass nib, and two inks: bitter cocoa and oxblood. Boxed in linen with a parchment instruction card." },
  { id: "incense-trio",            category: "gift-ideas", name: "Incense Trio",           subtitle: "Three lots, cedar & oud",           price: "£54",  oldPrice: null, badge: null,        shape: "round",
    description: "Three lots in a cypress box: cedar, smoked oud, white pepper. Each stick burns for twenty-eight minutes." },
  { id: "gift-card",               category: "gift-ideas", name: "Maison Gift Card",       subtitle: "Any denomination, brass-foiled",    price: "£50+", oldPrice: null, badge: null,        shape: "tall",
    description: "A brass-foiled card in any denomination, hand-numbered, posted in a kraft envelope with a wax seal." },

  /* ── MONOCHROME COLLECTION ────────────────────────────────────────── */
  { id: "monochrome-tee",          category: "monochrome-collection", name: "Monochrome Tee",       subtitle: "Black, every weight",         price: "£94",  oldPrice: null, badge: null,        shape: "round",
    description: "The same tee in eight weights of black, from a featherweight cotton to a brushed jersey. Cut identical, so only the cloth changes." },
  { id: "monochrome-trouser",      category: "monochrome-collection", name: "Monochrome Trouser",   subtitle: "Wool flannel, single pleat",   price: "£228", oldPrice: null, badge: "Last lot", shape: "tall",
    description: "Wool flannel, single pleat, a clean break. One trouser the maison would wear most days of the year." },
  { id: "monochrome-coat",         category: "monochrome-collection", name: "Monochrome Coat",      subtitle: "Boiled wool, raglan",         price: "£684", oldPrice: "£820", badge: null,     shape: "tall",
    description: "Boiled wool, raglan shoulder, horn buttons, a half-belt at the back. The coat for grey weeks and graver evenings." },
  { id: "monochrome-cardigan",     category: "monochrome-collection", name: "Monochrome Cardigan",  subtitle: "Cashmere, shawl collar",       price: "£396", oldPrice: null, badge: null,        shape: "round",
    description: "Hand-loomed cashmere, shawl collar, leather-bound buttons. A cardigan the way they used to make them." },
  { id: "monochrome-scarf",        category: "monochrome-collection", name: "Monochrome Scarf",     subtitle: "Yak wool, hand-fringed",       price: "£162", oldPrice: null, badge: null,        shape: "squat",
    description: "Yak-wool scarf, hand-fringed, woven on a single loom by a single weaver. Wears warm without weight." },
];

/* Look-up helpers --------------------------------------------------------- */
export const getCategory = (slug) =>
  CATEGORIES.find((c) => c.slug === slug) || null;

export const getProductsByCategory = (slug) =>
  PRODUCTS.filter((p) => p.category === slug);

export const getProduct = (id) =>
  PRODUCTS.find((p) => p.id === id) || null;

export const getRelatedProducts = (id, count = 4) => {
  const me = getProduct(id);
  if (!me) return [];
  const sameCat = PRODUCTS.filter((p) => p.category === me.category && p.id !== id);
  if (sameCat.length >= count) return sameCat.slice(0, count);
  const others = PRODUCTS.filter((p) => p.category !== me.category && p.id !== id);
  return [...sameCat, ...others].slice(0, count);
};
