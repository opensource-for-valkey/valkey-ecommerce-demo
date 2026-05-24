import React, { useEffect, useState } from "react";
import query from "jquery";
import { Link, NavLink, useNavigate } from "react-router-dom";
import SearchSuggestions from "./common/SearchSuggestions";
const HeaderTwo = ({ category }) => {
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const submitSearch = (raw) => {
    const q = String(raw || "").trim();
    if (!q) return;
    setSuggestOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    submitSearch(searchQ);
  };
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.onscroll = () => {
      if (window.pageYOffset < 150) {
        setScroll(false);
      } else if (window.pageYOffset > 150) {
        setScroll(true);
      }
      return () => (window.onscroll = null);
    };
    const selectElement = query(".js-example-basic-single");
    selectElement.select2();

    return () => {
      if (selectElement.data("select2")) {
        selectElement.select2("destroy");
      }
    };
  }, []);

  // Set the default language
  const [selectedLanguage, setSelectedLanguage] = useState("Eng");
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  // Set the default currency
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  // Mobile menu support
  const [menuActive, setMenuActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const handleMenuClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const handleMenuToggle = () => {
    setMenuActive(!menuActive);
  };

  // Search control support
  const [activeSearch, setActiveSearch] = useState(false);
  const handleSearchToggle = () => {
    setActiveSearch(!activeSearch);
  };

  // category control support
  const [activeCategory, setActiveCategory] = useState(false);
  const handleCategoryToggle = () => {
    setActiveCategory(!activeCategory);
  };
  const [activeIndexCat, setActiveIndexCat] = useState(null);
  const handleCatClick = (index) => {
    setActiveIndexCat(activeIndexCat === index ? null : index);
  };

  return (
    <>
      <div className='overlay' />
      <div
        className={`side-overlay ${(menuActive || activeCategory) && "show"}`}
      />
      {/* ==================== Search Box Start Here ==================== */}

      {/* Overlay search removed — the inline search bar in the middle header is
          always visible and editable on every screen size. */}
      {/* ==================== Search Box End Here ==================== */}
      {/* ==================== Mobile Menu Start Here ==================== */}
      <div
        className={`mobile-menu scroll-sm d-lg-none d-block ${
          menuActive && "active"
        }`}
      >
        <button
          onClick={() => {
            handleMenuToggle();
            setActiveIndex(null);
          }}
          type='button'
          className='close-button'
        >
          <i className='ph ph-x' />{" "}
        </button>
        <div className='mobile-menu__inner'>
          <Link to='/' className='mobile-menu__logo'>
            <img src='assets/images/logo/logo.png' alt='Logo' />
          </Link>
          <div className='mobile-menu__menu'>
            {/* Nav Menu Start */}
            <ul className='nav-menu flex-align nav-menu--mobile'>
              <li
                onClick={() => handleMenuClick(0)}
                className={`on-hover-item nav-menu__item has-submenu ${
                  activeIndex === 0 ? "d-block" : ""
                }`}
              >
                <Link to='#' className='nav-menu__link'>
                  Home
                </Link>
                <ul
                  className={`on-hover-dropdown common-dropdown nav-submenu scroll-sm ${
                    activeIndex === 0 ? "open" : ""
                  }`}
                >
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      {" "}
                      Home Grocery
                    </Link>
                  </li>
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/index-two'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      {" "}
                      Home Electronics
                    </Link>
                  </li>
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/index-three'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      {" "}
                      Home Fashion
                    </Link>
                  </li>
                </ul>
              </li>
              <li
                onClick={() => handleMenuClick(1)}
                className={`on-hover-item nav-menu__item has-submenu ${
                  activeIndex === 1 ? "d-block" : ""
                }`}
              >
                <Link to='#' className='nav-menu__link'>
                  Shop
                </Link>
                <ul
                  className={`on-hover-dropdown common-dropdown nav-submenu scroll-sm ${
                    activeIndex === 1 ? "open" : ""
                  }`}
                >
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/shop'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      {" "}
                      Shop
                    </Link>
                  </li>
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/product-details'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      {" "}
                      Shop Details
                    </Link>
                  </li>
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/product-details-two'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      {" "}
                      Shop Details Two
                    </Link>
                  </li>
                </ul>
              </li>
              <li
                onClick={() => handleMenuClick(2)}
                className={`on-hover-item nav-menu__item has-submenu ${
                  activeIndex === 2 ? "d-block" : ""
                }`}
              >
<Link to='#' className='nav-menu__link'>
                  Pages
                </Link>
                <ul
                  className={`on-hover-dropdown common-dropdown nav-submenu scroll-sm ${
                    activeIndex === 2 ? "open" : ""
                  }`}
                >
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/cart'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      {" "}
                      Cart
                    </Link>
                  </li>
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/wishlist'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      Wishlist
                    </Link>
                  </li>
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/checkout'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      Checkout
                    </Link>
                  </li>
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/become-seller'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      Become Seller
                    </Link>
                  </li>
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/account'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      Account
                    </Link>
                  </li>
                </ul>
              </li>
              <li
                onClick={() => handleMenuClick(3)}
                className={`on-hover-item nav-menu__item has-submenu ${
                  activeIndex === 3 ? "d-block" : ""
                }`}
              >
<Link to='#' className='nav-menu__link'>
                  Vendors
                </Link>
                <ul
                  className={`on-hover-dropdown common-dropdown nav-submenu scroll-sm ${
                    activeIndex === 3 ? "open" : ""
                  }`}
                >
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/vendor'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      Vendors
                    </Link>
                  </li>
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/vendor-details'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      Vendor Details
                    </Link>
                  </li>
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/vendor-two'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      Vendors Two
                    </Link>
                  </li>
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/vendor-two-details'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      Vendors Two Details
                    </Link>
                  </li>
                </ul>
              </li>
              <li
                onClick={() => handleMenuClick(4)}
                className={`on-hover-item nav-menu__item has-submenu ${
                  activeIndex === 4 ? "d-block" : ""
                }`}
              >
                <Link to='#' className='nav-menu__link'>
                  Blog
                </Link>
                <ul
                  className={`on-hover-dropdown common-dropdown nav-submenu scroll-sm ${
                    activeIndex === 4 ? "open" : ""
                  }`}
                >
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/blog'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      {" "}
                      Blog
                    </Link>
                  </li>
                  <li className='common-dropdown__item nav-submenu__item'>
                    <Link
                      onClick={() => setActiveIndex(null)}
                      to='/blog-details'
                      className='common-dropdown__link nav-submenu__link hover-bg-neutral-100'
                    >
                      {" "}
                      Blog Details
                    </Link>
                  </li>
                </ul>
              </li>
              <li className='nav-menu__item'>
                <Link to='/contact' className='nav-menu__link'>
                  Contact Us
                </Link>
              </li>
            </ul>
            {/* Nav Menu End */}
          </div>
        </div>
      </div>
      {/* ==================== Mobile Menu End Here ==================== */}
      {/* ======================= Middle Header Two Start ========================= */}
      <header className='header-middle style-two bg-color-neutral'>
        <div className='container container-lg'>
          <nav className='header-inner flex-between'>
            {/* Logo Start */}
            <div className='logo'>
              <Link to='/' className='link'>
                <img src='assets/images/logo/logo-two.png' alt='Logo' />
              </Link>
            </div>
            {/* Logo End  */}
            {/* form Category Start */}
            <div className='flex-align gap-16'>
              <div className='select-dropdown-for-home-two d-lg-none d-block'>
                {/* Dropdown Select Start */}
                <ul className='header-top__right style-two flex-align flex-wrap'>
                  <li className='on-hover-item border-right-item border-right-item-sm-space has-submenu arrow-white'>
                    {/* Display the selected language */}
                    <Link
                      to='#'
                      className='selected-text text-heading text-sm py-8'
                    >
                      {selectedLanguage}
                    </Link>
                    <ul className='selectable-text-list on-hover-dropdown common-dropdown common-dropdown--sm max-h-200 scroll-sm px-0 py-8'>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleLanguageChange("English")}
                        >
                          <img
                            src='assets/images/thumbs/flag1.png'
                            alt='English'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          English
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleLanguageChange("Japan")}
                        >
                          <img
                            src='assets/images/thumbs/flag2.png'
                            alt='Japan'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          Japan
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleLanguageChange("French")}
                        >
                          <img
                            src='assets/images/thumbs/flag3.png'
                            alt='French'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          French
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleLanguageChange("Germany")}
                        >
                          <img
                            src='assets/images/thumbs/flag4.png'
                            alt='Germany'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          Germany
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleLanguageChange("Bangladesh")}
                        >
                          <img
                            src='assets/images/thumbs/flag6.png'
                            alt='Bangladesh'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          Bangladesh
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleLanguageChange("South Korea")}
                        >
                          <img
                            src='assets/images/thumbs/flag5.png'
                            alt='South Korea'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          South Korea
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className='on-hover-item border-right-item border-right-item-sm-space has-submenu arrow-white'>
                    {/* Display the selected currency */}
                    <Link
                      to='#'
                      className='selected-text text-heading text-sm py-8'
                    >
                      {selectedCurrency}
                    </Link>
                    <ul className='selectable-text-list on-hover-dropdown common-dropdown common-dropdown--sm max-h-200 scroll-sm px-0 py-8'>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleCurrencyChange("USD")}
                        >
                          <img
                            src='assets/images/thumbs/flag1.png'
                            alt='USD'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          USD
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleCurrencyChange("Yen")}
                        >
                          <img
                            src='assets/images/thumbs/flag2.png'
                            alt='Yen'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          Yen
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleCurrencyChange("Franc")}
                        >
                          <img
                            src='assets/images/thumbs/flag3.png'
                            alt='Franc'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          Franc
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleCurrencyChange("EURO")}
                        >
                          <img
                            src='assets/images/thumbs/flag4.png'
                            alt='EURO'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          EURO
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleCurrencyChange("BDT")}
                        >
                          <img
                            src='assets/images/thumbs/flag6.png'
                            alt='BDT'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          BDT
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleCurrencyChange("WON")}
                        >
                          <img
                            src='assets/images/thumbs/flag5.png'
                            alt='WON'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          WON
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
                {/* Dropdown Select End */}
              </div>
              <form
                onSubmit={handleSearchSubmit}
                className='flex-align flex-wrap form-location-wrapper'
                role='search'
              >
                <div className='search-category style-two d-flex h-48 search-form flex-grow-1 position-relative'>
                  <div className='search-form__wrapper position-relative flex-grow-1'>
                    <input
                      type='text'
                      value={searchQ}
                      onChange={(e) => { setSearchQ(e.target.value); setSuggestOpen(true); }}
                      onFocus={() => setSuggestOpen(true)}
                      className='search-form__input common-input py-13 ps-16 pe-18 rounded-0 border-0'
                      placeholder='Search the catalogue — try "more expensive", "under £150", "gift for a friend"'
                      aria-label='Search products'
                      aria-autocomplete='list'
                      autoComplete='off'
                    />
                    <SearchSuggestions
                      value={searchQ}
                      open={suggestOpen}
                      onPick={(label) => { setSearchQ(label); submitSearch(label); }}
                      onClose={() => setSuggestOpen(false)}
                    />
                  </div>
                  <button
                    type='submit'
                    className='bg-main-two-600 flex-center text-xl text-white flex-shrink-0 w-48 hover-bg-main-two-700 d-flex'
                    aria-label='Submit search'
                  >
                    <i className='ph ph-magnifying-glass' />
                  </button>
                </div>
              </form>
            </div>
            {/* form Category start */}
            {/* Header Middle Right start */}
            <div className='header-right flex-align d-lg-block d-none'>
              <div className='header-two-activities flex-align flex-wrap gap-32'>
                {/* search-icon removed: search bar is now always visible inline */}
                <Link
                  to='/account'
                  className='flex-align flex-column gap-8 item-hover-two'
                >
                  <span className='text-2xl text-white d-flex position-relative item-hover__text'>
                    <i className='ph ph-user' />
                  </span>
                  <span className='text-md text-white item-hover__text d-none d-lg-flex'>
                    Profile
                  </span>
                </Link>
                <Link
                  to='/wishlist'
                  className='flex-align flex-column gap-8 item-hover-two'
                >
                  <span className='text-2xl text-white d-flex position-relative me-6 mt-6 item-hover__text'>
                    <i className='ph ph-heart' />
                    <span className='w-16 h-16 flex-center rounded-circle bg-main-two-600 text-white text-xs position-absolute top-n6 end-n4'>
                      2
                    </span>
                  </span>
                  <span className='text-md text-white item-hover__text d-none d-lg-flex'>
                    Wishlist
                  </span>
                </Link>
                <Link
                  to='/cart'
                  className='flex-align flex-column gap-8 item-hover-two'
                >
                  <span className='text-2xl text-white d-flex position-relative me-6 mt-6 item-hover__text'>
                    <i className='ph-fill ph-shuffle' />
                    <span className='w-16 h-16 flex-center rounded-circle bg-main-two-600 text-white text-xs position-absolute top-n6 end-n4'>
                      2
                    </span>
                  </span>
                  <span className='text-md text-white item-hover__text d-none d-lg-flex'>
                    Compare
                  </span>
                </Link>
                <Link
                  to='/cart'
                  className='flex-align flex-column gap-8 item-hover-two'
                >
                  <span className='text-2xl text-white d-flex position-relative me-6 mt-6 item-hover__text'>
                    <i className='ph ph-shopping-cart-simple' />
                    <span className='w-16 h-16 flex-center rounded-circle bg-main-two-600 text-white text-xs position-absolute top-n6 end-n4'>
                      2
                    </span>
                  </span>
                  <span className='text-md text-white item-hover__text d-none d-lg-flex'>
                    Cart
                  </span>
                </Link>
              </div>
            </div>
            {/* Header Middle Right End  */}
          </nav>
        </div>
      </header>
      {/* ======================= Middle Header Two End ========================= */}
      {/* ==================== Header Two Start Here ==================== */}
      <header
        className={`header bg-white border-bottom border-gray-100 ${
          scroll && "fixed-header"
        }`}
      >
        <div className='container container-lg'>
          <nav className='header-inner d-flex justify-content-between gap-8'>
            <div className='flex-align menu-category-wrapper'>
              {/* Category Dropdown Start */}
              <div
                className={`category-two ${
                  category === false ? "d-block" : "d-none"
                } `}
              >
                <button
                  onClick={handleCategoryToggle}
                  type='button'
                  className='category__button flex-align gap-8 fw-medium bg-main-two-600 p-16 text-white'
                >
                  <span className='icon text-2xl d-xs-flex d-none'>
                    <i className='ph ph-dots-nine' />
                  </span>
                  <span className='d-sm-flex d-none'>All</span> Categories
                  <span className='arrow-icon text-xl d-flex'>
                    <i className='ph ph-caret-down' />
                  </span>
                </button>
                <div
                  className={`responsive-dropdown cat common-dropdown d-lg-none d-block nav-submenu p-0 submenus-submenu-wrapper shadow-none border border-gray-100 ${
                    activeCategory && "active"
                  }`}
                >
                  <button
                    onClick={() => {
                      handleCategoryToggle();
                      setActiveIndexCat(null);
                    }}
                    type='button'
                    className='close-responsive-dropdown rounded-circle text-xl position-absolute inset-inline-end-0 inset-block-start-0 mt-4 me-8 d-lg-none d-flex'
                  >
                    <i className='ph ph-x' />{" "}
                  </button>
                  <div className='logo px-16 d-lg-none d-block'>
                    <Link to='/' className='link'>
                      <img src='assets/images/logo/logo.png' alt='Logo' />
                    </Link>
                  </div>
                  <ul className='scroll-sm p-0 py-8 overflow-y-auto'>
                    <li
                      onClick={() => handleCatClick(0)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 0 ? "active" : ""
                      }`}
                    >
                      <Link
                        onClick={() => setActiveIndexCat(null)}
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span>Cell Phone</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 0 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Cell Phone
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li
                      onClick={() => handleCatClick(1)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 1 ? "active" : ""
                      }`}
                    >
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span>Wear</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 1 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Wear
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li
                      onClick={() => handleCatClick(2)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 2 ? "active" : ""
                      }`}
                    >
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span>Computer</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 2 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Computer
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li
                      onClick={() => handleCatClick(3)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 3 ? "active" : ""
                      }`}
                    >
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span>Headphone</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 3 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Headphone
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li
                      onClick={() => handleCatClick(4)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 4 ? "active" : ""
                      }`}
                    >
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span>Smart Screen</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 4 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Smart Screen
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li
                      onClick={() => handleCatClick(5)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 5 ? "active" : ""
                      }`}
                    >
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span>Smart Home</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 5 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Smart Home
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li
                      onClick={() => handleCatClick(6)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 6 ? "active" : ""
                      }`}
                    >
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span>Digital Accessories</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 6 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Digital Accessories
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li
                      onClick={() => handleCatClick(7)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 7 ? "active" : ""
                      }`}
                    >
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span> Value Added Services</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 7 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          {" "}
                          Value Added Services
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li
                      onClick={() => handleCatClick(8)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 8 ? "active" : ""
                      }`}
                    >
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span>Car Products</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 8 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Car Products
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li
                      onClick={() => handleCatClick(9)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 9 ? "active" : ""
                      }`}
                    >
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span>Ecological Products</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 9 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Ecological Products
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li
                      onClick={() => handleCatClick(10)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 10 ? "active" : ""
                      }`}
                    >
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span>Flat</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 10 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Flat
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li
                      onClick={() => handleCatClick(11)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 11 ? "active" : ""
                      }`}
                    >
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span>Commercial Terminal</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 11 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Commercial Terminal
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li
                      onClick={() => handleCatClick(12)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 12 ? "active" : ""
                      }`}
                    >
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span>Headphone</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 12 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Headphone
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li
                      onClick={() => handleCatClick(13)}
                      className={`has-submenus-submenu ${
                        activeIndexCat === 13 ? "active" : ""
                      }`}
                    >
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span>Smart Screen</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div
                        className={`submenus-submenu py-16 ${
                          activeIndexCat === 13 ? "open" : ""
                        }`}
                      >
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Smart Screen
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Samsung</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Iphone</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Vivo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Oppo</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Itel</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Realme</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className={`category main  on-hover-item bg-main-600 text-white ${
                  category === true ? "d-block" : "d-none"
                }`}
              >
                <button
                  type='button'
                  className='category__button flex-align gap-8 fw-medium p-16 border-end border-start border-gray-100 text-white'
                >
                  <span className='icon text-2xl d-xs-flex d-none'>
                    <i className='ph ph-dots-nine' />
                  </span>
                  <span className='d-sm-flex d-none'>All</span> Categories
                  <span className='arrow-icon text-xl d-flex'>
                    <i className='ph ph-caret-down' />
                  </span>
                </button>
                <div className='responsive-dropdown on-hover-dropdown common-dropdown nav-submenu p-0 submenus-submenu-wrapper'>
                  <button
                    type='button'
                    className='close-responsive-dropdown rounded-circle text-xl position-absolute inset-inline-end-0 inset-block-start-0 mt-4 me-8 d-lg-none d-flex'
                  >
                    <i className='ph ph-x' />{" "}
                  </button>
                  <div className='logo px-16 d-lg-none d-block'>
                    <Link to='/' className='link'>
                      <img src='assets/images/logo/logo.png' alt='Logo' />
                    </Link>
                  </div>
                  <ul className='scroll-sm p-0 py-8 w-300 max-h-400 overflow-y-auto'>
                    <li className='has-submenus-submenu'>
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span className='text-xl d-flex'>
                          <i className='ph ph-carrot' />
                        </span>
                        <span>Vegetables &amp; Fruit</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div className='submenus-submenu py-16'>
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Vegetables &amp; Fruit
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Potato &amp; Tomato</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Cucumber &amp; Capsicum</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Leafy Vegetables</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Root Vegetables</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Beans &amp; Okra</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Cabbage &amp; Cauliflower</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Gourd &amp; Drumstick</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Specialty</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className='has-submenus-submenu'>
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span className='text-xl d-flex'>
                          <i className='ph ph-brandy' />
                        </span>
                        <span>Beverages</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div className='submenus-submenu py-16'>
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Beverages
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'>Soda &amp; Cocktail Mix </Link>
                          </li>
                          <li>
                            <Link to='/shop'> Sports &amp; Energy Drinks</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Non Alcoholic Drinks</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Packaged Water </Link>
                          </li>
                          <li>
                            <Link to='/shop'> Spring Water</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Flavoured Water </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className='has-submenus-submenu'>
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span className='text-xl d-flex'>
                          <i className='ph ph-brandy' />
                        </span>
                        <span>Meats &amp; Seafood</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div className='submenus-submenu py-16'>
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Meats &amp; Seafood
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'> Fresh Meat </Link>
                          </li>
                          <li>
                            <Link to='/shop'> Frozen Meat</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Marinated Meat</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Fresh &amp; Frozen Meat</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className='has-submenus-submenu'>
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span className='text-xl d-flex'>
                          <i className='ph ph-brandy' />
                        </span>
                        <span>Breakfast &amp; Dairy</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div className='submenus-submenu py-16'>
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Breakfast &amp; Dairy
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'> Oats &amp; Porridge</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Kids Cereal</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Muesli</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Flakes</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Granola &amp; Cereal Bars</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Instant Noodles</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className='has-submenus-submenu'>
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span className='text-xl d-flex'>
                          <i className='ph ph-brandy' />
                        </span>
                        <span>Frozen Foods</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div className='submenus-submenu py-16'>
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Frozen Foods
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'> Instant Noodles </Link>
                          </li>
                          <li>
                            <Link to='/shop'> Hakka Noodles</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Cup Noodles</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Vermicelli</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Instant Pasta</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className='has-submenus-submenu'>
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span className='text-xl d-flex'>
                          <i className='ph ph-brandy' />
                        </span>
                        <span>Biscuits &amp; Snacks</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div className='submenus-submenu py-16'>
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Biscuits &amp; Snacks
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'> Salted Biscuits </Link>
                          </li>
                          <li>
                            <Link to='/shop'> Marie, Health, Digestive</Link>
                          </li>
                          <li>
                            <Link to='/shop'>
                              {" "}
                              Cream Biscuits &amp; Wafers{" "}
                            </Link>
                          </li>
                          <li>
                            <Link to='/shop'> Glucose &amp; Milk biscuits</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Cookies</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className='has-submenus-submenu'>
                      <Link
                        to='#'
                        className='text-gray-500 text-15 py-12 px-16 flex-align gap-8 rounded-0'
                      >
                        <span className='text-xl d-flex'>
                          <i className='ph ph-brandy' />
                        </span>
                        <span>Grocery &amp; Staples</span>
                        <span className='icon text-md d-flex ms-auto'>
                          <i className='ph ph-caret-right' />
                        </span>
                      </Link>
                      <div className='submenus-submenu py-16'>
                        <h6 className='text-lg px-16 submenus-submenu__title'>
                          Grocery &amp; Staples
                        </h6>
                        <ul className='submenus-submenu__list max-h-300 overflow-y-auto scroll-sm'>
                          <li>
                            <Link to='/shop'> Lemon, Ginger &amp; Garlic </Link>
                          </li>
                          <li>
                            <Link to='/shop'> Indian &amp; Exotic Herbs</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Orangic Vegetables</Link>
                          </li>
                          <li>
                            <Link to='/shop'>Orangic Fruits </Link>
                          </li>
                          <li>
                            <Link to='/shop'> Orangic Dry Fruits</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Orangic Dals &amp; pulses</Link>
                          </li>
                          <li>
                            <Link to='/shop'> Orangic Millet &amp; Flours</Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Category Dropdown End  */}
              {/* Menu Start  */}
              <div className='header-menu d-lg-block d-none'>
                {/* Nav Menu Start */}
                <ul className='nav-menu flex-align '>
                  <li className='on-hover-item nav-menu__item has-submenu'>
                    <Link to='#' className='nav-menu__link'>
                      Home
                    </Link>
                    <ul className='on-hover-dropdown common-dropdown nav-submenu scroll-sm'>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          {" "}
                          Home Grocery
                        </NavLink>
                      </li>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/index-two'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          {" "}
                          Home Electronics
                        </NavLink>
                      </li>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/index-three'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          {" "}
                          Home Fashion
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li className='on-hover-item nav-menu__item has-submenu'>
                    <Link to='#' className='nav-menu__link'>
                      Shop
                    </Link>
                    <ul className='on-hover-dropdown common-dropdown nav-submenu scroll-sm'>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/shop'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          Shop
                        </NavLink>
                      </li>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/product-details'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          {" "}
                          Shop Details
                        </NavLink>
                      </li>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/product-details-two'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          {" "}
                          Shop Details Two
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li className='on-hover-item nav-menu__item has-submenu'>
<Link to='#' className='nav-menu__link'>
                      Pages
                    </Link>
                    <ul className='on-hover-dropdown common-dropdown nav-submenu scroll-sm'>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/cart'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          Cart
                        </NavLink>
                      </li>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/wishlist'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          Wishlist
                        </NavLink>
                      </li>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/checkout'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          Checkout
                        </NavLink>
                      </li>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/become-seller'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          Become Seller
                        </NavLink>
                      </li>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/account'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          Account
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li className='on-hover-item nav-menu__item has-submenu'>
<Link to='#' className='nav-menu__link'>
                      Vendors
                    </Link>
                    <ul className='on-hover-dropdown common-dropdown nav-submenu scroll-sm'>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/vendor'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          Vendor
                        </NavLink>
                      </li>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/vendor-details'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          Vendor Details
                        </NavLink>
                      </li>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/vendor-two'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          Vendor Two
                        </NavLink>
                      </li>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/vendor-two-details'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          Vendor Two Details
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li className='on-hover-item nav-menu__item has-submenu'>
                    <Link to='#' className='nav-menu__link'>
                      Blog
                    </Link>
                    <ul className='on-hover-dropdown common-dropdown nav-submenu scroll-sm'>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/blog'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          Blog
                        </NavLink>
                      </li>
                      <li className='common-dropdown__item nav-submenu__item'>
                        <NavLink
                          to='/blog-details'
                          className={(navData) =>
                            navData.isActive
                              ? "common-dropdown__link nav-submenu__link hover-bg-neutral-100 activePage"
                              : "common-dropdown__link nav-submenu__link hover-bg-neutral-100"
                          }
                        >
                          {" "}
                          Blog Details
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li className='nav-menu__item'>
                    <NavLink
                      to='/contact'
                      className={(navData) =>
                        navData.isActive
                          ? "nav-menu__link activePage"
                          : "nav-menu__link"
                      }
                    >
                      Contact Us
                    </NavLink>
                  </li>
                </ul>
                {/* Nav Menu End */}
              </div>
              {/* Menu End  */}
            </div>
            {/* Header Right start */}
            <div className='header-right flex-align'>
              <div className='select-dropdown-for-home-two d-lg-block d-none'>
                {/* Dropdown Select Start */}
                <ul className='header-top__right style-two flex-align flex-wrap'>
                  <li className='on-hover-item border-right-item border-right-item-sm-space has-submenu arrow-white'>
                    {/* Display the selected language */}
                    <Link
                      to='#'
                      className='selected-text text-heading text-sm py-8'
                    >
                      {selectedLanguage}
                    </Link>
                    <ul className='selectable-text-list on-hover-dropdown common-dropdown common-dropdown--sm max-h-200 scroll-sm px-0 py-8'>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleLanguageChange("English")}
                        >
                          <img
                            src='assets/images/thumbs/flag1.png'
                            alt='English'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          English
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleLanguageChange("Japan")}
                        >
                          <img
                            src='assets/images/thumbs/flag2.png'
                            alt='Japan'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          Japan
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleLanguageChange("French")}
                        >
                          <img
                            src='assets/images/thumbs/flag3.png'
                            alt='French'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          French
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleLanguageChange("Germany")}
                        >
                          <img
                            src='assets/images/thumbs/flag4.png'
                            alt='Germany'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          Germany
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleLanguageChange("Bangladesh")}
                        >
                          <img
                            src='assets/images/thumbs/flag6.png'
                            alt='Bangladesh'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          Bangladesh
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleLanguageChange("South Korea")}
                        >
                          <img
                            src='assets/images/thumbs/flag5.png'
                            alt='South Korea'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          South Korea
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className='on-hover-item border-right-item border-right-item-sm-space has-submenu arrow-white'>
                    {/* Display the selected currency */}
                    <Link
                      to='#'
                      className='selected-text text-heading text-sm py-8'
                    >
                      {selectedCurrency}
                    </Link>
                    <ul className='selectable-text-list on-hover-dropdown common-dropdown common-dropdown--sm max-h-200 scroll-sm px-0 py-8'>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleCurrencyChange("USD")}
                        >
                          <img
                            src='assets/images/thumbs/flag1.png'
                            alt='USD'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          USD
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleCurrencyChange("Yen")}
                        >
                          <img
                            src='assets/images/thumbs/flag2.png'
                            alt='Yen'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          Yen
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleCurrencyChange("Franc")}
                        >
                          <img
                            src='assets/images/thumbs/flag3.png'
                            alt='Franc'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          Franc
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleCurrencyChange("EURO")}
                        >
                          <img
                            src='assets/images/thumbs/flag4.png'
                            alt='EURO'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          EURO
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleCurrencyChange("BDT")}
                        >
                          <img
                            src='assets/images/thumbs/flag6.png'
                            alt='BDT'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          BDT
                        </Link>
                      </li>
                      <li>
                        <Link
                          to='#'
                          className='hover-bg-gray-100 text-gray-500 text-xs py-6 px-16 flex-align gap-8 rounded-0'
                          onClick={() => handleCurrencyChange("WON")}
                        >
                          <img
                            src='assets/images/thumbs/flag5.png'
                            alt='WON'
                            className='w-16 h-12 rounded-4 border border-gray-100'
                          />
                          WON
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
                {/* Dropdown Select End */}
              </div>
              <div className='me-8 d-lg-none d-block'>
                <div className='header-two-activities flex-align flex-wrap gap-32'>
                  <button
                    onClick={handleSearchToggle}
                    type='button'
                    className='flex-align search-icon d-lg-none d-flex gap-4 item-hover-two'
                  >
                    <span className='text-2xl text-white d-flex position-relative item-hover__text'>
                      <i className='ph ph-magnifying-glass' />
                    </span>
                  </button>
                  <Link
                    to='/account'
                    className='flex-align flex-column gap-8 item-hover-two'
                  >
                    <span className='text-2xl text-white d-flex position-relative item-hover__text'>
                      <i className='ph ph-user' />
                    </span>
                    <span className='text-md text-white item-hover__text d-none d-lg-flex'>
                      Profile
                    </span>
                  </Link>
                  <Link
                    to='/wishlist'
                    className='flex-align flex-column gap-8 item-hover-two'
                  >
                    <span className='text-2xl text-white d-flex position-relative me-6 mt-6 item-hover__text'>
                      <i className='ph ph-heart' />
                      <span className='w-16 h-16 flex-center rounded-circle bg-main-two-600 text-white text-xs position-absolute top-n6 end-n4'>
                        2
                      </span>
                    </span>
                    <span className='text-md text-white item-hover__text d-none d-lg-flex'>
                      Wishlist
                    </span>
                  </Link>
                  <Link
                    to='/cart'
                    className='flex-align flex-column gap-8 item-hover-two'
                  >
                    <span className='text-2xl text-white d-flex position-relative me-6 mt-6 item-hover__text'>
                      <i className='ph-fill ph-shuffle' />
                      <span className='w-16 h-16 flex-center rounded-circle bg-main-two-600 text-white text-xs position-absolute top-n6 end-n4'>
                        2
                      </span>
                    </span>
                    <span className='text-md text-white item-hover__text d-none d-lg-flex'>
                      Compare
                    </span>
                  </Link>
                  <Link
                    to='/cart'
                    className='flex-align flex-column gap-8 item-hover-two'
                  >
                    <span className='text-2xl text-white d-flex position-relative me-6 mt-6 item-hover__text'>
                      <i className='ph ph-shopping-cart-simple' />
                      <span className='w-16 h-16 flex-center rounded-circle bg-main-two-600 text-white text-xs position-absolute top-n6 end-n4'>
                        2
                      </span>
                    </span>
                    <span className='text-md text-white item-hover__text d-none d-lg-flex'>
                      Cart
                    </span>
                  </Link>
                </div>
              </div>
              <button
                onClick={handleMenuToggle}
                type='button'
                className='toggle-mobileMenu d-lg-none ms-3n text-gray-800 text-4xl d-flex'
              >
                {" "}
                <i className='ph ph-list' />{" "}
              </button>
            </div>
            {/* Header Right End  */}
          </nav>
        </div>
      </header>
      {/* ==================== Header End Here ==================== */}
    </>
  );
};

export default HeaderTwo;
