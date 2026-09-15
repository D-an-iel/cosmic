import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CinematicMobileHero from './CinematicMobileHero.jsx';
import CurvedProductCarousel from './CurvedProductCarousel.jsx';
import FloatingBuyNowDrawer from './FloatingBuyNowDrawer.jsx';
import CurvedRecommendationCarousel from './CurvedRecommendationCarousel.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { PRODUCTS as STATIC_PRODUCTS } from '../../data/products.js';
import { ArrowLeft, Sparkles, Heart, Eye } from 'lucide-react';

export default function CinematicExperiencePage() {
  const navigate = useNavigate();
  const { wishlistCount, isInWishlist, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [selectedQuickBuy, setSelectedQuickBuy] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [scrolled, setScrolled] = useState(false);

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
        console.warn('Using static products for cinematic experience');
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => {
        const cat = p.category?.toLowerCase() || '';
        return cat.includes(activeCategory.toLowerCase());
      });

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C0C0C0] selection:text-black antialiased relative pb-24">
      {/* 1. TOP EXPERIMENTAL COMPARISON BAR */}
      <div className="bg-[#0e0e0e] border-b border-white/10 px-4 py-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] z-50 relative font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-semibold">EXPERIMENTAL PREVIEW // CINEMATIC MODE</span>
        </div>
        <Link
          to="/"
          className="text-[#C0C0C0] hover:text-white underline underline-offset-4 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Exit to Classic Storefront</span>
        </Link>
      </div>

      {/* 2. MINIMAL SLIDING MOBILE HEADER */}
      <header
        className={`sticky top-0 z-40 bg-black/85 backdrop-blur-xl border-b border-white/10 transition-all duration-500 ${
          scrolled ? 'translate-y-0 opacity-100' : 'max-md:-translate-y-full max-md:opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="text-xs uppercase tracking-[0.25em] text-[#808080] hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Classic</span>
          </Link>

          <Link to="/cinematic" className="flex flex-col items-center">
            <span className="font-serif text-lg tracking-[0.25em] font-light chrome-gradient-text">
              COSMIC
            </span>
            <span className="text-[8px] tracking-[0.3em] text-[#606060] -mt-1 font-mono">
              CINEMATIC
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/wishlist"
              className="relative p-1.5 text-[#C0C0C0] hover:text-white transition-colors"
              title="Private Vault"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* 3. CINEMATIC MOBILE HERO */}
      <CinematicMobileHero
        onExplore={() => {
          const el = document.getElementById('curved-spatial-orbit');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. CURVED 3D CAROUSEL SECTION */}
      <section id="curved-spatial-orbit" className="py-16 px-4 max-w-6xl mx-auto w-full border-b border-white/5">
        <div className="text-center mb-6 space-y-2">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C0C0C0] font-mono block">
            SPATIAL 3D ORBIT
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif uppercase tracking-wider text-white font-light">
            Curved Architecture
          </h2>
          <p className="text-xs text-[#808080] font-light max-w-sm mx-auto">
            Physical inertia motion with depth perspective scaling. Tap Instant Buy for in-place 75vh checkout.
          </p>
          <div className="w-12 h-px bg-[#C0C0C0] mx-auto mt-4" />
        </div>

        <CurvedProductCarousel
          products={filteredProducts}
          onQuickBuy={(p) => {
            setSelectedQuickBuy(p);
            setIsDrawerOpen(true);
          }}
        />
      </section>

      {/* 5. EDITORIAL SELECTION GALLERY (Links to 4-Screen Vertical Snap View) */}
      <section className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#707070] font-mono block">
              EDITORIAL DOSSIER
            </span>
            <h3 className="font-serif text-2xl uppercase tracking-wider text-white">
              Creations In The Atelier
            </h3>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2">
            {['All', 'Rings', 'Necklaces', 'Bracelets'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-white/15 text-[#888888] hover:border-white/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const inW = isInWishlist(p.id);
            const img = p.images?.[0]?.src || p.gallery?.[0]?.src || p.image || '/assets/lunar_collection.jpg';

            return (
              <div
                key={p.id}
                className="group relative bg-[#070707] border border-white/10 hover:border-white/30 rounded-sm p-4 flex flex-col justify-between transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] uppercase tracking-widest text-[#707070] font-mono">
                    {p.category || 'Maison Piece'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(p)}
                    className="p-1.5 rounded-full bg-black/60 border border-white/10 hover:border-white/30 text-white transition-colors cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${inW ? 'fill-red-500 text-red-500' : 'text-[#A0A0A0]'}`} />
                  </button>
                </div>

                <div
                  onClick={() => navigate(`/cinematic/product/${p.slug}`)}
                  className="aspect-square relative overflow-hidden bg-black mb-4 rounded-sm cursor-pointer"
                >
                  <img
                    src={img}
                    alt={p.name}
                    className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 rounded-full bg-white text-black text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-lg">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Cinematic 4-Snap View</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <h4
                      onClick={() => navigate(`/cinematic/product/${p.slug}`)}
                      className="font-serif text-base text-white hover:text-[#C0C0C0] transition-colors cursor-pointer truncate"
                    >
                      {p.name}
                    </h4>
                    <span className="font-mono text-sm text-[#C0C0C0] font-medium shrink-0 ml-2">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/cinematic/product/${p.slug}`)}
                      className="flex-1 py-2.5 border border-white/20 hover:border-white text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white rounded-sm transition-all cursor-pointer"
                    >
                      Snap Story →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedQuickBuy(p);
                        setIsDrawerOpen(true);
                      }}
                      className="px-4 py-2.5 chrome-button text-[10px] uppercase tracking-[0.2em] font-bold text-black rounded-sm cursor-pointer shadow-[0_0_15px_rgba(192,192,192,0.3)] transition-all"
                    >
                      Instant Buy
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. SIDE-BY-SIDE COMPARISON RETURN PILL */}
      <div className="fixed bottom-6 left-6 z-40">
        <Link
          to="/"
          className="px-4 py-2.5 rounded-full bg-black/90 hover:bg-black border border-white/30 hover:border-white/60 text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white backdrop-blur-xl transition-all shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex items-center gap-2 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-white" />
          <span>Compare: Return to Classic Cosmic Storefront</span>
        </Link>
      </div>

      {/* 7. IN-PLACE 75vh FLOATING GLASS BUY NOW DRAWER */}
      <FloatingBuyNowDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={selectedQuickBuy}
      />
    </div>
  );
}
