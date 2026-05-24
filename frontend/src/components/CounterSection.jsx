import React from "react";

const CounterSection = () => {
  return (
    <section className='counter'>
      <div className='container container-lg'>
        <div className='row justify-content-center'>
          <div className='col-xxl-11'>
            <div className='bg-neutral-600 rounded-16 px-xxl-5 px-xl-4'>
              <div className='row gy-lg-0 gy-4 line-wrapper'>
                <div className='col-lg-3 col-sm-6 col-xs-6'>
                  <div className='counter-item text-center py-100 px-8'>
                    <h3 className='text-main-600 counter mb-8 fw-semibold'>
                      185+
                    </h3>
                    <p className='text-white text-xl font-heading-two fw-semibold'>
                      Store around the world
                    </p>
                  </div>
                </div>
                <div className='col-lg-3 col-sm-6 col-xs-6'>
                  <div className='counter-item text-center py-100 px-8'>
                    <h3 className='text-main-600 counter mb-8 fw-semibold'>
                      152K
                    </h3>
                    <p className='text-white text-xl font-heading-two fw-semibold'>
                      Product Sold
                    </p>
                  </div>
                </div>
                <div className='col-lg-3 col-sm-6 col-xs-6'>
                  <div className='counter-item text-center py-100 px-8'>
                    <h3 className='text-main-600 counter mb-8 fw-semibold'>
                      15K+
                    </h3>
                    <p className='text-white text-xl font-heading-two fw-semibold'>
                      Registered Users
                    </p>
                  </div>
                </div>
                <div className='col-lg-3 col-sm-6 col-xs-6'>
                  <div className='counter-item text-center py-100 px-8'>
                    <h3 className='text-main-600 counter mb-8 fw-semibold'>
                      2K+
                    </h3>
                    <p className='text-white text-xl font-heading-two fw-semibold'>
                      Top Brands Available in store
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CounterSection;
