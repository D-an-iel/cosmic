import React, { useState, useEffect } from 'react';
import heroEditorial from './assets/hero_editorial.jpg';
import lunarImg from './assets/lunar_collection.jpg';
import novaImg from './assets/nova_collection.jpg';
import eclipseImg from './assets/eclipse_collection.jpg';
import halftoneHeart from './assets/halftone_heart.jpg';
import halftoneHand from './assets/halftone_hand.jpg';
import { PunkStar, SketchyHeart, BarbedWireLine, DoodleArrow, GothicCross } from './components/GothicDoodles.jsx';

// Gothic Dark Halftone Catalog Data
const CATALOG = {
  products: [
    {
      id: 1,
      name: "The Barbed Solstice Ring",
      series: "Thorn & Barb",
      category: "Rings",
      price: 340,
      material: "Solid 925 Silver • Heavy Weight",
      tag: "ARCHIVE 01",
      image: lunarImg,
      description: "Heavy solid 925 sterling silver band sculpted with aggressive thorn bevels and hand-polished mirror chrome planar flats."
    },
    {
      id: 2,
      name: "Anatomical Heart Relic Pendant",
      series: "Anatomical Relics",
      category: "Chokers",
      price: 480,
      material: "Cast Sterling Silver • Barbed Chain",
      tag: "FEATURED RELIC",
      image: halftoneHeart,
      description: "Hyper-detailed anatomical heart wrapped in cast miniature barbed wire. Suspended from an oxidised 18-inch box chain."
    },
    {
      id: 3,
      name: "Liquid Chrome Orbital Hoops",
      series: "Cyber-Astral",
      category: "Earrings",
      price: 290,
      material: "Liquid Rhodium • Black Moissanite",
      tag: "LIMITED RUN",
      image: novaImg,
      description: "Molten planetary concentric hoops dipped in liquid rhodium and studded with lab-grown obsidian black moissanite."
    },
    {
      id: 4,
      name: "Sculptural Skull Signet",
      series: "Thorn & Barb",
      category: "Rings",
      price: 360,
      material: "Solid 925 Silver • Hand Buffed",
      tag: "BEST SELLER",
      image: halftoneHand,
      description: "Cast-metal brutalist skull signet ring with hand-engraved cross emblems on flanking shoulders. Milanese atelier hallmark."
    },
    {
      id: 5,
      name: "Barbed Wire Collar Choker",
      series: "Thorn & Barb",
      category: "Chokers",
      price: 640,
      material: "Pure Argentium Silver • Barbed Links",
      tag: "HAUTE RELIC",
      image: eclipseImg,
      description: "High-fashion statement collar articulated with interlocking barbed wire segments. Rests flush against the neck with industrial clasp."
    },
    {
      id: 6,
      name: "Astral Spike Ear Cuffs",
      series: "Cyber-Astral",
      category: "Earrings",
      price: 310,
      material: "Liquid Rhodium • Bespoke Spikes",
      tag: "NEW DROP",
      image: novaImg,
      description: "Double ear cuffs with sculpted celestial star constellations and sharp liquid-chrome drip spikes. No piercing required."
    }
  ],
  collections: [
    {
      id: "thorn",
      name: "Thorn & Barb Series",
      subtitle: "Sculptural Barbed Cuffs & Heavy Rings",
      tag: "COLLECTION 01",
      image: lunarImg,
      description: "Industrial sharp geometry cast in solid sterling silver, blending dark punk attitude with haute joaillerie precision."
    },
    {
      id: "heart",
      name: "Anatomical Relics",
      subtitle: "Cast Silver Organs & Sacred Daggers",
      tag: "COLLECTION 02",
      image: halftoneHeart,
      description: "Visceral anatomical heart amulets and sacred talismans carved from wax and poured in recycled sterling silver."
    },
    {
      id: "cyber",
      name: "Cyber-Astral Series",
      subtitle: "Liquid Chrome Spikes & Moon Hoops",
      tag: "COLLECTION 03",
      image: eclipseImg,
      description: "Fluid dripping metals, futuristic spikes, and starburst ear attachments reflecting mirror-chrome under flash."
    }
  ],
  categories: [
    { name: "Rings", count: "18 Relics", image: lunarImg },
    { name: "Chokers", count: "14 Relics", image: halftoneHeart },
    { name: "Earrings", count: "12 Relics", image: novaImg },
    { name: "Haute Relics", count: "8 Pieces", image: halftoneHand }
  ]
};

export default function App() {
  // State
  const [loading, setLoading] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([
    {
      id: 2,
      name: "Anatomical Heart Relic Pendant",
      price: 480,
      quantity: 1,
      material: "Cast Sterling Silver",
      image: halftoneHeart
    }
  ]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Loading Screen Timer
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    const removeTimer = setTimeout(() => {
      setLoaderVisible(false);
    }, 2400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3200);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          material: product.material,
          image: product.image
        }
      ];
    });
    showToast(`Added "${product.name}" to bag`);
    setCartOpen(true);
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = activeCategory === "All"
    ? CATALOG.products
    : CATALOG.products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF1E44] selection:text-white antialiased relative overflow-x-hidden">
      
      {/* 1. GOTHIC HALFTONE LOADING SCREEN */}
      {loaderVisible && (
        <div
          className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center transition-opacity duration-700 pointer-events-none bg-halftone-dense ${
            loading ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Subtle Halftone Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,30,68,0.12)_0%,transparent_70%)]" />

          <div className="relative z-10 text-center px-6 flex flex-col items-center">
            {/* Top Doodle Spark */}
            <div className="flex items-center gap-3 mb-4 animate-crimson-pulse">
              <PunkStar className="w-8 h-8 text-[#FF1E44]" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-[#FF1E44] font-mono">
                GOTHIC ARTIFACTS
              </span>
              <PunkStar className="w-8 h-8 text-[#FF1E44]" />
            </div>

            <h1 className="text-5xl md:text-8xl font-serif font-light tracking-[0.35em] uppercase chrome-gradient-text animate-luxury-scale drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]">
              COSMIC
            </h1>

            {/* Barbed Wire Divider in Loader */}
            <div className="w-64 my-6 opacity-80">
              <BarbedWireLine className="w-full text-[#C0C0C0]" />
            </div>

            <p className="text-xs uppercase tracking-[0.35em] text-[#A0A0A0] font-light">
              Milan • Paris • Tokyo • London
            </p>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A0A0A] border-2 border-[#FF1E44] px-5 py-3 shadow-[0_0_30px_rgba(255,30,68,0.4)] flex items-center gap-3 animate-fade-in text-xs uppercase tracking-widest text-white">
          <PunkStar className="w-4 h-4 text-[#FF1E44] animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. TOP GOTHIC ANNOUNCEMENT BAR */}
      <div className="bg-[#050505] border-b border-[#222222] py-2.5 px-4 text-[11px] uppercase tracking-[0.25em] text-center text-[#B0B0B0] flex items-center justify-center gap-4 relative overflow-hidden bg-halftone">
        <span className="flex items-center gap-2">
          <GothicCross className="w-3.5 h-3.5 text-[#FF1E44]" />
          <span>Complimentary Worldwide Courier on Orders Over $500</span>
        </span>
        <span className="hidden md:inline text-[#FF1E44] font-bold">✦</span>
        <span className="hidden md:inline">Solid 925 Sterling Silver & Liquid Rhodium</span>
        <span className="hidden lg:inline text-[#FF1E44] font-bold">✦</span>
        <span className="hidden lg:inline">Handcrafted In Milanese Ateliers</span>
      </div>

      {/* 3. STICKY NEO-GOTHIC NAVBAR */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/15 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-[#FF1E44] transition-colors p-2 -ml-2"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>

          {/* Left Nav */}
          <nav className="hidden md:flex items-center space-x-10 text-xs uppercase tracking-[0.25em] font-medium text-[#D0D0D0]">
            <a href="#collections" className="hover:text-white transition-colors relative py-1 group flex items-center gap-1.5">
              <span>Artifacts</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E44] opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="#shop" className="hover:text-white transition-colors relative py-1 group flex items-center gap-1.5">
              <span>Relics</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E44] opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a href="#manifesto" className="hover:text-white transition-colors relative py-1 group flex items-center gap-1.5">
              <span>The Atelier</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E44] opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </nav>

          {/* Center Brand Logo with Red Star Doodle */}
          <a href="#" className="flex items-center gap-3 group cursor-pointer text-center">
            <PunkStar className="w-6 h-6 text-[#FF1E44] group-hover:rotate-45 transition-transform duration-300" />
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl md:text-3xl tracking-[0.32em] font-normal uppercase chrome-gradient-text group-hover:text-white transition-colors">
                COSMIC
              </span>
              <span className="text-[8px] uppercase tracking-[0.45em] text-[#FF1E44] font-mono -mt-1">
                GOTHIC JOAILLERIE
              </span>
            </div>
            <PunkStar className="w-6 h-6 text-[#FF1E44] group-hover:-rotate-45 transition-transform duration-300" />
          </a>

          {/* Right Nav / Bag */}
          <div className="flex items-center space-x-6 text-xs uppercase tracking-[0.2em]">
            <a href="#shop" className="hidden lg:inline text-[#A0A0A0] hover:text-[#FF1E44] transition-colors">
              Archive
            </a>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 bg-[#111111] border border-white/20 hover:border-[#FF1E44] transition-all flex items-center gap-2 group cursor-pointer"
              aria-label="Shopping Bag"
            >
              <span className="text-xs uppercase tracking-widest hidden sm:inline text-[#C0C0C0] group-hover:text-white">
                Bag
              </span>
              <div className="relative">
                <svg className="w-5 h-5 text-white group-hover:text-[#FF1E44] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF1E44] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,30,68,0.8)]">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#070707] border-b border-[#FF1E44]/40 px-6 py-8 space-y-6 bg-halftone">
            <nav className="flex flex-col space-y-4 text-sm uppercase tracking-[0.25em]">
              <a href="#collections" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#FF1E44] py-2 border-b border-white/10 flex items-center justify-between">
                <span>Collections</span>
                <DoodleArrow className="w-5 h-5 text-[#FF1E44]" />
              </a>
              <a href="#shop" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#FF1E44] py-2 border-b border-white/10 flex items-center justify-between">
                <span>All Relics</span>
                <DoodleArrow className="w-5 h-5 text-[#FF1E44]" />
              </a>
              <a href="#manifesto" onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-[#FF1E44] py-2 border-b border-white/10 flex items-center justify-between">
                <span>The Atelier Manifesto</span>
                <DoodleArrow className="w-5 h-5 text-[#FF1E44]" />
              </a>
            </nav>
            <div className="pt-2 text-xs tracking-widest text-[#888888] uppercase font-mono">
              Milanese Craft • Pure 925 Solid Silver
            </div>
          </div>
        )}
      </header>

      {/* 4. HERO SECTION (HALFTONE COLLAGE WITH GOTHIC DOODLES) */}
      <section className="relative min-h-[85vh] max-h-[880px] flex items-center justify-center overflow-hidden border-b border-white/15 bg-black">
        
        {/* Background Editorial Image with Halftone Dot Matrix Texture */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroEditorial}
            alt="COSMIC Haute Joaillerie editorial campaign"
            className="w-full h-full object-cover object-center filter contrast-125 brightness-90 opacity-60"
          />
          {/* Halftone Pattern Screen Grid */}
          <div className="absolute inset-0 bg-halftone opacity-80" />
          {/* Dark Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.9)_100%)]" />
        </div>

        {/* FLOATING HALFTONE COLLAGE CUTOUT STICKERS (Matching Figma Reference) */}
        
        {/* Cutout 1: Barbed Anatomical Heart (Top Right) */}
        <div className="hidden lg:block absolute top-16 right-12 z-20 w-44 xl:w-52 transform rotate-6 animate-doodle-float pointer-events-none">
          <div className="relative p-1 bg-white shadow-[0_0_25px_rgba(0,0,0,0.9)]">
            <img
              src={halftoneHeart}
              alt="Anatomical Barbed Heart Cutout"
              className="w-full h-auto object-cover contrast-125"
            />
            <div className="absolute -top-3 -right-3">
              <PunkStar className="w-10 h-10 text-[#FF1E44] animate-spin" />
            </div>
            <div className="bg-black text-[9px] font-mono tracking-widest uppercase py-1 text-center text-white border-t border-white/20">
              RELIC NO. 02
            </div>
          </div>
        </div>

        {/* Cutout 2: Gothic Reaching Hand with Rings (Bottom Left) */}
        <div className="hidden lg:block absolute bottom-12 left-10 z-20 w-40 xl:w-48 transform -rotate-6 animate-doodle-float pointer-events-none" style={{ animationDelay: "1.5s" }}>
          <div className="relative p-1 bg-white shadow-[0_0_25px_rgba(0,0,0,0.9)]">
            <img
              src={halftoneHand}
              alt="Gothic Skull Hand Cutout"
              className="w-full h-auto object-cover contrast-125"
            />
            <div className="absolute -bottom-3 -left-3">
              <SketchyHeart className="w-10 h-10 text-[#FF1E44]" />
            </div>
            <div className="bg-black text-[9px] font-mono tracking-widest uppercase py-1 text-center text-white border-t border-white/20">
              SOLID 925 SILVER
            </div>
          </div>
        </div>

        {/* FLOATING NEON CRIMSON DOODLES (Matching Figma Reference) */}
        <div className="absolute top-24 left-1/4 z-20 hidden md:block pointer-events-none">
          <PunkStar className="w-14 h-14 text-[#FF1E44] transform -rotate-12 animate-crimson-pulse" />
        </div>
        <div className="absolute top-1/3 right-1/4 z-20 hidden md:block pointer-events-none">
          <SketchyHeart className="w-16 h-16 text-[#FF1E44] transform rotate-12" />
        </div>
        <div className="absolute bottom-28 right-1/3 z-20 hidden md:block pointer-events-none">
          <PunkStar className="w-12 h-12 text-[#FF1E44] transform rotate-45" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center py-16">
          
          {/* Gothic Edition Tag */}
          <div className="inline-flex items-center gap-3 px-5 py-2 border-2 border-[#FF1E44] bg-black/70 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(255,30,68,0.4)]">
            <PunkStar className="w-4 h-4 text-[#FF1E44]" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-white font-mono font-semibold">
              GOTHIC ARTIFACTS • HALTONE NO. 04
            </span>
            <PunkStar className="w-4 h-4 text-[#FF1E44]" />
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-light uppercase tracking-[0.16em] leading-tight mb-6 chrome-gradient-text drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)]">
            Wear The Universe
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[#D0D0D0] font-light tracking-wide leading-relaxed mb-10">
            Raw celestial energy forged in solid 925 sterling silver, liquid rhodium barbs, and dark anatomical relics.
          </p>

          {/* DUAL ACTION BUTTONS (Chrome & Crimson) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 relative">
            <a
              href="#collections"
              className="w-full sm:w-auto px-10 py-4 chrome-button text-xs uppercase tracking-[0.3em] font-semibold text-center border border-white"
            >
              Explore Relics
            </a>
            <a
              href="#shop"
              className="w-full sm:w-auto px-10 py-4 crimson-button text-xs uppercase tracking-[0.3em] font-semibold flex items-center justify-center gap-3 group"
            >
              <span>New Drops</span>
              <DoodleArrow direction="right" className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Barbed Wire Accent Strand */}
          <div className="mt-14 max-w-xl mx-auto opacity-70">
            <BarbedWireLine className="w-full text-[#C0C0C0]" />
          </div>

          {/* Atelier Specs */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-left border-t border-white/10 pt-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#FF1E44] block font-mono">01 // Material</span>
              <span className="text-xs uppercase tracking-wider text-white font-medium">925 Solid Silver</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#FF1E44] block font-mono">02 // Finish</span>
              <span className="text-xs uppercase tracking-wider text-white font-medium">Liquid Rhodium</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#FF1E44] block font-mono">03 // Origin</span>
              <span className="text-xs uppercase tracking-wider text-white font-medium">Milanese Handcraft</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#FF1E44] block font-mono">04 // Guarantee</span>
              <span className="text-xs uppercase tracking-wider text-white font-medium">Lifetime Archival</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED COLLECTIONS ("THE GOTHIC RELICS") */}
      <section id="collections" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/15 relative">
        
        {/* Background Halftone Texture */}
        <div className="absolute inset-0 bg-halftone opacity-40 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-[#FF1E44] mb-2 font-mono text-xs uppercase tracking-[0.3em]">
              <PunkStar className="w-4 h-4 text-[#FF1E44]" />
              <span>Archival Series</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.18em] text-white">
              The Gothic Artifacts
            </h2>
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0] mt-4 md:mt-0 max-w-xs leading-relaxed font-mono">
            Three conceptual collections sculpted around thorns, anatomical organs, and astral chrome.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {CATALOG.collections.map((col, idx) => (
            <div
              key={col.id}
              className="group border-2 border-white/15 bg-[#080808] hover:border-[#FF1E44] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Halftone Image Frame */}
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-110"
                />
                <div className="absolute inset-0 bg-halftone opacity-60 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                
                {/* Red Doodle Sticker Tag */}
                <div className="absolute top-4 left-4 bg-black border border-[#FF1E44] text-[#FF1E44] px-3 py-1 text-[10px] font-mono tracking-widest uppercase shadow-[0_0_12px_rgba(255,30,68,0.4)]">
                  {col.tag}
                </div>

                {/* Floating mini star on hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PunkStar className="w-8 h-8 text-[#FF1E44] animate-spin" />
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 flex-1 flex flex-col justify-between border-t border-white/10 bg-black">
                <div>
                  <h3 className="font-serif text-2xl tracking-[0.15em] uppercase text-white mb-2 group-hover:text-[#FF1E44] transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-[#999999] leading-relaxed font-light mb-6">
                    {col.description}
                  </p>
                </div>
                <a
                  href="#shop"
                  onClick={() => setActiveCategory(idx === 0 ? "Rings" : idx === 1 ? "Chokers" : "Earrings")}
                  className="text-xs uppercase tracking-[0.25em] text-white flex items-center justify-between border-t border-white/10 pt-4 group-hover:text-[#FF1E44] transition-colors"
                >
                  <span>Explore Series</span>
                  <DoodleArrow direction="right" className="w-5 h-5 text-[#FF1E44]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CATEGORIES (HALFTONE CARDS) */}
      <section id="categories" className="py-20 px-6 max-w-7xl mx-auto border-b border-white/15">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#FF1E44] font-mono block mb-2">
            Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-[0.2em] text-white">
            Sculpted Relics
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CATALOG.categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (cat.name !== "Haute Relics") {
                  setActiveCategory(cat.name);
                }
                const el = document.getElementById("shop");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group cursor-pointer border border-white/20 hover:border-[#FF1E44] transition-all bg-[#080808] relative overflow-hidden"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-115"
                />
                <div className="absolute inset-0 bg-halftone opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-lg md:text-xl tracking-[0.15em] uppercase text-white group-hover:text-[#FF1E44] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] font-mono">
                    {cat.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FEATURED PRODUCTS & NEW DROPS */}
      <section id="shop" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/15 relative">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#FF1E44] mb-2 font-mono text-xs uppercase tracking-[0.3em]">
              <SketchyHeart className="w-4 h-4 text-[#FF1E44]" />
              <span>Current Archive</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.2em] text-white">
              Gothic Relics Catalog
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {["All", "Rings", "Chokers", "Earrings"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 text-xs uppercase tracking-[0.25em] transition-all cursor-pointer font-mono ${
                  activeCategory === cat
                    ? "bg-[#FF1E44] text-white font-bold shadow-[0_0_15px_rgba(255,30,68,0.6)]"
                    : "border border-white/20 text-[#C0C0C0] hover:text-white hover:border-[#FF1E44]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group border border-white/20 bg-[#080808] hover:border-[#FF1E44] transition-all flex flex-col justify-between relative"
            >
              {/* Halftone image frame */}
              <div className="relative aspect-square overflow-hidden bg-neutral-950">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-110"
                />
                <div className="absolute inset-0 bg-halftone opacity-50 pointer-events-none" />

                {/* Tag Sticker */}
                <div className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] bg-black border border-[#FF1E44] text-[#FF1E44] px-2.5 py-1 font-mono font-bold shadow-[0_0_10px_rgba(255,30,68,0.5)]">
                  {product.tag}
                </div>

                {/* Quick Action Overlay (Desktop) */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="px-4 py-2.5 bg-black border border-white text-white text-xs uppercase tracking-widest hover:border-[#FF1E44] hover:text-[#FF1E44] transition-colors"
                  >
                    Quick View
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-4 py-2.5 crimson-button text-xs uppercase tracking-widest font-semibold"
                  >
                    Add To Bag
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between border-t border-white/10">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#FF1E44] font-mono mb-1">
                    {product.series}
                  </div>
                  <h3 className="font-serif text-xl tracking-[0.1em] text-white uppercase mb-2 group-hover:text-[#FF1E44] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#A0A0A0] tracking-wide mb-4 font-light">
                    {product.material}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-sm tracking-wider text-white font-bold">
                    ${product.price}.00
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="md:hidden text-xs uppercase tracking-[0.2em] text-[#FF1E44] hover:text-white"
                  >
                    + Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. THE ATELIER MANIFESTO (ZINE / COLLAGE SECTION) */}
      <section id="manifesto" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/15 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Collage Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative border-2 border-white/30 p-2 bg-white transform -rotate-2 shadow-2xl">
              <div className="aspect-[4/5] overflow-hidden bg-black relative">
                <img
                  src={halftoneHeart}
                  alt="Anatomical Barbed Wire Heart"
                  className="w-full h-full object-cover filter contrast-125"
                />
                <div className="absolute inset-0 bg-halftone opacity-70" />
              </div>
              <div className="bg-black text-white p-4 border-t border-white/20">
                <div className="flex justify-between items-center text-xs font-mono tracking-widest text-[#FF1E44]">
                  <span>ARCHIVAL PLATE NO. 04</span>
                  <span>MILANESE FORGE</span>
                </div>
              </div>
            </div>

            {/* Overlapping sticker hand */}
            <div className="hidden sm:block absolute -bottom-8 -right-8 w-44 p-1 bg-white border border-black shadow-2xl transform rotate-6">
              <img src={halftoneHand} alt="Gothic Hand" className="w-full h-auto" />
            </div>
          </div>

          {/* Manifesto Text */}
          <div className="lg:col-span-7 lg:pl-8">
            <div className="flex items-center gap-2 text-[#FF1E44] font-mono text-xs uppercase tracking-[0.3em] mb-3">
              <PunkStar className="w-5 h-5 text-[#FF1E44]" />
              <span>The Atelier Manifesto</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-serif uppercase tracking-[0.16em] leading-tight text-white mb-6">
              We Don't Make Accessories. We Forge Permanent Talismans.
            </h2>
            
            <p className="text-sm sm:text-base text-[#C0C0C0] font-light leading-relaxed tracking-wide mb-10">
              COSMIC stands at the violent intersection of classical Milanese haute joaillerie and raw neo-gothic brutality. We cast only solid 925 sterling silver, heavy platinum dips, and laboratory obsidian moissanite—building heirlooms that resist time and trends.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="border-l-2 border-[#FF1E44] pl-5">
                <span className="text-xs uppercase tracking-[0.25em] text-white font-mono font-semibold block mb-2">
                  01 // Cast In Solid 925
                </span>
                <p className="text-xs text-[#909090] leading-relaxed">
                  Never hollow. Every piece carries significant density and is stamped with our registered Italian hallmark.
                </p>
              </div>

              <div className="border-l-2 border-[#FF1E44] pl-5">
                <span className="text-xs uppercase tracking-[0.25em] text-white font-mono font-semibold block mb-2">
                  02 // Liquid Rhodium Armor
                </span>
                <p className="text-xs text-[#909090] leading-relaxed">
                  Multi-micron rhodium baths provide deep mirror chrome sheen and permanent defense against tarnish.
                </p>
              </div>

              <div className="border-l-2 border-[#FF1E44] pl-5">
                <span className="text-xs uppercase tracking-[0.25em] text-white font-mono font-semibold block mb-2">
                  03 // Sculpted Barbed Geometry
                </span>
                <p className="text-xs text-[#909090] leading-relaxed">
                  Every barb, thorn, and anatomical curve is sculpted in wax and finished across seven grits of jeweler's stone.
                </p>
              </div>

              <div className="border-l-2 border-[#FF1E44] pl-5">
                <span className="text-xs uppercase tracking-[0.25em] text-white font-mono font-semibold block mb-2">
                  04 // Lifetime Restoration
                </span>
                <p className="text-xs text-[#909090] leading-relaxed">
                  Lifetime complimentary ultrasonic bath cleaning, edge re-honing, and clasp replacement at any global boutique.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 9. THE SYNDICATE (NEWSLETTER) */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center relative">
        <div className="flex items-center justify-center gap-3 text-[#FF1E44] mb-3">
          <PunkStar className="w-5 h-5 text-[#FF1E44]" />
          <span className="text-xs font-mono uppercase tracking-[0.4em]">Private Syndicate Access</span>
          <PunkStar className="w-5 h-5 text-[#FF1E44]" />
        </div>

        <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.2em] text-white mb-4">
          Join The Cosmic Syndicate
        </h2>
        <p className="text-xs md:text-sm text-[#A0A0A0] font-light max-w-lg mx-auto tracking-wide leading-relaxed mb-8">
          Members receive encrypted invitations to archival drops, custom sizing requests, and seasonal zines.
        </p>

        {newsletterSubscribed ? (
          <div className="bg-[#0A0A0A] border-2 border-[#FF1E44] py-4 px-6 max-w-md mx-auto text-xs uppercase tracking-[0.25em] text-white font-mono">
            Welcome to the Syndicate. Dispatch confirmed.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newsletterEmail) {
                setNewsletterSubscribed(true);
                showToast("Joined The Cosmic Syndicate");
              }
            }}
            className="flex flex-col sm:flex-row max-w-md mx-auto gap-2"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-[#0A0A0A] border border-white/20 px-4 py-3.5 text-xs text-white placeholder-[#666666] tracking-widest focus:outline-none focus:border-[#FF1E44] font-mono"
            />
            <button
              type="submit"
              className="px-8 py-3.5 crimson-button text-xs uppercase tracking-[0.3em] font-bold cursor-pointer font-mono"
            >
              Enlist
            </button>
          </form>
        )}
      </section>

      {/* 10. GOTHIC LUXURY FOOTER */}
      <footer className="bg-[#050505] border-t border-white/15 pt-16 pb-12 px-6 bg-halftone">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <PunkStar className="w-5 h-5 text-[#FF1E44]" />
              <span className="font-serif text-3xl tracking-[0.32em] uppercase chrome-gradient-text block">
                COSMIC
              </span>
            </div>
            <p className="text-xs text-[#808080] font-light leading-relaxed max-w-sm tracking-wide mb-6">
              Neo-gothic fine jewelry cast in 925 sterling silver, liquid rhodium, and black moissanite. Inspired by celestial physics and brutalist sacred art.
            </p>
            <div className="text-[11px] uppercase tracking-[0.25em] text-[#FF1E44] font-mono">
              Boutiques: Milan • Paris • New York • Tokyo
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-white font-mono font-semibold mb-5">
              Series
            </h4>
            <ul className="space-y-3 text-xs tracking-wider text-[#888888]">
              <li><a href="#collections" className="hover:text-[#FF1E44] transition-colors">Thorn & Barb</a></li>
              <li><a href="#collections" className="hover:text-[#FF1E44] transition-colors">Anatomical Relics</a></li>
              <li><a href="#collections" className="hover:text-[#FF1E44] transition-colors">Cyber-Astral</a></li>
              <li><a href="#shop" className="hover:text-[#FF1E44] transition-colors">Haute Joaillerie</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-white font-mono font-semibold mb-5">
              Client Care
            </h4>
            <ul className="space-y-3 text-xs tracking-wider text-[#888888]">
              <li><a href="#" className="hover:text-[#FF1E44] transition-colors">Worldwide Courier</a></li>
              <li><a href="#" className="hover:text-[#FF1E44] transition-colors">Ring Sizing Atelier</a></li>
              <li><a href="#" className="hover:text-[#FF1E44] transition-colors">Lifetime Refinishing</a></li>
              <li><a href="#" className="hover:text-[#FF1E44] transition-colors">Certificates of Origin</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-white font-mono font-semibold mb-5">
              The Maison
            </h4>
            <ul className="space-y-3 text-xs tracking-wider text-[#888888]">
              <li><a href="#manifesto" className="hover:text-[#FF1E44] transition-colors">Atelier Manifesto</a></li>
              <li><a href="#manifesto" className="hover:text-[#FF1E44] transition-colors">Milanese Foundry</a></li>
              <li><a href="#" className="hover:text-[#FF1E44] transition-colors">Archival Zines</a></li>
              <li><a href="#" className="hover:text-[#FF1E44] transition-colors">Press Inquiries</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#606060] font-mono">
          <div>
            © {new Date().getFullYear()} COSMIC GOTHIC JOAILLERIE S.P.A. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </footer>

      {/* 11. QUICK VIEW PRODUCT MODAL (ZINE LOOKBOOK STYLE) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#070707] border-2 border-[#FF1E44] max-w-3xl w-full p-6 sm:p-8 overflow-hidden shadow-[0_0_50px_rgba(255,30,68,0.3)] animate-fade-in bg-halftone">
            
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-[#A0A0A0] hover:text-[#FF1E44] p-2 cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="aspect-square relative overflow-hidden border-2 border-white/20 bg-black">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover filter contrast-115"
                />
                <div className="absolute inset-0 bg-halftone opacity-60 pointer-events-none" />
                <div className="absolute top-3 left-3 bg-black border border-[#FF1E44] text-[#FF1E44] text-[9px] font-mono font-bold px-2 py-0.5">
                  {selectedProduct.tag}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#FF1E44] font-mono block mb-2">
                  {selectedProduct.series} • {selectedProduct.category}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-[0.15em] text-white mb-3">
                  {selectedProduct.name}
                </h3>
                <div className="font-mono text-xl text-white font-bold mb-4">
                  ${selectedProduct.price}.00 USD
                </div>
                <p className="text-xs text-[#B0B0B0] font-light leading-relaxed mb-6">
                  {selectedProduct.description}
                </p>

                <div className="space-y-3 mb-8 text-xs text-[#909090] border-t border-b border-white/10 py-4 font-mono">
                  <div className="flex justify-between">
                    <span>Metal Alloy</span>
                    <span className="text-white">{selectedProduct.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Atelier</span>
                    <span className="text-white">Milanese Foundry</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging</span>
                    <span className="text-white">Archival Monolith Box</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3.5 crimson-button text-xs uppercase tracking-[0.3em] font-bold font-mono cursor-pointer"
                  >
                    Add To Bag
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-6 py-3.5 border border-white/20 text-xs uppercase tracking-widest text-[#A0A0A0] hover:text-white font-mono cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. SHOPPING BAG SLIDE-OVER DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
            onClick={() => setCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#070707] border-l-2 border-[#FF1E44]/50 p-6 flex flex-col justify-between shadow-2xl bg-halftone">
              
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <PunkStar className="w-5 h-5 text-[#FF1E44]" />
                    <h3 className="font-serif text-2xl uppercase tracking-[0.2em] text-white">
                      Relics Bag ({cartCount})
                    </h3>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="text-[#888888] hover:text-[#FF1E44] p-2 cursor-pointer"
                    aria-label="Close Bag"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Free Shipping Progress */}
                <div className="py-4 border-b border-white/10">
                  <div className="flex justify-between text-[11px] uppercase tracking-wider text-[#C0C0C0] mb-2 font-mono">
                    <span>
                      {cartTotal >= 500
                        ? "✦ Worldwide Express Courier Unlocked"
                        : `Add $${500 - cartTotal} more for Express Courier`}
                    </span>
                  </div>
                  <div className="w-full bg-[#1a1a1a] h-1.5 border border-white/10">
                    <div
                      className="bg-[#FF1E44] h-full transition-all duration-500 shadow-[0_0_10px_rgba(255,30,68,0.8)]"
                      style={{ width: `${Math.min(100, (cartTotal / 500) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-white/10 max-h-[50vh] overflow-y-auto mt-4 pr-1">
                  {cart.length === 0 ? (
                    <div className="py-16 text-center text-[#666666] text-xs uppercase tracking-widest font-mono">
                      Your bag is currently empty
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="py-4 flex gap-4 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover border border-white/20 bg-black"
                        />
                        <div className="flex-1">
                          <h4 className="font-serif text-sm uppercase tracking-wider text-white">
                            {item.name}
                          </h4>
                          <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0] font-mono block">
                            {item.material}
                          </span>
                          <span className="font-mono text-xs text-[#FF1E44] font-bold mt-1 block">
                            ${item.price}.00
                          </span>
                        </div>
                        <div className="flex items-center border border-white/20 bg-black">
                          <button
                            onClick={() => updateCartQty(item.id, -1)}
                            className="px-2.5 py-1 text-xs text-[#888888] hover:text-white cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.id, 1)}
                            className="px-2.5 py-1 text-xs text-[#888888] hover:text-white cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-6 border-t border-white/15">
                <div className="flex justify-between text-xs uppercase tracking-widest text-[#A0A0A0] mb-2 font-mono">
                  <span>Subtotal</span>
                  <span className="font-mono text-white text-base font-bold">${cartTotal}.00</span>
                </div>
                <p className="text-[10px] text-[#707070] uppercase tracking-wider mb-6 font-mono">
                  Taxes, duties & insurance calculated at checkout.
                </p>
                <button
                  disabled={cart.length === 0}
                  onClick={() => showToast("Checkout initiated")}
                  className={`w-full py-4 text-xs uppercase tracking-[0.3em] font-bold text-center transition-all font-mono ${
                    cart.length === 0
                      ? "bg-[#222222] text-[#666666] cursor-not-allowed"
                      : "crimson-button cursor-pointer"
                  }`}
                >
                  Proceed To Checkout
                </button>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full py-2.5 mt-2 text-[10px] uppercase tracking-widest text-[#808080] hover:text-white text-center font-mono cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
