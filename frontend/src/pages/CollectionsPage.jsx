import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PRODUCTS as STATIC_PRODUCTS } from '../data/products.js';

const CHAPTERS = [
  { name: 'Rings', slug: 'Rings' },
  { name: 'Necklaces', slug: 'Necklaces' },
  { name: 'Bracelets', slug: 'Bracelets' },
  { name: 'Earrings', slug: 'Earrings' },
];

export default function CollectionsPage({ products: apiProducts }) {
  const allProducts = useMemo(() => {
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts.map(p => {
        const staticMatch = STATIC_PRODUCTS.find(sp => sp.slug === p.slug || sp.id === p.id);
        return {
          ...staticMatch,
          ...p,
          // Ensure we have a type, falling back to static data
          type: p.type || staticMatch?.type || (p.category?.includes('Ring') ? 'Rings' : p.category?.includes('Necklace') ? 'Necklaces' : p.category?.includes('Bracelet') ? 'Bracelets' : p.category?.includes('Earring') ? 'Earrings' : 'Rings'),
          images: p.images || staticMatch?.gallery || [{ src: p.image || staticMatch?.gallery?.[0]?.src }],
          gallery: staticMatch?.gallery || [{ src: p.image }],
        };
      });
    }
    return STATIC_PRODUCTS;
  }, [apiProducts]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#C0C0C0] selection:text-black">
      <header className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-20">
        <div className="space-y-6">
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#707070] font-mono block">
            The Archive
          </span>
          <h1 className="font-serif text-5xl md:text-8xl uppercase tracking-[0.1em] text-white font-light leading-tight">
            Collections
          </h1>
          <p className="text-xs md:text-sm text-[#505050] uppercase tracking-widest font-mono max-w-md leading-relaxed">
            A curated discovery of sculptural forms <br className="hidden md:block" />
            and celestial geometry.
          </p>
        </div>
      </header>

      <main className="pb-32">
        {CHAPTERS.map((chapter) => {
          const categoryProducts = allProducts.filter(p => {
            const pType = (p.type || '').toLowerCase();
            const pCat = (p.category || '').toLowerCase();
            const sSlug = chapter.slug.toLowerCase();
            return pType.includes(sSlug) || pCat.includes(sSlug);
          });

          if (categoryProducts.length === 0) return null;

          return (
            <section key={chapter.slug} className="py-12 md:py-24 border-t border-white/[0.03]">
              <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex items-baseline justify-between mb-12">
                  <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-widest text-white font-light">
                    {chapter.name}
                  </h2>
                  <span className="text-[10px] font-mono text-[#404040] uppercase tracking-widest">
                    {categoryProducts.length} Pieces
                  </span>
                </div>
                <div className="relative">
                  <div className="flex overflow-x-auto gap-6 md:gap-12 pb-12 snap-x snap-mandatory scrollbar-hide">
                    {categoryProducts.map((product, idx) => {
                      const imgUrl = product.images?.[0]?.src || product.gallery?.[0]?.src || product.image || '/assets/lunar_collection.jpg';
                      return (
                        <motion.div
                          key={product.id || product.slug}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: idx * 0.05 }}
                          className="shrink-0 w-[75vw] md:w-[350px] snap-start group"
                        >
                          <Link to={`/product/${product.slug}`} className="flex flex-col space-y-4">
                            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-950 rounded-sm">
                              <img src={imgUrl} alt={product.name} className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-1000 select-none" loading="lazy" />
                              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none" />
                            </div>
                            <div className="space-y-1 px-1">
                              <h3 className="font-serif text-base md:text-lg uppercase tracking-wider text-white group-hover:text-[#C0C0C0] transition-colors">
                                {product.name}
                              </h3>
                              <p className="font-mono text-xs text-[#666666] chrome-gradient-text">
                                ₹{product.price}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
