import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import ProfileSection from './account/ProfileSection';
import AddressManager from './account/AddressManager';
import OrderHistory from './account/OrderHistory';

const AccountPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const getInitialTab = () => {
    const tabParam = searchParams.get('tab') || location.state?.tab;
    if (tabParam === 'orders' || tabParam === 'acquisitions') return 'acquisitions';
    if (tabParam === 'addresses' || tabParam === 'destinations') return 'destinations';
    return 'identity';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab') || location.state?.tab;
    if (tabParam === 'orders' || tabParam === 'acquisitions') {
      setActiveTab('acquisitions');
    } else if (tabParam === 'addresses' || tabParam === 'destinations') {
      setActiveTab('destinations');
    } else if (tabParam === 'identity') {
      setActiveTab('identity');
    }
  }, [searchParams, location.state]);

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#C0C0C0] selection:text-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

          {/* LEFT SIDEBAR: Identity & Navigation */}
          <aside className="lg:w-1/3 space-y-16 sticky top-24 h-fit">
            <ProfileSection />

            <nav className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#505050] block mb-6">
                Registry Navigation
              </span>
              <div className="flex flex-col space-y-2">
                {[
                  { id: 'identity', label: 'Client Identity' },
                  { id: 'destinations', label: 'Atelier Destinations' },
                  { id: 'acquisitions', label: 'Acquisition Archive' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-left py-2 text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                      activeTab === tab.id
                        ? "text-white border-l-2 border-white pl-4"
                        : "text-[#666666] hover:text-[#C0C0C0] pl-4 border-l-2 border-transparent"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* RIGHT CONTENT AREA: Dynamic Registry Views */}
          <main className="lg:w-2/3 min-w-0">
            {activeTab === 'identity' && (
              <div className="animate-fadeIn space-y-12">
                <div className="border border-white/10 p-8 bg-white/[0.02] backdrop-blur-sm">
                  <h2 className="text-2xl font-serif uppercase tracking-wider text-white mb-6">Registry Status</h2>
                  <p className="text-sm text-[#A0A0A0] font-light leading-relaxed max-w-2xl">
                    Welcome to your private vault. Here you can refine your identity, manage the
                    coordinated delivery of your commissions, and review your collection's provenance.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                    <div className="p-4 border border-white/10 bg-black/40">
                      <span className="text-[10px] uppercase tracking-widest text-[#666666] block mb-1">Account Tier</span>
                      <span className="text-xs text-white font-medium tracking-wider uppercase">Patron</span>
                    </div>
                    <div className="p-4 border border-white/10 bg-black/40">
                      <span className="text-[10px] uppercase tracking-widest text-[#666666] block mb-1">Registry Date</span>
                      <span className="text-xs text-white font-medium tracking-wider">September 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'destinations' && <AddressManager />}
            {activeTab === 'acquisitions' && <OrderHistory />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
