import React from "react";
import Preloader from "../helper/Preloader";
import HeaderTwo from "../components/HeaderTwo";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
// import ShippingOne from "../components/ShippingOne";
import Account from "../components/Account";
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";

const AccountPage = () => {
  return (
    <>
      {/* ColorInit */}
      <ColorInit color={true} />

      {/* ScrollToTop */}
      {/* <ScrollToTop smooth color="#8B5CF6" /> */}

      {/* Preloader */}
      <Preloader />

      {/* Header */}
      <HeaderTwo />

      {/* Account */}
      <Account />

      {/* Shipping */}
      {/* <ShippingOne /> */}

      {/* Footer */}
      {/* <FooterTwo /> */}

      {/* Bottom Footer */}
      {/* <BottomFooter /> */}
    </>
  );
};

export default AccountPage;