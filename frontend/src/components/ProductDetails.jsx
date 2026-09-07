import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductBySlug, getRelatedProducts, COLOR_VARIANTS, SIZE_VARIANTS } from '../data/products';

export default function ProductDetails({ onAddToCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Retrieve current product based on URL slug (defaults to Lunar Silver Ring)
  const product = getProductBySlug(slug);
  const relatedProducts = getRelatedProducts(slug);

  // Gallery Imagery
  const images = useMemo(() => product.gallery || [], [product.gallery]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Variant & Purchase State
  const [selectedColor, setSelectedColor] = useState(COLOR_VARIANTS[1].name); // Default Chrome
  const [selectedSize, setSelectedSize] = useState("8");
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Accordion State
  const [openAccordions, setOpenAccordions] = useState({
    details: false,
    materials: false,
    dimensions: false,
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

  // Customer Stories Horizontal Rail State & Handlers (Wheel conversion + Mouse Drag + Arrow buttons)
  const storiesRailRef = useRef(null);
  const [isDraggingStories, setIsDraggingStories] = useState(false);
  const isMouseDownRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);

  const handleStoriesMouseDown = (e) => {
    if (!storiesRailRef.current) return;
    isMouseDownRef.current = true;
    setIsDraggingStories(true);
    dragStartXRef.current = e.pageX - storiesRailRef.current.offsetLeft;
    dragScrollLeftRef.current = storiesRailRef.current.scrollLeft;
    storiesRailRef.current.style.scrollSnapType = 'none';
    storiesRailRef.current.style.scrollBehavior = 'auto';
  };

  useEffect(() => {
    const rail = storiesRailRef.current;
    if (!rail) return;

    // Wheel vertical-to-horizontal conversion
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && e.deltaY !== 0) {
        const atStart = rail.scrollLeft <= 0;
        const atEnd = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 4;

        if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
          e.preventDefault();
          rail.scrollLeft += e.deltaY * 1.5;
        }
      }
    };

    // Global mousemove and mouseup for smooth drag tracking
    const handleMouseMove = (e) => {
      if (!isMouseDownRef.current || !rail) return;
      e.preventDefault();
      const x = e.pageX - rail.offsetLeft;
      const walk = (x - dragStartXRef.current) * 1.5;
      rail.scrollLeft = dragScrollLeftRef.current - walk;
    };

    const handleMouseUp = () => {
      if (!isMouseDownRef.current) return;
      isMouseDownRef.current = false;
      setIsDraggingStories(false);
      if (rail) {
        rail.style.scrollSnapType = 'x proximity';
        rail.style.scrollBehavior = 'smooth';
      }
    };

    rail.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      rail.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const scrollStories = (direction) => {
    if (!storiesRailRef.current) return;
    const cardWidth = storiesRailRef.current.clientWidth > 768 ? 460 : 380;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    storiesRailRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Construct item payload for cart/checkout
  const currentItemPayload = {
    id: `${product.slug}-${selectedColor.toLowerCase()}-${selectedSize}`,
    slug: product.slug,
    name: product.name,
    price: product.price,
    color: selectedColor,
    size: selectedSize,
    quantity: quantity,
    material: product.shortDescription,
    image: images[activeImageIndex]?.src || images[0]?.src || product.image
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(currentItemPayload);
    }
  };

  const handleBuyNow = () => {
    navigate('/checkout', { state: { buyNowItem: currentItemPayload } });
  };

  return (
    <div className="bg-[#000000] text-white min-h-screen font-sans selection:bg-[#C0C0C0] selection:text-black">
      
      {/* 1. BREADCRUMB */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-4 pb-2">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.25em] text-[#707070]">
          <Link to="/" className="hover:text-white transition-colors">
            Maison
          </Link>
          <span className="text-[#333333]">/</span>
          <Link to="/#shop" className="hover:text-white transition-colors">
            {product.type || "Fine Creations"}
          </Link>
          <span className="text-[#333333]">/</span>
          <span className="text-white font-medium tracking-wider truncate">{product.name}</span>
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* 2. FIRST VIEWPORT PRODUCT HERO SECTION (3-COLUMN DESKTOP LAYOUT)           */}
      {/* Width: Thumbnails (6–8%) | Main Image (52–54%) | Product Details (38–40%)  */}
      {/* ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pt-2 pb-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-10 items-start">
          
          {/* ===================================================== */}
          {/* DESKTOP LEFT: VERTICAL THUMBNAIL RAIL (5–8%)           */}
          {/* ===================================================== */}
          <div className="hidden lg:flex flex-col gap-3 w-16 xl:w-20 shrink-0">
            {images.map((img, idx) => {
              const isActive = activeImageIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[4/5] w-full overflow-hidden border transition-all cursor-pointer bg-[#0a0a0a] ${
                    isActive
                      ? "border-[#C0C0C0] shadow-[0_0_12px_rgba(192,192,192,0.35)] opacity-100"
                      : "border-white/15 opacity-50 hover:opacity-90 hover:border-white/40"
                  }`}
                  aria-label={`Select view ${idx + 1}: ${img.label || 'Product angle'}`}
                >
                  <img
                    src={img.src}
                    alt={img.label || `Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C0C0C0]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ===================================================== */}
          {/* CENTER: CONTAINED MAIN PRODUCT IMAGE (50–55%)          */}
          {/* ===================================================== */}
          <div className="w-full lg:flex-1 min-w-0 flex flex-col items-center">
            <div
              className="relative w-full aspect-[4/5] max-h-[64vh] sm:max-h-[70vh] lg:max-h-[74vh] bg-[#050505] border border-white/10 overflow-hidden group cursor-zoom-in flex items-center justify-center"
              onClick={() => setLightboxImage(images[activeImageIndex]?.src)}
            >
              <img
                key={activeImageIndex}
                src={images[activeImageIndex]?.src}
                alt={images[activeImageIndex]?.alt || product.name}
                className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 filter brightness-95"
              />

              {/* Minimal Frame Label Badge */}
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 text-[9px] font-mono tracking-widest text-[#A0A0A0] border border-white/10 pointer-events-none">
                {activeImageIndex + 1} / {images.length} • {images[activeImageIndex]?.label || 'VIEW'}
              </div>

              {/* Zoom Indicator */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md p-2 text-[#C0C0C0] border border-white/10 pointer-events-none">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>
            </div>

            {/* Mobile Thumbnails Slider (Horizontal below image on mobile only) */}
            <div className="lg:hidden flex gap-2.5 overflow-x-auto w-full pt-3 pb-1 scrollbar-none snap-x">
              {images.map((img, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-14 aspect-[4/5] shrink-0 overflow-hidden border transition-all cursor-pointer bg-[#0a0a0a] snap-start ${
                      isActive ? "border-[#C0C0C0] opacity-100" : "border-white/15 opacity-50"
                    }`}
                  >
                    <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ===================================================== */}
          {/* RIGHT: COMPACT & EFFICIENT PRODUCT DETAILS (35–40%)   */}
          {/* ===================================================== */}
          <div className="w-full lg:w-[38%] xl:w-[36%] shrink-0 space-y-4 pt-1">
            
            {/* Header: Collection Tag & In-Stock */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#888888]">
                {product.collection || "Permanent Collection"}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#A0A0A0]">
                  {product.availability || "In Stock"}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif tracking-wide uppercase text-white font-normal leading-tight">
              {product.name}
            </h1>

            {/* Price & Rating Link */}
            <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl lg:text-3xl text-white font-light chrome-gradient-text tracking-tight">
                  ₹{product.price}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#707070]">
                  INR
                </span>
              </div>
              <a
                href="#customer-stories"
                className="flex items-center gap-1.5 text-xs text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
              >
                <span className="text-[#C0C0C0] tracking-widest text-xs">★★★★★</span>
                <span className="font-mono text-[11px] underline underline-offset-4">
                  {product.reviewCount || 24} reviews
                </span>
              </a>
            </div>

            {/* Short Narrative Description */}
            <p className="text-xs text-[#A8A8A8] font-light leading-relaxed">
              {product.shortDescription || product.story}
            </p>

            {/* Color / Finish Selector */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs">
                <span className="uppercase text-[10px] tracking-[0.25em] text-[#808080]">
                  Finish: <span className="text-white font-medium">{selectedColor}</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_VARIANTS.map((col) => {
                  const isSelected = selectedColor === col.name;
                  return (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => setSelectedColor(col.name)}
                      className={`py-2 px-2.5 text-left border transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? "border-[#C0C0C0] bg-white/10 shadow-[0_0_12px_rgba(192,192,192,0.2)]"
                          : "border-white/15 bg-[#080808] hover:border-white/40"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/40 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-[11px] uppercase tracking-wider text-white truncate">
                        {col.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs">
                <span className="uppercase text-[10px] tracking-[0.25em] text-[#808080]">
                  Size (US): <span className="text-white font-medium">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {SIZE_VARIANTS.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-center font-mono text-xs tracking-wider border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#C0C0C0] bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                          : "border-white/15 bg-[#080808] text-white hover:border-white/40"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between py-2 border-t border-b border-white/10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#808080]">
                Quantity
              </span>
              <div className="flex items-center border border-white/20">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-[#909090] hover:text-white transition-colors cursor-pointer text-sm"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="font-mono text-xs text-white font-medium px-3 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(5, quantity + 1))}
                  className="w-7 h-7 flex items-center justify-center text-[#909090] hover:text-white transition-colors cursor-pointer text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Purchase CTAs (Buy Now Primary, Add to Bag Secondary) */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-3.5 chrome-button text-xs uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(192,192,192,0.3)] transition-all"
              >
                <span>Buy Now • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 border border-white/30 hover:border-white hover:bg-white/5 text-xs uppercase tracking-[0.2em] text-white font-medium transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Add To Bag</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#808080] border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="text-[#C0C0C0]">✦</span>
                <span>Solid 925 Hallmark</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#C0C0C0]">✦</span>
                <span>Insured Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#C0C0C0]">✦</span>
                <span>Lifetime Care</span>
              </div>
            </div>

            {/* Collapsible Accordion Specs (Compact disclosures) */}
            <div className="pt-2 divide-y divide-white/10 border-t border-white/10">
              
              {/* Product Details */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('details')}
                  className="w-full py-2.5 flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-[11px] uppercase tracking-[0.2em] text-white group-hover:text-[#C0C0C0] transition-colors">
                    Product Details & Specifications
                  </span>
                  <span className="font-mono text-xs text-[#888888]">
                    {openAccordions.details ? '−' : '+'}
                  </span>
                </button>
                {openAccordions.details && (
                  <div className="pb-3 text-xs text-[#A0A0A0] space-y-1.5 font-light animate-fadeIn">
                    {product.accordions?.details?.map((item, i) => (
                      <div key={i} className="flex justify-between py-0.5 border-b border-white/5 text-[11px]">
                        <span className="text-[#666666] uppercase text-[9px] tracking-wider">{item.label}</span>
                        <span className="text-white font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Materials & Provenance */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('materials')}
                  className="w-full py-2.5 flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-[11px] uppercase tracking-[0.2em] text-white group-hover:text-[#C0C0C0] transition-colors">
                    Materials & Provenance
                  </span>
                  <span className="font-mono text-xs text-[#888888]">
                    {openAccordions.materials ? '−' : '+'}
                  </span>
                </button>
                {openAccordions.materials && (
                  <div className="pb-3 text-xs text-[#A0A0A0] space-y-1.5 font-light animate-fadeIn">
                    {product.accordions?.materials?.map((item, i) => (
                      <div key={i} className="flex justify-between py-0.5 border-b border-white/5 text-[11px]">
                        <span className="text-[#666666] uppercase text-[9px] tracking-wider">{item.label}</span>
                        <span className="text-white font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full py-2.5 flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className="text-[11px] uppercase tracking-[0.2em] text-white group-hover:text-[#C0C0C0] transition-colors">
                    Shipping & Returns
                  </span>
                  <span className="font-mono text-xs text-[#888888]">
                    {openAccordions.shipping ? '−' : '+'}
                  </span>
                </button>
                {openAccordions.shipping && (
                  <div className="pb-3 text-xs text-[#A0A0A0] space-y-1.5 font-light animate-fadeIn">
                    {product.accordions?.shipping?.map((item, i) => (
                      <div key={i} className="flex justify-between py-0.5 border-b border-white/5 text-[11px]">
                        <span className="text-[#666666] uppercase text-[9px] tracking-wider">{item.label}</span>
                        <span className="text-white font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CUSTOMER STORIES / REVIEWS (COMPACT HORIZONTAL RAIL)                   */}
      {/* Width: 400–500px, Height: 220–280px, Wheel-to-horizontal scrolling       */}
      {/* ========================================================================= */}
      <section id="customer-stories" className="border-t border-b border-white/10 bg-[#040404] py-14 px-4 sm:px-8 lg:px-12 overflow-hidden">
        <div className="max-w-[1400px] mx-auto mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#707070] block mb-1">
              Feedback & Verifications
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-wider text-white">
              Customer Stories
            </h2>
          </div>
          
          {/* Controls: Drag note + Arrow Navigation Buttons */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-[#707070] hidden sm:inline">
              Scroll or drag horizontally
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollStories('left')}
                className="w-8 h-8 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-colors flex items-center justify-center text-white cursor-pointer text-xs"
                aria-label="Previous story"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollStories('right')}
                className="w-8 h-8 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-colors flex items-center justify-center text-white cursor-pointer text-xs"
                aria-label="Next story"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Compact Horizontal Review Rail with Drag & Wheel Scroll */}
        <div
          ref={storiesRailRef}
          onMouseDown={handleStoriesMouseDown}
          className={`flex gap-5 overflow-x-auto pb-6 pt-1 snap-x scrollbar-none select-none ${
            isDraggingStories ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ scrollSnapType: 'x proximity', scrollBehavior: 'smooth' }}
        >
          {(product.reviews || []).map((rev) => (
            <div
              key={rev.id}
              className="w-[380px] sm:w-[440px] h-[230px] sm:h-[250px] shrink-0 snap-start border border-white/10 hover:border-white/30 bg-[#090909] p-5 sm:p-6 flex flex-col justify-between transition-colors rounded-sm"
            >
              <div>
                {/* Header: Patron Info + Rating */}
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 text-[11px] font-serif text-[#C0C0C0]">
                      {rev.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-white font-medium block">
                        {rev.name}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-emerald-400">
                        ✓ Verified Patron
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-[#C0C0C0] tracking-widest font-mono">
                      {'★'.repeat(rev.rating)}
                    </span>
                    <span className="text-[9px] text-[#707070] font-mono mt-0.5">
                      {rev.date}
                    </span>
                  </div>
                </div>

                {/* Review Title */}
                <h4 className="font-serif text-sm sm:text-base italic text-white mb-2 leading-snug line-clamp-1">
                  "{rev.title || rev.comment.slice(0, 50) + '...'}"
                </h4>

                {/* Review Text */}
                <p className="text-xs text-[#A0A0A0] font-light leading-relaxed line-clamp-3">
                  {rev.comment}
                </p>
              </div>

              {/* Bottom Line: Acquisition context */}
              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-[#707070]">
                <span>
                  {product.name} / {rev.color || 'Chrome'} • Size {rev.size}
                </span>
                <span className="font-mono text-[#888888]">
                  {rev.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. RELATED PRODUCTS (4 IN A ROW ON DESKTOP, 2 ON TABLET, 1 ON MOBILE)     */}
      {/* ========================================================================= */}
      <section className="py-14 px-4 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#707070] block mb-1">
              Complete The Look
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-wider text-white">
              Related Creations
            </h2>
          </div>
          <Link
            to="/#shop"
            className="text-xs uppercase tracking-wider text-[#C0C0C0] hover:text-white transition-colors"
          >
            View All →
          </Link>
        </div>

        {/* 4 Products in a Row Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {relatedProducts.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.slug}`)}
              className="group cursor-pointer flex flex-col justify-between border border-white/10 hover:border-white/30 bg-[#070707] p-3.5 transition-all"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#030303] mb-3">
                <img
                  src={item.gallery?.[0]?.src || item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 text-[8px] uppercase tracking-wider bg-black/80 px-2 py-0.5 text-[#C0C0C0] border border-white/10">
                  {item.collection}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-[#707070] block">
                  {item.category}
                </span>
                <h3 className="font-serif text-sm uppercase tracking-wider text-white group-hover:text-[#C0C0C0] transition-colors truncate">
                  {item.name}
                </h3>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-mono text-xs text-white font-light">
                    ₹{item.price}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#808080] group-hover:text-white transition-colors">
                    View →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SIZE GUIDE MODAL                                                       */}
      {/* ========================================================================= */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="border border-white/20 bg-[#0a0a0a] max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="absolute top-4 right-4 text-[#808080] hover:text-white transition-colors cursor-pointer text-lg"
              aria-label="Close size guide"
            >
              ✕
            </button>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#808080] block mb-1">
              Atelier Sizing
            </span>
            <h3 className="text-xl font-serif uppercase tracking-wider text-white mb-3 font-normal">
              Ring Sizing Specifications
            </h3>
            <p className="text-xs text-[#A0A0A0] mb-6 font-light leading-relaxed">
              Cosmic rings are engineered with our curved inner shank ("Comfort Fit"). If between sizes, choose your standard US size.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/20 text-[#707070] uppercase tracking-wider text-[9px]">
                    <th className="py-2 font-medium">US Size</th>
                    <th className="py-2 font-medium">Inside Diam.</th>
                    <th className="py-2 font-medium">Circumference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 font-mono text-[#C0C0C0]">
                  <tr><td className="py-2.5 text-white font-semibold">6</td><td>16.5 mm</td><td>51.9 mm</td></tr>
                  <tr><td className="py-2.5 text-white font-semibold">7</td><td>17.3 mm</td><td>54.4 mm</td></tr>
                  <tr><td className="py-2.5 text-white font-semibold">8</td><td>18.1 mm</td><td>57.0 mm</td></tr>
                  <tr><td className="py-2.5 text-white font-semibold">9</td><td>18.9 mm</td><td>59.5 mm</td></tr>
                  <tr><td className="py-2.5 text-white font-semibold">10</td><td>19.8 mm</td><td>62.1 mm</td></tr>
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => setSizeGuideOpen(false)}
              className="w-full py-3 chrome-button text-xs uppercase tracking-widest font-semibold cursor-pointer"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. LIGHTBOX MODAL                                                         */}
      {/* ========================================================================= */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxImage}
              alt="Cosmic jewelry fullscreen view"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 px-3 py-1.5 bg-black/80 border border-white/20 text-white text-xs tracking-widest uppercase cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
