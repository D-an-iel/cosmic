import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.jsx';

export default function CurvedProductCarousel({
  products = [],
  onQuickBuy,
}) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isDragging = useRef(false);

  const safeProducts = products.length > 0 ? products : [];

  const handleTouchStart = (e) => {
    isDragging.current = true;
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    touchDeltaX.current = currentX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const threshold = 40;
    if (touchDeltaX.current > threshold) {
      // Swiped right -> previous product
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : safeProducts.length - 1));
    } else if (touchDeltaX.current < -threshold) {
      // Swiped left -> next product
      setActiveIndex((prev) => (prev < safeProducts.length - 1 ? prev + 1 : 0));
    }
  };

  if (safeProducts.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden py-10 select-none font-sans">
      {/* Curved Carousel Stage (Perspective container) */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        className="relative w-full h-[480px] sm:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing perspective-[1000px]"
      >
        {safeProducts.map((product, index) => {
          // Circular delta relative to active index
          const count = safeProducts.length;
          let offset = index - activeIndex;

          // Wrap offset for circular effect
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;

          // Compute 3D parameters along the invisible curved arc
          const isCenter = offset === 0;
          const absOffset = Math.abs(offset);

          if (absOffset > 2) {
            return null; // Cull distant cards
          }

          // Curved circular path math
          const translateX = offset * 180; // horizontal arc spread
          const translateZ = -absOffset * 80; // push backwards
          const rotateY = offset * -14; // yaw inwards
          const scale = isCenter ? 1.05 : Math.max(0.78, 1 - absOffset * 0.16);
          const opacity = isCenter ? 1 : Math.max(0.35, 1 - absOffset * 0.45);
          const zIndex = 30 - absOffset * 10;

          const imgUrl =
            product.images?.[0]?.src ||
            product.gallery?.[0]?.src ||
            product.image ||
            '/assets/lunar_collection.jpg';

          const inWishlist = isInWishlist(product.id);

          return (
            <div
              key={product.id || index}
              onClick={() => {
                if (!isCenter) {
                  setActiveIndex(index);
                } else {
                  navigate(`/product/${product.slug}`);
                }
              }}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className={`absolute w-[270px] sm:w-[310px] bg-[#070707] border ${
                isCenter ? 'border-[#C0C0C0]/50 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(192,192,192,0.15)]' : 'border-white/10 shadow-xl'
              } p-4 rounded-sm flex flex-col justify-between overflow-hidden group`}
            >
              {/* Card Top: Wishlist Button & Flagship Pill */}
              <div className="flex items-center justify-between z-10 mb-3">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#808080] font-mono">
                  {product.category || 'Maison Piece'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className="p-1.5 rounded-full bg-black/60 border border-white/10 hover:border-white/30 text-white transition-colors cursor-pointer"
                  title="Save to Collection"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      inWishlist ? 'fill-red-500 text-red-500' : 'text-[#C0C0C0]'
                    }`}
                  />
                </button>
              </div>

              {/* Jewelry Image with Slow Zoom Hover */}
              <div className="aspect-square relative overflow-hidden bg-[#030303] border border-white/5 mb-4 rounded-sm">
                <img
                  src={imgUrl}
                  alt={product.name}
                  className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.target.src = '/assets/lunar_collection.jpg';
                  }}
                />
              </div>

              {/* Information & Action */}
              <div className="space-y-2">
                <div>
                  <h3 className="font-serif text-lg tracking-wide text-white truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="font-mono text-sm text-[#E0E0E0] font-medium">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-[#707070]">
                      Solid 925
                    </span>
                  </div>
                </div>

                {isCenter && (
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onQuickBuy) onQuickBuy(product);
                        else navigate(`/product/${product.slug}`);
                      }}
                      className="flex-1 py-2.5 chrome-button text-[10px] uppercase tracking-[0.2em] font-bold text-black rounded-sm cursor-pointer shadow-[0_0_15px_rgba(192,192,192,0.3)] transition-all"
                    >
                      Instant Buy →
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dot Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {safeProducts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === activeIndex
                ? 'w-6 h-1 bg-[#C0C0C0]'
                : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
