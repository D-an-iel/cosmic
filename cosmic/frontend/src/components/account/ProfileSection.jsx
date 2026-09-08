import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfileSection = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#707070] block">
          Client Identity
        </span>
        <h2 className="text-4xl md:text-6xl font-serif italic leading-tight chrome-gradient-text">
          {user.name}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-4">
        <div className="flex flex-col space-y-1">
          <span className="text-[9px] uppercase tracking-widest text-[#505050]">Digital Registry</span>
          <span className="text-sm font-light text-white font-mono">{user.email}</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-[9px] uppercase tracking-widest text-[#505050]">Communication Line</span>
          <span className="text-sm font-light text-white font-mono">{user.phone || 'Not provided'}</span>
        </div>
      </div>

      <div className="pt-12">
        <div className="p-4 border border-white/10 bg-white/5 backdrop-blur-sm text-[10px] uppercase tracking-widest text-[#808080] leading-relaxed">
          Your relationship with Maison Cosmic is recorded in our private registry.
          Every acquisition is hallmarked and archived for eternity.
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
