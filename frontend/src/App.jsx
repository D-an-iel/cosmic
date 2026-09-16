import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './context/AuthContext.jsx';
import LuxuryAuthModal from './components/luxury-flow/LuxuryAuthModal.jsx';
import AuthGuard from './components/AuthGuard.jsx';
import lunarImg from './assets/lunar_collection.jpg';
import CinematicIntro from './components/CinematicIntro.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import CheckoutPage from './components/CheckoutPage.jsx';
import OrderSuccessPage from './components/OrderSuccessPage.jsx';
import PaymentTestPage from './components/PaymentTestPage.jsx';
import AccountPage from './components/AccountPage.jsx';
import OrderDetailsPage from './components/OrderDetailsPage.jsx';
import OrderTrackingPage from './components/account/OrderTrackingPage.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { PRODUCTS as STATIC_PRODUCTS } from './data/products.js';
import { useWishlist } from './context/WishlistContext.jsx';
import LuxuryWishlistVault from './components/luxury-mobile/LuxuryWishlistVault.jsx';
import ArchitecturalCampaignHero from './components/campaign-hero/ArchitecturalCampaignHero.jsx';
import CollectionsPage from './pages/CollectionsPage.jsx';
import EditorialFeaturedPieces from './components/storytelling/EditorialFeaturedPieces.jsx';
import BrandStory from './components/storytelling/BrandStory.jsx';
import CollectionsPreview from './components/storytelling/CollectionsPreview.jsx';
import Craftsmanship from './components/storytelling/Craftsmanship.jsx';
import SocialProof from './components/storytelling/SocialProof.jsx';
import Footer from './components/layout/Footer.jsx';

import AdminGuard from './components/admin/AdminGuard.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import AdminOrders from './components/admin/AdminOrders.jsx';
import AdminOrderDetail from './components/admin/AdminOrderDetail.jsx';
import AdminProducts from './components/admin/AdminProducts.jsx';
import AdminCustomers from './components/admin/AdminCustomers.jsx';
import AdminLogin from './components/admin/AdminLogin.jsx';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Permanent Brand Intro / Loading Screen - always plays when entering the root homepage
  const [introActive, setIntroActive] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('cosmic_intro_seen');
      } catch (e) {}
      return window.location.pathname === '/' || window.location.pathname === '';
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

  const isDedicatedExperience =
    location.pathname.startsWith('/admin') ||
    location.pathname === '/checkout' ||
    location.pathname === '/order-success';

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C0C0C0] selection:text-black antialiased relative">
      <ScrollToTop />

      {/* 0. APPLICATION LOADING STATE (Only when intro is not running) */}
      {appLoading && !isDedicatedExperience && !introActive && <LoadingScreen />}

      {/* 1. CINEMATIC LUXURY BRAND INTRO (Permanent loading intro) */}
      {introActive && (
        <CinematicIntro
          onComplete={() => {
            setIntroActive(false);
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

      {/* 2. TOP ANNOUNCEMENT BAR (Hidden on dedicated experiences) */}
      {!isDedicatedExperience && (
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

      {/* 3. STICKY LUXURY NAVBAR (Hidden on dedicated experiences) */}
      {!isDedicatedExperience && (
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
                to="/collections"
                className={`transition-colors relative py-1 group cursor-pointer ${
                  location.pathname === '/collections' ? 'text-white font-medium' : 'hover:text-white'
                }`}
              >
                Collections
                <span className={`absolute bottom-0 left-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 ${
                  location.pathname === '/collections' ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>

              <Link
                to="/collections"
                className="hover:text-white transition-colors relative py-1 group cursor-pointer text-[#A0A0A0]"
              >
                Catalog
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
                to="/#maison"
                onClick={() => {
                  if (location.pathname === '/') {
                    const el = document.getElementById("maison");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="hidden lg:inline text-[#A0A0A0] hover:text-white transition-colors relative py-1 group"
              >
                The Maison
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C0C0C0] transition-all duration-300 group-hover:w-full" />
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
                        {user.name && user.name !== 'OTP User' ? `Hello, ${user.name.split(' ')[0]}` : (user.phone ? user.phone : 'Account')}
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
                            to="/account"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center justify-between py-2 px-2.5 text-[#C0C0C0] hover:text-white hover:bg-white/5 transition-colors uppercase tracking-[0.15em] text-[11px]"
                          >
                            <span>Profile</span>
                            <span className="text-[#666666] text-[10px]">→</span>
                          </Link>
                          <Link
                            to="/account/addresses"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center justify-between py-2 px-2.5 text-[#C0C0C0] hover:text-white hover:bg-white/5 transition-colors uppercase tracking-[0.15em] text-[11px]"
                          >
                            <span>Saved Addresses</span>
                            <span className="text-[#666666] text-[10px]">→</span>
                          </Link>
                          <Link
                            to="/account/orders"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center justify-between py-2 px-2.5 text-[#C0C0C0] hover:text-white hover:bg-white/5 transition-colors uppercase tracking-[0.15em] text-[11px]"
                          >
                            <span>My Orders</span>
                            <span className="text-[#666666] text-[10px]">→</span>
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setAccountDropdownOpen(false)}
                            className="flex items-center justify-between py-2 px-2.5 text-[#C0C0C0] hover:text-white hover:bg-white/5 transition-colors uppercase tracking-[0.15em] text-[11px]"
                          >
                            <span className="flex items-center gap-2">
                              <span>Private Vault</span>
                              {wishlistCount > 0 && (
                                <span className="px-1.5 py-0.2 bg-white text-black font-bold text-[9px] rounded-full">
                                  {wishlistCount}
                                </span>
                              )}
                            </span>
                            <span className="text-[#666666] text-[10px]">→</span>
                          </Link>
                          {user?.role === 'ADMIN' && (
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setAccountDropdownOpen(false)}
                              className="flex items-center justify-between py-2 px-2.5 bg-white/10 hover:bg-white/15 text-white transition-colors uppercase tracking-[0.15em] text-[11px] font-semibold border border-white/20 mt-1"
                            >
                              <span className="flex items-center gap-1.5 text-[#C0C0C0]">
                                <span className="text-emerald-400">●</span> Atelier Operations
                              </span>
                              <span className="text-white text-[10px]">→</span>
                            </Link>
                          )}
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



              {/* Private Vault / Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-white hover:text-[#C0C0C0] transition-colors flex items-center gap-1.5 group cursor-pointer"
                aria-label="Private Vault"
              >
                <span className="text-sm tracking-wide hidden sm:inline text-[#A0A0A0] group-hover:text-white">
                  Vault
                </span>
                <div className="relative">
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </Link>

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
                        to="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 min-h-[44px] flex items-center justify-between text-[#C0C0C0] hover:text-white border-b border-white/5"
                      >
                        <span>Profile</span>
                        <span className="text-[#606060] text-xs">→</span>
                      </Link>
                      <Link
                        to="/account/addresses"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 min-h-[44px] flex items-center justify-between text-[#C0C0C0] hover:text-white border-b border-white/5"
                      >
                        <span>Saved Addresses</span>
                        <span className="text-[#606060] text-xs">→</span>
                      </Link>
                      <Link
                        to="/account/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 min-h-[44px] flex items-center justify-between text-[#C0C0C0] hover:text-white border-b border-white/5"
                      >
                        <span>My Orders</span>
                        <span className="text-[#606060] text-xs">→</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 min-h-[44px] flex items-center justify-between text-[#C0C0C0] hover:text-white border-b border-white/5"
                      >
                        <span className="flex items-center gap-2">
                          <span>Private Vault (Wishlist)</span>
                          {wishlistCount > 0 && (
                            <span className="px-1.5 py-0.5 text-[9px] bg-white text-black font-bold rounded-full">
                              {wishlistCount}
                            </span>
                          )}
                        </span>
                        <span className="text-[#606060] text-xs">→</span>
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-2.5 min-h-[44px] flex items-center justify-between text-white font-medium bg-white/10 px-2 my-1 border border-white/20"
                        >
                          <span className="flex items-center gap-2 text-xs uppercase tracking-wider">
                            <span className="text-emerald-400">●</span> Atelier Operations
                          </span>
                          <span className="text-white text-xs">→</span>
                        </Link>
                      )}
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
                  Maison Navigation
                </span>
                <Link
                  to="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left text-white font-medium py-2.5 px-1 border-b border-white/5 cursor-pointer flex items-center justify-between min-h-[44px]"
                >
                  <span>Collections</span>
                  <span className="text-[10px] text-[#808080] uppercase tracking-widest">Full Archive</span>
                </Link>
                <Link
                  to="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#C0C0C0] hover:text-white py-2.5 px-1 border-b border-white/5 min-h-[44px] flex items-center justify-between"
                >
                  <span>Catalog</span>
                  <span className="text-xs text-[#606060]">→</span>
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
                  className="text-[#C0C0C0] hover:text-white py-2.5 px-1 border-b border-white/5 min-h-[44px] flex items-center justify-between"
                >
                  <span>The Maison & Philosophy</span>
                  <span className="text-xs text-[#606060]">→</span>
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#C0C0C0] hover:text-white py-2.5 px-1 border-b border-white/5 min-h-[44px] flex items-center justify-between"
                >
                  <span>Private Vault</span>
                  <span className="text-xs text-[#606060]">→</span>
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
              onAddToCart={addToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
              newsletterEmail={newsletterEmail}
              setNewsletterEmail={setNewsletterEmail}
              newsletterSubscribed={newsletterSubscribed}
              setNewsletterSubscribed={setNewsletterSubscribed}
              totalCatalogCount={allProducts.length}
            />
          }
        />

        {/* DEDICATED COLLECTIONS EXPERIENCE */}
        <Route
          path="/collections"
          element={
            <CollectionsPage
              products={products}
              onAddToCart={addToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          }
        />
        <Route
          path="/catalog"
          element={
            <CollectionsPage
              products={products}
              onAddToCart={addToCart}
              onQuickView={(p) => setQuickViewProduct(p)}
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

        {/* ACCOUNT & DEDICATED ORDER ROUTES */}
        <Route
          path="/account"
          element={
            <AuthGuard>
              <AccountPage onAddToCart={addToCart} onOpenCart={() => setCartOpen(true)} />
            </AuthGuard>
          }
        />
        <Route
          path="/account/orders"
          element={
            <AuthGuard>
              <AccountPage onAddToCart={addToCart} onOpenCart={() => setCartOpen(true)} />
            </AuthGuard>
          }
        />
        <Route
          path="/account/addresses"
          element={
            <AuthGuard>
              <AccountPage onAddToCart={addToCart} onOpenCart={() => setCartOpen(true)} />
            </AuthGuard>
          }
        />
        <Route
          path="/account/orders/:id"
          element={
            <AuthGuard>
              <OrderDetailsPage onAddToCart={addToCart} onOpenCart={() => setCartOpen(true)} />
            </AuthGuard>
          }
        />
        <Route
          path="/account/order/:id"
          element={
            <AuthGuard>
              <OrderDetailsPage onAddToCart={addToCart} onOpenCart={() => setCartOpen(true)} />
            </AuthGuard>
          }
        />
        <Route
          path="/account/orders/:id/tracking"
          element={
            <AuthGuard>
              <OrderTrackingPage />
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
        {/* LUXURY WISHLIST VAULT */}
        <Route
          path="/wishlist"
          element={<LuxuryWishlistVault />}
        />



        {/* ADMIN LUXURY OPERATIONS CENTER */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminGuard>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminGuard>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminGuard>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminGuard>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </AdminGuard>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <AdminGuard>
              <AdminLayout>
                <AdminOrderDetail />
              </AdminLayout>
            </AdminGuard>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminGuard>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </AdminGuard>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <AdminGuard>
              <AdminLayout>
                <AdminCustomers />
              </AdminLayout>
            </AdminGuard>
          }
        />
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />
      </Routes>

      {/* 4. FOOTER (Hidden on dedicated experiences) */}
      {!isDedicatedExperience && (
        <Footer />
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

                {/* Curated Suite Recommendations (Minimalist, Zero Carousel) */}
                {allProducts.length > 0 && (
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] font-mono block mb-3">
                      Complete The Suite
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {allProducts
                        .filter((p) => !cart.some((c) => c.productId === p.id || c.slug === p.slug))
                        .slice(0, 2)
                        .map((rec) => (
                          <button
                            key={rec.id}
                            type="button"
                            onClick={() => {
                              setCartOpen(false);
                              navigate(`/product/${rec.slug}`);
                            }}
                            className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 hover:border-white/30 text-left transition-all cursor-pointer group rounded-sm"
                          >
                            <img
                              src={rec.images?.[0]?.src || rec.gallery?.[0]?.src || rec.image}
                              alt={rec.name}
                              className="w-10 h-10 object-cover bg-neutral-900 border border-white/10 shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="text-[10px] uppercase font-serif text-white truncate group-hover:text-[#C0C0C0] transition-colors">
                                {rec.name}
                              </h5>
                              <span className="text-[9px] font-mono text-[#A0A0A0]">₹{rec.price}</span>
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
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
      <LuxuryAuthModal
        isOpen={isGlobalLoginModalOpen}
        onClose={() => setIsGlobalLoginModalOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setIsGlobalLoginModalOpen(false);
          const patronName = loggedInUser?.name && loggedInUser?.name !== 'OTP User'
            ? loggedInUser.name
            : (loggedInUser?.phone || 'Patron');
          showToast(`✦ Welcome to Maison Cosmic, ${patronName}`);
          navigate('/account');
        }}
      />
    </div>
  );
}

function HomePageContent({
  onAddToCart,
  onQuickView,
  newsletterEmail,
  setNewsletterEmail,
  newsletterSubscribed,
  setNewsletterSubscribed,
  totalCatalogCount = 9,
}) {
  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1: ARCHITECTURAL SPLIT-IMAGE CAMPAIGN HERO */}
      <ArchitecturalCampaignHero />

      {/* SECTION 2: FEATURED PIECES (4 Signature Products with GSAP ScrollTrigger Storytelling) */}
      <EditorialFeaturedPieces
        onAddToCart={onAddToCart}
        onQuickView={onQuickView}
      />

      {/* SECTION 3: THE MAISON / BRAND STORY */}
      <BrandStory />

      {/* SECTION 4: COLLECTIONS PREVIEW */}
      <CollectionsPreview />

      {/* SECTION 5: CRAFTSMANSHIP / MATERIALS */}
      <Craftsmanship />

      {/* SECTION 6: SOCIAL PROOF / EDITORIAL MENTIONS */}
      <SocialProof />

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