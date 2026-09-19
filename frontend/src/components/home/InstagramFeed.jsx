import React from 'react';
import ig1 from '../../assets/products/ring_lifestyle_hand.jpg';
import ig2 from '../../assets/products/pendant_lifestyle_neck.jpg';
import ig3 from '../../assets/products/bracelet_lifestyle_wrist.jpg';
import ig4 from '../../assets/products/ring_detail_macro.jpg';
import ig5 from '../../assets/products/pendant_detail_macro.jpg';
import ig6 from '../../assets/products/earrings_lifestyle_ear.jpg';

const POSTS = [
  { id: 1, image: ig1, alt: 'Cosmic Editorial Ring Styling FW26' },
  { id: 2, image: ig2, alt: 'Celestial Pendant Liquid Rhodium Neckline' },
  { id: 3, image: ig3, alt: 'Orbit Bracelet Wrist Architecture' },
  { id: 4, image: ig4, alt: 'S925 Hallmark & Razor Bevel Macro' },
  { id: 5, image: ig5, alt: 'Deep Space Celestial Medallion Relief' },
  { id: 6, image: ig6, alt: 'Nova Geometric Studs Editorial Styling' },
];

export default function InstagramFeed() {
  return (
    <section className="w-full bg-black py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-white/10 font-aileron">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 px-1 gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#808080] font-mono block">
              The Digital Atelier • Community
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.2em] text-white font-normal mt-1">
              Follow Cosmic
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white transition-colors flex items-center gap-2 group font-mono"
          >
            <span>@cosmic.maison</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* Grid: Desktop 6-image grid, Mobile 2-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {POSTS.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden bg-[#0a0a0a] border border-white/10 group cursor-pointer block"
            >
              <img
                src={post.image}
                alt={post.alt}
                className="w-full h-full object-cover object-center filter brightness-90 contrast-[1.05] group-hover:scale-110 transition-transform duration-700 ease-out select-none"
                loading="lazy"
              />
              {/* Instagram Hover Overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-2 p-4 text-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white font-mono">
                  View Post
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
