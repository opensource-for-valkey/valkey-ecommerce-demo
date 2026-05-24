import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MagnifyingGlass, SlidersHorizontal, X } from "@phosphor-icons/react";
import { api } from "../api";
import { EmptyState } from "../components/EmptyState";
import { ProductCard } from "../components/ProductCard";
import { ProductSkeleton } from "../components/ProductSkeleton";
import { useSeo } from "../useSeo";

export const ShopPage = () => {
  useSeo("Shop", "Search, filter, and sort the VAL-HYD catalog.");
  const [searchParams, setSearchParams] = useSearchParams();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const query = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      brand: searchParams.get("brand") || "",
      subcategory: searchParams.get("subcategory") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      rating: searchParams.get("rating") || "",
      sort: searchParams.get("sort") || "featured",
      page: searchParams.get("page") || 1,
      limit: 16
    }),
    [searchParams]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setResponse(await api.products(query));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [query]);

  const updateQuery = (next) => {
    const merged = { ...query, ...next, page: next.page || 1 };
    Object.keys(merged).forEach((key) => {
      if (!merged[key]) delete merged[key];
    });
    setSearchParams(merged);
  };

  const products = response?.data || [];
  const categoryFacets = response?.facets?.categories || [];

  return (
    <main className="vc-page">
      <section className="vc-page-heading">
        <div>
          <span className="vc-eyebrow">Catalog</span>
          <h1>Shop the collection</h1>
          <p>
            Search, sort, filter, paginate, and cache product responses through the API.
          </p>
        </div>
        <button
          className="vc-button vc-button--ghost vc-filter-trigger"
          type="button"
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontal size={18} /> Filters
        </button>
      </section>

      {categoryFacets.length > 0 && (
        <nav className="vc-category-rail" aria-label="Product categories">
          <button
            type="button"
            className={!query.category ? "is-active" : ""}
            onClick={() => updateQuery({ category: "" })}
          >
            All
          </button>
          {categoryFacets.map((category) => (
            <button
              type="button"
              key={category.name}
              className={query.category === category.name ? "is-active" : ""}
              onClick={() => updateQuery({ category: category.name })}
            >
              {category.name}
              <span>{category.count}</span>
            </button>
          ))}
        </nav>
      )}

      <section className="vc-shop-layout">
        <aside className={`vc-filters ${filtersOpen ? "is-open" : ""}`}>
          <button
            className="vc-icon-button vc-filters__close"
            type="button"
            aria-label="Close filters"
            title="Close filters"
            onClick={() => setFiltersOpen(false)}
          >
            <X size={18} />
          </button>
          <h2>Filters</h2>
          <label>
            Search
            <input
              value={query.search}
              onChange={(event) => updateQuery({ search: event.target.value })}
              placeholder="Product or brand"
            />
          </label>
          <label>
            Category
            <select
              value={query.category}
              onChange={(event) => updateQuery({ category: event.target.value })}
            >
              <option value="">All categories</option>
              {response?.facets?.categories?.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </label>
          <label>
            Brand
            <select
              value={query.brand}
              onChange={(event) => updateQuery({ brand: event.target.value })}
            >
              <option value="">All brands</option>
              {response?.facets?.brands?.map((brand) => (
                <option key={brand.name} value={brand.name}>
                  {brand.name} ({brand.count})
                </option>
              ))}
            </select>
          </label>
          <label>
            Subcategory
            <select
              value={query.subcategory}
              onChange={(event) => updateQuery({ subcategory: event.target.value })}
            >
              <option value="">All subcategories</option>
              {response?.facets?.subcategories?.map((subcategory) => (
                <option key={subcategory.name} value={subcategory.name}>
                  {subcategory.name} ({subcategory.count})
                </option>
              ))}
            </select>
          </label>
          <div className="vc-filter-pair">
            <label>
              Min price
              <input
                type="number"
                min="0"
                value={query.minPrice}
                onChange={(event) => updateQuery({ minPrice: event.target.value })}
              />
            </label>
            <label>
              Max price
              <input
                type="number"
                min="0"
                value={query.maxPrice}
                onChange={(event) => updateQuery({ maxPrice: event.target.value })}
              />
            </label>
          </div>
          <label>
            Rating
            <select
              value={query.rating}
              onChange={(event) => updateQuery({ rating: event.target.value })}
            >
              <option value="">Any rating</option>
              <option value="4.8">4.8 and up</option>
              <option value="4.6">4.6 and up</option>
              <option value="4.4">4.4 and up</option>
            </select>
          </label>
          <button className="vc-button vc-button--ghost" type="button" onClick={() => setSearchParams({})}>
            Reset filters
          </button>
        </aside>

        <div className="vc-shop-results">
          <div className="vc-results-bar">
            <span>
              {response?.pagination?.total || 0} products
              {response?.cache && (
                <small> Cache {response.cache.hit ? "hit" : "miss"} via {response.cache.mode}</small>
              )}
            </span>
            <select
              value={query.sort}
              onChange={(event) => updateQuery({ sort: event.target.value })}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="trending">Trending</option>
              <option value="rating">Top rated</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price low to high</option>
              <option value="price-desc">Price high to low</option>
            </select>
          </div>

          {loading ? (
            <div className="vc-product-grid">
              {Array.from({ length: 12 }, (_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : products.length ? (
            <>
              <div className="vc-product-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="vc-pagination">
                <button
                  className="vc-button vc-button--ghost"
                  type="button"
                  disabled={Number(query.page) <= 1}
                  onClick={() => updateQuery({ page: Number(query.page) - 1 })}
                >
                  Previous
                </button>
                <span>
                  Page {response.pagination.page} of {response.pagination.totalPages}
                </span>
                <button
                  className="vc-button vc-button--ghost"
                  type="button"
                  disabled={response.pagination.page >= response.pagination.totalPages}
                  onClick={() => updateQuery({ page: Number(query.page) + 1 })}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <EmptyState
              icon={MagnifyingGlass}
              title="No matching products"
              body="Try a different search, category, price range, or rating filter."
              action={
                <button className="vc-button vc-button--primary" type="button" onClick={() => setSearchParams({})}>
                  Clear filters
                </button>
              }
            />
          )}
        </div>
      </section>
    </main>
  );
};

