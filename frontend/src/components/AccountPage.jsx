import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileSection from './account/ProfileSection';
import AddressManager from './account/AddressManager';
import OrderHistory from './account/OrderHistory';

export default function AccountPage({ onAddToCart, onOpenCart }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Resolve active tab from pathname or query param
  const resolveTab = () => {
    const path = location.pathname;
    if (path.includes('/orders')) return 'orders';
    if (path.includes('/addresses')) return 'addresses';

    const tabParam = searchParams.get('tab');
    if (tabParam === 'orders' || tabParam === 'acquisitions') return 'orders';
    if (tabParam === 'addresses' || tabParam === 'destinations') return 'addresses';
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState(resolveTab);

  useEffect(() => {
    setActiveTab(resolveTab());
  }, [location.pathname, searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'orders') {
      navigate('/account/orders');
    } else if (tabId === 'addresses') {
      navigate('/account/addresses');
    } else {
      navigate('/account');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { id: 'profile', label: 'Profile' },
    { id: 'addresses', label: 'Saved Addresses' },
    { id: 'orders', label: 'My Orders' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C0C0C0] selection:text-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        
        {/* Mobile Horizontal Tab Navigation (Sticky on Mobile) */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/10 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`px-4 py-2.5 rounded-full text-xs uppercase tracking-[0.18em] transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                  isActive
                    ? 'border-white bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : 'border-white/15 bg-black text-[#808080] hover:text-white hover:border-white/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-full text-xs uppercase tracking-[0.18em] text-red-400 border border-red-500/20 hover:border-red-500/50 bg-red-950/20 whitespace-nowrap cursor-pointer shrink-0 ml-auto"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Desktop Left Sidebar: Registry Navigation & Profile */}
          <aside className="hidden lg:block lg:w-1/4 space-y-12 sticky top-28 h-fit text-left">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#707070] block">
                Maison Cosmic
              </span>
              <h1 className="text-3xl font-serif uppercase tracking-wider text-white font-light">
                Account
              </h1>
            </div>

            <nav className="space-y-2">
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#505050] block mb-4">
                Vault Navigation
              </span>
              <div className="flex flex-col space-y-1.5">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleTabChange(item.id)}
                      className={`text-left py-3 text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-between cursor-pointer group ${
                        isActive
                          ? 'text-white border-l-2 border-white pl-4 font-medium'
                          : 'text-[#666666] hover:text-[#C0C0C0] pl-4 border-l-2 border-transparent'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`text-[10px] transition-transform ${isActive ? 'translate-x-1 text-white' : 'opacity-0 group-hover:opacity-100'}`}>
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="pt-8 border-t border-white/10">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left py-2 pl-4 text-xs uppercase tracking-[0.2em] text-[#888888] hover:text-red-400 hover:border-l-2 hover:border-red-500 transition-all cursor-pointer flex items-center justify-between"
              >
                <span>Logout</span>
                <span>⇥</span>
              </button>
            </div>
          </aside>

          {/* Right Main Content Panel */}
          <main className="flex-1 lg:max-w-4xl">
            {activeTab === 'profile' && <ProfileSection />}
            {activeTab === 'addresses' && <AddressManager />}
            {activeTab === 'orders' && (
              <OrderHistory
                onAddToCart={onAddToCart}
                onOpenCart={onOpenCart}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
