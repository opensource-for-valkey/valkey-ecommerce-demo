import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="product-card h-100 p-16 border border-gray-100 rounded-16 position-relative transition-2 placeholder-glow">
      <div
        className="product-card__thumb flex-center rounded-8 bg-gray-50 position-relative placeholder"
        style={{ height: '200px', width: '100%' }}
      ></div>
      <div className="product-card__content mt-16">
        <h6 className="title text-lg fw-semibold mt-12 mb-8 placeholder col-10"></h6>
        <div className="flex-align mb-20 mt-16 gap-6">
          <span className="placeholder col-3"></span>
        </div>
        <div className="mt-8">
          <div className="progress w-100 bg-color-three rounded-pill h-4 placeholder"></div>
          <span className="placeholder col-4 mt-8"></span>
        </div>
        <div className="product-card__price my-20">
          <span className="placeholder col-5"></span>
        </div>
        <div className="placeholder col-12 py-11 px-24 rounded-8" style={{ height: '46px' }}></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
