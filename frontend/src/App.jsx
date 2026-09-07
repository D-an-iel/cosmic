import React, { useState } from 'react';
import heroEditorial from './assets/hero_editorial.jpg';
import lunarImg from './assets/lunar_collection.jpg';
import novaImg from './assets/nova_collection.jpg';
import eclipseImg from './assets/eclipse_collection.jpg';
import CinematicIntro from './components/CinematicIntro.jsx';
import ProductDetails from './components/ProductDetails.jsx';

// Verified high-resolution luxury jewelry & fashion photography (served locally)
const IMAGES = {
  hero: heroEditorial,
  lunar: lunarImg,
  nova: novaImg,
  eclipse: eclipseImg,
  products: [
    {
      id: 1,
      name: "Lunar Silver Ring",
      collection: "Lunar",
      category: "Rings",
      price: 799,
      material: "925 Solid Silver • Liquid Rhodium Dip",
      tag: "Flagship",
      image: lunarImg,
      description: "Cast in solid 925 sterling silver with a sculpted celestial bevel. Individually hand-finished in our Milanese atelier."
    },
    {
      id: 2,
      name: "Nova Orbital Hoops",
      collection: "Nova",
      category: "Earrings",
      price: 290,
      material: "Liquid Rhodium • Micro-Pavé Moissanite",
      tag: "New Arrival",
      image: novaImg,
      description: "Dual planetary concentric rings finished in high-lustre liquid rhodium for brilliant reflection under any ambient light."
    },
    {
      id: 3,
      name: "Eclipse Pavé Pendant",
      collection: "Eclipse",
      category: "Necklaces",
      price: 480,
      material: "Solid 925 Silver • 18\" Box Chain",
      tag: "Iconic",
      image: eclipseImg,
      description: "Inspired by the geometry of a total lunar eclipse. Features a concealed clasp and architectural diamond-cut chain."
    },
    {
      id: 4,
      name: "Stardust Band Ring",
      collection: "Lunar",
      category: "Rings",
      price: 310,
      material: "Mirror Chrome Finish • Platinum Dipped",
      tag: "Limited",
      image: lunarImg,
      description: "A continuous band sculpted with tactile cosmic fluting. Dipped in rare platinum for unmatched resistance to tarnish."
    },
    {
      id: 5,
      name: "Celestial Cascade Choker",
      collection: "Nova",
      category: "Necklaces",
      price: 620,
      material: "Pure Argentium Silver • Hallmarked",
      tag: "Haute Joaillerie",
      image: eclipseImg,
      description: "An editorial statement collar that rests effortlessly along the collarbone. Hand-articulated links provide fluid movement."
    },
    {
      id: 6,
      name: "Astral Drop Earrings",
      collection: "Eclipse",
      category: "Earrings",
      price: 360,
      material: "Solid Silver • Bespoke Hinged Backs",
      tag: "New",
      image: novaImg,
      description: "Elongated architectural teardrops featuring a brushed matte interior contrasted against mirror-chrome outer bevels."
    }
  ],
  categories: [
    { name: "Rings", count: "18 Creations", image: lunarImg },
    { name: "Earrings", count: "14 Creations", image: novaImg },
    { name: "Necklaces", count: "12 Creations", image: eclipseImg },
    { name: "Haute Joaillerie", count: "8 Masterpieces", image: heroEditorial }
  ],
  craftsmanship: heroEditorial
};

export default function App() {
  // State management
  const [introActive, setIntroActive] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'product'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([
    {
      id: "lunar-silver-ring",
      name: "Lunar Silver Ring",
      price: 799,
      quantity: 1,
      material: "Solid 925 Silver • Rhodium Dip",
      image: lunarImg
    }
  ]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
    showToast(`Added "${product.name}" to your bag`);
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
    ? IMAGES.products
    : IMAGES.products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C0C0C0] selection:text-black antialiased relative">
      
      {/* 1. CINEMATIC LUXURY BRAND INTRO (7-8s) */}
      {introActive && (
        <CinematicIntro onComplete={() => setIntroActive(false)} />
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111]/95 border border-[#C0C0C0]/40 backdrop-blur-md px-5 py-3 rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-3 animate-fade-in text-xs uppercase tracking-widest text-white">
          <span className="w-2 h-2 rounded-full bg-[#C0C0C0] animate-pulse" />
          {toastMessage}
        </div>
      )}

      {/* 2. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#0A0A0A] border-b border-[#222222] py-2 px-4 text-[11px] uppercase tracking-[0.25em] text-center text-[#A0A0A0] flex items-center justify-center gap-4">
        <span>Complimentary Express Courier on Orders Above $500</span>
        <span className="hidden md:inline text-[#444444]">•</span>
        <span className="hidden md:inline">Certified 925 Solid Silver & Platinum Dipping</span>
      </div>

      {/* 3. STICKY LUXURY NAVBAR */}
      <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-xl border-b border-white/10 transition-colors duration-300 font-aileron">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-[#C0C0C0] transition-colors p-2 -ml-2"
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

          {/* Left Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-10 text-sm font-normal text-[#C0C0C0] tracking-wide">
            <button
              onClick={() => {
                setCurrentView('home');
                const el = document.getElementById("collections");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-white transition-colors relative py-1 group cursor-pointer"
            >
              Collections
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => {
                setCurrentView('product');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition-colors relative py-1 group cursor-pointer ${
                currentView === 'product' ? 'text-white font-medium' : 'hover:text-white'
              }`}
            >
              Lunar Ring (₹799)
              <span className={`absolute bottom-0 left-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 ${
                currentView === 'product' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>
            <button
              onClick={() => {
                setCurrentView('home');
                const el = document.getElementById("shop");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-white transition-colors relative py-1 group cursor-pointer"
            >
              Fine jewelry
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => {
                setCurrentView('home');
                const el = document.getElementById("maison");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="hover:text-white transition-colors relative py-1 group cursor-pointer"
            >
              The maison
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 group-hover:w-full" />
            </button>
          </nav>

          {/* Center Brand Logo */}
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center group cursor-pointer text-center"
          >
            <span className="font-aileron text-2xl md:text-3xl tracking-[0.2em] font-normal chrome-gradient-text group-hover:opacity-90 transition-opacity">
              Cosmic
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[#707070] -mt-0.5 group-hover:text-[#A0A0A0] transition-colors">
              Haute joaillerie
            </span>
          </button>

          {/* Right Navigation / Bag */}
          <div className="flex items-center space-x-6 text-sm tracking-wide">
            <a
              href="#shop"
              className="hidden lg:inline text-[#A0A0A0] hover:text-white transition-colors"
            >
              Search
            </a>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-white hover:text-[#C0C0C0] transition-colors flex items-center gap-2 group cursor-pointer"
              aria-label="Shopping Bag"
            >
              <span className="text-sm tracking-wide hidden sm:inline text-[#A0A0A0] group-hover:text-white">
                Bag
              </span>
              <div className="relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] border-b border-white/10 px-6 py-8 space-y-6 font-aileron">
            <nav className="flex flex-col space-y-4 text-base tracking-wide">
              <button
                onClick={() => {
                  setCurrentView('product');
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-left text-white font-medium py-2 border-b border-white/5 cursor-pointer"
              >
                Lunar Ring (₹799)
              </button>
              <a
                href="#collections"
                onClick={() => {
                  setCurrentView('home');
                  setMobileMenuOpen(false);
                }}
                className="text-[#C0C0C0] hover:text-white py-2 border-b border-white/5"
              >
                Collections
              </a>
              <a
                href="#shop"
                onClick={() => {
                  setCurrentView('home');
                  setMobileMenuOpen(false);
                }}
                className="text-[#C0C0C0] hover:text-white py-2 border-b border-white/5"
              >
                Fine jewelry
              </a>
              <a
                href="#categories"
                onClick={() => {
                  setCurrentView('home');
                  setMobileMenuOpen(false);
                }}
                className="text-[#C0C0C0] hover:text-white py-2 border-b border-white/5"
              >
                Categories
              </a>
              <a
                href="#maison"
                onClick={() => {
                  setCurrentView('home');
                  setMobileMenuOpen(false);
                }}
                className="text-[#C0C0C0] hover:text-white py-2 border-b border-white/5"
              >
                The maison & craft
              </a>
            </nav>
            <div className="pt-4 text-xs tracking-wider text-[#707070]">
              Boutiques: Milan • Paris • New York • Tokyo
            </div>
          </div>
        )}
      </header>

      {/* VIEW SWITCHER: PRODUCT DETAILS OR HOME */}
      {currentView === 'product' ? (
        <ProductDetails
          onBackToHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToCart={addToCart}
          onOpenCart={() => setCartOpen(true)}
          onSelectRelatedProduct={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <>
          {/* 4. HERO SECTION */}
      <section className="relative min-h-[80vh] max-h-[850px] flex items-center justify-center overflow-hidden border-b border-white/10">
        {/* Background Editorial Image with Luxury Dark Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGES.hero}
            alt="COSMIC Haute Joaillerie editorial campaign"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-105 opacity-60 transition-transform duration-1000 ease-out hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-16 md:py-20">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-aileron font-light tracking-[0.04em] leading-tight mb-6 chrome-gradient-text drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
            Wear the universe
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-[#C0C0C0] font-light tracking-wide leading-relaxed mb-12">
            Premium accessories inspired by celestial elegance and sculpted in solid 925 sterling silver and rare platinum for the modern icon.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={() => {
                setCurrentView('product');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-10 py-4 chrome-button text-xs uppercase tracking-[0.3em] font-semibold cursor-pointer shadow-lg"
            >
              Flagship: Lunar Ring (₹799)
            </button>
            <a
              href="#collections"
              className="w-full sm:w-auto px-10 py-4 border border-[#C0C0C0]/50 hover:border-white hover:bg-white/5 transition-all text-xs uppercase tracking-[0.3em] text-[#E0E0E0] font-medium backdrop-blur-md text-center"
            >
              Explore Collection
            </a>
          </div>

          {/* Pillars Bar */}
          <div className="mt-20 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#888888] block">Material</span>
              <span className="text-xs uppercase tracking-wider text-white font-medium">925 Sterling & Rhodium</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#888888] block">Origin</span>
              <span className="text-xs uppercase tracking-wider text-white font-medium">Milanese Handcraft</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#888888] block">Editions</span>
              <span className="text-xs uppercase tracking-wider text-white font-medium">Limited Artisanal Runs</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#888888] block">Guarantee</span>
              <span className="text-xs uppercase tracking-wider text-white font-medium">Lifetime Authenticity</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED COLLECTIONS */}
      <section id="collections" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-[11px] uppercase tracking-[0.4em] text-[#999999] block mb-3">
              Curated Worlds
            </span>
            <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.2em] text-white">
              The Celestial Series
            </h2>
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#A0A0A0] mt-4 md:mt-0 max-w-xs leading-relaxed">
            Three distinct design expressions inspired by the physics and geometry of the night sky.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Collection 1: Lunar */}
          <div className="group relative border border-white/10 bg-[#080808] transition-all duration-500 hover:border-[#C0C0C0]/60 flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
              <img
                src={IMAGES.lunar}
                alt="Lunar Collection"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.25em] bg-black/70 backdrop-blur-md px-3 py-1 border border-white/10 text-[#C0C0C0]">
                Collection I
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl tracking-[0.18em] uppercase text-white mb-2 group-hover:text-[#C0C0C0] transition-colors">
                  Lunar
                </h3>
                <p className="text-xs text-[#999999] leading-relaxed font-light mb-6">
                  Architectural silhouettes cast in solid sterling silver with clean mirror-finished planar surfaces.
                </p>
              </div>
              <a
                href="#shop"
                onClick={() => setActiveCategory("Rings")}
                className="text-xs uppercase tracking-[0.25em] text-white flex items-center gap-2 group-hover:gap-4 transition-all"
              >
                <span>Explore Lunar</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Collection 2: Nova */}
          <div className="group relative border border-white/10 bg-[#080808] transition-all duration-500 hover:border-[#C0C0C0]/60 flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
              <img
                src={IMAGES.nova}
                alt="Nova Collection"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.25em] bg-black/70 backdrop-blur-md px-3 py-1 border border-white/10 text-[#C0C0C0]">
                Collection II
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl tracking-[0.18em] uppercase text-white mb-2 group-hover:text-[#C0C0C0] transition-colors">
                  Nova
                </h3>
                <p className="text-xs text-[#999999] leading-relaxed font-light mb-6">
                  Dynamic stellar radiance captured through liquid rhodium dipped metals and ethically cultured moissanite.
                </p>
              </div>
              <a
                href="#shop"
                onClick={() => setActiveCategory("Earrings")}
                className="text-xs uppercase tracking-[0.25em] text-white flex items-center gap-2 group-hover:gap-4 transition-all"
              >
                <span>Explore Nova</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Collection 3: Eclipse */}
          <div className="group relative border border-white/10 bg-[#080808] transition-all duration-500 hover:border-[#C0C0C0]/60 flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
              <img
                src={IMAGES.eclipse}
                alt="Eclipse Collection"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.25em] bg-black/70 backdrop-blur-md px-3 py-1 border border-white/10 text-[#C0C0C0]">
                Collection III
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl tracking-[0.18em] uppercase text-white mb-2 group-hover:text-[#C0C0C0] transition-colors">
                  Eclipse
                </h3>
                <p className="text-xs text-[#999999] leading-relaxed font-light mb-6">
                  Sculptural mystery blending oxidised deep shadow accents with hand-polished chrome high-points.
                </p>
              </div>
              <a
                href="#shop"
                onClick={() => setActiveCategory("Necklaces")}
                className="text-xs uppercase tracking-[0.25em] text-white flex items-center gap-2 group-hover:gap-4 transition-all"
              >
                <span>Explore Eclipse</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SHOP BY CATEGORY */}
      <section id="categories" className="py-20 px-6 max-w-7xl mx-auto border-b border-white/10">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#999999] block mb-2">
            Categories
          </span>
          <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-[0.2em] text-white">
            Designed For Every Silhouette
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {IMAGES.categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (cat.name !== "Haute Joaillerie") {
                  setActiveCategory(cat.name);
                }
                const el = document.getElementById("shop");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group cursor-pointer relative border border-white/10 overflow-hidden bg-neutral-950 hover:border-[#C0C0C0] transition-colors"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-lg md:text-xl tracking-[0.15em] uppercase text-white group-hover:text-[#C0C0C0] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#909090]">
                    {cat.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FEATURED PRODUCTS & NEW ARRIVALS */}
      <section id="shop" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-[0.4em] text-[#999999] block mb-2">
              New Arrivals
            </span>
            <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.2em] text-white">
              The Cosmic Collection
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {["All", "Rings", "Earrings", "Necklaces"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.25em] transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-white text-black font-semibold"
                    : "border border-white/20 text-[#A0A0A0] hover:text-white hover:border-white/50"
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
              className="group border border-white/10 bg-[#080808] hover:border-[#C0C0C0]/50 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] bg-black/80 backdrop-blur-md px-2.5 py-1 border border-white/15 text-[#D0D0D0]">
                  {product.tag}
                </div>

                {/* Quick Action Overlay (Desktop) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="px-4 py-2.5 bg-black/90 border border-white/30 text-white text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    Quick View
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-4 py-2.5 chrome-button text-xs uppercase tracking-widest font-semibold"
                  >
                    Add To Bag
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#808080] mb-1">
                    {product.collection} Series • {product.category}
                  </div>
                  <h3 className="font-serif text-xl tracking-[0.1em] text-white uppercase mb-2 group-hover:text-[#C0C0C0] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#909090] tracking-wide mb-4 font-light">
                    {product.material}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="font-mono text-sm tracking-wider text-white">
                    ₹{product.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="md:hidden text-xs uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white"
                  >
                    + Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. BRAND STORY & CRAFTSMANSHIP (THE MAISON) */}
      <section id="maison" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] border border-white/20 relative overflow-hidden bg-neutral-900">
              <img
                src={IMAGES.craftsmanship}
                alt="COSMIC Atelier Craftsmanship"
                className="w-full h-full object-cover filter brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-black border border-[#C0C0C0]/50 p-6 backdrop-blur-md max-w-xs shadow-2xl">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#888888] block mb-1">
                Artisanal Milan
              </span>
              <p className="text-xs text-[#C0C0C0] font-light leading-relaxed">
                Every piece is hand-cast, buffed, and stamped with our registered hallmark at our private workshop in Northern Italy.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <span className="text-[11px] uppercase tracking-[0.4em] text-[#999999] block mb-3">
              The Cosmic Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif uppercase tracking-[0.18em] leading-tight text-white mb-6">
              Alchemical Perfection Meets Cosmic Geometry
            </h2>
            <p className="text-sm sm:text-base text-[#B0B0B0] font-light leading-relaxed tracking-wide mb-10">
              COSMIC was born from the desire to create jewelry that feels both ancient and futuristic. We reject disposable fashion in favor of timeless heirloom metals—transforming recycled sterling silver into sculpted celestial artifacts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="border-l border-[#C0C0C0]/30 pl-5">
                <span className="text-xs uppercase tracking-[0.25em] text-white font-semibold block mb-2">
                  01. Solid 925 & Platinum
                </span>
                <p className="text-xs text-[#8E8E8E] leading-relaxed">
                  Crafted exclusively with certified solid sterling silver, fortified with a rare liquid platinum bath to prevent dullness.
                </p>
              </div>

              <div className="border-l border-[#C0C0C0]/30 pl-5">
                <span className="text-xs uppercase tracking-[0.25em] text-white font-semibold block mb-2">
                  02. Ethical Gemology
                </span>
                <p className="text-xs text-[#8E8E8E] leading-relaxed">
                  Every accent stone is cultured in zero-emission laboratories, achieving higher fire and dispersion than mined counterparts.
                </p>
              </div>

              <div className="border-l border-[#C0C0C0]/30 pl-5">
                <span className="text-xs uppercase tracking-[0.25em] text-white font-semibold block mb-2">
                  03. Hand-Finished Edges
                </span>
                <p className="text-xs text-[#8E8E8E] leading-relaxed">
                  Trained artisans polish each bevel across seven distinct grits, yielding the signature COSMIC liquid chrome mirror sheen.
                </p>
              </div>

              <div className="border-l border-[#C0C0C0]/30 pl-5">
                <span className="text-xs uppercase tracking-[0.25em] text-white font-semibold block mb-2">
                  04. Lifetime Warranty
                </span>
                <p className="text-xs text-[#8E8E8E] leading-relaxed">
                  Our commitment to haute joaillerie means lifetime complimentary refinishing, ultrasonic cleaning, and prong inspection.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 9. NEWSLETTER / THE CIRCLE */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#999999] block mb-3">
          Private Access
        </span>
        <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.2em] text-white mb-4">
          Join The Cosmic Circle
        </h2>
        <p className="text-xs md:text-sm text-[#A0A0A0] font-light max-w-lg mx-auto tracking-wide leading-relaxed mb-8">
          Subscribers receive private access to limited edition drops, bespoke sizing invitations, and seasonal archival exhibitions.
        </p>

        {newsletterSubscribed ? (
          <div className="bg-[#111111] border border-[#C0C0C0]/50 py-4 px-6 max-w-md mx-auto text-xs uppercase tracking-[0.25em] text-[#E0E0E0]">
            Welcome to the Circle. Confirmation sent.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newsletterEmail) {
                setNewsletterSubscribed(true);
                showToast("Subscribed to The Cosmic Circle");
              }
            }}
            className="flex flex-col sm:flex-row max-w-md mx-auto gap-2"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-[#0A0A0A] border border-white/20 px-4 py-3.5 text-xs text-white placeholder-[#666666] tracking-widest focus:outline-none focus:border-[#C0C0C0]"
            />
            <button
              type="submit"
              className="px-8 py-3.5 chrome-button text-xs uppercase tracking-[0.3em] font-semibold cursor-pointer"
            >
              Join
            </button>
          </form>
        )}
      </section>
        </>
      )}

      {/* 10. LUXURY FOOTER */}
      <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          <div className="lg:col-span-2">
            <span className="font-serif text-3xl tracking-[0.32em] uppercase chrome-gradient-text block mb-4">
              COSMIC
            </span>
            <p className="text-xs text-[#808080] font-light leading-relaxed max-w-sm tracking-wide mb-6">
              Fine celestial accessories sculpted from high-purity recycled sterling silver, liquid rhodium, and platinum. Designed for everyday elevation and eternal wear.
            </p>
            <div className="text-[11px] uppercase tracking-[0.25em] text-[#606060]">
              Ateliers: Milan • Paris • New York • Tokyo
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-white font-semibold mb-5">
              Collections
            </h4>
            <ul className="space-y-3 text-xs tracking-wider text-[#888888]">
              <li><a href="#collections" className="hover:text-white transition-colors">Lunar Series</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">Nova Series</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">Eclipse Series</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Haute Joaillerie</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Bespoke Inquiries</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-white font-semibold mb-5">
              Client Care
            </h4>
            <ul className="space-y-3 text-xs tracking-wider text-[#888888]">
              <li><a href="#" className="hover:text-white transition-colors">Complimentary Shipping</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ring Size Atelier</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Lifetime Refinishing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Certificate of Origin</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Concierge Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-white font-semibold mb-5">
              The Maison
            </h4>
            <ul className="space-y-3 text-xs tracking-wider text-[#888888]">
              <li><a href="#maison" className="hover:text-white transition-colors">Our Philosophy</a></li>
              <li><a href="#maison" className="hover:text-white transition-colors">Ethical Sourcing</a></li>
              <li><a href="#maison" className="hover:text-white transition-colors">Sustainable 925</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press & Editorial</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers at COSMIC</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#606060]">
          <div>
            © {new Date().getFullYear()} COSMIC HAUTE JOAILLERIE S.P.A. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Preferences</a>
          </div>
        </div>
      </footer>

      {/* 11. QUICK VIEW PRODUCT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0a0a0a] border border-[#C0C0C0]/50 max-w-3xl w-full p-6 sm:p-8 overflow-hidden shadow-2xl animate-fade-in">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-[#888888] hover:text-white p-2"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="aspect-square relative overflow-hidden border border-white/10 bg-neutral-900">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#888888] block mb-2">
                  {selectedProduct.collection} Series • {selectedProduct.category}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-[0.15em] text-white mb-3">
                  {selectedProduct.name}
                </h3>
                <div className="font-mono text-lg text-white mb-4">
                  ${selectedProduct.price}.00 USD
                </div>
                <p className="text-xs text-[#B0B0B0] font-light leading-relaxed mb-6">
                  {selectedProduct.description}
                </p>

                <div className="space-y-3 mb-8 text-xs text-[#909090] border-t border-b border-white/10 py-4">
                  <div className="flex justify-between">
                    <span>Composition</span>
                    <span className="text-white">{selectedProduct.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Origin</span>
                    <span className="text-white">Milanese Atelier</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging</span>
                    <span className="text-white">Velvet Monolith Box</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3.5 chrome-button text-xs uppercase tracking-[0.3em] font-semibold"
                  >
                    Add To Bag
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-6 py-3.5 border border-white/20 text-xs uppercase tracking-widest text-[#A0A0A0] hover:text-white"
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#0a0a0a] border-l border-white/15 p-6 flex flex-col justify-between shadow-2xl">
              
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <h3 className="font-serif text-2xl uppercase tracking-[0.2em] text-white">
                    Your Bag ({cartCount})
                  </h3>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="text-[#888888] hover:text-white p-2"
                    aria-label="Close Bag"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Free Shipping Progress */}
                <div className="py-4 border-b border-white/5">
                  <div className="flex justify-between text-[11px] uppercase tracking-wider text-[#A0A0A0] mb-2">
                    <span>
                      {cartTotal >= 1500
                        ? "Complimentary Worldwide Express Courier Unlocked"
                        : `Add ₹${1500 - cartTotal} more for Complimentary Courier`}
                    </span>
                  </div>
                  <div className="w-full bg-[#222222] h-1">
                    <div
                      className="bg-[#C0C0C0] h-1 transition-all duration-500"
                      style={{ width: `${Math.min(100, (cartTotal / 1500) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-white/5 max-h-[50vh] overflow-y-auto mt-4 pr-1">
                  {cart.length === 0 ? (
                    <div className="py-16 text-center text-[#666666] text-xs uppercase tracking-widest">
                      Your bag is currently empty
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="py-4 flex gap-4 items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover border border-white/10 bg-neutral-900"
                        />
                        <div className="flex-1">
                          <h4 className="font-serif text-sm uppercase tracking-wider text-white">
                            {item.name}
                          </h4>
                          <span className="text-[10px] uppercase tracking-wider text-[#888888] block">
                            {item.material}
                          </span>
                          <span className="font-mono text-xs text-[#D0D0D0] mt-1 block">
                            ₹{item.price}
                          </span>
                        </div>
                        <div className="flex items-center border border-white/20">
                          <button
                            onClick={() => updateCartQty(item.id, -1)}
                            className="px-2.5 py-1 text-xs text-[#888888] hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.id, 1)}
                            className="px-2.5 py-1 text-xs text-[#888888] hover:text-white"
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
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between text-xs uppercase tracking-widest text-[#888888] mb-2">
                  <span>Subtotal</span>
                  <span className="font-mono text-white text-base">₹{cartTotal}</span>
                </div>
                <p className="text-[10px] text-[#666666] uppercase tracking-wider mb-6">
                  Taxes, duties & insurance calculated at checkout.
                </p>
                <button
                  disabled={cart.length === 0}
                  onClick={() => showToast("Checkout integration initiated")}
                  className={`w-full py-4 text-xs uppercase tracking-[0.3em] font-semibold text-center transition-all ${
                    cart.length === 0
                      ? "bg-[#222222] text-[#666666] cursor-not-allowed"
                      : "chrome-button cursor-pointer"
                  }`}
                >
                  Proceed To Checkout
                </button>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full py-2.5 mt-2 text-[10px] uppercase tracking-widest text-[#707070] hover:text-white text-center"
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
