import React from "react";
import { Link } from "react-router-dom";

const BreadcrumbImage = () => {
  return (
    <section
      className='banner-inner bg-overlay z-1 position-relative py-72 bg-img bg-start'
      style={{
        backgroundImage: 'url("/assets/images/thumbs/banner-inner-bg.png")',
      }}
    >
      <div className='banner-inner__img position-absolute inset-inline-end-0 top-50 translate-middle-y h-100 arrow-left-clip w-30-percent d-xxl-block d-none'>
        <img
          src='/assets/images/thumbs/banner-inner-img.png'
          alt=''
          className='h-100'
        />
      </div>
      <div className='container'>
        <div className='banner-inner__content text-center'>
          <h4 className='text-white mb-20 fw-semibold'>
            Become A Valkey Seller
          </h4>
          <p className='text-white my-20'>
            More than half the units sold in our stores from independent
            sellers.
          </p>
          <Link to='/account' className='btn btn-main-two rounded-8'>
            Create An Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BreadcrumbImage;
