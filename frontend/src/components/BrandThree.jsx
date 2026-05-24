import React from "react";
import Slider from "react-slick";

const BrandThree = () => {
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      type='button'
      id='topBrand-next'
      className='slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-two-600 text-xl hover-bg-main-two-600 hover-text-white transition-1'
    >
      <i className='ph ph-caret-right'></i>
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      type='button'
      id='topBrand-prev'
      className='slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-two-600 text-xl hover-bg-main-two-600 hover-text-white transition-1'
    >
      <i className='ph ph-caret-left'></i>
    </button>
  );
  const settings = {
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    dots: false,
    arrows: true,
    speed: 900,
    infinite: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1599,
        settings: {
          slidesToShow: 7,
          arrows: false,
        },
      },
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 6,
          arrows: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
          arrows: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 4,
          arrows: false,
        },
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 3,
          arrows: false,
        },
      },
      {
        breakpoint: 359,
        settings: {
          slidesToShow: 2,
          arrows: false,
        },
      },
    ],
  };
  return (
    <div className='top-brand three pb-80 overflow-hidden'>
      <div className='container container-lg'>
        <div className='border border-gray-100 p-24 rounded-16'>
          <div className='section-heading mb-24'>
            <div className='flex-between flex-wrap gap-8'>
              <h5 className='mb-0 text-uppercase'>Top Brands</h5>
            </div>
          </div>
          <div className='top-brand__slider'>
            <Slider {...settings}>
              <div>
                <img src='/assets/images/thumbs/brand-three-img1.png' alt='' />
              </div>
              <div>
                <img src='/assets/images/thumbs/brand-three-img2.png' alt='' />
              </div>
              <div>
                <img src='/assets/images/thumbs/brand-three-img3.png' alt='' />
              </div>
              <div>
                <img src='/assets/images/thumbs/brand-three-img4.png' alt='' />
              </div>
              <div>
                <img src='/assets/images/thumbs/brand-three-img5.png' alt='' />
              </div>
              <div>
                <img src='/assets/images/thumbs/brand-three-img6.png' alt='' />
              </div>
              <div>
                <img src='/assets/images/thumbs/brand-three-img7.png' alt='' />
              </div>
              <div>
                <img src='/assets/images/thumbs/brand-three-img8.png' alt='' />
              </div>
              <div>
                <img src='/assets/images/thumbs/brand-three-img5.png' alt='' />
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandThree;
