import React from "react";
import api from "../api/client";
import useFetch from "../api/useFetch";
import ProductCard from "./common/ProductCard";

const ProductListOne = () => {
  const { data, error, loading } = useFetch(
    (opts) => api.listProducts({ limit: 12, sort: "rating" }, opts),
    []
  );

  return (
    <div className="product mt-24">
      <div className="container container-lg">
        {loading && (
          <div className="py-40 text-center text-gray-500">Loading products…</div>
        )}
        {error && (
          <div className="py-40 text-center text-danger-600">
            Couldn't load products. Is the backend running on
            {" "}<code>{api.baseUrl}</code>?
          </div>
        )}
        {!loading && !error && (
          <div className="row gy-4 g-12">
            {(data?.results ?? []).map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                variant="compact"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListOne;
