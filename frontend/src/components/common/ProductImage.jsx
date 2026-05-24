import React, { useState, useRef, useEffect } from "react";
import { sized, srcSet, lqip, placeholderImage } from "../../lib/img";

// Single source of truth for product imagery. Zero-CLS aspect-ratio container,
// LQIP-or-skeleton placeholder, blur-up fade-in, error fallback to local PNG.
//
// Props:
//   src        — resolved image URL (Unsplash / loremflickr / picsum / local)
//   alt        — required
//   ratio      — "1/1" (default), "4/3", "16/9", etc.
//   priority   — true for above-the-fold / LCP; sets eager + fetchpriority="high"
//   width      — intrinsic px width to request (default 600)
//   sizes      — responsive sizes hint
//   className  — passed through to wrapper
//   onClick    — passed through to <img>
//   hoverSrc   — optional second image to crossfade in on hover (gallery angles)

const DEFAULT_SIZES = "(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw";

const ProductImage = ({
  src,
  alt = "",
  ratio = "1/1",
  priority = false,
  width = 600,
  sizes = DEFAULT_SIZES,
  className = "",
  onClick,
  hoverSrc = null,
  style: extraStyle = {},
}) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef(null);

  const effectiveSrc = errored
    ? placeholderImage
    : (hovered && hoverSrc) ? sized(hoverSrc, width) : sized(src, width);
  const lq = lqip(src);
  const set = srcSet(src, width);

  useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [src]);

  return (
    <div
      className={`product-image ${className}`}
      style={{
        position: "relative",
        aspectRatio: ratio,
        width: "100%",
        background: "var(--ch-muted-bg, #f4f4f5)",
        overflow: "hidden",
        borderRadius: "inherit",
        ...extraStyle,
      }}
      onMouseEnter={hoverSrc ? () => setHovered(true) : undefined}
      onMouseLeave={hoverSrc ? () => setHovered(false) : undefined}
    >
      {lq && !loaded && (
        <img
          src={lq}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(12px)",
            transform: "scale(1.06)",
          }}
        />
      )}
      {!lq && !loaded && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 100%)",
            backgroundSize: "200% 100%",
            animation: "product-image-shimmer 1.4s ease-in-out infinite",
          }}
        />
      )}

      <img
        ref={imgRef}
        src={effectiveSrc}
        srcSet={set}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // React doesn't lowercase this attribute consistently across versions;
        // both forms are safe to set.
        fetchpriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={() => { if (!errored) setErrored(true); }}
        onClick={onClick}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 350ms ease",
          cursor: onClick ? "pointer" : "default",
        }}
      />

      <style>{`
        @keyframes product-image-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default ProductImage;
