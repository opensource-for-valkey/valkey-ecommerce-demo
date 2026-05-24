import React from "react";
import ColorInit from "../helper/ColorInit";
import Preloader from "../helper/Preloader";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import WishListSection from "../components/WishListSection";
import ShippingOne from "../components/ShippingOne";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";

function WishlistPage() {
  return (
    <>
      {/* ColorInit */}
      <ColorInit color={true} />

      {/* Preloader */}
      <Preloader />

      {/* HeaderTwo */}
      <HeaderTwo category={true} />

      {/* Breadcrumb */}
      <Breadcrumb title={"My Wishlist"} />

      {/* WishListSection */}
      <WishListSection />

      {/* ShippingOne */}
      <ShippingOne />

      {/* FooterTwo */}
      <FooterTwo />

      {/* BottomFooter */}
      <BottomFooter />
    </>
  );
}

export default WishlistPage;
