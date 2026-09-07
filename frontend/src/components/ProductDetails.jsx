import React, { useState, useRef, useEffect } from 'react';
import heroRingImg from '../assets/lunar_ring_hero.jpg';
import macroRingImg from '../assets/lunar_ring_macro.jpg';
import onModelRingImg from '../assets/lunar_ring_onmodel.jpg';
import packagingRingImg from '../assets/lunar_ring_packaging.jpg';
import lunarImg from '../assets/lunar_collection.jpg';
import novaImg from '../assets/nova_collection.jpg';
import eclipseImg from '../assets/eclipse_collection.jpg';

export default function ProductDetails({ onBackToHome, onAddToCart, onOpenCart, onSelectRelatedProduct }) {
  // Gallery State
  const images = [
    { src: heroRingImg, alt: "Lunar Silver Ring - Hero Studio Silhouette", label: "Studio" },
    { src: macroRingImg, alt: "Lunar Silver Ring - Celestial Bevel & S925 Hallmark", label: "Macro" },
    { src: onModelRingImg, alt: "Lunar Silver Ring - On Model Editorial Styling", label: "Editorial" },
    { src: packagingRingImg, alt: "Lunar Silver Ring - Velvet Monolith Box", label: "Packaging" }
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Purchase State
  const [selectedSize, setSelectedSize] = useState("US 8");
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [buyNowModalOpen, setBuyNowModalOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const purchaseSectionRef = useRef(null);

  // Accordion State (Product Details open by default)
  const [openAccordions, setOpenAccordions] = useState({
    details: true,
    materials: false,
    shipping: false,
    returns: false,
    care: false
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Review Filter State
  const [reviewFilter, setReviewFilter] = useState("all");

  // Track scroll for Mobile Sticky Purchase Bar
  useEffect(() => {
    const handleScroll = () => {
      if (!purchaseSectionRef.current) return;
      const rect = purchaseSectionRef.current.getBoundingClientRect();
      // Show sticky bar when the purchase section scrolls out of view
      setShowStickyBar(rect.bottom < 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Zoom Mouse Move
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Mobile Touch Swipe Handling
  const touchStartXRef = useRef(0);
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Next image
        setActiveImageIndex((prev) => (prev + 1) % images.length);
      } else {
        // Prev image
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    }
  };

  const handleAddToCart = () => {
    const productPayload = {
      id: "lunar-silver-ring",
      name: "Lunar Silver Ring",
      price: 799,
      size: selectedSize,
      quantity: quantity,
      material: "Solid 925 Silver • Rhodium Dip",
      image: heroRingImg
    };
    if (onAddToCart) {
      onAddToCart(productPayload);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setBuyNowModalOpen(true);
  };

  // Mock Reviews Data
  const reviews = [
    {
      id: 1,
      name: "Alexander V.",
      location: "London, UK",
      date: "August 2026",
      rating: 5,
      size: "US 9",
      verified: true,
      title: "Phenomenal weight and sculptural presence",
      comment: "The geometric facets catch the light exactly like in the studio editorial. It has substantial heft in hand without feeling bulky on the finger. The rhodium finish is intensely reflective—closest thing to wearable liquid chrome."
    },
    {
      id: 2,
      name: "Valerie D.",
      location: "Paris, FR",
      date: "July 2026",
      rating: 5,
      size: "US 7",
      verified: true,
      title: "Supreme craftsmanship, beats high jewelry houses",
      comment: "Ordered this after admiring the campaign on Instagram. The registered S925 hallmark is razor sharp on the inside shank. Packaged inside a heavy matte black velvet box that feels like an art piece. 10/10."
    },
    {
      id: 3,
      name: "Marcus K.",
      location: "Tokyo, JP",
      date: "June 2026",
      rating: 5,
      size: "US 8",
      verified: true,
      title: "Represent / Fear of God aesthetic done to perfection",
      comment: "Pairs seamlessly with heavy dark tailored streetwear. The bevels reflect ambient light in angular slices. Delivery to Tokyo took only 3 days via express courier."
    },
    {
      id: 4,
      name: "Rohan M.",
      location: "Mumbai, IN",
      date: "May 2026",
      rating: 4,
      size: "US 10",
      verified: true,
      title: "Flawless mirror finish, exceptional value",
      comment: "At ₹799 this is genuinely unbeatable for solid 925 sterling silver. Had to exchange sizes and their concierge completed the replacement in 48 hours without friction."
    }
  ];

  // Related Creations
  const relatedCreations = [
    {
      id: 1,
      name: "The Solstice Signet Ring",
      collection: "Lunar Series",
      price: 999,
      material: "Solid 925 Silver • Beveled Shank",
      image: lunarImg
    },
    {
      id: 2,
      name: "Nova Orbital Hoops",
      collection: "Nova Series",
      price: 849,
      material: "Liquid Rhodium • Micro-Pavé",
      image: novaImg
    },
    {
      id: 3,
      name: "Eclipse Pavé Pendant",
      collection: "Eclipse Series",
      price: 1299,
      material: "Solid 925 Silver • 18\" Box Chain",
      image: eclipseImg
    },
    {
      id: 4,
      name: "Stardust Band Ring",
      collection: "Lunar Series",
      price: 699,
      material: "Mirror Chrome Finish • Platinum Dipped",
      image: lunarImg
    }
  ];

  return (
    <div className="bg-[#000000] text-white min-h-screen font-sans selection:bg-[#C0C0C0] selection:text-black">
      
      {/* BREADCRUMB NAVIGATION */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.22em] text-[#808080]">
          <button
            onClick={onBackToHome}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Home
          </button>
          <span className="text-[#404040]">/</span>
          <button
            onClick={onBackToHome}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Rings
          </button>
          <span className="text-[#404040]">/</span>
          <span className="text-white font-medium">Lunar Silver Ring</span>
        </nav>
      </div>

      {/* ========================================================= */}
      {/* MAIN PRODUCT HERO SECTION (Gallery + Product Details)     */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-6 pt-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ===================================================== */}
          {/* LEFT: IMMERSIVE PRODUCT GALLERY (Lg: 7 cols)          */}
          {/* ===================================================== */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Main Stage Image Viewer */}
            <div
              className="relative aspect-square w-full bg-[#050505] border border-white/10 overflow-hidden cursor-crosshair group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={images[activeImageIndex].src}
                alt={images[activeImageIndex].alt}
                className="w-full h-full object-cover transition-transform duration-300 ease-out select-none"
                style={{
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  transform: isZoomed ? 'scale(1.22)' : 'scale(1)',
                }}
              />

              {/* Luxury Badge Overlays */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                <span className="text-[9px] uppercase tracking-[0.28em] bg-black/85 backdrop-blur-md px-3 py-1.5 border border-white/15 text-[#E0E0E0] font-medium">
                  Batch 04 • Certified 925
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] bg-black/80 backdrop-blur-md px-3 py-1 border border-white/10 text-[#A0A0A0]">
                  {images[activeImageIndex].label} View
                </span>
              </div>

              {/* Expand to Lightbox Hint */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="absolute top-4 right-4 p-2.5 bg-black/80 border border-white/15 text-[#C0C0C0] hover:text-white transition-colors opacity-80 group-hover:opacity-100"
                aria-label="View Fullscreen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>

              {/* Mobile Swipe Pagination Indicator */}
              <div className="lg:hidden absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1 border border-white/15 text-[10px] tracking-widest text-[#B0B0B0]">
                0{activeImageIndex + 1} / 0{images.length}
              </div>
            </div>

            {/* Thumbnail Selector Strip */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-square overflow-hidden border transition-all duration-300 cursor-pointer bg-[#080808] ${
                    activeImageIndex === idx
                      ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.25)] scale-[1.02]"
                      : "border-white/15 opacity-60 hover:opacity-100 hover:border-white/40"
                  }`}
                  aria-label={`Select ${img.label} angle`}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-full h-full object-cover select-none"
                  />
                  <span className="absolute bottom-1.5 left-2 text-[8px] uppercase tracking-[0.2em] text-[#C0C0C0] bg-black/80 px-1.5 py-0.5 pointer-events-none">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Editorial Guarantee Under-gallery */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-white/10 text-center text-[10px] uppercase tracking-[0.2em] text-[#8E8E8E]">
              <div className="py-2 border-r border-white/5">
                <span className="block text-white font-medium mb-0.5">Solid 925</span>
                <span>Silver Ingot</span>
              </div>
              <div className="py-2 border-r border-white/5">
                <span className="block text-white font-medium mb-0.5">Rhodium</span>
                <span>Liquid Bath</span>
              </div>
              <div className="py-2">
                <span className="block text-white font-medium mb-0.5">Milan</span>
                <span>Hand Finished</span>
              </div>
            </div>

          </div>

          {/* ===================================================== */}
          {/* RIGHT: PRODUCT INFORMATION & PURCHASE (Lg: 5 cols)    */}
          {/* ===================================================== */}
          <div className="lg:col-span-5 flex flex-col space-y-7" ref={purchaseSectionRef}>
            
            {/* Header / Brand & Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#A0A0A0] font-light">
                  Cosmic Haute Joaillerie
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#707070]">
                  Celestial Series
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.14em] text-white leading-tight mb-3 chrome-gradient-text">
                Lunar Silver Ring
              </h1>

              {/* Price & Rating */}
              <div className="flex items-baseline justify-between border-b border-white/10 pb-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-2xl sm:text-3xl text-white font-normal tracking-wide">
                    ₹799
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#707070]">
                    INR • Tax Included
                  </span>
                </div>

                {/* Rating Link to Reviews */}
                <a
                  href="#reviews-section"
                  className="flex items-center gap-1.5 text-xs text-[#C0C0C0] hover:text-white transition-colors group"
                >
                  <div className="flex text-[#C0C0C0] text-sm">
                    {"★★★★★"}
                  </div>
                  <span className="font-mono text-xs text-white">4.9</span>
                  <span className="text-[10px] text-[#707070] group-hover:text-[#A0A0A0]">
                    (128)
                  </span>
                </a>
              </div>
            </div>

            {/* Short Luxury Description */}
            <p className="text-xs sm:text-sm text-[#B0B0B0] font-light leading-relaxed tracking-wide">
              Cast from solid 925 sterling silver, the Lunar Silver Ring features architectural celestial facets reminiscent of cratered lunar geometry. Fortified with an electroplated liquid rhodium dip for brilliant mirror reflection, maximum tarnish resistance, and eternal wear.
            </p>

            {/* Stock Scarcity Status */}
            <div className="flex items-center gap-2.5 py-2 px-3 bg-[#0c0c0c] border border-white/10 text-xs tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C0C0C0] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C0C0C0]" />
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C0C0C0]">
                Low Stock: Only 8 Pieces Remaining in Batch 04
              </span>
            </div>

            {/* Ring Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-[0.2em]">
                <span className="text-[#C0C0C0]">
                  Select Size: <strong className="text-white ml-1">{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-[11px] text-[#A0A0A0] hover:text-white underline underline-offset-4 tracking-widest cursor-pointer transition-colors"
                >
                  Ring Size Atelier
                </button>
              </div>

              {/* Size Buttons Grid */}
              <div className="grid grid-cols-6 gap-2">
                {["US 6", "US 7", "US 8", "US 9", "US 10", "US 11"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-xs uppercase font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                      selectedSize === size
                        ? "bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.35)]"
                        : "border border-white/20 text-[#A0A0A0] hover:text-white hover:border-white/60 bg-[#0a0a0a]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Purchase CTAs */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                
                {/* Quantity Control */}
                <div className="flex items-center border border-white/20 bg-[#0a0a0a]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-3 text-xs text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="px-3 py-3 text-xs font-mono text-white min-w-[2.5rem] text-center select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                    className="px-3.5 py-3 text-xs text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Primary CTA: Add To Bag */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 chrome-button text-xs uppercase tracking-[0.28em] font-semibold flex items-center justify-center gap-3 cursor-pointer shadow-lg group"
                >
                  <span>Add To Bag</span>
                  <span className="text-[#333333] group-hover:translate-x-0.5 transition-transform">
                    • ₹{799 * quantity}
                  </span>
                </button>
              </div>

              {/* Secondary CTA: Buy Now Express */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-transparent border border-white/35 text-white hover:bg-white hover:text-black transition-all duration-300 text-xs uppercase tracking-[0.3em] font-medium cursor-pointer"
              >
                Instant Express Checkout
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="pt-4 border-t border-white/10 space-y-3 text-xs text-[#909090]">
              <div className="flex items-center gap-3">
                <span className="text-white text-base">⚡</span>
                <span className="tracking-wide">Complimentary express shipping across India & worldwide</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white text-base">🛡️</span>
                <span className="tracking-wide">Registered 925 hallmark certificate & lifetime polishing warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white text-base">🔄</span>
                <span className="tracking-wide">14-day vault returns with complimentary first resize</span>
              </div>
            </div>

            {/* =================================================== */}
            {/* PRODUCT INFORMATION ACCORDIONS                      */}
            {/* =================================================== */}
            <div className="pt-6 border-t border-white/15 space-y-3">
              
              {/* Accordion 1: Product Details */}
              <div className="border-b border-white/10 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('details')}
                  className="w-full py-2 flex items-center justify-between text-left text-xs uppercase tracking-[0.25em] text-white hover:text-[#C0C0C0] transition-colors cursor-pointer"
                >
                  <span>01. Product Details</span>
                  <span className="text-sm font-mono text-[#C0C0C0]">
                    {openAccordions.details ? "−" : "+"}
                  </span>
                </button>
                {openAccordions.details && (
                  <div className="pt-3 pb-2 text-xs text-[#A0A0A0] font-light leading-relaxed tracking-wide space-y-2 animate-fade-in">
                    <p>
                      Sculpted with a low-profile architectural bevel inspired by celestial crater topography. The interior band features an ergonomic comfort-fit contour for seamless daily wear.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[#8E8E8E] pt-1">
                      <li>Total Weight: Approximately 14.2 grams (Solid Sterling Silver)</li>
                      <li>Band Width: 8.5mm tapering to 6mm at under-shank</li>
                      <li>Engraving: Internal laser-etched "925 STERLING SILVER LUNAR"</li>
                      <li>Finish: Mirror liquid chrome exterior with satin interior shank</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Materials & Craftsmanship */}
              <div className="border-b border-white/10 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('materials')}
                  className="w-full py-2 flex items-center justify-between text-left text-xs uppercase tracking-[0.25em] text-white hover:text-[#C0C0C0] transition-colors cursor-pointer"
                >
                  <span>02. Materials & Atelier Craft</span>
                  <span className="text-sm font-mono text-[#C0C0C0]">
                    {openAccordions.materials ? "−" : "+"}
                  </span>
                </button>
                {openAccordions.materials && (
                  <div className="pt-3 pb-2 text-xs text-[#A0A0A0] font-light leading-relaxed tracking-wide space-y-2 animate-fade-in">
                    <p>
                      Cast strictly from 100% recycled 925 sterling silver, free from nickel, lead, and filler alloys. Each piece undergoes an electrolytic liquid rhodium immersion bath, fortifying the silver against oxidation, scratches, and everyday skin acidity.
                    </p>
                    <p className="text-[#8E8E8E]">
                      Hand-buffed across seven diamond-grit wheels by master goldsmiths in our Milanese atelier before receiving our registered hallmark stamp.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Delivery */}
              <div className="border-b border-white/10 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full py-2 flex items-center justify-between text-left text-xs uppercase tracking-[0.25em] text-white hover:text-[#C0C0C0] transition-colors cursor-pointer"
                >
                  <span>03. Shipping & Vault Delivery</span>
                  <span className="text-sm font-mono text-[#C0C0C0]">
                    {openAccordions.shipping ? "−" : "+"}
                  </span>
                </button>
                {openAccordions.shipping && (
                  <div className="pt-3 pb-2 text-xs text-[#A0A0A0] font-light leading-relaxed tracking-wide space-y-2 animate-fade-in">
                    <p>
                      Every order is dispatched via insured priority courier inside our discreet, tamper-evident black outer box.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[#8E8E8E]">
                      <li>India Delivery: 2–3 business days via Blue Dart / Delhivery Express</li>
                      <li>International Delivery: 3–5 business days via DHL Express Worldwide</li>
                      <li>Real-time encrypted tracking link sent via SMS and Email upon fulfillment</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 4: Returns & Exchanges */}
              <div className="border-b border-white/10 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('returns')}
                  className="w-full py-2 flex items-center justify-between text-left text-xs uppercase tracking-[0.25em] text-white hover:text-[#C0C0C0] transition-colors cursor-pointer"
                >
                  <span>04. 14-Day Vault Returns & Resizing</span>
                  <span className="text-sm font-mono text-[#C0C0C0]">
                    {openAccordions.returns ? "−" : "+"}
                  </span>
                </button>
                {openAccordions.returns && (
                  <div className="pt-3 pb-2 text-xs text-[#A0A0A0] font-light leading-relaxed tracking-wide space-y-2 animate-fade-in">
                    <p>
                      We want your Cosmic creation to sit in absolute ergonomic harmony. If your ring does not fit as intended, we provide one complimentary size exchange with pre-paid courier collection.
                    </p>
                    <p className="text-[#8E8E8E]">
                      Returns are accepted within 14 days of delivery in pristine, unworn condition with intact serial tags and the original velvet presentation box.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 5: Care Instructions */}
              <div className="border-b border-white/10 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="w-full py-2 flex items-center justify-between text-left text-xs uppercase tracking-[0.25em] text-white hover:text-[#C0C0C0] transition-colors cursor-pointer"
                >
                  <span>05. Heirloom Care Instructions</span>
                  <span className="text-sm font-mono text-[#C0C0C0]">
                    {openAccordions.care ? "−" : "+"}
                  </span>
                </button>
                {openAccordions.care && (
                  <div className="pt-3 pb-2 text-xs text-[#A0A0A0] font-light leading-relaxed tracking-wide space-y-2 animate-fade-in">
                    <p>
                      Your ring includes our signature microfiber jeweler's buffing cloth. Gently wipe after heavy wear to lift natural oils and maintain the high-frequency chrome reflection.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[#8E8E8E]">
                      <li>Store within the provided velvet anti-tarnish vault pouch when not worn</li>
                      <li>Remove prior to entering chlorinated swimming pools or using harsh chemical solvents</li>
                      <li>Eligible for lifetime complimentary ultrasonic spa cleaning at any Cosmic atelier</li>
                    </ul>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* VERIFIED CUSTOMER REVIEWS SECTION                         */}
      {/* ========================================================= */}
      <section id="reviews-section" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.4em] text-[#999999] block mb-2">
              Client Appraisals
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif uppercase tracking-[0.16em] text-white mb-4">
              Verified Client Impressions
            </h2>
            <p className="text-xs text-[#8E8E8E] tracking-wider uppercase">
              128 Global Appraisals • 98% Recommend Rate
            </p>
          </div>

          {/* Rating Summary Card */}
          <div className="p-8 bg-[#070707] border border-white/10 mb-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Big Score */}
            <div className="md:col-span-4 text-center md:border-r border-white/10 md:pr-8">
              <div className="font-mono text-5xl sm:text-6xl text-white font-normal mb-2">
                4.9
              </div>
              <div className="flex justify-center text-[#C0C0C0] text-base mb-1">
                {"★★★★★"}
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#808080]">
                Overall Excellence
              </span>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="md:col-span-8 space-y-2 text-xs">
              {[
                { stars: 5, pct: 89, count: 114 },
                { stars: 4, pct: 9, count: 11 },
                { stars: 3, pct: 2, count: 3 },
                { stars: 2, pct: 0, count: 0 },
                { stars: 1, pct: 0, count: 0 },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-[#A0A0A0]">
                  <span className="w-10 text-[11px] uppercase tracking-wider text-right font-mono">
                    {row.stars} ★
                  </span>
                  <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#909090] to-white transition-all duration-500"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-[11px] font-mono text-[#606060] text-right">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Filter Pills */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {[
              { id: "all", label: "All Reviews (128)" },
              { id: "photos", label: "Editorial Photos (42)" },
              { id: "verified", label: "Verified Buyers (128)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setReviewFilter(f.id)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors whitespace-nowrap cursor-pointer ${
                  reviewFilter === f.id
                    ? "bg-white text-black font-semibold"
                    : "bg-[#0a0a0a] border border-white/15 text-[#A0A0A0] hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Review Cards Grid */}
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 sm:p-8 bg-[#070707] border border-white/10 hover:border-white/25 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium text-sm tracking-wide">
                      {rev.name}
                    </span>
                    {rev.verified && (
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#C0C0C0] bg-white/5 border border-white/15 px-2 py-0.5">
                        Verified Acquisition
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#707070]">
                    <span className="font-mono text-[#C0C0C0] tracking-widest">
                      {"★".repeat(rev.rating)}
                    </span>
                    <span>Size: {rev.size}</span>
                    <span>{rev.date}</span>
                  </div>
                </div>

                <h4 className="text-sm uppercase tracking-wider text-white font-medium mb-2">
                  "{rev.title}"
                </h4>
                <p className="text-xs text-[#A0A0A0] font-light leading-relaxed tracking-wide">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* RELATED CREATIONS SECTION (The Celestial Series)          */}
      {/* ========================================================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-[0.4em] text-[#999999] block mb-2">
              Complete The Silhouette
            </span>
            <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-[0.18em] text-white">
              Complementary Celestial Artifacts
            </h2>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs uppercase tracking-[0.25em] text-[#C0C0C0] hover:text-white transition-colors mt-4 md:mt-0 flex items-center gap-2 cursor-pointer"
          >
            <span>View Full Archive</span>
            <span>→</span>
          </button>
        </div>

        {/* Horizontal scroll on mobile, 4-col grid on desktop */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 pb-6 lg:pb-0 scrollbar-none snap-x">
          {relatedCreations.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (onSelectRelatedProduct) {
                  onSelectRelatedProduct(item);
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="min-w-[260px] sm:min-w-[300px] lg:min-w-0 snap-start group border border-white/10 bg-[#080808] hover:border-[#C0C0C0]/50 transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="aspect-square relative overflow-hidden bg-neutral-900">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] bg-black/80 backdrop-blur-md px-2.5 py-1 border border-white/15 text-[#C0C0C0]">
                  {item.collection}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg tracking-[0.1em] text-white uppercase mb-1 group-hover:text-[#C0C0C0] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-[#8E8E8E] font-light mb-4">
                    {item.material}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="font-mono text-sm text-white">
                    ₹{item.price}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] group-hover:text-white transition-colors">
                    View Piece →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* MOBILE STICKY PURCHASE BAR                                */}
      {/* ========================================================= */}
      {showStickyBar && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t border-white/15 backdrop-blur-xl p-4 flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <img
              src={images[0].src}
              alt="Lunar Ring"
              className="w-12 h-12 object-cover border border-white/15"
            />
            <div>
              <span className="text-xs uppercase tracking-wider text-white font-medium block truncate max-w-[140px]">
                Lunar Silver Ring
              </span>
              <span className="font-mono text-sm text-white">
                ₹799 • {selectedSize}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="px-6 py-3 chrome-button text-xs uppercase tracking-[0.25em] font-semibold cursor-pointer whitespace-nowrap"
          >
            Add To Bag
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* SIZE GUIDE ATELIER MODAL                                  */}
      {/* ========================================================= */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-white/20 max-w-lg w-full p-8 relative shadow-2xl animate-fade-in">
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-[#888888] hover:text-white p-2"
              aria-label="Close modal"
            >
              ✕
            </button>

            <span className="text-[10px] uppercase tracking-[0.35em] text-[#888888] block mb-1">
              Cosmic Atelier
            </span>
            <h3 className="font-serif text-2xl uppercase tracking-[0.15em] text-white mb-4">
              Ring Sizing Guide
            </h3>
            <p className="text-xs text-[#A0A0A0] leading-relaxed mb-6 font-light">
              Wrap a strip of paper tightly around the knuckle of your intended finger, mark the overlap, and measure the circumference in millimeters.
            </p>

            <div className="border border-white/10 overflow-hidden mb-6 text-xs font-mono">
              <table className="w-full text-left">
                <thead className="bg-[#141414] text-[#A0A0A0] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">US Size</th>
                    <th className="py-2.5 px-4">Inside Diameter</th>
                    <th className="py-2.5 px-4">Circumference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[#E0E0E0]">
                  <tr><td className="py-2.5 px-4 font-semibold text-white">US 6</td><td className="py-2.5 px-4">16.5 mm</td><td className="py-2.5 px-4">51.8 mm</td></tr>
                  <tr><td className="py-2.5 px-4 font-semibold text-white">US 7</td><td className="py-2.5 px-4">17.3 mm</td><td className="py-2.5 px-4">54.4 mm</td></tr>
                  <tr><td className="py-2.5 px-4 font-semibold text-white">US 8</td><td className="py-2.5 px-4">18.1 mm</td><td className="py-2.5 px-4">57.0 mm</td></tr>
                  <tr><td className="py-2.5 px-4 font-semibold text-white">US 9</td><td className="py-2.5 px-4">18.9 mm</td><td className="py-2.5 px-4">59.5 mm</td></tr>
                  <tr><td className="py-2.5 px-4 font-semibold text-white">US 10</td><td className="py-2.5 px-4">19.8 mm</td><td className="py-2.5 px-4">62.1 mm</td></tr>
                  <tr><td className="py-2.5 px-4 font-semibold text-white">US 11</td><td className="py-2.5 px-4">20.6 mm</td><td className="py-2.5 px-4">64.6 mm</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-[#707070] text-center uppercase tracking-widest mb-6">
              Complimentary first resize included with every acquisition.
            </p>

            <button
              onClick={() => setSizeGuideOpen(false)}
              className="w-full py-3 border border-white/25 text-xs uppercase tracking-[0.25em] text-white hover:bg-white hover:text-black transition-colors"
            >
              Return To Product
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FULLSCREEN LIGHTBOX MODAL                                 */}
      {/* ========================================================= */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white text-2xl p-3 z-10 hover:opacity-75"
            aria-label="Close Fullscreen"
          >
            ✕
          </button>
          <div className="max-w-4xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[activeImageIndex].src}
              alt={images[activeImageIndex].alt}
              className="w-full h-full object-contain max-h-[85vh] border border-white/15"
            />
            <div className="absolute bottom-4 left-4 text-xs tracking-widest uppercase bg-black/80 px-4 py-2 border border-white/10 text-white">
              {images[activeImageIndex].label} • Lunar Silver Ring
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* INSTANT EXPRESS CHECKOUT MODAL                            */}
      {/* ========================================================= */}
      {buyNowModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-[#C0C0C0]/50 max-w-md w-full p-8 relative shadow-2xl animate-fade-in text-center">
            <button
              onClick={() => setBuyNowModalOpen(false)}
              className="absolute top-4 right-4 text-[#888888] hover:text-white p-2"
              aria-label="Close"
            >
              ✕
            </button>

            <span className="text-[10px] uppercase tracking-[0.35em] text-[#888888] block mb-2">
              Express Vault Checkout
            </span>
            <h3 className="font-serif text-3xl uppercase tracking-[0.15em] text-white mb-4">
              Acquisition Initiated
            </h3>

            <div className="p-4 bg-[#141414] border border-white/10 flex items-center gap-4 mb-6 text-left">
              <img
                src={heroRingImg}
                alt="Lunar Ring"
                className="w-16 h-16 object-cover border border-white/15"
              />
              <div>
                <span className="text-xs uppercase tracking-wider text-white font-medium block">
                  Lunar Silver Ring
                </span>
                <span className="text-[11px] text-[#A0A0A0] block">
                  Size: {selectedSize} • Qty: {quantity}
                </span>
                <span className="font-mono text-sm text-white font-semibold">
                  Total: ₹{799 * quantity}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A0A0A0] leading-relaxed mb-6 font-light">
              Item placed securely in your vault bag. Click below to proceed to encrypted gateway.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setBuyNowModalOpen(false);
                  if (onOpenCart) onOpenCart();
                }}
                className="w-full py-4 chrome-button text-xs uppercase tracking-[0.28em] font-semibold cursor-pointer"
              >
                Proceed To Secured Gateway
              </button>
              <button
                onClick={() => setBuyNowModalOpen(false)}
                className="w-full py-3 border border-white/20 text-xs uppercase tracking-widest text-[#A0A0A0] hover:text-white transition-colors"
              >
                Continue Viewing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
