import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import heroEditorial from './assets/hero_editorial.jpg';
import lunarImg from './assets/lunar_collection.jpg';
import novaImg from './assets/nova_collection.jpg';
import eclipseImg from './assets/eclipse_collection.jpg';
import CinematicIntro from './components/CinematicIntro.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import CheckoutPage from './components/CheckoutPage.jsx';
import OrderSuccessPage from './components/OrderSuccessPage.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { PRODUCTS } from './data/products.js';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Intro state - only play on root homepage when not previously dismissed in session
  const [introActive, setIntroActive] = useState(() => {
    if (typeof window !== 'undefined') {
      const isRoot = window.location.pathname === '/' || window.location.pathname === '';
      const seen = sessionStorage.getItem('cosmic_intro_seen');
      return isRoot && !seen;
    }
    return false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Default cart with flagship Lunar Silver Ring
  const [cart, setCart] = useState([
    {
      id: "lunar-silver-ring-chrome-8",
      slug: "lunar-silver-ring",
      name: "Lunar Silver Ring",
      price: 799,
      color: "Chrome",
      size: "8",
      quantity: 1,
      material: "Solid 925 Silver • Liquid Rhodium Dip",
      image: PRODUCTS[0].gallery[0].src
    }
  ]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3200);
  };

  const addToCart = (productPayload) => {
    const itemToAdd = {
      id: productPayload.id || `${productPayload.slug}-${productPayload.color || 'silver'}-${productPayload.size || '8'}`,
      slug: productPayload.slug || 'lunar-silver-ring',
      name: productPayload.name,
      price: productPayload.price,
      color: productPayload.color || 'Chrome',
      size: productPayload.size || '8',
      quantity: productPayload.quantity || 1,
      material: productPayload.material || productPayload.shortDescription || 'Solid 925 Silver',
      image: productPayload.image || productPayload.gallery?.[0]?.src || lunarImg
    };

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === itemToAdd.id);
      if (existingIdx >= 0) {
        return prev.map((item, idx) =>
          idx === existingIdx
            ? { ...item, quantity: item.quantity + (productPayload.quantity || 1) }
            : item
        );
      }
      return [...prev, itemToAdd];
    });

    showToast(`Added "${itemToAdd.name}" to your bag`);
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

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = activeCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.type === activeCategory || p.collection?.includes(activeCategory));

  const isCheckoutOrSuccess = location.pathname === '/checkout' || location.pathname === '/order-success';

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C0C0C0] selection:text-black antialiased relative">
      <ScrollToTop />

      {/* 1. CINEMATIC LUXURY BRAND INTRO */}
      {introActive && (
        <CinematicIntro
          onComplete={() => {
            setIntroActive(false);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('cosmic_intro_seen', 'true');
            }
          }}
        />
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111]/95 border border-[#C0C0C0]/50 backdrop-blur-md px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-3 text-xs uppercase tracking-widest text-white animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#C0C0C0] animate-pulse" />
          {toastMessage}
        </div>
      )}

      {/* 2. TOP ANNOUNCEMENT BAR (Hidden on checkout to keep focus) */}
      {!isCheckoutOrSuccess && (
        <div className="bg-[#0A0A0A] border-b border-[#222222] py-2 px-4 text-[11px] uppercase tracking-[0.25em] text-center text-[#A0A0A0] flex items-center justify-center gap-4">
          <span>Complimentary Express Air Courier</span>
          <span className="text-[#444444]">•</span>
          <Link
            to="/product/lunar-silver-ring"
            className="text-white hover:text-[#C0C0C0] underline underline-offset-4 font-medium transition-colors"
          >
            Flagship Showroom: Lunar Silver Ring (₹799) →
          </Link>
        </div>
      )}

      {/* 3. STICKY LUXURY NAVBAR */}
      {!isCheckoutOrSuccess && (
        <header className="sticky top-0 z-40 bg-black/85 backdrop-blur-xl border-b border-white/10 transition-colors duration-300 font-aileron">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:text-[#C0C0C0] transition-colors p-2 -ml-2 cursor-pointer"
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
              <Link
                to="/#collections"
                onClick={() => {
                  if (location.pathname === '/') {
                    const el = document.getElementById("collections");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="hover:text-white transition-colors relative py-1 group cursor-pointer"
              >
                Collections
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 group-hover:w-full" />
              </Link>
              
              <Link
                to="/product/lunar-silver-ring"
                className={`transition-colors relative py-1 group cursor-pointer ${
                  location.pathname === '/product/lunar-silver-ring' ? 'text-white font-medium' : 'hover:text-white'
                }`}
              >
                Flagship: Lunar Ring (₹799)
                <span className={`absolute bottom-0 left-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 ${
                  location.pathname === '/product/lunar-silver-ring' ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>

              <Link
                to="/#shop"
                onClick={() => {
                  if (location.pathname === '/') {
                    const el = document.getElementById("shop");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="hover:text-white transition-colors relative py-1 group cursor-pointer"
              >
                Fine Jewelry
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link
                to="/#maison"
                onClick={() => {
                  if (location.pathname === '/') {
                    const el = document.getElementById("maison");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="hover:text-white transition-colors relative py-1 group cursor-pointer"
              >
                The Maison
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            {/* Center Brand Logo */}
            <Link
              to="/"
              className="flex flex-col items-center group cursor-pointer text-center"
            >
              <span className="font-aileron text-2xl md:text-3xl tracking-[0.2em] font-normal chrome-gradient-text group-hover:opacity-90 transition-opacity">
                Cosmic
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#707070] -mt-0.5 group-hover:text-[#A0A0A0] transition-colors">
                Haute Joaillerie
              </span>
            </Link>

            {/* Right Navigation / Bag */}
            <div className="flex items-center space-x-6 text-sm tracking-wide">
              <Link
                to="/#shop"
                onClick={() => {
                  if (location.pathname === '/') {
                    const el = document.getElementById("shop");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="hidden lg:inline text-[#A0A0A0] hover:text-white transition-colors"
              >
                Catalog
              </Link>
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
                <Link
                  to="/product/lunar-silver-ring"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left text-white font-medium py-2 border-b border-white/5 cursor-pointer"
                >
                  Lunar Silver Ring (₹799)
                </Link>
                <Link
                  to="/#collections"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (location.pathname === '/') {
                      const el = document.getElementById("collections");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-[#C0C0C0] hover:text-white py-2 border-b border-white/5"
                >
                  Collections
                </Link>
                <Link
                  to="/#shop"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (location.pathname === '/') {
                      const el = document.getElementById("shop");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-[#C0C0C0] hover:text-white py-2 border-b border-white/5"
                >
                  Fine Jewelry & Catalog
                </Link>
                <Link
                  to="/#maison"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (location.pathname === '/') {
                      const el = document.getElementById("maison");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-[#C0C0C0] hover:text-white py-2 border-b border-white/5"
                >
                  The Maison & Craft
                </Link>
              </nav>
              <div className="pt-4 text-xs tracking-wider text-[#707070]">
                Boutiques: Milan • Paris • New York • Tokyo • Mumbai
              </div>
            </div>
          )}
        </header>
      )}

      {/* ROUTES */}
      <Routes>
        {/* HOMEPAGE ROUTE */}
        <Route
          path="/"
          element={
            <HomePageContent
              filteredProducts={filteredProducts}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onAddToCart={addToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
              newsletterEmail={newsletterEmail}
              setNewsletterEmail={setNewsletterEmail}
              newsletterSubscribed={newsletterSubscribed}
              setNewsletterSubscribed={setNewsletterSubscribed}
            />
          }
        />

        {/* DEDICATED PRODUCT DETAILS PAGE ROUTES */}
        <Route
          path="/product"
          element={
            <ProductDetails
              key="product-root"
              onAddToCart={addToCart}
            />
          }
        />
        <Route
          path="/showroom"
          element={
            <ProductDetails
              key="showroom-root"
              onAddToCart={addToCart}
            />
          }
        />
        <Route
          path="/product/:slug"
          element={
            <ProductDetails
              key={location.pathname}
              onAddToCart={addToCart}
            />
          }
        />

        {/* DEDICATED CHECKOUT PAGE ROUTE */}
        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cart={cart}
              onClearCart={() => setCart([])}
            />
          }
        />

        {/* ORDER SUCCESS PAGE ROUTE */}
        <Route
          path="/order-success"
          element={<OrderSuccessPage />}
        />
      </Routes>

      {/* 4. FOOTER (Hidden on Checkout & Order Success) */}
      {!isCheckoutOrSuccess && (
        <footer className="border-t border-white/10 bg-[#030303] py-20 px-6 font-aileron">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            
            <div className="lg:col-span-2 space-y-6">
              <Link to="/" className="inline-block">
                <span className="font-aileron text-2xl tracking-[0.25em] font-normal chrome-gradient-text">
                  Cosmic
                </span>
              </Link>
              <p className="text-xs text-[#808080] font-light max-w-sm leading-relaxed">
                Sculptural fine jewelry and futuristic accessories engineered from solid 925 sterling silver and liquid rhodium. Forged for the modern icon.
              </p>
              <div className="text-xs text-[#606060] tracking-wider">
                Milanese Atelier • Registered Hallmark S925
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] text-white font-medium mb-4">
                Creations
              </h4>
              <ul className="space-y-3 text-xs text-[#808080]">
                <li><Link to="/product/lunar-silver-ring" className="hover:text-white transition-colors">Lunar Silver Ring (₹799)</Link></li>
                <li><Link to="/product/nova-eclipse-ring" className="hover:text-white transition-colors">Nova Eclipse Ring (₹849)</Link></li>
                <li><Link to="/product/celestial-pendant" className="hover:text-white transition-colors">Celestial Pendant (₹1299)</Link></li>
                <li><Link to="/product/orbit-bracelet" className="hover:text-white transition-colors">Orbit Bracelet (₹999)</Link></li>
                <li><Link to="/product/stellar-chain" className="hover:text-white transition-colors">Stellar Chain (₹1499)</Link></li>
                <li><Link to="/product/cosmic-signature-pendant" className="hover:text-white transition-colors">Cosmic Signature Pendant</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] text-white font-medium mb-4">
                Client Concierge
              </h4>
              <ul className="space-y-3 text-xs text-[#808080]">
                <li><Link to="/product/lunar-silver-ring" className="hover:text-white transition-colors">Ring Size Master</Link></li>
                <li><a href="#shop" className="hover:text-white transition-colors">Insured Shipping</a></li>
                <li><a href="#shop" className="hover:text-white transition-colors">30-Day Exchanges</a></li>
                <li><a href="#maison" className="hover:text-white transition-colors">Lifetime Care Service</a></li>
                <li><a href="mailto:concierge@cosmic-maison.com" className="hover:text-white transition-colors">Bespoke Inquiries</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] text-white font-medium mb-4">
                Maison
              </h4>
              <ul className="space-y-3 text-xs text-[#808080]">
                <li><a href="#maison" className="hover:text-white transition-colors">The Atelier</a></li>
                <li><a href="#maison" className="hover:text-white transition-colors">Sustainable 925</a></li>
                <li><a href="#shop" className="hover:text-white transition-colors">Press & Editorial</a></li>
                <li><a href="#shop" className="hover:text-white transition-colors">Global Boutiques</a></li>
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
              <a href="#" className="hover:text-white transition-colors">Authenticity Certificate</a>
            </div>
          </div>
        </footer>
      )}

      {/* QUICK VIEW PRODUCT MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#0a0a0a] border border-[#C0C0C0]/50 max-w-3xl w-full p-6 sm:p-8 overflow-hidden shadow-2xl animate-fade-in">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-[#888888] hover:text-white p-2 cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="aspect-square relative overflow-hidden border border-white/10 bg-neutral-900">
                <img
                  src={quickViewProduct.gallery?.[0]?.src || quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#888888] block mb-2">
                  {quickViewProduct.collection} • {quickViewProduct.category}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-[0.15em] text-white mb-3">
                  {quickViewProduct.name}
                </h3>
                <div className="font-mono text-2xl text-white mb-4 chrome-gradient-text font-bold">
                  ₹{quickViewProduct.price}
                </div>
                <p className="text-xs text-[#B0B0B0] font-light leading-relaxed mb-6">
                  {quickViewProduct.shortDescription || quickViewProduct.story}
                </p>

                <div className="space-y-3 mb-8 text-xs text-[#909090] border-t border-b border-white/10 py-4">
                  <div className="flex justify-between">
                    <span>Base Metal</span>
                    <span className="text-white font-medium">Solid 925 Sterling Silver</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Origin</span>
                    <span className="text-white font-medium">Milanese Atelier</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-emerald-400 font-medium">Complimentary Insured</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3.5 chrome-button text-xs uppercase tracking-[0.25em] font-semibold cursor-pointer"
                  >
                    Add To Bag
                  </button>
                  <button
                    onClick={() => {
                      setQuickViewProduct(null);
                      navigate(`/product/${quickViewProduct.slug}`);
                    }}
                    className="px-6 py-3.5 border border-white/30 text-xs uppercase tracking-widest text-[#C0C0C0] hover:text-white hover:border-white transition-colors cursor-pointer"
                  >
                    View Showroom →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING BAG SLIDE-OVER DRAWER */}
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
                    className="text-[#888888] hover:text-white p-2 cursor-pointer"
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
                    <span>Complimentary Express Air Courier Unlocked</span>
                    <span className="text-emerald-400 font-mono">₹0 FREE</span>
                  </div>
                  <div className="w-full bg-[#222222] h-1">
                    <div className="bg-[#C0C0C0] h-1 w-full" />
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
                          className="w-16 h-16 object-cover border border-white/10 bg-neutral-900 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm uppercase tracking-wider text-white truncate">
                            {item.name}
                          </h4>
                          <div className="flex gap-2 text-[10px] text-[#888888] mt-0.5">
                            {item.color && <span>{item.color}</span>}
                            {item.size && <span>• Size {item.size}</span>}
                          </div>
                          <span className="font-mono text-xs text-[#D0D0D0] mt-1 block">
                            ₹{item.price}
                          </span>
                        </div>
                        <div className="flex items-center border border-white/20">
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
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#666666] hover:text-red-400 text-xs p-1 cursor-pointer"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between text-xs uppercase tracking-widest text-[#888888] mb-2">
                  <span>Subtotal</span>
                  <span className="font-mono text-white text-base">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-[#666666] uppercase tracking-wider mb-6">
                  Complimentary luxury velvet packaging included.
                </p>
                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    setCartOpen(false);
                    navigate('/checkout');
                  }}
                  className={`w-full py-4 text-xs uppercase tracking-[0.3em] font-semibold text-center transition-all ${
                    cart.length === 0
                      ? "bg-[#222222] text-[#666666] cursor-not-allowed"
                      : "chrome-button cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  }`}
                >
                  Proceed To Checkout →
                </button>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full py-2.5 mt-2 text-[10px] uppercase tracking-widest text-[#707070] hover:text-white text-center cursor-pointer"
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

// =========================================================================
// HOMEPAGE COMPONENT (HERO, COLLECTIONS, SHOP CARDS, MAISON, NEWSLETTER)
// =========================================================================
function HomePageContent({
  filteredProducts,
  activeCategory,
  setActiveCategory,
  onAddToCart,
  onQuickView,
  newsletterEmail,
  setNewsletterEmail,
  newsletterSubscribed,
  setNewsletterSubscribed,
}) {
  const navigate = useNavigate();

  return (
    <>
      {/* DIRECT SHOWROOM ACCESS CALLOUT */}
      <div className="bg-gradient-to-r from-neutral-950 via-[#111111] to-neutral-950 border-b border-white/15 py-3 px-6 text-center text-xs tracking-wider flex flex-wrap items-center justify-center gap-3">
        <span className="text-[#C0C0C0] font-mono text-[11px]">✦ FLAGSHIP CREATION:</span>
        <span className="text-white font-serif tracking-[0.18em] uppercase text-sm font-medium">Lunar Silver Ring (₹799)</span>
        <Link
          to="/product/lunar-silver-ring"
          className="ml-2 px-4 py-1.5 chrome-button text-[10px] uppercase tracking-[0.25em] font-bold inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          <span>Enter Showroom</span>
          <span>→</span>
        </Link>
      </div>

      {/* 4. HERO SECTION */}
      <section className="relative min-h-[80vh] max-h-[850px] flex items-center justify-center overflow-hidden border-b border-white/10">
        {/* Background Editorial Image with Luxury Dark Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroEditorial}
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
            Premium accessories inspired by celestial elegance and sculpted in solid 925 sterling silver and liquid rhodium for the modern icon.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/product/lunar-silver-ring"
              className="w-full sm:w-auto px-10 py-4 chrome-button text-xs uppercase tracking-[0.3em] font-semibold cursor-pointer shadow-lg text-center"
            >
              Flagship: Lunar Ring (₹799)
            </Link>
            <a
              href="#shop"
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
            <h2 className="text-4xl md:text-5xl font-serif uppercase tracking-[0.18em] text-white">
              The Triple Cosmos
            </h2>
          </div>
          <p className="text-sm text-[#A0A0A0] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            Three distinct aesthetic dimensions forged through precision silversmithing, architectural geometric bevels, and liquid rhodium electro-deposition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Collection 1: Lunar */}
          <div className="group relative border border-white/10 bg-[#080808] transition-all duration-500 hover:border-[#C0C0C0]/60 flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
              <img
                src={lunarImg}
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
                  Architectural rings and tactile bands embodying the stark craters and reflective sheen of planetary satellites.
                </p>
              </div>
              <Link
                to="/product/lunar-silver-ring"
                className="text-xs uppercase tracking-[0.25em] text-white flex items-center gap-2 group-hover:gap-4 transition-all"
              >
                <span>Explore Lunar (₹799)</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Collection 2: Nova */}
          <div className="group relative border border-white/10 bg-[#080808] transition-all duration-500 hover:border-[#C0C0C0]/60 flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
              <img
                src={novaImg}
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
                  Orbital earrings and explosive radial geometry finished in brilliant mirror rhodium for dazzling movement.
                </p>
              </div>
              <Link
                to="/product/nova-eclipse-ring"
                className="text-xs uppercase tracking-[0.25em] text-white flex items-center gap-2 group-hover:gap-4 transition-all"
              >
                <span>Explore Nova (₹849)</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Collection 3: Eclipse */}
          <div className="group relative border border-white/10 bg-[#080808] transition-all duration-500 hover:border-[#C0C0C0]/60 flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
              <img
                src={eclipseImg}
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
              <Link
                to="/product/celestial-pendant"
                className="text-xs uppercase tracking-[0.25em] text-white flex items-center gap-2 group-hover:gap-4 transition-all"
              >
                <span>Explore Eclipse (₹1299)</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REDESIGNED SHOP & PRODUCT CARDS */}
      <section id="shop" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-[0.4em] text-[#999999] block mb-2">
              The Cosmic Collection
            </span>
            <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.2em] text-white">
              Fine Jewelry & Catalog
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {["All", "Rings", "Necklaces", "Bracelets"].map((cat) => (
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

        {/* Product Cards Grid: Redesigned according to Prompt Rules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.slug}`)}
              className="group border border-white/10 bg-[#080808] hover:border-[#C0C0C0] hover:shadow-[0_12px_40px_rgba(255,255,255,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
              title={`View ${product.name} Showroom`}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-neutral-900">
                <img
                  src={product.gallery?.[0]?.src || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] bg-black/80 backdrop-blur-md px-2.5 py-1 border border-white/15 text-[#D0D0D0]">
                  {product.tag}
                </div>

                {/* Clickable Hint Overlay */}
                <div className="absolute top-3 right-3 text-[9px] uppercase tracking-wider text-[#888888] group-hover:text-white bg-black/70 px-2 py-0.5 border border-white/10 transition-colors">
                  Showroom ↗
                </div>

                {/* Quick Action Overlay (Desktop) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickView(product);
                    }}
                    className="px-4 py-2.5 bg-black/90 border border-white/30 text-white text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer"
                  >
                    Quick View
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="px-4 py-2.5 chrome-button text-xs uppercase tracking-widest font-semibold cursor-pointer"
                  >
                    Add To Bag
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#808080] mb-1">
                    {product.category}
                  </div>
                  
                  {/* Product Name */}
                  <h3 className="font-serif text-xl tracking-[0.1em] text-white uppercase mb-2 group-hover:text-[#C0C0C0] transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-xs text-[#909090] tracking-wide mb-4 font-light line-clamp-2">
                    {product.shortDescription || product.story}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="font-mono text-base tracking-wider text-white font-semibold">
                    ₹{product.price}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-wider text-[#A0A0A0] group-hover:text-white transition-colors">
                      View Details →
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="md:hidden text-xs uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white px-2 py-1 border border-white/20"
                    >
                      + Bag
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. BRAND STORY & CRAFTSMANSHIP (THE MAISON) */}
      <section id="maison" className="py-24 px-6 max-w-7xl mx-auto border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] border border-white/20 relative overflow-hidden bg-neutral-900">
              <img
                src={heroEditorial}
                alt="COSMIC Atelier Craftsmanship"
                className="w-full h-full object-cover filter brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-black border border-white/20 p-6 max-w-xs hidden sm:block shadow-2xl">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#888888] block mb-1">Hallmark Registry</span>
              <p className="font-serif text-xs text-[#D0D0D0] italic">
                "Each piece bears the laser-inscribed star hallmark and official 925 certification."
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8 lg:pl-8">
            <div>
              <span className="text-[11px] uppercase tracking-[0.4em] text-[#999999] block mb-3">
                The Maison & Craft
              </span>
              <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.18em] text-white leading-tight mb-6">
                Born From The Void. Polished By Hand.
              </h2>
            </div>

            <p className="text-sm md:text-base text-[#B0B0B0] font-light leading-relaxed">
              Cosmic was founded in Milan with a singular vision: to dismantle the convention of generic luxury jewelry. We look beyond traditional filigree to embrace brutalist aerospace contours, celestial orbits, and the timeless weight of certified solid 925 sterling silver.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div>
                <span className="font-mono text-2xl text-white block mb-1">14-Step</span>
                <span className="text-[10px] uppercase tracking-widest text-[#888888]">
                  Liquid Rhodium Immersion
                </span>
              </div>
              <div>
                <span className="font-mono text-2xl text-white block mb-1">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-[#888888]">
                  Solid 925 Sterling Silver
                </span>
              </div>
              <div>
                <span className="font-mono text-2xl text-white block mb-1">0.02mm</span>
                <span className="text-[10px] uppercase tracking-widest text-[#888888]">
                  Micro-Facet Precision
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/product/lunar-silver-ring"
                className="inline-flex items-center gap-3 px-8 py-4 chrome-button text-xs uppercase tracking-[0.25em] font-semibold cursor-pointer"
              >
                <span>Experience Flagship Lunar Ring</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 8. NEWSLETTER / ATELIER DISPATCH */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <span className="text-[11px] uppercase tracking-[0.4em] text-[#999999] block mb-3">
          Atelier Dispatch
        </span>
        <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-[0.18em] text-white mb-4">
          Join The Cosmic Registry
        </h2>
        <p className="text-xs md:text-sm text-[#A0A0A0] max-w-md mx-auto mb-8 font-light leading-relaxed">
          Receive private invitations to limited batch drops, atelier archive exhibitions, and private previews.
        </p>

        {newsletterSubscribed ? (
          <div className="p-4 border border-white/20 bg-white/5 text-xs tracking-wider uppercase text-[#C0C0C0]">
            ✓ Your invitation is registered. Welcome to Maison Cosmic.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newsletterEmail) setNewsletterSubscribed(true);
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="ENTER YOUR EMAIL"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-[#0a0a0a] border border-white/20 px-5 py-3.5 text-xs text-white placeholder-[#606060] focus:border-[#C0C0C0] focus:outline-none tracking-widest uppercase"
            />
            <button
              type="submit"
              className="px-8 py-3.5 chrome-button text-xs uppercase tracking-[0.25em] font-semibold cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        )}
      </section>
    </>
  );
}
