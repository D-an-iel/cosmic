import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PRODUCTS as STATIC_PRODUCTS } from '../data/products.js';
import ProductCard from '../components/common/ProductCard.jsx';

const CHAPTERS = [
  { name: 'All Rings', slug: 'Rings', key: 'ring' },
  { name: 'All Necklaces', slug: 'Necklaces', key: 'necklace' },
  { name: 'All Bracelets', slug: 'Bracelets', key: 'bracelet' },
  { name: 'All Earrings', slug: 'Earrings', key: 'earring' },
  { name: 'All Pendants', slug: 'Pendants', key: 'pendant' },
];

export default function CollectionsPage({ products: apiProducts }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedFilter = searchParams.get('category') || 'All';

  const setSelectedFilter = (category) => {
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
      const targetEl = document.getElementById(`chapter-${category.toLowerCase()}`);
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    }
  };

  const allProducts = useMemo(() => {
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts.map((p) => {
        const staticMatch = STATIC_PRODUCTS.find((sp) => sp.slug === p.slug || sp.id === p.id);
        return {
          ...staticMatch,
          ...p,
          type:
            p.type ||
            staticMatch?.type ||
            (p.category?.includes('Ring') || p.name?.includes('Ring')
              ? 'Rings'
              : p.category?.includes('Necklace') || p.name?.includes('Chain')
              ? 'Necklaces'
              : p.category?.includes('Bracelet') || p.name?.includes('Bracelet') || p.name?.includes('Cuff')
              ? 'Bracelets'
              : p.category?.includes('Earring') || p.name?.includes('Stud')
              ? 'Earrings'
              : p.category?.includes('Pendant') || p.name?.includes('Pendant') || p.name?.includes('Medallion')
              ? 'Pendants'
              : 'Rings'),
          images: p.images || staticMatch?.gallery || [{ src: p.image || staticMatch?.gallery?.[0]?.src }],
          gallery: staticMatch?.gallery || [{ src: p.image }],
        };
      });
    }
    return STATIC_PRODUCTS;
  }, [apiProducts]);

  const filterList = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Pendants'];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#C0C0C0] selection:text-black font-aileron">
      <header className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-12">
        <div className="space-y-6">
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#707070] font-mono block">
            The Permanent Archive
          </span>
          <h1 className="font-serif text-5xl md:text-8xl uppercase tracking-[0.1em] text-white font-light leading-tight">
            Collections
          </h1>
          <p className="text-xs md:text-sm text-[#808080] uppercase tracking-widest font-mono max-w-md leading-relaxed">
            All sculptural creations forged in solid 925 sterling silver and liquid rhodium.
          </p>

          {/* Quick Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-white/10">
            {filterList.map((item) => {
              const active = selectedFilter.toLowerCase() === item.toLowerCase();
              return (
                <button
                  key={item}
                  onClick={() => {
                    setSelectedFilter(item);
                    if (item === 'All') {
                      setSearchParams({});
                    } else {
                      setSearchParams({ category: item });
                    }
                  }}
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-mono transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                      : 'bg-white/5 text-[#A0A0A0] hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="pb-32">
        {CHAPTERS.map((chapter) => {
          if (
            selectedFilter !== 'All' &&
            selectedFilter.toLowerCase() !== chapter.slug.toLowerCase() &&
            !chapter.name.toLowerCase().includes(selectedFilter.toLowerCase())
          ) {
            return null;
          }

          const categoryProducts = allProducts.filter((p) => {
            const pType = (p.type || '').toLowerCase();
            const pCat = (p.category || '').toLowerCase();
            const pName = (p.name || '').toLowerCase();
            const key = chapter.key;
            return pType.includes(key) || pCat.includes(key) || pName.includes(key);
          });

          if (categoryProducts.length === 0) return null;

          return (
            <section
              key={chapter.slug}
              id={`chapter-${chapter.slug.toLowerCase()}`}
              className="py-12 md:py-20 border-t border-white/[0.06]"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex items-baseline justify-between mb-8 md:mb-12">
                  <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-widest text-white font-light">
                    {chapter.name}
                  </h2>
                  <span className="text-[10px] font-mono text-[#707070] uppercase tracking-widest">
                    {categoryProducts.length} Pieces
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                  {categoryProducts.map((product, idx) => (
                    <motion.div
                      key={product.id || product.slug}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.03 }}
                    >
                      <ProductCard
                        product={product}
                        aspectRatio="aspect-[4/5]"
                        className="w-full"
                      />
                    </motion.div>
                  ))}
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
