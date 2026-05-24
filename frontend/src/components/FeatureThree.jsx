import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";

const FeatureThree = () => {
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      type='button'
      id='feature-item-wrapper-next'
      className='slick-next slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1'
    >
      <i className='ph ph-caret-right' />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      type='button'
      id='feature-item-wrapper-prev'
      className='slick-prev slick-arrow flex-center rounded-circle bg-white text-xl hover-bg-main-600 hover-text-white transition-1'
    >
      <i className='ph ph-caret-left' />
    </button>
  );
  const settings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 900,
    dots: false,
    pauseOnHover: true,
    arrows: true,
    draggable: true,
    infinite: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1599,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 359,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <div
      className='feature feature-three mt-0 py-120 overflow-hidden'
      id='featureSection'
    >
      <div className='container container-lg'>
        <div className='section-heading text-center'>
          <h5 className='mb-0  text-uppercase'>Popular Categories</h5>
        </div>
        <div className='position-relative arrow-center'>
          <div className='feature-three-item-wrapper'>
            <Slider {...settings}>
              <div className='feature-item text-center'>
                <div className='feature-item__thumb bg-yellow-light max-w-260 max-h-260 rounded-circle w-100 h-100'>
                  <Link to='/shop' className='w-100 h-100 flex-center'>
                    <img
                      src='/assets/images/thumbs/features-three-img1.png'
                      alt=''
                    />
                  </Link>
                </div>
                <div className='feature-item__content mt-20'>
                  <h6 className='text-lg mb-8'>
                    <Link to='/shop' className='text-inherit'>
                      Men's Fashion
                    </Link>
                  </h6>
                  <span className='text-sm text-gray-900'>180 Items</span>
                </div>
              </div>
              <div className='feature-item text-center'>
                <div className='feature-item__thumb bg-danger-light max-w-260 max-h-260 rounded-circle w-100 h-100'>
                  <Link to='/shop' className='w-100 h-100 flex-center'>
                    <img
                      src='/assets/images/thumbs/features-three-img2.png'
                      alt=''
                    />
                  </Link>
                </div>
                <div className='feature-item__content mt-20'>
                  <h6 className='text-lg mb-8'>
                    <Link to='/shop' className='text-inherit'>
                      Women's Fashion
                    </Link>
                  </h6>
                  <span className='text-sm text-gray-900'>220 Items</span>
                </div>
              </div>
              <div className='feature-item text-center'>
                <div className='feature-item__thumb bg-purple-light max-w-260 max-h-260 rounded-circle w-100 h-100'>
                  <Link to='/shop' className='w-100 h-100 flex-center'>
                    <img
                      src='/assets/images/thumbs/features-three-img3.png'
                      alt=''
                    />
                  </Link>
                </div>
                <div className='feature-item__content mt-20'>
                  <h6 className='text-lg mb-8'>
                    <Link to='/shop' className='text-inherit'>
                      Kid’s Fashion
                    </Link>
                  </h6>
                  <span className='text-sm text-gray-900'>205 Items</span>
                </div>
              </div>
              <div className='feature-item text-center'>
                <div className='feature-item__thumb bg-danger-light max-w-260 max-h-260 rounded-circle w-100 h-100'>
                  <Link to='/shop' className='w-100 h-100 flex-center'>
                    <img
                      src='/assets/images/thumbs/features-three-img4.png'
                      alt=''
                    />
                  </Link>
                </div>
                <div className='feature-item__content mt-20'>
                  <h6 className='text-lg mb-8'>
                    <Link to='/shop' className='text-inherit'>
                      Fashion Glass
                    </Link>
                  </h6>
                  <span className='text-sm text-gray-900'>68 Items</span>
                </div>
              </div>
              <div className='feature-item text-center'>
                <div className='feature-item__thumb bg-warning-light max-w-260 max-h-260 rounded-circle w-100 h-100'>
                  <Link to='/shop' className='w-100 h-100 flex-center'>
                    <img
                      src='/assets/images/thumbs/features-three-img5.png'
                      alt=''
                    />
                  </Link>
                </div>
                <div className='feature-item__content mt-20'>
                  <h6 className='text-lg mb-8'>
                    <Link to='/shop' className='text-inherit'>
                      Shoes Collection
                    </Link>
                  </h6>
                  <span className='text-sm text-gray-900'>190 Items</span>
                </div>
              </div>
              <div className='feature-item text-center'>
                <div className='feature-item__thumb bg-success-light max-w-260 max-h-260 rounded-circle w-100 h-100'>
                  <Link to='/shop' className='w-100 h-100 flex-center'>
                    <img
                      src='/assets/images/thumbs/features-three-img6.png'
                      alt=''
                    />
                  </Link>
                </div>
                <div className='feature-item__content mt-20'>
                  <h6 className='text-lg mb-8'>
                    <Link to='/shop' className='text-inherit'>
                      Bag Collection
                    </Link>
                  </h6>
                  <span className='text-sm text-gray-900'>128 Items</span>
                </div>
              </div>
              <div className='feature-item text-center'>
                <div className='feature-item__thumb max-w-260 max-h-260 rounded-circle w-100 h-100'>
                  <Link to='/shop' className='w-100 h-100 flex-center'>
                    <img
                      src='/assets/images/thumbs/features-three-img3.png'
                      alt=''
                    />
                  </Link>
                </div>
                <div className='feature-item__content mt-20'>
                  <h6 className='text-lg mb-8'>
                    <Link to='/shop' className='text-inherit'>
                      Men's Fashion
                    </Link>
                  </h6>
                  <span className='text-sm text-gray-900'>180 Items</span>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureThree;
