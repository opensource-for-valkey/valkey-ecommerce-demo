import React from "react";
import Preloader from "../helper/Preloader";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";
import VoiceChat from "../components/VoiceChat";

const VoiceChatPage = () => {
  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />
      <HeaderTwo category={true} />
      <Breadcrumb title={"AI Voice Chat"} />
      <VoiceChat />
      <FooterTwo />
      <BottomFooter />
    </>
  );
};

export default VoiceChatPage;
