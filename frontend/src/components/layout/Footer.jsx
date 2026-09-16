import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
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
            Maison
          </h4>
          <ul className="space-y-3 text-xs text-[#808080]">
            <li><Link to="/collections" className="hover:text-white transition-colors">Collections</Link></li>
            <li><Link to="/collections" className="hover:text-white transition-colors">Catalog</Link></li>
            <li><a href="#maison" className="hover:text-white transition-colors">The Maison</a></li>
            <li><Link to="/wishlist" className="hover:text-white transition-colors">Vault</Link></li>
            <li><a href="mailto:concierge@cosmic-maison.com" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-white font-medium mb-4">
            Social
          </h4>
          <ul className="space-y-3 text-xs text-[#808080]">
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-white transition-colors">X (Twitter)</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Pinterest</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-white font-medium mb-4">
            Legal
          </h4>
          <ul className="space-y-3 text-xs text-[#808080]">
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Authenticity Certificate</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#606060]">
        <div className="mb-4 md:mb-0">
          © {new Date().getFullYear()} COSMIC HAUTE JOAILLERIE S.P.A. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-6">
          <span className="text-white/40">Newsletter Subscription</span>
          <Link to="/" className="text-white/80 hover:text-white transition-colors">Unsubscribe</Link>
        </div>
      </div>
    </footer>
  );
}
