import React, { useEffect, useMemo, useState } from "react";
import ScrollToTop from "react-scroll-to-top";
import BottomFooter from "../components/BottomFooter";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import HeaderTwo from "../components/HeaderTwo";
import ShippingOne from "../components/ShippingOne";
import ValkeyChallengeNav from "../components/ValkeyChallengeNav";
import { useCart } from "../context/CartContext";
import ColorInit from "../helper/ColorInit";
import Preloader from "../helper/Preloader";
import { getCatalogProducts, getCategories, getVendors } from "../services/valkeyApi";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const CatalogPage = () => {
  const { addItem } = useCart();
  const [filters, setFilters] = useState({
    categoryId: "",
    vendorId: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    limit: 8,
    offset: 0,
  });
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, offset: 0, limit: 8, nextOffset: null });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getCategories(), getVendors()])
      .then(([categoryData, vendorData]) => {
        setCategories(categoryData.categories || []);
        setVendors(vendorData.vendors || []);
      })
      .catch((error) => setMessage(error.message));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setMessage("");
    getCatalogProducts(filters)
      .then((data) => {
        if (!active) return;
        setProducts(data.products || []);
        setPagination(data.pagination || { total: 0, offset: 0, limit: 8, nextOffset: null });
      })
      .catch((error) => {
        if (active) setMessage(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters]);

  const categoryOptions = useMemo(() => flattenCategories(categories), [categories]);
  const brands = useMemo(() => [...new Set(products.map((product) => product.brand))].sort(), [products]);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value, offset: 0 }));
  }

  function goToOffset(offset) {
    setFilters((current) => ({ ...current, offset }));
  }

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />
      <HeaderTwo category={true} />
      <Breadcrumb title="Catalog" />
      <ValkeyChallengeNav />

      <section className="py-60">
        <div className="container container-lg">
          <div className="border border-gray-100 rounded-8 p-24 mb-32">
            <div className="flex-between flex-wrap gap-16 mb-24">
              <div>
                <span className="text-sm text-main-600 fw-semibold">Challenge 2</span>
                <h6 className="mb-0 mt-4">Valkey JSON product catalog</h6>
              </div>
              <span className="text-sm text-gray-600">{pagination.total} matching products</span>
            </div>
            <div className="row gy-3 align-items-end">
              <div className="col-lg-3 col-md-6">
                <label className="text-sm fw-semibold mb-8">Category tree</label>
                <select className="common-input border-gray-100" value={filters.categoryId} onChange={(event) => updateFilter("categoryId", event.target.value)}>
                  <option value="">All categories</option>
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-3 col-md-6">
                <label className="text-sm fw-semibold mb-8">Vendor</label>
                <select className="common-input border-gray-100" value={filters.vendorId} onChange={(event) => updateFilter("vendorId", event.target.value)}>
                  <option value="">All vendors</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-2 col-md-4">
                <label className="text-sm fw-semibold mb-8">Brand</label>
                <select className="common-input border-gray-100" value={filters.brand} onChange={(event) => updateFilter("brand", event.target.value)}>
                  <option value="">All brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-lg-2 col-md-4">
                <label className="text-sm fw-semibold mb-8">Min price</label>
                <input className="common-input border-gray-100" value={filters.minPrice} onChange={(event) => updateFilter("minPrice", event.target.value)} />
              </div>
              <div className="col-lg-2 col-md-4">
                <label className="text-sm fw-semibold mb-8">Max price</label>
                <input className="common-input border-gray-100" value={filters.maxPrice} onChange={(event) => updateFilter("maxPrice", event.target.value)} />
              </div>
            </div>
          </div>

          {message && <div className="alert alert-warning rounded-8">{message}</div>}
          {loading && <div className="alert alert-info rounded-8">Loading catalog from Valkey</div>}

          <div className="row gy-4">
            {products.map((product) => (
              <div className="col-xl-3 col-md-6" key={product.id}>
                <div className="border border-gray-100 rounded-8 p-20 h-100">
                  <div className="valkey-product-media mb-16">
                    <img src={product.images?.[0]?.url || "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mechanical_Keyboard.jpg/960px-Mechanical_Keyboard.jpg"} alt={product.name} />
                  </div>
                  <span className="text-xs text-main-600 fw-semibold">{product.brand}</span>
                  <h6 className="text-lg mt-8 mb-8">{product.name}</h6>
                  <p className="text-sm text-gray-600 text-line-2">{product.shortDescription}</p>
                  <div className="flex-between gap-12 mb-16">
                    <span className="fw-bold text-heading">{currency.format(product.price.amount)}</span>
                    <span className="text-sm text-gray-500">{product.inventory.quantity - product.inventory.reserved} available</span>
                  </div>
                  <button className="btn btn-main py-10 px-14 rounded-8 flex-align gap-6" onClick={() => void addItem(product)} type="button">
                    <i className="ph ph-shopping-cart" />
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-between flex-wrap gap-16 mt-32">
            <button className="btn bg-gray-50 text-heading py-10 px-16 rounded-8" type="button" disabled={pagination.offset === 0} onClick={() => goToOffset(Math.max(0, pagination.offset - pagination.limit))}>
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Showing {products.length === 0 ? 0 : pagination.offset + 1}-{pagination.offset + products.length} of {pagination.total}
            </span>
            <button className="btn bg-gray-50 text-heading py-10 px-16 rounded-8" type="button" disabled={pagination.nextOffset === null} onClick={() => goToOffset(pagination.nextOffset)}>
              Next
            </button>
          </div>
        </div>
      </section>

      <ShippingOne />
      <FooterTwo />
      <BottomFooter />
    </>
  );
};

function flattenCategories(nodes, depth = 0) {
  return nodes.flatMap((node) => [
    { id: node.id, label: `${"  ".repeat(depth)}${node.name}` },
    ...flattenCategories(node.childNodes || [], depth + 1),
  ]);
}

export default CatalogPage;
