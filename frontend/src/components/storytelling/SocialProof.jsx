import React from 'react';
import { motion } from 'framer-motion';

const PRESS = [
  { name: 'VOGUE', link: '#' },
  { name: 'HYPEBEAST', link: '#' },
  { name: 'GQ', link: '#' },
  { name: 'Bazaar', link: '#' },
  { name: 'Architectural Digest', link: '#' },
];

export default function SocialProof() {
  return (
    <section className="relative w-full py-32 bg-black overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="flex flex-col items-center justify-center text-center space-y-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="space-y-4"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#505050] font-mono block">
              EDITORIAL RECOGNITION
            </span>
            <h2 className="text-xs uppercase tracking-[0.3em] text-white/30 font-light">
              Featured In
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 opacity-40 grayscale">
            {PRESS.map((press, idx) => (
              <motion.a
                key={idx}
                href={press.link}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="text-lg md:text-2xl font-serif uppercase tracking-[0.2em] text-white hover:text-white/100 transition-all duration-500 cursor-pointer"
              >
                {press.name}
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-2xl text-center space-y-6 pt-12 border-t border-white/5"
          >
            <p className="text-sm italic text-[#808080] font-light leading-relaxed tracking-wide">
              "Cosmic has redefined the intersection of industrial design and high jewelry.
              A masterclass in restraint and precision."
            </p>
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
              — L'Officiel Mode
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
