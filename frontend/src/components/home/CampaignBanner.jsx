import React from 'react';
import { Link } from 'react-router-dom';
import campaignImg from '../../assets/hero_editorial.jpg';

export default function CampaignBanner() {
  return (
    <section className="relative w-full min-h-[480px] md:min-h-[580px] flex items-center justify-center overflow-hidden bg-black font-aileron">
      {/* Edge-to-Edge Campaign Image */}
      <div className="absolute inset-0 select-none">
        <img
          src={campaignImg}
          alt="COSMIC FW26 Campaign - Forged In Intention"
          className="w-full h-full object-cover object-[center_35%] filter brightness-[0.6] contrast-[1.1]"
          loading="lazy"
        />
        {/* Subtle overlays for maximum luxury contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>

      {/* Campaign Storytelling Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center justify-center space-y-6">
        <div className="space-y-3">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-[#C0C0C0] font-mono block">
            Autumn / Winter 2026 Campaign
          </span>
          <h2 className="font-aileron text-3xl sm:text-5xl md:text-6xl uppercase tracking-[0.25em] text-white font-normal chrome-gradient-text">
            Cosmic FW26
          </h2>
          <p className="text-xs sm:text-sm md:text-base tracking-[0.35em] text-[#D0D0D0] uppercase font-light max-w-lg mx-auto">
            Forged In Intention
          </p>
        </div>

        <p className="text-xs text-[#888888] font-light max-w-md mx-auto leading-relaxed tracking-wider hidden sm:block">
          A relentless study of pure form, liquid rhodium reflection, and cosmic geometry engineered for permanent wear.
        </p>

        <div className="pt-3">
          <Link
            to="/collections"
            id="campaign-explore-collection-btn"
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 bg-transparent hover:bg-white text-white hover:text-black border border-white/40 hover:border-white text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-300 shadow-[0_0_25px_rgba(0,0,0,0.5)]"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
