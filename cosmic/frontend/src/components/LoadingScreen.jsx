import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-center px-4">
      <div className="relative">
        {/* Cinematic Logo Animation */}
        <div className="relative z-10">
          <span className="font-serif text-4xl md:text-6xl tracking-[0.3em] uppercase text-white animate-pulse font-light">
            Cosmic
          </span>
          <span className="block text-[10px] tracking-[0.5em] uppercase text-[#C0C0C0] mt-2 animate-fade-in-up">
            Haute Joaillerie
          </span>
        </div>

        {/* Background Glow Effect */}
        <div className="absolute inset-0 -z-10 bg-white/5 blur-[120px] rounded-full scale-150 animate-pulse" />
      </div>

      {/* Bottom Loading Indicator */}
      <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3">
        <div className="w-32 h-px bg-white/10 overflow-hidden">
          <div className="h-full bg-white/60 animate-loading-bar" />
        </div>
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#707070] font-mono">
          Synchronizing Atelier...
        </span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s linear infinite;
          width: 40%;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}