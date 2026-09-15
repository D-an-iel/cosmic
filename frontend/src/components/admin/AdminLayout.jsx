import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  ShoppingBag,
  Gem,
  Users,
  Search,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Clock,
  Radio,
  SlidersHorizontal,
  Command,
  X,
  ArrowRight,
  ShieldCheck,
  Bell,
  Sparkles
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    return localStorage.getItem('cosmic_admin_sidebar') !== 'compact';
  });
  const [omnisearchOpen, setOmnisearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [selectedAtelier, setSelectedAtelier] = useState('Mumbai Flagship & Global Vault');

  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => {
      const next = !prev;
      localStorage.setItem('cosmic_admin_sidebar', next ? 'expanded' : 'compact');
      return next;
    });
  };

  // Keyboard shortcut listener for Omnisearch (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOmnisearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOmnisearchOpen(false);
        setProfileDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    {
      label: "Vue d'Ensemble",
      subLabel: "Command Center",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
      code: "01",
    },
    {
      label: "Commandes",
      subLabel: "Orders & Pipeline",
      path: "/admin/orders",
      icon: ShoppingBag,
      code: "02",
    },
    {
      label: "Catalogue & Pièces",
      subLabel: "Vault & Inventory",
      path: "/admin/products",
      icon: Gem,
      code: "03",
    },
    {
      label: "Clientèle Maison",
      subLabel: "VIP Patron Dossiers",
      path: "/admin/customers",
      icon: Users,
      code: "04",
    },
  ];

  const quickShortcuts = [
    { title: "View Urgent Dispatch Queue", path: "/admin/orders?status=PROCESSING", category: "Orders" },
    { title: "Review Low Stock Vault Items", path: "/admin/products", category: "Vault" },
    { title: "Browse Maison Obsidian VIP Clients", path: "/admin/customers?tier=MAISON+OBSIDIAN+VIP", category: "VIP" },
    { title: "Return to Maison Storefront", path: "/", category: "Navigation" },
  ];

  const filteredShortcuts = searchQuery
    ? quickShortcuts.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : quickShortcuts;

  const getActiveBreadcrumb = () => {
    if (location.pathname.startsWith('/admin/orders/')) return 'Commande Dossier';
    if (location.pathname === '/admin/orders') return 'Master Order Ledger';
    if (location.pathname === '/admin/products') return 'Catalogue & Vault';
    if (location.pathname === '/admin/customers') return 'Clientèle Directory';
    return 'Executive Command Center';
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col antialiased selection:bg-[#C0C0C0] selection:text-black">
      {/* 1. PERSISTENT TOP ATELIER COMMAND BAR */}
      <header className="h-16 bg-[#070707] border-b border-white/10 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
        {/* Left: Brand Identity & Atelier Switcher */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link to="/admin/dashboard" className="flex items-center gap-2 group">
            <span className="font-serif text-lg tracking-[0.25em] text-white group-hover:text-[#C0C0C0] transition-colors">
              COSMIC
            </span>
            <span className="text-[10px] tracking-[0.3em] text-[#707070] uppercase font-light hidden sm:inline">
              // ATELIER
            </span>
          </Link>

          <div className="h-4 w-px bg-white/10 hidden md:block" />

          {/* Atelier Selector */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#A0A0A0]">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <select
              value={selectedAtelier}
              onChange={(e) => setSelectedAtelier(e.target.value)}
              aria-label="Atelier Location Selector"
              className="bg-transparent text-xs text-[#C0C0C0] outline-none cursor-pointer hover:text-white transition-colors"
            >
              <option value="Mumbai Flagship & Global Vault" className="bg-[#111111] text-white">
                Mumbai Atelier & Vault
              </option>
              <option value="Milan Atelier & Salon" className="bg-[#111111] text-white">
                Milan Atelier & Salon
              </option>
              <option value="Paris Place Vendôme" className="bg-[#111111] text-white">
                Paris Place Vendôme
              </option>
              <option value="Global Online Operations" className="bg-[#111111] text-white">
                Global Online Operations
              </option>
            </select>
          </div>
        </div>

        {/* Center: Horological Clocks & Telemetry */}
        <div className="hidden xl:flex items-center gap-6 text-[11px] font-mono text-[#808080]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-white font-medium">BOM</span>
            <span>
              {currentTime.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">PAR</span>
            <span>
              {currentTime.toLocaleTimeString('en-US', {
                timeZone: 'Europe/Paris',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">NYC</span>
            <span>
              {currentTime.toLocaleTimeString('en-US', {
                timeZone: 'America/New_York',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </span>
          </div>
        </div>

        {/* Right: Omnisearch & Profile */}
        <div className="flex items-center gap-3">
          {/* Omnisearch Trigger */}
          <button
            onClick={() => setOmnisearchOpen(true)}
            className="flex items-center gap-2 bg-[#121212] hover:bg-[#1A1A1A] border border-white/10 hover:border-white/20 text-[#A0A0A0] hover:text-white px-3 py-1.5 text-xs transition-all cursor-pointer rounded-sm"
          >
            <Search className="w-3.5 h-3.5 text-[#808080]" />
            <span className="hidden sm:inline">Search (⌘K)</span>
            <kbd className="text-[10px] bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[#707070] font-mono hidden md:inline">
              ⌘K
            </kbd>
          </button>

          {/* Quick Storefront Link */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Preview Live Maison Storefront"
            className="p-2 text-[#808080] hover:text-white transition-colors border border-transparent hover:border-white/10 rounded-sm"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 border border-white/10 hover:border-white/20 bg-[#0E0E0E] transition-all cursor-pointer rounded-sm"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#333333] to-[#C0C0C0] flex items-center justify-center text-[10px] text-black font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-[11px] font-medium text-white leading-tight">
                  {user?.name || 'Directeur'}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-[#707070] font-mono leading-none">
                  SUPER ADMIN
                </div>
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0E0E0E] border border-white/15 p-2 shadow-2xl z-50 animate-fadeIn text-xs">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-[10px] uppercase tracking-widest text-[#707070]">Signed in as</p>
                  <p className="text-white font-medium truncate">{user?.email || 'admin@cosmic.com'}</p>
                </div>
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-2 text-[#A0A0A0] hover:text-white hover:bg-white/5 transition-colors"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Public Storefront</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Atelier</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY WORKSPACE: SIDEBAR + MAIN VIEW */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLLAPSIBLE NAVIGATION RAIL */}
        <aside
          className={`${
            sidebarExpanded ? 'w-64' : 'w-20'
          } bg-[#070707] border-r border-white/10 flex flex-col justify-between transition-all duration-300 select-none shrink-0`}
        >
          {/* Top Rail Section */}
          <div className="p-3 space-y-6">
            {/* Toggle Rail Button */}
            <div className="flex items-center justify-between px-2 pt-1">
              {sidebarExpanded ? (
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#606060] font-mono">
                  OPERATIONS SUITE
                </span>
              ) : (
                <span className="text-[9px] uppercase tracking-widest text-[#505050] mx-auto font-mono">
                  CMD
                </span>
              )}
              <button
                onClick={toggleSidebar}
                title={sidebarExpanded ? 'Compact Sidebar' : 'Expand Sidebar'}
                className="p-1 text-[#606060] hover:text-white transition-colors cursor-pointer"
              >
                {sidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-3 rounded-sm transition-all group relative ${
                      isActive
                        ? 'bg-white/10 text-white border-l-2 border-[#C0C0C0]'
                        : 'text-[#8A8A8A] hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#C0C0C0]' : 'text-[#606060] group-hover:text-white'
                      }`}
                    />

                    {sidebarExpanded && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium tracking-wide truncate">
                            {item.label}
                          </span>
                          <span className="text-[9px] font-mono text-[#505050] group-hover:text-[#808080]">
                            {item.code}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#606060] tracking-wider truncate">
                          {item.subLabel}
                        </p>
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Rail Section */}
          <div className="p-3 border-t border-white/10 space-y-2">
            {sidebarExpanded ? (
              <div className="p-3 bg-[#0E0E0E] border border-white/5 rounded-sm">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#707070] mb-1">
                  <span>Vault Security</span>
                  <span className="text-emerald-400">NOMINAL</span>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#C0C0C0] h-full w-[94%]" />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            )}

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-[#808080] hover:text-red-400 hover:bg-red-950/20 rounded-sm transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {sidebarExpanded && <span>Exit Operations</span>}
            </button>
          </div>
        </aside>

        {/* MAIN VIEWPORT */}
        <main className="flex-1 overflow-y-auto bg-black p-4 md:p-8 lg:p-10">
          {/* Breadcrumb Bar */}
          <div className="mb-6 flex items-center justify-between text-xs text-[#707070]">
            <div className="flex items-center gap-2">
              <Link to="/admin/dashboard" className="hover:text-white transition-colors">
                Maison Operations
              </Link>
              <span>/</span>
              <span className="text-white font-medium">{getActiveBreadcrumb()}</span>
            </div>

            <div className="text-[11px] font-mono text-[#606060] hidden sm:block">
              BUILD 2026.09 // HAUTE JOAILLERIE
            </div>
          </div>

          {/* Page Child Render */}
          {children}
        </main>
      </div>

      {/* 3. OMNISEARCH MODAL (⌘K) */}
      {omnisearchOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-xl bg-[#0C0C0C] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden animate-fadeIn">
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10">
              <Search className="w-4 h-4 text-[#808080] mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders (#ORD-...), patrons, SKUs, or actions..."
                autoFocus
                className="w-full bg-transparent text-sm text-white placeholder-[#505050] outline-none"
              />
              <button
                onClick={() => setOmnisearchOpen(false)}
                className="text-[#707070] hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions List */}
            <div className="p-3 max-h-80 overflow-y-auto space-y-1 text-xs">
              <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-[#606060]">
                Quick Atelier Actions
              </div>

              {filteredShortcuts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setOmnisearchOpen(false);
                    navigate(item.path);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded hover:bg-white/10 text-left text-white transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 bg-white/5 border border-white/10 text-[#A0A0A0]">
                      {item.category}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#505050] group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-[#080808] border-t border-white/5 flex items-center justify-between text-[10px] text-[#606060]">
              <span>Navigate with arrow keys</span>
              <span>ESC to dismiss</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
