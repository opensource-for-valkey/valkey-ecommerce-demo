
import Aos from "aos";
import { useEffect } from "react";

const Animation = () => {
  useEffect(() => {
    Aos.init({
      offset: 0,
      easing: "ease",
      once: true,
      duration: 1200,
    });
    Aos.refresh();
  }, []);
  return null;
};

export default Animation;
