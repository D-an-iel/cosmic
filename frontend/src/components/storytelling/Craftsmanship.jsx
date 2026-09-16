import React from 'react';
import { motion } from 'framer-motion';
import macroImg from '../../assets/lunar_ring_macro.jpg';
import packagingImg from '../../assets/lunar_ring_packaging.jpg';

const FEATURES = [
  {
    title: '925 Sterling Silver',
    description: 'Sourced from the highest purity ore, our silver is forged for eternal resilience and a mirror-like luster.',
    image: macroImg,
    position: 'left'
  },
  {
    title: 'Hand Finished Details',
    description: 'Every bevel, every curve, and every edge is meticulously polished by hand in our Milanese atelier.',
    image: packagingImg,
    position: 'right'
  },
  {
    title: 'Contemporary Design',
    description: 'Where brutalist architecture meets celestial inspiration. Forged for the modern icon.',
    image: macroImg, // Reuse for demo, would be different in real world
    position: 'left'
  },
  {
    title: 'Liquid Rhodium Dip',
    description: 'A proprietary finishing process that grants a deep, chrome-like brilliance and unparalleled scratch resistance.',
    image: packagingImg, // Reuse for demo
    position: 'right'
  },
];

export default function Craftsmanship() {
  return (
    <section className="relative w-full py-32 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="text-center mb-32 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#707070] font-mono block">
              THE ART OF FORGING
            </span>
            <h2 className="font-serif text-4xl md:text-6xl uppercase tracking-[0.1em] text-white font-light">
              Uncompromising Craft
            </h2>
          </motion.div>
        </div>

        <div className="space-y-40">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`flex flex-col ${feature.position === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 lg:gap-24 items-center`}
            >
              <div className="w-full md:w-1/2 relative group">
                <div className="relative aspect-video overflow-hidden rounded-sm border border-white/10 shadow-2xl">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
                </div>
                {/* Floating Detail Label */}
                <div className="absolute -bottom-6 -left-6 bg-black border border-white/20 px-4 py-2 z-10">
                  <span className="text-[9px] uppercase tracking-widest text-white/60 font-mono">
                    Detail {idx + 1}
                  </span>
                </div>
              </div>

              <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                <h3 className="text-2xl md:text-4xl font-serif uppercase tracking-widest text-white">
                  {feature.title}
                </h3>
                <div className={`h-px w-12 bg-white/30 mx-auto ${feature.position === 'right' ? 'md:ml-auto' : 'md:mr-auto'}`} />
                <p className="text-sm md:text-base text-[#A0A0A0] font-light leading-relaxed tracking-wide max-w-md mx-auto md:mx-0">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
