import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ReactSlider from "react-slider";

import api from "../api/client";
import useFetch from "../api/useFetch";
import ProductCard from "./common/ProductCard";

// /shop driven by the local API. Filters: category, price range, sort.
// Pagination is offset-based, matching the backend's `limit`/`offset` params.

const PAGE_SIZE = 12;
// Outer bound for the price slider, in INR paise. 0 to ~₹2,50,000.
const PRICE_MIN = 0;
const PRICE_MAX = 25000000;
const PRICE_STEP = 100000; // ₹1,000 increments

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top rated" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

const ShopSection = () => {
  const [grid, setGrid] = useState(false);
  const [active, setActive] = useState(false);
  const sidebarController = () => setActive(!active);

  const [searchParams, setSearchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim();

  // Filter state
  const [categoryId, setCategoryId] = useState(null);
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);
  const [appliedPrice, setAppliedPrice] = useState([PRICE_MIN, PRICE_MAX]);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // Reset to first page whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [categoryId, appliedPrice, sort, q]);

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next, { replace: true });
  };

  // Categories sidebar
  const { data: catData } = useFetch((opts) => api.listCategories(opts), []);
  const topCategories = useMemo(() => {
    const all = catData?.categories ?? [];
    return all.filter((c) => !c.parentId);
  }, [catData]);
  const childrenByParent = useMemo(() => {
    const all = catData?.categories ?? [];
    const map = {};
    for (const c of all) {
      if (!c.parentId) continue;
      (map[c.parentId] ||= []).push(c);
    }
    return map;
  }, [catData]);

  // Products
  const productParams = useMemo(
    () => ({
      q: q || undefined,
      categoryId: categoryId || undefined,
      minPrice: appliedPrice[0] > PRICE_MIN ? appliedPrice[0] : undefined,
      maxPrice: appliedPrice[1] < PRICE_MAX ? appliedPrice[1] : undefined,
      sort,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
    [q, categoryId, appliedPrice, sort, page]
  );

  const { data, loading, error } = useFetch(
    (opts) => api.listProducts(productParams, opts),
    [productParams]
  );

  const products = data?.results ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, total);

  return (
    <section className="shop py-80">
      <div className={`side-overlay ${active && "show"}`}></div>
      <div className="container container-lg">
        <div className="row">
          {/* Sidebar Start */}
          <div className="col-lg-3">
            <div className={`shop-sidebar ${active && "active"}`}>
              <button
                onClick={sidebarController}
                type="button"
                className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle hover-bg-main-600 position-absolute inset-inline-end-0 me-10 mt-8 hover-text-white hover-border-main-600"
              >
                <i className="ph ph-x" />
              </button>

              {/* Category filter */}
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                  Product Category
                </h6>
                <ul className="max-h-540 overflow-y-auto scroll-sm">
                  <li className="mb-24">
                    <button
                      type="button"
                      onClick={() => setCategoryId(null)}
                      className={`btn btn-link p-0 text-start ${
                        categoryId === null
                          ? "text-main-600 fw-semibold"
                          : "text-gray-900 hover-text-main-600"
                      }`}
                    >
                      All categories
                    </button>
                  </li>
                  {topCategories.map((top) => (
                    <React.Fragment key={top.id}>
                      <li className="mb-12">
                        <button
                          type="button"
                          onClick={() => setCategoryId(top.id)}
                          className={`btn btn-link p-0 text-start fw-semibold ${
                            categoryId === top.id
                              ? "text-main-600"
                              : "text-gray-900 hover-text-main-600"
                          }`}
                        >
                          {top.name}
                        </button>
                      </li>
                      {(childrenByParent[top.id] || []).map((child) => (
                        <li key={child.id} className="mb-12 ms-16">
                          <button
                            type="button"
                            onClick={() => setCategoryId(child.id)}
                            className={`btn btn-link p-0 text-start ${
                              categoryId === child.id
                                ? "text-main-600 fw-semibold"
                                : "text-gray-700 hover-text-main-600"
                            }`}
                          >
                            {child.name}
                          </button>
                        </li>
                      ))}
                    </React.Fragment>
                  ))}
                </ul>
              </div>

              {/* Price filter */}
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                  Filter by Price (₹)
                </h6>
                <div className="custom--range">
                  <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="example-thumb"
                    trackClassName="example-track"
                    value={priceRange}
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    onChange={(value) => setPriceRange(value)}
                    ariaLabel={["Lower thumb", "Upper thumb"]}
                    ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
                    renderThumb={(props, state) => {
                      const { key, ...rest } = props;
                      return (
                        <div {...rest} key={state.index}>
                          {Math.round(state.valueNow / 100)}
                        </div>
                      );
                    }}
                    pearling
                    minDistance={PRICE_STEP * 5}
                  />
                  <div className="d-flex justify-content-between mt-16 text-sm text-gray-700">
                    <span>₹{(priceRange[0] / 100).toLocaleString("en-IN")}</span>
                    <span>₹{(priceRange[1] / 100).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex-between flex-wrap-reverse gap-8 mt-24">
                    <button
                      type="button"
                      className="btn btn-main h-40 flex-align"
                      onClick={() => setAppliedPrice(priceRange)}
                    >
                      Filter
                    </button>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-gray-700"
                      onClick={() => {
                        setPriceRange([PRICE_MIN, PRICE_MAX]);
                        setAppliedPrice([PRICE_MIN, PRICE_MAX]);
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar End */}

          {/* Content Start */}
          <div className="col-lg-9">
            {q && (
              <div className="d-flex flex-wrap align-items-center gap-12 mb-24 p-16 bg-main-50 rounded-8">
                <span className="text-sm text-gray-700">
                  Search results for <strong>"{q}"</strong>
                </span>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="btn btn-link p-0 text-sm text-main-600"
                >
                  Clear search
                </button>
              </div>
            )}
            {/* Top Start */}
            <div className="flex-between gap-16 flex-wrap mb-40 ">
              <span className="text-gray-900">
                {total === 0
                  ? "No products match these filters"
                  : `Showing ${showingFrom}-${showingTo} of ${total} result${total === 1 ? "" : "s"}`}
              </span>
              <div className="position-relative flex-align gap-16 flex-wrap">
                <div className="list-grid-btns flex-align gap-16">
                  <button
                    onClick={() => setGrid(true)}
                    type="button"
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl list-btn border-gray-100 ${
                      grid === true && "border-main-600 text-white bg-main-600"
                    }`}
                  >
                    <i className="ph-bold ph-list-dashes" />
                  </button>
                  <button
                    onClick={() => setGrid(false)}
                    type="button"
                    className={`w-44 h-44 flex-center border rounded-6 text-2xl grid-btn border-gray-100 ${
                      grid === false && "border-main-600 text-white bg-main-600"
                    }`}
                  >
                    <i className="ph ph-squares-four" />
                  </button>
                </div>
                <div className="position-relative text-gray-500 flex-align gap-4 text-14">
                  <label htmlFor="sorting" className="text-inherit flex-shrink-0">
                    Sort by:{" "}
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="form-control common-input px-14 py-14 text-inherit rounded-6 w-auto"
                    id="sorting"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={sidebarController}
                  type="button"
                  className="w-44 h-44 d-lg-none d-flex flex-center border border-gray-100 rounded-6 text-2xl sidebar-btn"
                >
                  <i className="ph-bold ph-funnel" />
                </button>
              </div>
            </div>
            {/* Top End */}

            {/* Product Grid Start */}
            {loading && (
              <div className="py-80 text-center text-gray-500">Loading products…</div>
            )}
            {error && !loading && (
              <div className="py-40 text-center text-danger-600">
                Couldn't load products. Is the backend running on{" "}
                <code>{api.baseUrl}</code>?
              </div>
            )}
            {!loading && !error && products.length === 0 && (
              <div className="py-80 text-center text-gray-500">
                No products match the current filters.
              </div>
            )}
            {!loading && !error && products.length > 0 && (
              <div className={`list-grid-wrapper ${grid && "list-view"}`}>
                {products.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} variant="shop" />
                ))}
              </div>
            )}
            {/* Product Grid End */}

            {/* Pagination Start */}
            {pageCount > 1 && (
              <ul className="pagination flex-center flex-wrap gap-16 mt-40">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                  >
                    <i className="ph-bold ph-arrow-left" />
                  </button>
                </li>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <li key={n} className={`page-item ${n === page ? "active" : ""}`}>
                    <button
                      type="button"
                      onClick={() => setPage(n)}
                      className="page-link h-64 w-64 flex-center text-md rounded-8 fw-medium text-neutral-600 border border-gray-100"
                    >
                      {String(n).padStart(2, "0")}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === pageCount ? "disabled" : ""}`}>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    disabled={page === pageCount}
                    className="page-link h-64 w-64 flex-center text-xxl rounded-8 fw-medium text-neutral-600 border border-gray-100"
                  >
                    <i className="ph-bold ph-arrow-right" />
                  </button>
                </li>
              </ul>
            )}
            {/* Pagination End */}
          </div>
          {/* Content End */}
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
