import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// High-resolution studio white & editorial lifestyle assets
import ringLifestyleHand from '../../assets/products/ring_lifestyle_hand.jpg';
import ringWornScale from '../../assets/products/ring_worn_scale.jpg';
import ringHeroFront from '../../assets/products/ring_hero_front.jpg';
import ringDetailMacro from '../../assets/products/ring_detail_macro.jpg';
import ringAngle45 from '../../assets/products/ring_angle_45.jpg';

import pendantLifestyleNeck from '../../assets/products/pendant_lifestyle_neck.jpg';
import pendantWornScale from '../../assets/products/pendant_worn_scale.jpg';
import pendantHeroFront from '../../assets/products/pendant_hero_front.jpg';
import pendantDetailMacro from '../../assets/products/pendant_detail_macro.jpg';
import pendantAngle45 from '../../assets/products/pendant_angle_45.jpg';

import braceletLifestyleWrist from '../../assets/products/bracelet_lifestyle_wrist.jpg';
import braceletWornScale from '../../assets/products/bracelet_worn_scale.jpg';
import braceletHeroFront from '../../assets/products/bracelet_hero_front.jpg';
import braceletDetailMacro from '../../assets/products/bracelet_detail_macro.jpg';
import braceletAngle45 from '../../assets/products/bracelet_angle_45.jpg';

import earringsLifestyleEar from '../../assets/products/earrings_lifestyle_ear.jpg';
import earringsWornScale from '../../assets/products/earrings_worn_scale.jpg';
import earringsHeroFront from '../../assets/products/earrings_hero_front.jpg';
import earringsDetailMacro from '../../assets/products/earrings_detail_macro.jpg';
import earringsAngle45 from '../../assets/products/earrings_angle_45.jpg';

import editorialLookbook from '../../assets/hero_editorial.jpg';
import modelHands from '../../assets/lunar_ring_onmodel.jpg';
import packagingMonolith from '../../assets/lunar_ring_packaging.jpg';

const COMMUNITY_CARDS = [
  {
    id: 'wear-1',
    productName: 'Chrome Ring',
    category: 'Sterling Silver Ring',
    price: '₹799',
    slug: 'lunar-silver-ring',
    thumbnail: ringHeroFront,
    images: [
      ringLifestyleHand,
      ringWornScale,
      ringHeroFront,
      ringDetailMacro,
      ringAngle45,
      packagingMonolith,
    ],
  },
  {
    id: 'wear-2',
    productName: 'Cross Pendant',
    category: 'Diamond-Cut Medallion',
    price: '₹1,299',
    slug: 'celestial-pendant',
    thumbnail: pendantHeroFront,
    images: [
      pendantLifestyleNeck,
      pendantWornScale,
      pendantHeroFront,
      pendantDetailMacro,
      pendantAngle45,
      packagingMonolith,
    ],
  },
  {
    id: 'wear-3',
    productName: 'Chrome Bracelet',
    category: 'Kinetic Silver Cuff',
    price: '₹999',
    slug: 'orbit-bracelet',
    thumbnail: braceletHeroFront,
    images: [
      braceletLifestyleWrist,
      braceletWornScale,
      braceletHeroFront,
      braceletDetailMacro,
      braceletAngle45,
      packagingMonolith,
    ],
  },
  {
    id: 'wear-4',
    productName: 'Nova Studs',
    category: 'Architectural Stud Pair',
    price: '₹699',
    slug: 'nova-studs',
    thumbnail: earringsHeroFront,
    images: [
      earringsLifestyleEar,
      earringsWornScale,
      earringsHeroFront,
      earringsDetailMacro,
      earringsAngle45,
      packagingMonolith,
    ],
  },
  {
    id: 'wear-5',
    productName: 'Facet Band',
    category: 'Sculptural Signet Ring',
    price: '₹899',
    slug: 'lunar-silver-ring',
    thumbnail: ringAngle45,
    images: [
      modelHands,
      editorialLookbook,
      ringHeroFront,
      ringDetailMacro,
      ringWornScale,
      packagingMonolith,
    ],
  },
];

// Memoized Card component with multi-image gallery scrubbing on desktop and touch-swipe on mobile
const CommunityCard = React.memo(function CommunityCard({ card }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 35) {
      // Swipe Right -> Prev
      setActiveImgIndex((prev) => (prev > 0 ? prev - 1 : card.images.length - 1));
    } else if (deltaX < -35) {
      // Swipe Left -> Next
      setActiveImgIndex((prev) => (prev < card.images.length - 1 ? prev + 1 : 0));
    }
  };

  // Hover scrub across horizontal segments on desktop
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const segmentWidth = rect.width / card.images.length;
    const index = Math.min(
      card.images.length - 1,
      Math.max(0, Math.floor(x / segmentWidth))
    );
    setActiveImgIndex(index);
  };

  return (
    <div
      className="shrink-0 w-[82vw] sm:w-[320px] md:w-[280px] lg:w-[275px] xl:w-[285px] h-[520px] sm:h-[560px] md:h-[580px] snap-center rounded-2xl overflow-hidden border border-white/10 bg-[#0c0c0c] flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.8)] group select-none transition-all duration-300 hover:border-white/30"
    >
      {/* Top 80-82%: Main Lifestyle Image Container with Multi-Image Browsing */}
      <div
        className="relative w-full h-[79%] bg-[#080808] overflow-hidden cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveImgIndex(0)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={card.images[activeImgIndex]}
          alt={`${card.productName} Lifestyle ${activeImgIndex + 1}`}
          className="w-full h-full object-cover object-center filter brightness-[0.92] group-hover:brightness-100 transition-all duration-300"
          loading="lazy"
        />

        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Right Play Reel Icon Badge */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-[10px] shadow-lg group-hover:border-white/60 transition-colors">
            ▶
          </div>
        </div>

        {/* Image Progress Indicator Dots */}
        <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-1.5 pointer-events-none">
          {card.images.map((_, i) => (
            <span
              key={i}
              className={`h-1 transition-all rounded-full ${
                activeImgIndex === i
                  ? 'w-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                  : 'w-1 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom 18-21%: Glassmorphic Product Overlay Panel (Inspired by Miso reference) */}
      <Link
        to={`/product/${card.slug}`}
        className="w-full h-[21%] bg-[#0d0d0d]/90 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex items-center justify-between group-hover:bg-[#151515] transition-colors"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Small Product Thumbnail */}
          <div className="w-12 h-12 rounded-lg bg-black border border-white/15 overflow-hidden shrink-0 flex items-center justify-center p-1 group-hover:border-white/40 transition-colors">
            <img
              src={card.thumbnail}
              alt={card.productName}
              className="w-full h-full object-contain filter brightness-95"
              loading="lazy"
            />
          </div>

          {/* Product Information */}
          <div className="min-w-0 space-y-0.5">
            <h3 className="font-mono text-xs sm:text-sm uppercase tracking-wider text-white font-medium truncate group-hover:text-[#D8D8D8]">
              {card.productName}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#707070] uppercase tracking-wider truncate font-sans">
              {card.category}
            </p>
            <p className="font-mono text-xs font-semibold text-white/90">
              {card.price}
            </p>
          </div>
        </div>

        {/* Action Arrow */}
        <div className="shrink-0 w-7 h-7 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black flex items-center justify-center text-xs text-white/70 transition-colors">
          →
        </div>
      </Link>
    </div>
  );
});

export default function WearCosmic() {
  const scrollContainerRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const scrollByDirection = (direction) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth * 0.82;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Track active slide index on scroll for bottom pagination dots
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const index = Math.round(scrollLeft / (clientWidth * 0.8));
      setActiveSlide(Math.min(COMMUNITY_CARDS.length - 1, Math.max(0, index)));
    }
  };

  return (
    <section className="w-full bg-black py-20 md:py-28 px-4 sm:px-6 lg:px-12 border-b border-white/10 font-aileron">
      <div className="max-w-7xl mx-auto">
        {/* Section Header (Directly modeled on Miso Reference) */}
        <div className="text-center space-y-3 mb-12 md:mb-16">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-[#808080] font-mono block">
            Real People. Real Style.
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl uppercase tracking-[0.15em] text-white font-light">
            Wear Cosmic
          </h2>
          <p className="text-xs sm:text-sm text-[#A0A0A0] font-light max-w-md mx-auto tracking-wide">
            See how our community styles their favorite pieces.
          </p>

          <div className="pt-2">
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 hover:border-white/60 bg-white/[0.02] hover:bg-white/10 text-xs uppercase tracking-widest text-[#D0D0D0] hover:text-white font-mono transition-all duration-300"
            >
              <span>View all</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Carousel Container with Desktop Arrow Controls */}
        <div className="relative group/carousel">
          {/* Left Navigation Arrow (Desktop) */}
          <button
            onClick={() => scrollByDirection('left')}
            aria-label="Previous community style"
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white items-center justify-center hover:border-white/70 hover:scale-105 transition-all shadow-2xl cursor-pointer"
          >
            ‹
          </button>

          {/* Right Navigation Arrow (Desktop) */}
          <button
            onClick={() => scrollByDirection('right')}
            aria-label="Next community style"
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white items-center justify-center hover:border-white/70 hover:scale-105 transition-all shadow-2xl cursor-pointer"
          >
            ›
          </button>

          {/* Swipeable Cards (Mobile: 1.2 cards visible at 375px; Desktop: clean multi-card row) */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {COMMUNITY_CARDS.map((card) => (
              <CommunityCard key={card.id} card={card} />
            ))}
          </div>

          {/* Bottom Pagination Dots (Matching Miso reference) */}
          <div className="flex items-center justify-center gap-2 mt-4 md:mt-6">
            {COMMUNITY_CARDS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const cardWidth = scrollContainerRef.current.clientWidth * 0.82;
                    scrollContainerRef.current.scrollTo({
                      left: idx * cardWidth,
                      behavior: 'smooth',
                    });
                  }
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 transition-all rounded-full cursor-pointer ${
                  activeSlide === idx
                    ? 'w-6 bg-white'
                    : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
