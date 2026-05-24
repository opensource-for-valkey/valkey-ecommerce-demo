import React, { useRef } from "react";
import Slider from "react-slick";

const TestimonialOne = () => {
  const mainSliderRef = useRef(null);
  const thumbSliderRef = useRef(null);

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      type='button'
      id='testi-next'
      className='slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 text-white transition-1'
    >
      <i className='ph ph-caret-right'></i>
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      type='button'
      id='testi-prev'
      className='slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 text-white transition-1'
    >
      <i className='ph ph-caret-left'></i>
    </button>
  );

  const mainSliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: thumbSliderRef.current,
    dots: false,
    arrows: false,
    fade: true,
    cssEase: "linear",
  };

  const thumbSliderSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: mainSliderRef.current,
    dots: false,
    arrows: true,
    infinite: true,
    focusOnSelect: true,
    speed: 900,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const testimonialsData = [
    {
      name: "ROBIUL HASAN",
      role: "Business Owner",
      rating: 5,
      desc: "Customers expressed that shopping at Asiana Fashion was a delightful experience, highlighting the vibrant colors and unique designs that made them feel special atevents",
      img: "/assets/images/thumbs/testimonials-img1.png",
    },
    {
      name: "SAMIYA AKTER",
      role: "Front End Developer",
      rating: 5,
      desc: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia",
      img: "/assets/images/thumbs/testimonials-img2.png",
    },
    {
      name: "JOHN DOE",
      role: "Max Model",
      rating: 5,
      desc: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here",
      img: "/assets/images/thumbs/testimonials-img3.png",
    },
    {
      name: "MICHEL SMITH",
      role: "Former Model",
      rating: 5,
      desc: "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.",
      img: "/assets/images/thumbs/testimonials-img4.png",
    },
    {
      name: "ALEX",
      role: "Back End Developer",
      rating: 5,
      desc: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text",
      img: "/assets/images/thumbs/testimonials-img2.png",
    },
  ];
  return (
    <section
      className='testimonials py-120 bg-neutral-600 bg-img overflow-hidden'
      style={{ backgroundImage: "url('/assets/images/bg/pattern-two.png')" }}
    >
      <div className='container container-lg'>
        <div className='row gy-4 align-items-center'>
          <div className='col-xl-1'>
            <div className='section-heading mb-0 d-flex flex-column align-items-center writing-mode'>
              <p className='text-white'>
                Share information about your brand with your customers.
              </p>
              <h5 className='text-white mb-0 text-uppercase'>
                Customers Feedback
              </h5>
            </div>
          </div>
          <div className='col-xl-11'>
            <div className='position-relative'>
              <Slider
                {...mainSliderSettings}
                ref={mainSliderRef}
                className='testimonials-slider'
              >
                {testimonialsData.map((testimonial, index) => (
                  <div key={index} className='testimonials-item'>
                    <h6 className='text-white text-uppercase mb-8 fw-medium'>
                      {testimonial.name}
                    </h6>
                    <span className='text-md text-white fw-normal'>
                      {testimonial.role}
                    </span>
                    <div className='flex-align gap-8 mt-24'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span
                          key={i}
                          className='text-15 fw-medium text-warning-600 d-flex'
                        >
                          <i className='ph-fill ph-star'></i>
                        </span>
                      ))}
                    </div>
                    <p className='testimonials-item__desc text-white text-2xl fw-normal mt-40 max-w-990'>
                      {testimonial.desc}
                    </p>
                  </div>
                ))}
              </Slider>
            </div>
            <Slider
              {...thumbSliderSettings}
              ref={thumbSliderRef}
              className='testimonials-thumbs-slider'
            >
              {testimonialsData.map((testimonial, index) => (
                <div
                  key={index}
                  className='testimonials-thumbs d-flex position-relative align-items-end justify-content-end'
                >
                  <div className='testimonials-thumbs__img'>
                    <img
                      src={testimonial.img}
                      alt={testimonial.name}
                      className='cover-img'
                    />
                  </div>
                  <div className='testimonials-thumbs__content position-absolute transition-2 bottom-0 start-50 translate-middle-x mb-16 text-center hidden opacity-0'>
                    <h6 className='text-white text-uppercase mb-8 fw-medium'>
                      {testimonial.name}
                    </h6>
                    <span className='text-md text-white fw-normal'>
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialOne;
