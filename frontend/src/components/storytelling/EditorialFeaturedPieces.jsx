import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS } from '../../data/products.js';

gsap.registerPlugin(ScrollTrigger);

const SIGNATURE_PIECES = [
  { slug: 'lunar-silver-ring', name: 'Lunar Silver Ring', price: 799 },
  { slug: 'celestial-pendant', name: 'Celestial Pendant', price: 1299 },
  { slug: 'orbit-bracelet', name: 'Orbit Bracelet', price: 999 },
  { slug: 'nova-studs', name: 'Nova Geometric Studs', price: 699 },
];

export default function EditorialFeaturedPieces({ onAddToCart, onQuickView }) {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=5000', // Increased length for more breathing room
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      cards.forEach((card, i) => {
        // Initial state: invisible and slightly shifted
        gsap.set(card, {
          opacity: 0,
          scale: 1.05,
          y: 20,
          pointerEvents: 'none',
          willChange: 'transform, opacity'
        });

        if (i === 0) {
          gsap.set(card, { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto' });
        }

        // Sequence: Cinematic Fade In -> Hold -> Cinematic Fade Out
        tl.to(card, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
          pointerEvents: 'auto',
        }, i === 0 ? 0 : `>${cards[i-1].dataset.exitTime || 0}`);

        tl.to({}, { duration: 1.5 }); // Hold attention - luxury pacing

        tl.to(card, {
          opacity: 0,
          scale: 0.98,
          y: -20,
          duration: 1.2,
          ease: 'power2.inOut',
          pointerEvents: 'none',
        });

        card.dataset.exitTime = tl.totalTime();
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center select-none"
    >
      {/* Deep Cinematic Background */}
      <div className="absolute inset-0 bg-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(20,20,20,0.5)_0%,_transparent_70%)] pointer-events-none" />

      {/* Section Header - Minimalist Magazine Style */}
      <div className="absolute top-12 left-12 z-20 pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.5em] text-[#505050] font-mono block mb-1">
          CAMPAIGN MMXXVI
        </span>
        <h3 className="font-serif text-xs uppercase tracking-[0.3em] text-white/30 font-light">
          The Signature Series
        </h3>
      </div>

      {/* CINEMATIC CAMPAIGN LAYERS */}
      <div className="relative w-full h-full flex items-center justify-center px-4 sm:px-12">
        {SIGNATURE_PIECES.map((piece, idx) => {
          const product = PRODUCTS.find(p => p.slug === piece.slug) || PRODUCTS[0];
          // Use the most editorial/on-model image available
          const mainImg = product.gallery?.find(img => img.label === 'Silhouette' || img.label === 'On-Model')?.src
                         || product.gallery?.[0]?.src
                         || product.images?.[0]?.src
                         || product.image;

          return (
            <div
              key={piece.slug}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Full-Width Campaign Photography */}
              <div
                className="relative w-full max-w-6xl aspect-[16/9] sm:aspect-video lg:aspect-[21/9] group cursor-pointer"
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                <div className="w-full h-full overflow-hidden rounded-sm relative shadow-[0_0_100px_rgba(0,0,0,1)]">
                  <img
                    src={mainImg}
                    alt={product.name}
                    loading={idx === 0 ? "eager" : "lazy"}
                    className="w-full h-full object-cover filter brightness-90 contrast-110 transition-transform duration-[3s] group-hover:scale-105"
                  />

                  {/* Cinematic Vignette - Darkens edges to focus on center */}
                  <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.9)] pointer-events-none" />
                </div>

                {/* Subtle Magazine-style Overlay - Bottom Left */}
                <div className="absolute bottom-8 left-8 pointer-events-none z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                  <h4 className="font-serif text-sm sm:text-lg uppercase tracking-[0.2em] text-white font-light leading-tight">
                    {product.name}
                  </h4>
                  <div className="font-mono text-[10px] sm:text-xs text-white/80 tracking-widest mt-1">
                    ₹{product.price}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
