import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import lunarImg from '../../assets/lunar_collection.jpg';
import eclipseImg from '../../assets/eclipse_collection.jpg';
import novaImg from '../../assets/nova_collection.jpg';
import masterImg from '../../assets/cosmic_campaign_master.jpg';

const CATEGORIES = [
  {
    name: 'Rings',
    slug: 'rings',
    image: lunarImg,
    layout: 'dominant', // Large, focal piece
    span: 'md:col-span-2 md:row-span-2'
  },
  {
    name: 'Necklaces',
    slug: 'necklaces',
    image: eclipseImg,
    layout: 'tall', // Vertical emphasis
    span: 'md:col-span-1 md:row-span-2'
  },
  {
    name: 'Bracelets',
    slug: 'bracelets',
    image: novaImg,
    layout: 'supporting', // Small detail piece
    span: 'md:col-span-1 md:row-span-1'
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    image: masterImg,
    layout: 'wide', // Horizontal emphasis
    span: 'md:col-span-1 md:row-span-1'
  },
];

export default function CollectionsPreview() {
  return (
    <section id="collections-preview" className="relative w-full py-32 bg-black overflow-hidden border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#707070] font-mono block">
                THE ARCHITECTURAL PORTFOLIO
              </span>
              <h2 className="font-serif text-4xl md:text-6xl uppercase tracking-[0.1em] text-white font-light leading-tight">
                Explore the <br /> Maison Archive
              </h2>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden md:block text-right"
          >
            <p className="text-xs text-[#505050] uppercase tracking-widest font-mono max-w-xs leading-relaxed">
              A curated selection of sculptural forms <br />
              defined by precision and light.
            </p>
          </motion.div>
        </div>

        {/* ASYMMETRIC EDITORIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className={`group relative overflow-hidden rounded-sm cursor-pointer ${cat.span}`}
            >
              <Link to="/collections" className="block w-full h-full relative">
                {/* Category Image - different scaling based on layout */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className={`w-full h-full object-cover transition-transform duration-1000 grayscale group-hover:grayscale-0
                    ${cat.layout === 'dominant' ? 'group-hover:scale-105' : 'group-hover:scale-110'}`}
                />

                {/* Cinematic Overlay - deeper for dominant pieces */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent
                  ${cat.layout === 'dominant' ? 'opacity-90' : 'opacity-70'} group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Text Content - varying typography based on layout */}
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end items-start space-y-3">
                  <span className={`text-[9px] uppercase tracking-[0.3em] text-white/60 font-mono transition-all duration-500
                    ${cat.layout === 'dominant' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}`}>
                    Collection {idx + 1}
                  </span>
                  <h3 className={`font-serif uppercase tracking-widest text-white transition-all duration-500
                    ${cat.layout === 'dominant' ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>
                    {cat.name}
                  </h3>
                  <div className={`h-px bg-white/40 transition-all duration-700
                    ${cat.layout === 'dominant' ? 'w-24' : 'w-0 group-hover:w-full'}`}
                  />
                  <span className={`text-[10px] uppercase tracking-[0.2em] text-white/80 font-medium transition-all duration-500 delay-100
                    ${cat.layout === 'dominant' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    Explore the Collection →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
