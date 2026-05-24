const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/src/components/ShopSection.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add imports
if (!content.includes('useEffect')) {
    content = content.replace(
        "import React, { useState } from 'react'",
        "import React, { useState, useEffect } from 'react'"
    );
}

// Add state
const stateAddition = `
    let [grid, setGrid] = useState(false)
    let [active, setActive] = useState(false)
    let [products, setProducts] = useState([])
    let [loading, setLoading] = useState(true)

    let sidebarController = () => {
        setActive(!active)
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setProducts(data.products || []);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
`;

if (!content.includes('fetchProducts = async')) {
    content = content.replace(
        /let \[grid, setGrid\] = useState\(false\)([\s\S]*?)let sidebarController = \(\) => {[\s\S]*?setActive\(!active\)[\s\S]*?}/m,
        stateAddition
    );
}

// Replace grid wrapper
const listGridStart = '<div className={`list-grid-wrapper ${grid && "list-view"}`}>';
const paginationStart = '{/* Pagination Start */}';

const startIndex = content.indexOf(listGridStart);
const endIndex = content.indexOf(paginationStart);

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
    const dynamicGrid = `
                        <div className={\`list-grid-wrapper \${grid && "list-view"}\`}>
                            {loading ? (
                                <div className="py-40 text-center w-100">Loading products...</div>
                            ) : products.length === 0 ? (
                                <div className="py-40 text-center w-100">No products found.</div>
                            ) : (
                                products.map((product) => (
                                    <div key={product.id} className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2">
                                        <Link
                                            to={\`/product-details-two?id=\${product.id}\`}
                                            className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative"
                                        >
                                            <img
                                                src={product.images?.[0] || "assets/images/thumbs/product-two-img1.png"}
                                                alt={product.name}
                                                className="w-auto max-w-unset"
                                            />
                                            {product.price?.discount > 0 && (
                                                <span className="product-card__badge bg-primary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                                                    Best Sale{" "}
                                                </span>
                                            )}
                                        </Link>
                                        <div className="product-card__content mt-16">
                                            <h6 className="title text-lg fw-semibold mt-12 mb-8">
                                                <Link
                                                    to={\`/product-details-two?id=\${product.id}\`}
                                                    className="link text-line-2"
                                                    tabIndex={0}
                                                >
                                                    {product.name}
                                                </Link>
                                            </h6>
                                            <div className="flex-align mb-20 mt-16 gap-6">
                                                <span className="text-xs fw-medium text-gray-500">{product.ratings?.average || 0}</span>
                                                <span className="text-15 fw-medium text-warning-600 d-flex">
                                                    <i className="ph-fill ph-star" />
                                                </span>
                                                <span className="text-xs fw-medium text-gray-500">({product.ratings?.count || 0})</span>
                                            </div>
                                            <div className="mt-8">
                                                <div
                                                    className="progress w-100 bg-color-three rounded-pill h-4"
                                                    role="progressbar"
                                                    aria-label="Basic example"
                                                    aria-valuenow={35}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                >
                                                    <div
                                                        className="progress-bar bg-main-two-600 rounded-pill"
                                                        style={{ width: "35%" }}
                                                    />
                                                </div>
                                                <span className="text-gray-900 text-xs fw-medium mt-8">
                                                    Inventory: {product.inventory?.quantity || 0}
                                                </span>
                                            </div>
                                            <div className="product-card__price my-20">
                                                {product.price?.discount > 0 && (
                                                    <span className="text-gray-400 text-md fw-semibold text-decoration-line-through me-2">
                                                        \${((product.price.amount + product.price.discount)).toFixed(2)}
                                                    </span>
                                                )}
                                                <span className="text-heading text-md fw-semibold ">
                                                    \${product.price?.amount || '0.00'} <span className="text-gray-500 fw-normal">/Qty</span>{" "}
                                                </span>
                                            </div>
                                            <Link
                                                to="/cart"
                                                className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                                                tabIndex={0}
                                            >
                                                Add To Cart <i className="ph ph-shopping-cart" />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        `;

    content = content.slice(0, startIndex) + dynamicGrid + content.slice(endIndex);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Successfully patched ShopSection.jsx");
} else {
    console.log("Could not find list-grid-wrapper or Pagination Start");
}
