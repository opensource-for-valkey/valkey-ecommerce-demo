# Nocturne & Co. — Frontend

React 18 + Create React App. Bootstrap 5 utility classes plus a hand-written Nocturne theme layer in `src/styles/nocturne.css`. Every page that shows products talks to the backend at `http://localhost:4000/api/...` — there is no local product data path left in the rendered flow.

## Run

```
npm install
npm start
```

The dev server runs on `http://localhost:3000` and expects the backend to be reachable at `http://localhost:4000`. To point at a different backend:

```
echo "REACT_APP_CATALOG_URL=https://api.example.com/api" > .env.local
echo "REACT_APP_API_URL=https://api.example.com/api/agent" >> .env.local
```

## Folder layout

```
frontend/
  public/
    index.html                  # preconnects for images.unsplash.com, loremflickr, picsum
    assets/                     # template CSS, fonts, fallback product PNGs
  src/
    App.js                      # Router. Real product routes: /category/:slug,
                                # /product/:id, /search, /categories
    index.js                    # CRA entry; imports nocturne.css globally
    lib/
      api.js                    # Single fetch wrapper. fetchCategories,
                                # fetchProducts, fetchProduct, fetchSimilar,
                                # fetchTrending. Every page goes through here.
      img.js                    # sized(), srcSet(), lqip() helpers
      category-art.js           # One curated keyword image per category
      brand-logos.js            # Wikimedia logo URLs per brand
    components/
      HeaderOne.jsx             # Wired to the always-on inline search
      HeaderTwo.jsx
      HeaderThree.jsx
      common/
        ProductImage.jsx        # Zero-CLS image wrapper with blur-up fade
        SearchSuggestions.jsx   # Debounced dropdown backed by
                                # GET /api/agent/suggestions
    pages/
      CategoryPage.jsx          # /category/:slug — fetchProducts({category})
      ProductPage.jsx           # /product/:id — fetchProduct + fetchSimilar
      CategoriesPage.jsx        # /categories — fetchCategories + preview grid
      SearchResultsPage.jsx     # /search?q=... — POST /api/agent/search,
                                # honors notInCatalog flag with Nocturne chips
      HomePageOne.jsx
      ProductDetailsPageOne.jsx
      ...
    helper/
      mockCatalog.js            # Fallback shape mirror of the Nocturne data
      NocturneEnhance.jsx       # The Nocturne CSS + small DOM glue
    styles/
      nocturne.css              # The brand layer that turns the template into
                                # Nocturne & Co.
    index.scss                  # Template SCSS entry
```

## Where data comes from

| Page | API call |
| --- | --- |
| `/categories` | `GET /api/categories` plus `GET /api/products?category=<slug>&pageSize=4` per tile |
| `/category/:slug` | `GET /api/categories`, `GET /api/products?category=<slug>&sort=<sort>` |
| `/product/:id` | `GET /api/products/:id` (or slug lookup), `GET /api/products/:id/similar` |
| `/search?q=...` | `POST /api/agent/search` with `{ sessionId, message }` |
| Header search dropdown | `GET /api/agent/suggestions?q=&sessionId=` |

The session id lives in `localStorage["agent_sid"]` and is regenerated only if the user clears site data.

## Search interaction

The header form is always visible and always editable. It does three things:

1. Submitting on Enter or clicking the magnifier navigates to `/search?q=<value>` which kicks off the agent search.
2. While typing, the `SearchSuggestions` dropdown debounces and pulls suggestions from `GET /api/agent/suggestions`. The list is keyboard-navigable (`Up`, `Down`, `Enter`, `Esc`). Picking a suggestion submits the search immediately.
3. With an empty input it shows recent searches first, then popular ones.

`SearchResultsPage` interprets the `notInCatalog` flag from the backend. When the catalogue does not carry the requested item it renders an honest warning with a row of real Nocturne categories pulled from `GET /api/categories` (no hardcoded chip list).

## Available scripts

```
npm start          # development server on :3000
npm test           # Jest in watch mode
CI=true npm test   # single CI run
npm run build      # production bundle in ./build
```

## Notes

- `src/data/products.js` is preserved as a structural reference but no rendered page imports from it.
- `helper/NocturneEnhance.jsx` injects a slim sticky category strip after the last `<header>`. The strip is React-router-friendly and survives client-side navigation.
- The previous "New" badges above the Pages and Vendors menu items have been removed. The header has no toggleable search overlay anymore — the inline form replaces it.
