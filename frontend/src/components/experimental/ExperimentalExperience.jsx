import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SmoothScrollProvider from './SmoothScrollProvider.jsx';
import ExperimentalNav from './ExperimentalNav.jsx';
import ThreeJewelryHero from './ThreeJewelryHero.jsx';
import Spatial3DCollection from './Spatial3DCollection.jsx';
import { PRODUCTS as STATIC_PRODUCTS } from '../../data/products.js';
import { ArrowLeft } from 'lucide-react';

export default function ExperimentalExperience() {
  const [products, setProducts] = useState(STATIC_PRODUCTS);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const resp = await fetch('http://localhost:4000/api/products');
        const data = await resp.json();
        if (data.success && data.data?.length > 0) {
          setProducts(data.data);
        }
      } catch (e) {
        console.warn('Using static products for experimental showcase');
      }
    };
    fetchProducts();
  }, []);

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-black text-white selection:bg-[#C0C0C0] selection:text-black antialiased relative">
        {/* 1. MINIMAL GLASS NAVIGATION */}
        <ExperimentalNav />

        {/* 2. THREE.JS 3D HERO PRESENTATION */}
        <ThreeJewelryHero />

        {/* 3. SPATIAL 3D CAROUSEL COLLECTION */}
        <Spatial3DCollection products={products} />

        {/* 4. FOOTER CREDITS & ATELIER PHILOSOPHY */}
        <footer className="py-20 px-6 border-t border-white/10 bg-[#040404] text-center space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#707070] font-mono block">
              COSMIC EXPERIMENTAL ATELIER
            </span>
            <h3 className="font-serif text-2xl uppercase tracking-wider text-white font-light">
              Sculpting The Celestial Cosmos
            </h3>
            <p className="text-xs text-[#808080] font-light max-w-sm mx-auto leading-relaxed">
              Solid 925 sterling silver engineered with liquid rhodium finishes. Forged in our Milanese atelier for the modern icon.
            </p>
          </div>

          <div className="text-[10px] uppercase tracking-[0.25em] text-[#505050] pt-4">
            Milan • Paris • New York • Tokyo • Mumbai
          </div>
        </footer>

        {/* 5. SIDE-BY-SIDE FLOATING COMPARISON SWITCHER */}
        <div className="fixed bottom-6 left-6 z-40">
          <Link
            to="/"
            className="px-4 py-2.5 rounded-full bg-black/90 hover:bg-black border border-white/30 hover:border-white/60 text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white backdrop-blur-2xl transition-all shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex items-center gap-2 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-white" />
            <span>Compare: Return to Classic Storefront</span>
          </Link>
        </div>
      </div>
    </SmoothScrollProvider>
  );
}
