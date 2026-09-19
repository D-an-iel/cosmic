import React from 'react';
import { Link } from 'react-router-dom';

import ringsImg from '../../assets/products/ring_lifestyle_hand.jpg';
import necklacesImg from '../../assets/products/pendant_lifestyle_neck.jpg';
import braceletsImg from '../../assets/products/bracelet_lifestyle_wrist.jpg';
import earringsImg from '../../assets/products/earrings_lifestyle_ear.jpg';
import pendantsImg from '../../assets/products/pendant_hero_front.jpg';

const CATEGORIES = [
  {
    name: 'RINGS',
    slug: 'Rings',
    image: ringsImg,
    count: '04 PIECES',
  },
  {
    name: 'NECKLACES',
    slug: 'Necklaces',
    image: necklacesImg,
    count: '02 PIECES',
  },
  {
    name: 'BRACELETS',
    slug: 'Bracelets',
    image: braceletsImg,
    count: '01 PIECE',
  },
  {
    name: 'EARRINGS',
    slug: 'Earrings',
    image: earringsImg,
    count: '01 PIECE',
  },
  {
    name: 'PENDANTS',
    slug: 'Pendants',
    image: pendantsImg,
    count: '02 PIECES',
  },
];

export default function CategoryStrip() {
  return (
    <section className="w-full max-w-full overflow-hidden p-0 m-0 bg-black font-aileron select-none">
      {/* Edge-to-Edge Continuous 5-Department Strip (No Gaps, No Spacing, No Floating Cards) */}
      <div className="w-full max-w-full flex md:grid md:grid-cols-5 gap-0 overflow-x-auto snap-x snap-mandatory scrollbar-none border-t border-b border-white/10">
        {CATEGORIES.map((cat, idx) => (
          <Link
            key={cat.slug}
            to={`/collections?category=${cat.slug}`}
            className="group relative shrink-0 w-[58vw] sm:w-[36vw] md:w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[460px] snap-start overflow-hidden border-r border-white/10 last:border-r-0 cursor-pointer flex flex-col justify-end p-5 sm:p-7 md:p-8"
          >
            {/* Background Editorial Product Imagery */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-[#0A0A0A]">
              <img
                src={cat.image}
                alt={`${cat.name} Category`}
                className="w-full h-full object-cover object-center filter grayscale contrast-[1.08] brightness-90 group-hover:scale-108 group-hover:filter-none group-hover:brightness-100 transition-all duration-700 ease-out"
                loading="lazy"
              />
              {/* Luxury Vignette & Dark Contrast Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:from-black/80 transition-colors duration-500" />
            </div>

            {/* Department Index Tag */}
            <div className="relative z-10 mb-auto flex items-center justify-between">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.35em] text-white/50 font-mono">
                0{idx + 1}
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-white/40 font-mono group-hover:text-white transition-colors">
                {cat.count}
              </span>
            </div>

            {/* Category Title & Interaction Action */}
            <div className="relative z-10 flex flex-col space-y-1.5 sm:space-y-2">
              <h2 className="text-base sm:text-lg md:text-xl font-normal uppercase tracking-[0.24em] text-white group-hover:tracking-[0.28em] transition-all duration-300">
                [{cat.name}]
              </h2>

              <div className="flex items-center space-x-2 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-white/60 group-hover:text-white transition-colors duration-300">
                <span>SHOP NOW</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </div>

            {/* Subtle Bottom Accent Glow on Hover */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </Link>
        ))}
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
