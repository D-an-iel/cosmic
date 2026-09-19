import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Standardized Miso-Style Product Card
 * Following Miso by Sonia's architectural card layout:
 * - 1px crisp outer border
 * - Pure white studio product stage with subtle hover zoom
 * - Integrated bottom bar (#E8E8E8) with uppercase Title on the left and RS. Price on the right
 * - Multi-image hover preview
 */
export default function ProductCard({
  product,
  aspectRatio = 'aspect-[4/5]',
  className = '',
  showTag = true,
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!product) return null;

  // Normalize images
  const rawImages = product.images || product.gallery || [product.image || product.thumbnail];
  const images = rawImages
    .map((img) => (typeof img === 'string' ? img : img?.src))
    .filter(Boolean);

  const primaryImage = images[activeIdx] || images[0] || '/assets/products/ring_hero_front.jpg';

  // Format Price to Miso format: RS. X,XXX.00
  const parsePrice = (priceVal) => {
    if (typeof priceVal === 'number') return priceVal;
    if (typeof priceVal === 'string') {
      const num = parseFloat(priceVal.replace(/[^0-9.]/g, ''));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const numericPrice = parsePrice(product.price);
  const formattedPrice = `RS. ${numericPrice.toLocaleString('en-IN')}.00`;

  // Desktop hover segment scrub across multiple views
  const handleMouseMove = (e) => {
    if (images.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const segmentWidth = rect.width / Math.min(images.length, 4);
    const index = Math.min(
      Math.min(images.length, 4) - 1,
      Math.max(0, Math.floor(x / segmentWidth))
    );
    setActiveIdx(index);
  };

  return (
    <div
      className={`group relative flex flex-col bg-white border border-[#D5D5D5] hover:border-black transition-colors duration-300 select-none overflow-hidden ${className}`}
    >
      <Link
        to={`/product/${product.slug || product.id}`}
        className="flex flex-col h-full w-full focus:outline-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveIdx(0)}
      >
        {/* 1. Main Studio Product Canvas (Pure White #FFFFFF) */}
        <div className={`relative w-full ${aspectRatio} bg-white flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-hidden`}>
          {/* Subtle Atelier Tag (Optional) */}
          {showTag && product.tag && (
            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 bg-black/85 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 border border-black/20 text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white font-mono pointer-events-none">
              {product.tag}
            </div>
          )}

          {/* Product Image with smooth scale on card hover */}
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Multi-Image indicator dots if more than 1 image */}
          {images.length > 1 && (
            <div className="absolute bottom-1.5 sm:bottom-2 left-0 right-0 flex items-center justify-center gap-1 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {images.slice(0, 4).map((_, i) => (
                <span
                  key={i}
                  className={`h-0.5 transition-all rounded-full ${
                    activeIdx === i ? 'w-2.5 sm:w-3 bg-black' : 'w-1 bg-black/25'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. Miso-Style Integrated Bottom Bar (Flush, Solid Divider, Title Left, Price Right) */}
        <div className="w-full bg-[#E8E8E8] group-hover:bg-[#DFDFDF] border-t border-[#D0D0D0] px-2 sm:px-3.5 py-1.5 sm:py-2.5 flex items-center justify-between gap-1 sm:gap-2 transition-colors duration-200 min-h-[32px] sm:min-h-[38px]">
          {/* Left: Product Name */}
          <span className="text-[8.5px] xs:text-[9.5px] sm:text-xs font-mono font-semibold uppercase tracking-tight sm:tracking-wider text-black truncate">
            {product.name}
          </span>

          {/* Right: Price in RS. X,XXX.00 */}
          <span className="text-[8.5px] xs:text-[9.5px] sm:text-xs font-mono font-medium uppercase tracking-tight sm:tracking-wider text-black shrink-0 whitespace-nowrap">
            {formattedPrice}
          </span>
        </div>
      </Link>
    </div>
  );
}
