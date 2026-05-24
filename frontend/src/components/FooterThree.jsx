import React from "react";
import { Link } from "react-router-dom";

const FooterThree = () => {
  return (
    <>
      {/* ==================== Footer Two Start Here ==================== */}
      <footer className='footer py-80 overflow-hidden'>
        <div className='container container-lg'>
          <div className='footer-item-two-wrapper d-flex align-items-start flex-wrap'>
            <div className='footer-item max-w-275'>
              <div className='footer-item__logo'>
                <Link to='/'>
                  {" "}
                  <img src='assets/images/logo/teamdod-valkey-logo.svg' alt='' />
                </Link>
              </div>
              <p className='mb-24'>
                Valkey become the largest computer parts, gaming pc parts,
                and other IT related products.
              </p>
              <div className='flex-align gap-16 mb-16'>
                <span className='w-32 h-32 flex-center rounded-circle border border-gray-100 text-main-two-600 text-md flex-shrink-0'>
                  <i className='ph-fill ph-phone-call' />
                </span>
                <a
                  href='tel:+00123456789'
                  className='text-md text-gray-900 hover-text-main-600'
                >
                  +00 123 456 789
                </a>
              </div>
              <div className='flex-align gap-16 mb-16'>
                <span className='w-32 h-32 flex-center rounded-circle border border-gray-100 text-main-two-600 text-md flex-shrink-0'>
                  <i className='ph-fill ph-envelope' />
                </span>
                <a
                  href='mailto:support24@valkey.com'
                  className='text-md text-gray-900 hover-text-main-600'
                >
                  support24@valkey.com
                </a>
              </div>
              <div className='flex-align gap-16 mb-16'>
                <span className='w-32 h-32 flex-center rounded-circle border border-gray-100 text-main-two-600 text-md flex-shrink-0'>
                  <i className='ph-fill ph-map-pin' />
                </span>
                <span className='text-md text-gray-900 '>
                  789 Inner Lane, California, USA
                </span>
              </div>
            </div>
            <div className='footer-item'>
              <h6 className='footer-item__title'>About us</h6>
              <ul className='footer-menu'>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Company Profile
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    All Retail Store
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Merchant Center
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Affiliate
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Contact Us
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Feedback
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Huawei Group
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Rules &amp; Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className='footer-item'>
              <h6 className='footer-item__title'>Customer Support</h6>
              <ul className='footer-menu'>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Help Center
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/contact'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Contact Us
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Gift Card
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Report Abuse
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Submit and Dispute
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Policies &amp; Rules
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Online Shopping
                  </Link>
                </li>
                <li className=''>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Redeem Voucher
                  </Link>
                </li>
              </ul>
            </div>
            <div className='footer-item'>
              <h6 className='footer-item__title'>My Account</h6>
              <ul className='footer-menu'>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    My Account
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Order History
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Shoping Cart
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Compare
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Help Ticket
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/wishlist'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Wishlist
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Order History
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Product Support
                  </Link>
                </li>
              </ul>
            </div>
            <div className='footer-item'>
              <h6 className='footer-item__title'>Information</h6>
              <ul className='footer-menu'>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Become a Vendor
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Affiliate Program
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Our Suppliers
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Extended Plan
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Extended Plan
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Community
                  </Link>
                </li>
                <li className='mb-16'>
                  <Link
                    to='/shop'
                    className='text-gray-600 hover-text-main-600'
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div className='footer-item'>
              <h6 className=''>Shop on The Go</h6>
              <p className='mb-16'>Valkey App is available. Get it now</p>
              <div className='flex-align gap-8 my-32'>
                <Link to='https://www.apple.com/store' className=''>
                  <img src='assets/images/thumbs/store-img1.png' alt='' />
                </Link>
                <Link
                  to='https://play.google.com/store/apps?hl=en'
                  className=''
                >
                  <img src='assets/images/thumbs/store-img2.png' alt='' />
                </Link>
              </div>
              <ul className='flex-align gap-16'>
                <li>
                  <Link
                    to='https://www.facebook.com'
                    className='w-44 h-44 flex-center bg-main-two-50 text-main-two-600 text-xl rounded-8 hover-bg-main-two-600 hover-text-white'
                  >
                    <i className='ph-fill ph-facebook-logo' />
                  </Link>
                </li>
                <li>
                  <Link
                    to='https://www.twitter.com'
                    className='w-44 h-44 flex-center bg-main-two-50 text-main-two-600 text-xl rounded-8 hover-bg-main-two-600 hover-text-white'
                  >
                    <i className='ph-fill ph-twitter-logo' />
                  </Link>
                </li>
                <li>
                  <Link
                    to='https://www.linkedin.com'
                    className='w-44 h-44 flex-center bg-main-two-50 text-main-two-600 text-xl rounded-8 hover-bg-main-two-600 hover-text-white'
                  >
                    <i className='ph-fill ph-instagram-logo' />
                  </Link>
                </li>
                <li>
                  <Link
                    to='https://www.pinterest.com'
                    className='w-44 h-44 flex-center bg-main-two-50 text-main-two-600 text-xl rounded-8 hover-bg-main-two-600 hover-text-white'
                  >
                    <i className='ph-fill ph-linkedin-logo' />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      {/* bottom Footer */}
      <div className='bottom-footer bg-color-three py-8'>
        <div className='container container-lg'>
          <div className='bottom-footer__inner flex-between flex-wrap gap-16 py-16'>
            <p className='bottom-footer__text '>
              Valkey eCommerce © 2026. All Rights Reserved
            </p>
            <div className='flex-align gap-8 flex-wrap '>
              <span className='text-heading text-sm'>We Are Accepting</span>
              <img src='assets/images/thumbs/payment-method.png' alt='' />
            </div>
          </div>
        </div>
      </div>
      {/* ==================== Footer Two End Here ==================== */}
    </>
  );
};

export default FooterThree;
