import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

const InstagramSection = () => {
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      type='button'
      id='feature-item-wrapper-next'
      className='slick-next slick-arrow flex-center rounded-circle border border-gray-100 bg-white text-xl hover-bg-main-600 hover-text-white transition-1'
    >
      <i className='ph ph-caret-right' />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      type='button'
      id='feature-item-wrapper-prev'
      className='slick-prev slick-arrow flex-center rounded-circle border border-gray-100 bg-white text-xl hover-bg-main-600 hover-text-white transition-1'
    >
      <i className='ph ph-caret-left' />
    </button>
  );
  const settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 1500,
    dots: false,
    pauseOnHover: true,
    arrows: true,
    draggable: true,
    infinite: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1299,
        settings: {
          slidesToShow: 3,
          arrows: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };
  return (
    <section className='instagram py-120 overflow-hidden'>
      <div className='container container-lg'>
        <div className='section-heading'>
          <div className='flex-between flex-wrap gap-8'>
            <div className=''>
              <h5 className='mb-0 text-uppercase'>Instagram</h5>
              <p className='text-gray-500'>
                Get inspired by Carina fans from all around the world
              </p>
            </div>
            <div className='flex-align gap-16'>
              <Link
                to='/shop'
                className='text-sm fw-semibold text-gray-700 hover-text-main-600 hover-text-decoration-underline'
              >
                View All
              </Link>
              <div className='flex-align gap-8'></div>
            </div>
          </div>
        </div>
        <div className='instagram-slider'>
          <Slider {...settings}>
            <div>
              <div className='instagram-item rounded-24 overflow-hidden position-relative'>
                <img src='/assets/images/thumbs/instagram-img1.png' alt='' />
                <Link
                  to='https://www.instagram.com'
                  className='w-72 h-72 bg-black bg-opacity-50 text-white text-32 position-absolute top-50 start-50 translate-middle flex-center rounded-circle hover-bg-main-two-600 hover-text-white'
                >
                  <i className='ph ph-instagram-logo' />
                </Link>
              </div>
            </div>
            <div>
              <div className='instagram-item rounded-24 overflow-hidden position-relative'>
                <img src='/assets/images/thumbs/instagram-img2.png' alt='' />
                <Link
                  to='https://www.instagram.com'
                  className='w-72 h-72 bg-black bg-opacity-50 text-white text-32 position-absolute top-50 start-50 translate-middle flex-center rounded-circle hover-bg-main-two-600 hover-text-white'
                >
                  <i className='ph ph-instagram-logo' />
                </Link>
              </div>
            </div>
            <div>
              <div className='instagram-item rounded-24 overflow-hidden position-relative'>
                <img src='/assets/images/thumbs/instagram-img3.png' alt='' />
                <Link
                  to='https://www.instagram.com'
                  className='w-72 h-72 bg-black bg-opacity-50 text-white text-32 position-absolute top-50 start-50 translate-middle flex-center rounded-circle hover-bg-main-two-600 hover-text-white'
                >
                  <i className='ph ph-instagram-logo' />
                </Link>
              </div>
            </div>
            <div>
              <div className='instagram-item rounded-24 overflow-hidden position-relative'>
                <img src='/assets/images/thumbs/instagram-img4.png' alt='' />
                <Link
                  to='https://www.instagram.com'
                  className='w-72 h-72 bg-black bg-opacity-50 text-white text-32 position-absolute top-50 start-50 translate-middle flex-center rounded-circle hover-bg-main-two-600 hover-text-white'
                >
                  <i className='ph ph-instagram-logo' />
                </Link>
              </div>
            </div>
            <div>
              <div className='instagram-item rounded-24 overflow-hidden position-relative'>
                <img src='/assets/images/thumbs/instagram-img2.png' alt='' />
                <Link
                  to='https://www.instagram.com'
                  className='w-72 h-72 bg-black bg-opacity-50 text-white text-32 position-absolute top-50 start-50 translate-middle flex-center rounded-circle hover-bg-main-two-600 hover-text-white'
                >
                  <i className='ph ph-instagram-logo' />
                </Link>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
