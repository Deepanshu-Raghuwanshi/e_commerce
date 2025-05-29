import { useState, useEffect } from "react";

/**
 * OptimizedImage component for better performance
 *
 * Features:
 * - Lazy loading
 * - Responsive image loading with srcset
 * - Blur-up loading effect
 * - WebP format with fallback
 *
 * @param {Object} props Component props
 * @param {string} props.src Main image source
 * @param {string} props.alt Alt text for accessibility
 * @param {string} props.className CSS class names
 * @param {Object} props.sizes Different image sizes for srcset
 * @param {string} props.placeholder Low-quality placeholder image
 */
const OptimizedImage = ({
  src,
  alt,
  className = "",
  sizes = {
    small: { width: 400, height: 300 },
    medium: { width: 800, height: 600 },
    large: { width: 1200, height: 900 },
  },
  placeholder = "",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState(false);

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = async () => {
      const webpSupported =
        document
          .createElement("canvas")
          .toDataURL("image/webp")
          .indexOf("data:image/webp") === 0;

      setSupportsWebP(webpSupported);
    };

    checkWebPSupport();
  }, []);

  // Generate srcset based on sizes
  const generateSrcSet = () => {
    if (!sizes) return "";

    // Convert image URL to WebP if supported
    const getImageUrl = (url, width) => {
      if (supportsWebP) {
        // will use cdn later
        return url.replace(/\.(jpg|jpeg|png)$/, ".webp") + `?w=${width}`;
      }
      return `${url}?w=${width}`;
    };

    return Object.entries(sizes)
      .map(([, { width }]) => `${getImageUrl(src, width)} ${width}w`)
      .join(", ");
  };

  // Generate sizes attribute
  const generateSizes = () => {
    return "(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px";
  };

  return (
    <div className={`optimized-image-container ${className}`}>
      {placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt={alt}
          className="placeholder-image"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            filter: "blur(10px)",
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      )}
      <img
        src={src}
        srcSet={generateSrcSet()}
        sizes={generateSizes()}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </div>
  );
};

export default OptimizedImage;
