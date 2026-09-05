import React, { useState, useEffect } from 'react';

// Collections Data
const COLLECTIONS = [
  {
    id: 'lunar',
    name: 'Lunar Collection',
    tag: 'Collection 01',
    description: 'Elegant silver rings inspired by moonlight and celestial crescents.',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1000&q=80',
    itemCount: '12 Creations',
    category: 'Rings',
  },
  {
    id: 'nova',
    name: 'Nova Collection',
    tag: 'Collection 02',
    description: 'Modern earrings crafted with bold geometry and liquid chrome luster.',
    image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=1000&q=80',
    itemCount: '8 Creations',
    category: 'Earrings',
  },
  {
    id: 'eclipse',
    name: 'Eclipse Collection',
    tag: 'Collection 03',
    description: 'Timeless necklaces with dark luxury aesthetics and obsidian accents.',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80',
    itemCount: '15 Creations',
    category: 'Necklaces',
  },
];

// Shop Categories
const CATEGORIES = [
  {
    id: 'rings',
    name: 'Rings',
    subtitle: 'Sculptural Bands & Astral Solitaires',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    count: '24 Designs',
  },
  {
    id: 'earrings',
    name: 'Earrings',
    subtitle: 'Geometric Hoops & Celestial Drops',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80',
    count: '18 Designs',
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    subtitle: 'Statement Collars & Orbit Pendants',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    count: '21 Designs',
  },
];

// Featured Products
const PRODUCTS = [
  {
    id: 1,
    name: 'Lunar Silver Ring',
    price: 799,
    category: 'Rings',
    badge: 'Pure 925 Silver',
    description: 'A liquid-silver band sculpted to mirror the soft luminescence of the crescent moon. Finished with high-refraction rhodium plating for eternal brilliance.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    material: '925 Sterling Silver',
    finish: 'Mirror Chrome Polish',
  },
  {
    id: 2,
    name: 'Nova Hoop Earrings',
    price: 599,
    category: 'Earrings',
    badge: 'Bestseller',
    description: 'Sculptural, hollow-form geometric hoops engineered for featherlight weight and striking architectural presence.',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
    material: 'Hypoallergenic Silver Alloy',
    finish: 'Satin Chrome',
  },
  {
    id: 3,
    name: 'Eclipse Necklace',
    price: 999,
    category: 'Necklaces',
    badge: 'Signature Piece',
    description: 'An obsidian-toned obsidian inlay cradled within a solid silver orbit, evoking the quiet drama of a solar eclipse.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    material: '925 Silver & Black Spinel',
    finish: 'Smoked Chrome & High Polish',
  },
  {
    id: 4,
    name: 'Stardust Ring',
    price: 699,
    category: 'Rings',
    badge: 'Limited Edition',
    description: 'Micro-pavé celestial crystals embedded along a razor-thin contoured band, catching every flicker of ambient light.',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
    material: '925 Sterling Silver & Lab Crystals',
    finish: 'Liquid Silver Rhodium',
  },
  {
    id: 5,
    name: 'Celestial Earrings',
    price: 549,
    category: 'Earrings',
    badge: 'New Arrival',
    description: 'Cascading linear drops terminating in faceted starburst pendants that sway with graceful fluidity with every gesture.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    material: '925 Sterling Silver',
    finish: 'Diamond Cut Reflective',
  },
  {
    id: 6,
    name: 'Orbit Necklace',
    price: 1099,
    category: 'Necklaces',
    badge: 'Haute Joaillerie',
    description: 'Interlocking concentric ellipses suspended on a delicate Venetian box chain, embodying cosmic equilibrium and eternal symmetry.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    material: '925 Sterling Silver',
    finish: 'Dual Chrome & Matte Rim',
  },
];

const App = () => {
  // Loading Screen State
  const [loading, setLoading] = useState(true);
  const [loadingFade, setLoadingFade] = useState(false);

  // App State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  // 1. Luxury Loading Screen: 2.2s duration with smooth scale and fade-out
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setLoadingFade(true);
    }, 2000);

    const endTimer = setTimeout(() => {
      setLoading(false);
    }, 2600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    triggerToast(`Added ${product.name} to your bag.`);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
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

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts =
    selectedCategoryFilter === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategoryFilter);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#C0C0C0] selection:text-black font-sans relative overflow-x-hidden">
      {/* 1. LUXURY LOADING SCREEN */}
      {loading && (
        <div
          className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-700 ease-out ${
            loadingFade ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Subtle Ambient Halo */}
          <div className="absolute w-72 h-72 rounded-full bg-[#C0C0C0]/10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <div className="w-10 h-10 mb-6 rounded-full border border-[#C0C0C0]/30 flex items-center justify-center animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#999999] via-[#C0C0C0] to-white shadow-[0_0_12px_#C0C0C0]"></span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif uppercase tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-[#999999] via-white to-[#CCCCCC] animate-luxury-scale">
              COSMIC
            </h1>

            <p className="mt-4 text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#C0C0C0]/70 font-light">
              Haute Joaillerie & Celestial Silver
            </p>

            <div className="mt-8 w-36 h-[1px] bg-neutral-800 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-[#C0C0C0] to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-neutral-900/95 border border-[#C0C0C0]/40 backdrop-blur-xl px-5 py-3.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-[#C0C0C0] animate-pulse"></span>
          <span className="text-xs tracking-wider uppercase text-neutral-200">{toastMessage}</span>
        </div>
      )}

      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#050505] border-b border-[#C0C0C0]/15 text-center py-2.5 px-4 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C0C0C0]/80 flex items-center justify-center gap-3">
        <span className="hidden sm:inline">Complimentary Insured Delivery Worldwide</span>
        <span className="hidden sm:inline text-neutral-600">•</span>
        <span>Signature Obsidian Presentation Box Included</span>
      </div>

      {/* 2. NAVBAR */}
      <nav className="bg-black/85 backdrop-blur-md sticky top-0 z-50 border-b border-[#C0C0C0]/20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Brand Logo */}
            <a href="#" className="group flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full border border-[#C0C0C0]/50 flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-[#999999] via-[#C0C0C0] to-white shadow-[0_0_8px_#C0C0C0]"></span>
              </span>
              <span className="text-xl sm:text-2xl font-serif tracking-[0.3em] uppercase bg-gradient-to-r from-white via-[#E8E8E8] to-[#999999] bg-clip-text text-transparent group-hover:to-white transition-all">
                COSMIC
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10 text-xs tracking-[0.2em] uppercase font-medium">
              <a href="#hero" className="text-neutral-300 hover:text-[#C0C0C0] transition-colors duration-200 py-1 relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#collections" className="text-neutral-300 hover:text-[#C0C0C0] transition-colors duration-200 py-1 relative group">
                Collections
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#categories" className="text-neutral-300 hover:text-[#C0C0C0] transition-colors duration-200 py-1 relative group">
                Categories
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#products" className="text-neutral-300 hover:text-[#C0C0C0] transition-colors duration-200 py-1 relative group">
                Shop
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#story" className="text-neutral-300 hover:text-[#C0C0C0] transition-colors duration-200 py-1 relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {/* Cart & Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-neutral-300 hover:text-white transition-colors duration-200 group flex items-center gap-2"
                aria-label="View Shopping Bag"
              >
                <span className="hidden sm:inline text-xs uppercase tracking-[0.15em] text-[#C0C0C0] group-hover:text-white">
                  Cart
                </span>
                <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {/* Cart Badge */}
                <span className="flex h-4 w-4 items-center justify-center bg-[#C0C0C0] text-black text-[10px] font-bold rounded-full shadow-[0_0_8px_rgba(192,192,192,0.8)]">
                  {totalCartCount}
                </span>
              </button>

              {/* Mobile Menu Button with comfortable touch target */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2.5 text-[#C0C0C0] hover:text-white transition-colors duration-200 focus:outline-none"
                  aria-label="Open menu"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-[#C0C0C0]/20 px-6 py-6 space-y-4">
            <nav className="flex flex-col space-y-2 text-sm uppercase tracking-[0.25em]">
              <a
                href="#hero"
                onClick={() => setIsMenuOpen(false)}
                className="text-neutral-300 hover:text-[#C0C0C0] transition-colors py-3 border-b border-neutral-900"
              >
                Home
              </a>
              <a
                href="#collections"
                onClick={() => setIsMenuOpen(false)}
                className="text-neutral-300 hover:text-[#C0C0C0] transition-colors py-3 border-b border-neutral-900"
              >
                Collections
              </a>
              <a
                href="#categories"
                onClick={() => setIsMenuOpen(false)}
                className="text-neutral-300 hover:text-[#C0C0C0] transition-colors py-3 border-b border-neutral-900"
              >
                Categories
              </a>
              <a
                href="#products"
                onClick={() => setIsMenuOpen(false)}
                className="text-neutral-300 hover:text-[#C0C0C0] transition-colors py-3 border-b border-neutral-900"
              >
                Shop All
              </a>
              <a
                href="#story"
                onClick={() => setIsMenuOpen(false)}
                className="text-neutral-300 hover:text-[#C0C0C0] transition-colors py-3 border-b border-neutral-900"
              >
                About Cosmic
              </a>
            </nav>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsCartOpen(true);
              }}
              className="w-full py-3.5 bg-[#C0C0C0] text-black text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              <span>View Shopping Bag</span>
              <span>({totalCartCount})</span>
            </button>
          </div>
        )}
      </nav>

      {/* 3. HERO SECTION */}
      <section
        id="hero"
        className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-24"
      >
        {/* Large Luxury Lifestyle Editorial Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&w=2000&q=85"
            alt="Cosmic Luxury Jewelry Editorial"
            className="w-full h-full object-cover object-center filter brightness-45 scale-105"
          />
          {/* Multi-layered Dark Vignette Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#000000_80%)]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
        </div>

        {/* Concentric Orbital Ring Visual */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] sm:w-[800px] sm:h-[800px] border border-[#C0C0C0]/10 rounded-full pointer-events-none animate-[spin_120s_linear_infinite]"></div>

        {/* Hero Content with Editorial Hierarchy */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C0C0C0]/30 bg-black/60 backdrop-blur-md mb-6 sm:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C0C0C0] shadow-[0_0_6px_#C0C0C0]"></span>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C0C0C0]">
              Maison de Haute Joaillerie
            </span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[1.05] sm:leading-[0.95] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-[#E8E8E8] to-[#999999]">
            Wear The Universe
          </h1>

          <p className="mb-10 text-base sm:text-lg md:text-xl max-w-xl text-neutral-300 font-light tracking-wide leading-relaxed">
            Premium accessories inspired by elegance and crafted for every style.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href="#collections"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-[#C0C0C0] text-black text-xs uppercase tracking-[0.25em] font-semibold rounded-none hover:bg-white hover:shadow-[0_0_30px_rgba(192,192,192,0.4)] transition-all duration-300 text-center"
            >
              Explore Collection
            </a>
            <a
              href="#products"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 border border-[#C0C0C0]/50 text-white text-xs uppercase tracking-[0.25em] font-medium hover:border-[#C0C0C0] hover:bg-white/10 backdrop-blur-sm transition-all duration-300 text-center"
            >
              View New Arrivals
            </a>
          </div>

          <div className="mt-12 sm:mt-16 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#C0C0C0]">Scroll To Discover</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-[#C0C0C0] to-transparent"></div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED COLLECTIONS (CLEAN ASPECT RATIO, NEVER COLLAPSED) */}
      <section id="collections" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-[#C0C0C0]/15">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-[#C0C0C0]/15 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#C0C0C0] block mb-2">Curated Capsules</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight">
                Featured Collections
              </h2>
            </div>
            <p className="max-w-md text-sm text-neutral-400 font-light leading-relaxed">
              Three singular celestial aesthetics sculpted in ethically sourced pure sterling silver with hand-finished liquid chrome precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {COLLECTIONS.map((col) => (
              <div
                key={col.id}
                className="group relative flex flex-col border border-[#C0C0C0]/20 bg-neutral-950/60 backdrop-blur-xl transition-all duration-500 hover:border-[#C0C0C0]/70 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(192,192,192,0.1)]"
              >
                {/* Independent Image Container with Fixed Aspect Ratio */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-900">
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md border border-[#C0C0C0]/30 text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0]">
                    {col.tag}
                  </div>
                </div>

                {/* Card Content Below Image */}
                <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[#C0C0C0]/70 mb-1.5">
                      {col.itemCount}
                    </div>
                    <h3 className="font-serif text-2xl font-light text-white mb-2 group-hover:text-[#E8E8E8] transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed mb-6">
                      {col.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCategoryFilter(col.category);
                      const el = document.getElementById('products');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-3.5 border border-[#C0C0C0]/30 bg-transparent text-[11px] uppercase tracking-[0.2em] font-medium text-white transition-all duration-300 group-hover:border-[#C0C0C0] group-hover:bg-white/10 flex items-center justify-center gap-2"
                  >
                    <span>Explore {col.name}</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SHOP BY CATEGORY */}
      <section id="categories" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10 bg-[#040404] border-t border-[#C0C0C0]/15">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C0C0C0] block mb-2">Universe by Design</span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight mb-4">
              Shop By Category
            </h2>
            <p className="text-sm text-neutral-400 font-light leading-relaxed">
              Timeless silhouettes designed to be stacked, layered, and worn with effortless confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryFilter(cat.name);
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative h-[420px] sm:h-[480px] overflow-hidden border border-[#C0C0C0]/20 cursor-pointer transition-all duration-500 hover:border-[#C0C0C0]/70 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-75 group-hover:brightness-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.25em] px-3 py-1 bg-black/70 backdrop-blur-md border border-[#C0C0C0]/25 text-[#C0C0C0]">
                  {cat.count}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col justify-end">
                  <span className="text-xs uppercase tracking-[0.25em] text-[#C0C0C0] mb-1">
                    Fine Silversmithing
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl font-light text-white mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-300 font-light mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    {cat.subtitle}
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C0C0C0] group-hover:text-white transition-colors">
                    <span>Explore Category</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURED PRODUCTS */}
      <section id="products" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-[#C0C0C0]/15">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-[#C0C0C0]/15 gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#C0C0C0] block mb-2">
                Precious Artifacts
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight">
                Featured Products
              </h2>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-2 md:pb-0">
              {['All', 'Rings', 'Earrings', 'Necklaces'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedCategoryFilter(tab)}
                  className={`px-4 py-2.5 text-xs uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${
                    selectedCategoryFilter === tab
                      ? 'bg-[#C0C0C0] text-black font-semibold'
                      : 'border border-[#C0C0C0]/20 text-neutral-400 hover:text-white hover:border-[#C0C0C0]/60'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="group relative flex flex-col justify-between bg-neutral-950/40 border border-[#C0C0C0]/15 p-5 sm:p-6 transition-all duration-500 hover:border-[#C0C0C0]/60 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(192,192,192,0.1)]"
              >
                <div className="relative w-full aspect-square overflow-hidden bg-neutral-900 mb-5">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 filter brightness-95 group-hover:brightness-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-[#C0C0C0]/30 text-[9px] uppercase tracking-[0.2em] text-[#C0C0C0]">
                    {prod.badge}
                  </div>

                  <div className="absolute inset-x-3 bottom-3 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
                    <button
                      onClick={() => addToCart(prod)}
                      className="flex-1 py-2.5 bg-black/90 backdrop-blur-md border border-[#C0C0C0]/50 text-white text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-white hover:text-black hover:border-white transition-all duration-200"
                    >
                      Quick Add
                    </button>
                    <button
                      onClick={() => setSelectedProduct(prod)}
                      className="px-3 py-2.5 bg-black/90 backdrop-blur-md border border-[#C0C0C0]/50 text-[#C0C0C0] text-[10px] hover:text-white transition-colors"
                      title="Quick View"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col flex-grow">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-[#C0C0C0]/60 mb-1.5">
                    <span>{prod.category}</span>
                    <span>{prod.material.split('&')[0]}</span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-light text-white group-hover:text-[#E8E8E8] transition-colors mb-2">
                    {prod.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-medium text-white tracking-wide">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#C0C0C0]/50 line-through">
                      ₹{(prod.price + 300).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#C0C0C0] ml-auto">
                      Taxes Included
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 font-light line-clamp-2 mb-6">
                    {prod.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-[#C0C0C0]/10 flex gap-2">
                    <button
                      onClick={() => setSelectedProduct(prod)}
                      className="w-full py-3.5 bg-neutral-900/80 border border-[#C0C0C0]/30 text-white text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:border-[#C0C0C0] hover:bg-neutral-800 flex items-center justify-center gap-2"
                    >
                      <span>View Details</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => addToCart(prod)}
                      className="sm:hidden px-4 py-3.5 bg-[#C0C0C0] text-black text-xs uppercase font-semibold"
                      aria-label="Add to bag"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BRAND STORY: THE COSMIC EXPERIENCE */}
      <section id="story" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative z-10 bg-[#050505] border-t border-[#C0C0C0]/15 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#C0C0C0]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#C0C0C0]/30 mb-8 bg-black/60">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#999999] via-[#C0C0C0] to-white shadow-[0_0_12px_#C0C0C0]"></span>
          </div>

          <span className="text-xs uppercase tracking-[0.3em] text-[#C0C0C0] block mb-3">
            Our Philosophy
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-white tracking-tight mb-8">
            The Cosmic Experience
          </h2>

          <div className="max-w-3xl mx-auto space-y-6 text-neutral-300 font-light text-base sm:text-lg leading-relaxed sm:leading-loose">
            <p>
              At Cosmic, we operate at the poetic intersection of cosmic geometry and contemporary haute joaillerie.
              Inspired by the eternal motion of celestial orbits and the quiet brilliance of lunar light, each piece
              is meticulously conceived for those who carry quiet strength and effortless refinement.
            </p>
            <p className="text-neutral-400 text-sm sm:text-base">
              Every creation is forged from ethically reclaimed 925 sterling silver, hand-beveled by master artisans,
              and layered with a signature liquid-chrome finish. We believe modern luxury should be personal,
              sculptural, and timeless—an enduring talisman that tells your singular story across any room.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-14 pt-14 border-t border-[#C0C0C0]/15 text-left">
            <div className="p-4 border border-[#C0C0C0]/15 bg-black/40 backdrop-blur-sm">
              <span className="text-xs font-serif text-[#C0C0C0] block mb-1">01 / Metallurgy</span>
              <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-1">Pure 925 Silver</h4>
              <p className="text-[11px] sm:text-xs text-neutral-400 font-light">Hypoallergenic & tarnish-resistant rhodium protective shield.</p>
            </div>
            <div className="p-4 border border-[#C0C0C0]/15 bg-black/40 backdrop-blur-sm">
              <span className="text-xs font-serif text-[#C0C0C0] block mb-1">02 / Artistry</span>
              <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-1">Hand-Polished</h4>
              <p className="text-[11px] sm:text-xs text-neutral-400 font-light">Multi-stage mirror chrome luster executed by artisan jewelers.</p>
            </div>
            <div className="p-4 border border-[#C0C0C0]/15 bg-black/40 backdrop-blur-sm">
              <span className="text-xs font-serif text-[#C0C0C0] block mb-1">03 / Presentation</span>
              <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-1">Obsidian Case</h4>
              <p className="text-[11px] sm:text-xs text-neutral-400 font-light">Custom archival velvet interior presentation box with certificate.</p>
            </div>
            <div className="p-4 border border-[#C0C0C0]/15 bg-black/40 backdrop-blur-sm">
              <span className="text-xs font-serif text-[#C0C0C0] block mb-1">04 / Assurance</span>
              <h4 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-1">Lifetime Care</h4>
              <p className="text-[11px] sm:text-xs text-neutral-400 font-light">Complimentary polish and structural integrity guarantee forever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-[#C0C0C0]/20 bg-[#020202]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-2xl font-serif tracking-[0.3em] uppercase text-white block">
                COSMIC
              </span>
              <p className="text-xs text-neutral-400 font-light max-w-sm leading-relaxed">
                Sculptural fine jewelry and modern silver artifacts forged with celestial precision. Designed to be worn with poise across the cosmos.
              </p>
              <div className="pt-2 flex items-center space-x-3">
                <a href="#instagram" aria-label="Instagram" className="w-8 h-8 rounded-full border border-[#C0C0C0]/20 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#C0C0C0] transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#pinterest" aria-label="Pinterest" className="w-8 h-8 rounded-full border border-[#C0C0C0]/20 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#C0C0C0] transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#x" aria-label="X" className="w-8 h-8 rounded-full border border-[#C0C0C0]/20 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#C0C0C0] transition-all">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] text-white font-medium mb-4">
                Collections
              </h4>
              <ul className="space-y-2.5 text-xs font-light">
                <li><a href="#collections" className="hover:text-[#C0C0C0] transition-colors">Lunar Collection</a></li>
                <li><a href="#collections" className="hover:text-[#C0C0C0] transition-colors">Nova Collection</a></li>
                <li><a href="#collections" className="hover:text-[#C0C0C0] transition-colors">Eclipse Collection</a></li>
                <li><a href="#products" className="hover:text-[#C0C0C0] transition-colors">New Arrivals</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] text-white font-medium mb-4">
                Client Care
              </h4>
              <ul className="space-y-2.5 text-xs font-light">
                <li><a href="#story" className="hover:text-[#C0C0C0] transition-colors">Size Guide & Fit</a></li>
                <li><a href="#story" className="hover:text-[#C0C0C0] transition-colors">Silver Care & Polish</a></li>
                <li><a href="#story" className="hover:text-[#C0C0C0] transition-colors">Insured Shipping</a></li>
                <li><a href="#story" className="hover:text-[#C0C0C0] transition-colors">Certificate of Authenticity</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] text-white font-medium mb-4">
                The Maison
              </h4>
              <ul className="space-y-2.5 text-xs font-light">
                <li><a href="#story" className="hover:text-[#C0C0C0] transition-colors">Heritage</a></li>
                <li><a href="#story" className="hover:text-[#C0C0C0] transition-colors">Artisanship</a></li>
                <li><a href="#story" className="hover:text-[#C0C0C0] transition-colors">Sustainability</a></li>
                <li><a href="#story" className="hover:text-[#C0C0C0] transition-colors">Private Boutiques</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#C0C0C0]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#C0C0C0]/60 font-light gap-4">
            <div className="text-center sm:text-left">
              © 2026 Cosmic. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-[10px] uppercase tracking-widest text-[#C0C0C0]/40">
              <a href="#" className="hover:text-[#C0C0C0] transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-[#C0C0C0] transition-colors">Terms</a>
              <span>•</span>
              <a href="#" className="hover:text-[#C0C0C0] transition-colors">Hallmark Certification</a>
            </div>
          </div>
        </div>
      </footer>

      {/* QUICK VIEW MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[#0c0c0c] border border-[#C0C0C0]/40 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.95)] max-h-[90vh] flex flex-col md:flex-row">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-white transition-colors bg-black/70 rounded-full"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-neutral-900 relative">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-[#C0C0C0]/30 text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0]">
                {selectedProduct.badge}
              </div>
            </div>

            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C0C0C0] block mb-1">
                  {selectedProduct.category} • Authentic Creation
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-white mb-2">
                  {selectedProduct.name}
                </h3>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-xl font-medium text-white">
                    ₹{selectedProduct.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-neutral-500 line-through">
                    ₹{(selectedProduct.price + 300).toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 font-light leading-relaxed mb-6">
                  {selectedProduct.description}
                </p>

                <div className="space-y-2 border-t border-b border-[#C0C0C0]/15 py-4 mb-6 text-xs text-neutral-400">
                  <div className="flex justify-between">
                    <span className="uppercase tracking-wider">Metal:</span>
                    <span className="text-white font-medium">{selectedProduct.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="uppercase tracking-wider">Finish:</span>
                    <span className="text-white font-medium">{selectedProduct.finish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="uppercase tracking-wider">Hallmark:</span>
                    <span className="text-white font-medium">925 Laser Inscribed</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-4 bg-[#C0C0C0] text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-white transition-all flex items-center justify-center gap-2"
                >
                  <span>Add To Bag — ₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                </button>
                <p className="text-[10px] text-center text-neutral-500 uppercase tracking-widest">
                  Includes Signature Velvet Case & Certificate
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING BAG SLIDE-OVER DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#0a0a0a] border-l border-[#C0C0C0]/20 p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
              <div className="flex items-center justify-between pb-6 border-b border-[#C0C0C0]/15">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C0C0C0]"></span>
                  <h3 className="font-serif text-xl uppercase tracking-[0.2em] text-white">
                    Shopping Bag
                  </h3>
                  <span className="text-xs text-neutral-500">({totalCartCount})</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1.5 text-neutral-400 hover:text-white transition-colors" aria-label="Close bag">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-12 h-12 rounded-full border border-[#C0C0C0]/30 flex items-center justify-center text-[#C0C0C0]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h4 className="font-serif text-lg text-white">Your Bag is Empty</h4>
                    <p className="text-xs text-neutral-500 max-w-xs font-light">
                      Discover our celestial collections and choose your signature talisman.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 border border-[#C0C0C0]/10 bg-neutral-950/60 relative">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover bg-neutral-900" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif text-base text-white">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.id)} className="text-neutral-500 hover:text-red-400 text-xs transition-colors">
                              ✕
                            </button>
                          </div>
                          <span className="text-[10px] text-[#C0C0C0] uppercase tracking-wider block">
                            ₹{item.price.toLocaleString('en-IN')} each
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-[#C0C0C0]/30 text-xs">
                            <button onClick={() => updateQuantity(item.id, -1)} className="px-2.5 py-1 text-neutral-400 hover:text-white transition-colors">-</button>
                            <span className="px-2.5 py-1 text-white font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="px-2.5 py-1 text-neutral-400 hover:text-white transition-colors">+</button>
                          </div>
                          <span className="text-xs font-medium text-white">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-6 border-t border-[#C0C0C0]/15 space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal</span>
                      <span className="text-white font-medium">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Insured Express Shipping</span>
                      <span className="text-[#C0C0C0] uppercase tracking-wider text-[10px]">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-neutral-900">
                      <span>Total</span>
                      <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => triggerToast('Proceeding to encrypted luxury checkout...')}
                    className="w-full py-4 bg-[#C0C0C0] text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-white transition-all flex items-center justify-center gap-2"
                  >
                    <span>Checkout Now</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                  <p className="text-[10px] text-center text-neutral-500 uppercase tracking-widest">
                    🔒 256-Bit Encrypted Secure Checkout
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
