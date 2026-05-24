import React from "react";
import Marquee from "react-fast-marquee";
const TextSlider = () => {
  return (
    <div className='text-slider-section overflow-hidden bg-neutral-600 py-28'>
      <div className='text-slider d-flex align-items-center gap-4'>
        <Marquee
          speed={150}
          pauseOnHover={true}
          className='Marquee_text-slider'
        >
          <div className='d-flex flex-nowrap flex-shrink-0 flx-align gap-32'>
            <span className='flex-shrink-0'>
              <img src='/assets/images/icon/star-color.png' alt='' />
            </span>
            <h4 className='text-white flex-grow-1 mb-0 fw-medium'>
              T-Shirt Offer
            </h4>
          </div>
          <div className='d-flex flex-nowrap flex-shrink-0 flx-align gap-32'>
            <span className='flex-shrink-0'>
              <img src='/assets/images/icon/star-color.png' alt='' />
            </span>
            <h4 className='text-white flex-grow-1 mb-0 fw-medium'>
              Best Selling Offer
            </h4>
          </div>
          <div className='d-flex flex-nowrap flex-shrink-0 flx-align gap-32'>
            <span className='flex-shrink-0'>
              <img src='/assets/images/icon/star-color.png' alt='' />
            </span>
            <h4 className='text-white flex-grow-1 mb-0 fw-medium'>
              Limited Offer Sales
            </h4>
          </div>
          <div className='d-flex flex-nowrap flex-shrink-0 flx-align gap-32'>
            <span className='flex-shrink-0'>
              <img src='/assets/images/icon/star-color.png' alt='' />
            </span>
            <h4 className='text-white flex-grow-1 mb-0 fw-medium'>
              Spring Collection
            </h4>
          </div>
          <div className='d-flex flex-nowrap flex-shrink-0 flx-align gap-32'>
            <span className='flex-shrink-0'>
              <img src='/assets/images/icon/star-color.png' alt='' />
            </span>
            <h4 className='text-white flex-grow-1 mb-0 fw-medium'>
              Hot Deal Products
            </h4>
          </div>
          <div className='d-flex flex-nowrap flex-shrink-0 flx-align gap-32'>
            <span className='flex-shrink-0'>
              <img src='/assets/images/icon/star-color.png' alt='' />
            </span>
            <h4 className='text-white flex-grow-1 mb-0 fw-medium'>
              {" "}
              Our Services
            </h4>
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default TextSlider;
