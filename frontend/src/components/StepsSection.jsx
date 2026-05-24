import React from "react";

const StepsSection = () => {
  return (
    <section className='step py-80'>
      <div className='position-relative z-1'>
        <img
          src='/assets/images/shape/curve-line-shape.png'
          alt=''
          className='position-absolute top-0 inset-inline-end-0 z-n1 me-60 d-lg-block d-none'
        />
        <div className='container container-lg'>
          <div className='row gy-4'>
            <div className='col-lg-6'>
              <div className='step-content'>
                <div className='section-heading ms-auto text-end'>
                  <h5 className=''>Over $200k in potential benefits</h5>
                  <span className='text-gray-600'>
                    Ready to sell? Launch your brand today with a powerful for
                    new sellers and over $200k in potential benefits
                  </span>
                </div>
                <div className='d-flex flex-column align-items-end gap-56'>
                  <div className='d-flex align-items-center gap-32'>
                    <div className='text-end'>
                      <h5 className='mb-8'>Step 01</h5>
                      <p className='text-gray-600'>
                        Create an account on our website. It is fast and free.
                      </p>
                    </div>
                    <div className='w-90 h-90 flex-center bg-main-two-100 rounded-circle'>
                      <h6 className='mb-0 w-60 h-60 bg-main-two-600 text-white d-flex align-items-center justify-content-center rounded-circle border border-5 border-white fw-medium'>
                        01
                      </h6>
                    </div>
                  </div>
                  <div className='d-flex align-items-center gap-32'>
                    <div className='text-end'>
                      <h5 className='mb-8'>Step 02</h5>
                      <p className='text-gray-600'>
                        {" "}
                        Upload your products and the display in your shop.
                      </p>
                    </div>
                    <div className='w-90 h-90 flex-center bg-main-two-100 rounded-circle'>
                      <h6 className='mb-0 w-60 h-60 bg-main-two-600 text-white d-flex align-items-center justify-content-center rounded-circle border border-5 border-white fw-medium'>
                        02
                      </h6>
                    </div>
                  </div>
                  <div className='d-flex align-items-center gap-32'>
                    <div className='text-end'>
                      <h5 className='mb-8'>Step 03</h5>
                      <p className='text-gray-600'>
                        We'll verify your account and then you can start
                        selling!
                      </p>
                    </div>
                    <div className='w-90 h-90 flex-center bg-main-two-100 rounded-circle'>
                      <h6 className='mb-0 w-60 h-60 bg-main-two-600 text-white d-flex align-items-center justify-content-center rounded-circle border border-5 border-white fw-medium'>
                        03
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='text-center'>
                <img src='/assets/images/thumbs/steps.png' alt='' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
