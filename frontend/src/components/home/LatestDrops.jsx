import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard.jsx';

// 5 Images per product (Pure White #FFFFFF Studio & Editorial Lifestyle)
import ringHeroFront from '../../assets/products/ring_hero_front.jpg';
import ringAngle45 from '../../assets/products/ring_angle_45.jpg';
import ringDetailMacro from '../../assets/products/ring_detail_macro.jpg';
import ringLifestyleHand from '../../assets/products/ring_lifestyle_hand.jpg';
import ringWornScale from '../../assets/products/ring_worn_scale.jpg';

import pendantHeroFront from '../../assets/products/pendant_hero_front.jpg';
import pendantAngle45 from '../../assets/products/pendant_angle_45.jpg';
import pendantDetailMacro from '../../assets/products/pendant_detail_macro.jpg';
import pendantLifestyleNeck from '../../assets/products/pendant_lifestyle_neck.jpg';
import pendantWornScale from '../../assets/products/pendant_worn_scale.jpg';

import braceletHeroFront from '../../assets/products/bracelet_hero_front.jpg';
import braceletAngle45 from '../../assets/products/bracelet_angle_45.jpg';
import braceletDetailMacro from '../../assets/products/bracelet_detail_macro.jpg';
import braceletLifestyleWrist from '../../assets/products/bracelet_lifestyle_wrist.jpg';
import braceletWornScale from '../../assets/products/bracelet_worn_scale.jpg';

import earringsHeroFront from '../../assets/products/earrings_hero_front.jpg';
import earringsAngle45 from '../../assets/products/earrings_angle_45.jpg';
import earringsDetailMacro from '../../assets/products/earrings_detail_macro.jpg';
import earringsLifestyleEar from '../../assets/products/earrings_lifestyle_ear.jpg';
import earringsWornScale from '../../assets/products/earrings_worn_scale.jpg';

const DROPS = [
  {
    id: 'lunar-silver-ring',
    slug: 'lunar-silver-ring',
    name: 'Lunar Silver Ring',
    category: 'Sculptural Ring',
    price: 799,
    tag: 'Solid S925',
    images: [
      ringHeroFront,
      ringAngle45,
      ringDetailMacro,
      ringLifestyleHand,
      ringWornScale,
    ],
  },
  {
    id: 'celestial-pendant',
    slug: 'celestial-pendant',
    name: 'Celestial Pendant',
    category: 'Diamond-Cut Medallion',
    price: 1299,
    tag: 'Liquid Rhodium',
    images: [
      pendantHeroFront,
      pendantAngle45,
      pendantDetailMacro,
      pendantLifestyleNeck,
      pendantWornScale,
    ],
  },
  {
    id: 'orbit-bracelet',
    slug: 'orbit-bracelet',
    name: 'Orbit Bracelet',
    category: 'Kinetic Cuff',
    price: 999,
    tag: 'Memory Silver',
    images: [
      braceletHeroFront,
      braceletAngle45,
      braceletDetailMacro,
      braceletLifestyleWrist,
      braceletWornScale,
    ],
  },
  {
    id: 'nova-studs',
    slug: 'nova-studs',
    name: 'Nova Studs',
    category: 'Architectural Lobe',
    price: 699,
    tag: 'Faceted Chamfer',
    images: [
      earringsHeroFront,
      earringsAngle45,
      earringsDetailMacro,
      earringsLifestyleEar,
      earringsWornScale,
    ],
  },
];

export default function LatestDrops() {
  const carouselRef = useRef(null);

  const scrollByAmount = (distance) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-black py-10 sm:py-16 md:py-24 px-3 sm:px-6 lg:px-12 border-b border-white/10 font-aileron">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8 md:mb-12 px-1 gap-2">
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#808080] font-mono block">
              Curated Releases • Batch 04
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl uppercase tracking-[0.18em] sm:tracking-[0.2em] text-white font-normal mt-1">
              Latest Drops
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Navigation Arrows for Carousel */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scrollByAmount(-340)}
                aria-label="Previous drop"
                className="w-10 h-10 border border-white/15 hover:border-white/50 flex items-center justify-center text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
              >
                ←
              </button>
              <button
                onClick={() => scrollByAmount(340)}
                aria-label="Next drop"
                className="w-10 h-10 border border-white/15 hover:border-white/50 flex items-center justify-center text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
              >
                →
              </button>
            </div>

            <Link
              to="/collections"
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white hover:text-[#C0C0C0] underline underline-offset-4 transition-colors font-medium whitespace-nowrap"
            >
              Shop All Drops →
            </Link>
          </div>
        </div>

        {/* Miso-Style Product Grid (Responsive: 2 cols on mobile, 4 on desktop) */}
        <div
          ref={carouselRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6"
        >
          {DROPS.map((drop) => (
            <ProductCard
              key={drop.slug}
              product={drop}
              aspectRatio="aspect-[4/5]"
              className="w-full"
            />
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

