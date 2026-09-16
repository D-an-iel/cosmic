import React from 'react';
import { motion } from 'framer-motion';
import campaignImg from '../../assets/cosmic_campaign_master.jpg';

export default function BrandStory() {
  return (
    <section id="maison" className="relative w-full py-32 bg-black overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Editorial Visual */}
          <div className="lg:col-span-7 relative group">
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="relative aspect-[4/5] overflow-hidden rounded-sm border border-white/10 shadow-2xl"
            >
              <img
                src={campaignImg}
                alt="The Maison Cosmic Atelier"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </motion.div>
            {/* Architectural Frame Accent */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-white/20 pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-white/20 pointer-events-none" />
          </div>

          {/* Right Column: Storytelling Typography */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#707070] font-mono block">
                THE PHILOSOPHY
              </span>
              <h2 className="text-4xl md:text-6xl font-serif uppercase tracking-tight text-white leading-[1.1]">
                Engineering <br />
                <span className="italic text-white/60">The Eternal</span>
              </h2>
              <div className="w-16 h-px bg-white/30" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              <p className="text-lg text-[#A0A0A0] font-light leading-relaxed tracking-wide italic">
                "Cosmic is not merely jewelry; it is an architectural exploration of form, light, and shadow."
              </p>
              <div className="space-y-6 text-sm text-[#808080] font-light leading-relaxed tracking-wide">
                <p>
                  We combine the brutalist purity of solid 925 sterling silver with
                  liquid rhodium finishes to create pieces that transcend temporal trends.
                </p>
                <p>
                  Each piece is individually hand-finished in our Milanese atelier,
                  ensuring that the geometry of the cosmos is captured in every
                  bevel and curve.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="pt-8">
                <a
                  href="/collections"
                  className="text-xs uppercase font-mono tracking-[0.3em] text-white border-b border-white/20 pb-2 hover:border-white transition-all inline-block group"
                >
                  Explore The Atelier Archive
                  <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
