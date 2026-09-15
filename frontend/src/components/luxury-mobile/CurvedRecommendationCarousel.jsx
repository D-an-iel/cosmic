import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CurvedRecommendationCarousel({
  products = [],
  title = "YOU MAY ALSO LIKE",
  onProductClick,
}) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
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
    if (touchDeltaX.current > 35) {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : safeProducts.length - 1));
    } else if (touchDeltaX.current < -35) {
      setActiveIndex((prev) => (prev < safeProducts.length - 1 ? prev + 1 : 0));
    }
  };

  if (safeProducts.length === 0) return null;

  return (
    <div className="w-full py-6 select-none font-sans overflow-hidden">
      <div className="text-center mb-4">
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#707070] font-mono block">
          CURATED HARMONY
        </span>
        <h4 className="font-serif text-lg tracking-wider text-white uppercase">
          {title}
        </h4>
      </div>

      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        className="relative w-full h-[280px] flex items-center justify-center cursor-grab active:cursor-grabbing perspective-[800px]"
      >
        {safeProducts.map((p, idx) => {
          const count = safeProducts.length;
          let offset = idx - activeIndex;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;

          const isCenter = offset === 0;
          const absOffset = Math.abs(offset);

          if (absOffset > 2) return null;

          const translateX = offset * 130;
          const translateZ = -absOffset * 60;
          const rotateY = offset * -12;
          const scale = isCenter ? 1.05 : 0.82;
          const opacity = isCenter ? 1 : 0.45;

          const imgUrl =
            p.images?.[0]?.src ||
            p.gallery?.[0]?.src ||
            p.image ||
            '/assets/lunar_collection.jpg';

          return (
            <div
              key={p.id || idx}
              onClick={() => {
                if (onProductClick) onProductClick(p);
                else navigate(`/product/${p.slug}`);
              }}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex: 20 - absOffset * 5,
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
              }}
              className={`absolute w-[180px] bg-[#0A0A0A] border ${
                isCenter ? 'border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]' : 'border-white/10'
              } p-3 rounded-sm text-center flex flex-col justify-between`}
            >
              <div className="aspect-square relative overflow-hidden bg-black mb-2 rounded-sm">
                <img
                  src={imgUrl}
                  alt={p.name}
                  className="w-full h-full object-cover filter brightness-95"
                />
              </div>

              <div>
                <h5 className="font-serif text-xs text-white truncate">{p.name}</h5>
                <span className="font-mono text-[11px] text-[#A0A0A0]">
                  ₹{Number(p.price).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
