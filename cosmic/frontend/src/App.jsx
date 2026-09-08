import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import OtpLoginModal from './components/modals/OtpLoginModal.jsx';
import AuthGuard from './components/AuthGuard.jsx';
import heroEditorial from './assets/hero_editorial.jpg';
import lunarImg from './assets/lunar_collection.jpg';
import novaImg from './assets/nova_collection.jpg';
import eclipseImg from './assets/eclipse_collection.jpg';
import CinematicIntro from './components/CinematicIntro.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import CheckoutPage from './components/CheckoutPage.jsx';
import OrderSuccessPage from './components/OrderSuccessPage.jsx';
import PaymentTestPage from './components/PaymentTestPage.jsx';
import AccountPage from './components/AccountPage.jsx';
import OrderDetailsPage from './components/OrderDetailsPage.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { PRODUCTS as STATIC_PRODUCTS } from './data/products.js';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isGlobalLoginModalOpen, setIsGlobalLoginModalOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    };
    if (accountDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [accountDropdownOpen]);

  useEffect(() => {
    setAccountDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setAccountDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  // Intro state - only play on root homepage when not previously dismissed in session
  const [introActive, setIntroActive] = useState(() => {
    if (typeof window !== 'undefined') {
      const isRoot = window.location.pathname === '/' || window.location.pathname === '';
      return isRoot; // Temporarily removed session check to ensure visibility during testing
    }
    return false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/products');
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setAppLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Default cart with flagship Lunar Silver Ring
  const [cart, setCart] = useState([
    {
      productId: "34bbdbad-11bb-4ffc-a641-dae851c1ad52",
      id: "lunar-silver-ring-chrome-8",
      slug: "lunar-silver-ring",
      name: "Lunar Silver Ring",
      price: 799,
      color: "Chrome",
      size: "8",
      quantity: 1,
      material: "Solid 925 Silver • Liquid Rhodium Dip",
      image: STATIC_PRODUCTS[0].gallery[0].src
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
    const resolvedPid = productPayload.productId || productPayload.id || '34bbdbad-11bb-4ffc-a641-dae851c1ad52';
    const itemToAdd = {
      productId: resolvedPid,
      id: resolvedPid ? `${resolvedPid}-${productPayload.color || 'silver'}-${productPayload.size || '8'}` : `${productPayload.slug}-${productPayload.color || 'silver'}-${productPayload.size || '8'}`,
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

  const allProducts = products.length > 0 ? products : STATIC_PRODUCTS;

  const filteredProducts = activeCategory === "All"
    ? allProducts
    : allProducts.filter((p) => {
        const cat = p.category?.toLowerCase() || "";
        const search = activeCategory.toLowerCase();
        return cat.includes(search.toLowerCase());
      });

  const isCheckoutOrSuccess = location.pathname === '/checkout' || location.pathname === '/order-success';

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C0C0C0] selection:text-black antialiased relative">
      <ScrollToTop />

      {/* 0. APPLICATION LOADING STATE */}
      {appLoading && <LoadingScreen />}

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

            {/* Right Navigation / Bag & Account */}
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

              {/* Desktop Auth State Trigger */}
              <div className="hidden md:flex items-center">
                {!user ? (
                  <button
                    onClick={() => setIsGlobalLoginModalOpen(true)}
                    className="text-xs uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white transition-colors py-1 relative group cursor-pointer"
                  >
                    Login
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
                  </button>
                ) : (
                  <div className="relative" ref={accountDropdownRef}>
                    <button
                      onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                      className="text-xs uppercase tracking-[0.2em] text-[#E0E0E0] hover:text-white transition-colors py-1 flex items-center gap-1.5 cursor-pointer group"
                    >
                      <span className="truncate max-w-[130px]">
                        {user.name ? `Hello, ${user.name.split(' ')[0]}` : 'Account'}
                      </span>
                      <svg
                        className={`w-3 h-3 text-[#A0A0A0] transition-transform duration-200 ${accountDropdownOpen ? 'rotate-180 text-white' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Desktop Luxury Dropdown Menu */}
                    {accountDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-64 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/15 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-50 animate-fade-in font-aileron">
                        <div className="pb-3 mb-3 border-b border-white/10">
                          <span className="text-[9px] uppercase tracking-[0.3em] text-[#707070] block">
                            Patron Registry
                          </span>
                          <div className="text-xs text-white font-medium truncate mt-0.5">
                            {user.name || 'Cosmic Patron'}
                          </div>
                          <div className="text-[10px] text-[#888888] font-mono truncate mt-0.5">
                            {user.email || user.phone || 'Authenticated'}
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <Link
                            to="/account?tab=orders"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center justify-between py-2 px-2.5 text-[#C0C0C0] hover:text-white hover:bg-white/5 transition-colors uppercase tracking-[0.15em] text-[11px]"
                          >
                            <span>My Orders</span>
                            <span className="text-[#666666] text-[10px]">→</span>
                          </Link>
                          <Link
                            to="/account?tab=addresses"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center justify-between py-2 px-2.5 text-[#C0C0C0] hover:text-white hover:bg-white/5 transition-colors uppercase tracking-[0.15em] text-[11px]"
                          >
                            <span>Saved Addresses</span>
                            <span className="text-[#666666] text-[10px]">→</span>
                          </Link>
                          <Link
                            to="/account"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center justify-between py-2 px-2.5 text-[#C0C0C0] hover:text-white hover:bg-white/5 transition-colors uppercase tracking-[0.15em] text-[11px]"
                          >
                            <span>Client Registry</span>
                            <span className="text-[#666666] text-[10px]">→</span>
                          </Link>
                        </div>

                        <div className="pt-2 mt-2 border-t border-white/10">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left py-2 px-2.5 text-[10px] uppercase tracking-[0.2em] text-[#888888] hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer flex items-center justify-between"
                          >
                            <span>Logout</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Shopping Bag */}
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
            <div className="md:hidden bg-[#0a0a0a] border-b border-white/10 px-4 sm:px-6 py-6 space-y-6 font-aileron max-h-[85vh] overflow-y-auto">
              {/* Account Section in Mobile Menu */}
              <div className="p-4 border border-white/10 bg-white/[0.02]">
                {!user ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#707070]">
                        Client Services
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#505050]">
                        Guest
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsGlobalLoginModalOpen(true);
                      }}
                      className="w-full py-3 min-h-[44px] chrome-button text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(192,192,192,0.2)]"
                    >
                      <span>✦</span>
                      <span>Login / Client Access</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#707070] block">
                          Patron
                        </span>
                        <div className="text-xs text-white font-medium truncate max-w-[180px]">
                          {user.name || 'Cosmic Patron'}
                        </div>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 border border-white/20 text-[#A0A0A0]">
                        Vault Active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1 text-xs uppercase tracking-[0.15em]">
                      <Link
                        to="/account?tab=orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 min-h-[44px] flex items-center justify-between text-[#C0C0C0] hover:text-white border-b border-white/5"
                      >
                        <span>My Orders</span>
                        <span className="text-[#606060] text-xs">→</span>
                      </Link>
                      <Link
                        to="/account?tab=addresses"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 min-h-[44px] flex items-center justify-between text-[#C0C0C0] hover:text-white border-b border-white/5"
                      >
                        <span>Saved Addresses</span>
                        <span className="text-[#606060] text-xs">→</span>
                      </Link>
                      <Link
                        to="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 min-h-[44px] flex items-center justify-between text-[#C0C0C0] hover:text-white border-b border-white/5"
                      >
                        <span>Client Registry</span>
                        <span className="text-[#606060] text-xs">→</span>
                      </Link>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full py-2.5 min-h-[44px] text-[10px] uppercase tracking-[0.2em] text-[#888888] hover:text-red-400 border border-white/10 hover:border-red-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <span>Logout</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Navigation Links */}
              <nav className="flex flex-col space-y-1 text-sm tracking-wide">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#606060] mb-2 px-1">
                  Maison Collections
                </span>
                <Link
                  to="/product/lunar-silver-ring"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left text-white font-medium py-2.5 px-1 border-b border-white/5 cursor-pointer flex items-center justify-between min-h-[44px]"
                >
                  <span>Lunar Silver Ring (₹799)</span>
                  <span className="text-[10px] text-[#808080] uppercase tracking-widest">Flagship</span>
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
                  className="text-[#C0C0C0] hover:text-white py-2.5 px-1 border-b border-white/5 min-h-[44px] flex items-center"
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
                  className="text-[#C0C0C0] hover:text-white py-2.5 px-1 border-b border-white/5 min-h-[44px] flex items-center"
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
                  className="text-[#C0C0C0] hover:text-white py-2.5 px-1 border-b border-white/5 min-h-[44px] flex items-center"
                >
                  The Maison & Craft
                </Link>
              </nav>

              <div className="pt-2 text-[10px] tracking-wider text-[#606060] uppercase border-t border-white/5">
                Milan • Paris • New York • Tokyo • Mumbai
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
          path="/account"
          element={
            <AuthGuard>
              <AccountPage />
            </AuthGuard>
          }
        />
        <Route
          path="/account/order/:id"
          element={
            <AuthGuard>
              <OrderDetailsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/checkout"
          element={
            <AuthGuard>
              <CheckoutPage
                cart={cart}
                onClearCart={() => setCart([])}
              />
            </AuthGuard>
          }
        />

        {/* ORDER SUCCESS PAGE ROUTE */}
        <Route
          path="/order-success"
          element={<OrderSuccessPage />}
        />
        <Route
          path="/payment-test"
          element={<PaymentTestPage />}
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
                <li><Link to="/account" className="hover:text-white transition-colors">Client Registry</Link></li>
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

                <div className="space-y-3 mb-8 text-xs text-[#9090도] border-t border-b border-white/10 py-4">
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

      {/* GLOBAL AUTH MODAL */}
      <OtpLoginModal
        isOpen={isGlobalLoginModalOpen}
        onClose={() => setIsGlobalLoginModalOpen(false)}
        onLoginSuccess={() => setIsGlobalLoginModalOpen(false)}
      />
    </div>
  );
}

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
  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] w-full overflow-hidden flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 z-0">
          <img
            src={heroEditorial}
            alt="Cosmic Hero"
            className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-6 animate-fade-in-up">
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#C0C0C0] block mb-2">
            Maison Cosmic
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif uppercase tracking-tighter text-white font-normal leading-[0.9]">
            Sculpting the <br />
            <span className="chrome-gradient-text italic">Celestial</span> Void
          </h1>
          <p className="text-sm md:text-base text-[#A0A0A0] font-light max-w-xl mx-auto leading-relaxed tracking-wide">
            Architectural fine jewelry engineered from solid 925 sterling silver.
            Forged in our Milanese atelier for the modern icon.
          </p>
          <div className="pt-8">
            <a
              href="#shop"
              className="inline-block px-10 py-4 chrome-button text-xs uppercase tracking-[0.3em] font-bold transition-all hover:scale-105"
            >
              Enter The Showroom
            </a>
          </div>
        </div>
      </section>

      {/* 2. COLLECTIONS FILTER */}
      <section id="collections" className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl font-serif uppercase tracking-wider text-white">The Collections</h2>
          <div className="w-12 h-px bg-[#C0C0C0] mx-auto" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
          {["All", "Rings", "Necklaces", "Bracelets"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] transition-all border ${
                activeCategory === cat
                ? "border-white text-white bg-white/10"
                : "border-white/20 text-[#707070] hover:border-white/50 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. PRODUCT SHOP GRID */}
      <section id="shop" className="py-20 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filteredProducts.map((product, index) => {
            const imgUrl = product.images?.[0]?.src || product.gallery?.[0]?.src || product.image || '/assets/lunar_collection.jpg';
            const isFlagship = index === 0;

            return (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className={`group relative flex flex-col transition-all duration-500 ${
                  isFlagship ? 'lg:col-span-2 lg:row-span-1' : ''
                }`}
              >
                {/* Image Container */}
                <div className={`relative overflow-hidden bg-[#050505] chrome-border-refined group-hover:border-white/30 transition-all ${
                  isFlagship ? 'aspect-[16/9] lg:aspect-[21/9]' : 'aspect-[3/4]'
                }`}>
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter brightness-90"
                    onError={(e) => {
                      e.target.src = '/assets/lunar_collection.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onQuickView(product);
                      }}
                      className="px-4 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-[#C0C0C0] transition-colors"
                    >
                      Quick View
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="p-2 bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-black transition-all"
                      title="Add to Bag"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute top-3 left-3 text-[8px] uppercase tracking-widest bg-black/60 px-2 py-0.5 text-[#C0C0C0] border border-white/10">
                    {product.tag || product.category}
                  </div>
                </div>

                {/* Details */}
                <div className={`pt-6 space-y-1 ${isFlagship ? 'text-left' : 'text-center'}`}>
                  <h3 className={`font-serif uppercase tracking-wider text-white group-hover:text-[#C0C0C0] transition-colors ${isFlagship ? 'text-xl sm:text-2xl' : 'text-sm'}`}>
                    {product.name}
                  </h3>
                  <p className="font-mono text-xs text-[#A0A0A0] tracking-tighter">
                    ₹{product.price}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-[#707070] uppercase tracking-widest text-xs">
            No creations found in this category.
          </div>
        )}
      </section>

      {/* 4. MAISON STORY SECTION */}
      <section id="maison" className="py-32 bg-[#050505] border-y border-white/5 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative">
            <img
              src={lunarImg}
              alt="Atelier Craft"
              className="w-full aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-1000 border border-white/10"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-white/20 -z-10" />
          </div>
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#707070] block">
                Our Philosophy
              </span>
              <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-tight text-white leading-tight">
                Engineering <br /> The Eternal
              </h2>
            </div>
            <p className="text-sm text-[#A0A0A0] font-light leading-relaxed tracking-wide">
              Cosmic is not merely jewelry; it is architectural exploration. We combine
              the purity of solid 925 sterling silver with liquid rhodium finishes to
              create pieces that transcend temporal trends.
            </p>
            <p className="text-sm text-[#A0A0A0] font-light leading-relaxed tracking-wide">
              Each piece is individually hand-finished in our Milanese atelier, ensuring
              that the geometry of the void is captured in every bevel and curve.
            </p>
            <div className="pt-4">
              <a href="/#shop" className="text-xs uppercase tracking-widest text-white border-b border-white/30 pb-1 hover:border-white transition-all">
                Discover the Craft →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER */}
      <section className="py-32 px-4 max-w-3xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-serif uppercase tracking-wider text-white">Join The Circle</h2>
          <p className="text-xs text-[#707070] uppercase tracking-widest leading-relaxed">
            Receive early access to limited drops and atelier notes.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setNewsletterSubscribed(true);
          }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Email Address"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="flex-1 bg-transparent border border-white/20 px-4 py-3 text-xs uppercase tracking-widest text-white focus:border-white outline-none transition-all"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 chrome-button text-xs uppercase tracking-widest font-bold"
          >
            {newsletterSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </form>
      </section>
    </div>
  );
}