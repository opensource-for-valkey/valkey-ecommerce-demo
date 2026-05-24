import React from "react";
import { Link } from "react-router-dom";

const DiscountThree = () => {
  return (
    <section className='discount-three overflow-hidden'>
      <div className='container container-lg'>
        <div className='row gy-4'>
          <div className='col-xl-4 col-sm-6'>
            <div
              className='discount-three-item bg-img rounded-16 overflow-hidden'
              style={{
                backgroundImage:
                  "url(/assets/images/thumbs/discount-three-img1.png)",
              }}
            >
              <div className='text-start'>
                <span className='fw-medium text-neutral-600 mb-4 text-uppercase'>
                  35% off the all order
                </span>
                <h6 className='fw-semibold mb-0 max-w-375'>
                  Spring Collection
                </h6>
                <Link
                  to='/shop'
                  className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                  tabIndex={0}
                >
                  Shop Now
                  <span className='text-xl d-flex'>
                    <i className='ph ph-shopping-cart-simple' />
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className='col-xl-4 col-sm-6'>
            <div
              className='discount-three-item bg-img rounded-16 overflow-hidden'
              style={{
                backgroundImage:
                  "url(/assets/images/thumbs/discount-three-img2.png)",
              }}
            >
              <div className='text-start'>
                <span className='fw-medium text-neutral-600 mb-4 text-uppercase'>
                  35% off the all order
                </span>
                <h6 className='fw-semibold mb-0 max-w-375'>
                  Spring Collection
                </h6>
                <Link
                  to='/shop'
                  className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                  tabIndex={0}
                >
                  Shop Now
                  <span className='text-xl d-flex'>
                    <i className='ph ph-shopping-cart-simple' />
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className='col-xl-4 col-sm-6'>
            <div
              className='discount-three-item bg-img rounded-16 overflow-hidden'
              style={{
                backgroundImage:
                  "url(/assets/images/thumbs/discount-three-img3.png)",
              }}
            >
              <div className='text-start'>
                <span className='fw-medium text-neutral-600 mb-4 text-uppercase'>
                  Get 25% off the all order
                </span>
                <h6 className='fw-semibold mb-0 max-w-375'>Black Friday</h6>
                <Link
                  to='/shop'
                  className='btn btn-black rounded-pill gap-8 mt-32 flex-align d-inline-flex'
                  tabIndex={0}
                >
                  Shop Now
                  <span className='text-xl d-flex'>
                    <i className='ph ph-shopping-cart-simple' />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscountThree;
