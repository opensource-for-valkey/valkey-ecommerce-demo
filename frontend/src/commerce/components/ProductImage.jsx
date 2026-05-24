import { useEffect, useState } from "react";
import { FALLBACK_IMAGE, imageUrl } from "../utils/images";

export const ProductImage = ({ src, alt = "", className = "", loading = "lazy", fetchPriority }) => {
  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK_IMAGE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setCurrentSrc(src || FALLBACK_IMAGE);
  }, [src]);

  return (
    <img
      src={imageUrl(currentSrc)}
      alt={alt}
      className={`${className} ${loaded ? "is-loaded" : "is-loading"}`.trim()}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (currentSrc !== FALLBACK_IMAGE) setCurrentSrc(FALLBACK_IMAGE);
      }}
    />
  );
};

