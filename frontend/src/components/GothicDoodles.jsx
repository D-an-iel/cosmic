import React from 'react';

// Neon crimson sketchy punk star (matching the Figma reference)
export function PunkStar({ className = "w-10 h-10 text-[#FF1E44]", strokeWidth = 2 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Hand-drawn sketchy star loop */}
      <path
        d="M50 8 L62 38 L95 40 L69 62 L78 94 L50 74 L22 94 L31 62 L5 40 L38 38 Z"
        className="opacity-90"
      />
      {/* Overlapping secondary sketchy scribble line */}
      <path
        d="M48 12 L60 36 L92 42 L66 60 L75 90 L51 72 L25 91 L33 60 L8 42 L36 36 Z"
        className="opacity-60"
      />
      {/* Central spark */}
      <circle cx="50" cy="50" r="2.5" fill="currentColor" />
    </svg>
  );
}

// Hand-drawn sketchy heart (matching the Figma reference)
export function SketchyHeart({ className = "w-10 h-10 text-[#FF1E44]", strokeWidth = 2.5 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Primary doodle heart */}
      <path
        d="M50 88 C20 65 6 45 6 26 C6 13 16 5 30 5 C40 5 47 11 50 18 C53 11 60 5 70 5 C84 5 94 13 94 26 C94 45 80 65 50 88 Z"
      />
      {/* Scribbled internal loop accent */}
      <path
        d="M49 82 C28 62 14 44 14 28 C14 18 21 11 31 11 C38 11 44 16 48 23"
        strokeWidth={1.5}
        className="opacity-70"
      />
    </svg>
  );
}

// Barbed wire decorative divider (matching the Figma reference)
export function BarbedWireLine({ className = "w-full text-[#C0C0C0]" }) {
  return (
    <svg
      viewBox="0 0 800 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      preserveAspectRatio="none"
    >
      {/* Continuous wire strand */}
      <path d="M0 12 Q200 10, 400 12 T800 12" />
      {/* Twisted secondary strand */}
      <path d="M0 12 Q200 14, 400 12 T800 12" strokeDasharray="6 8" className="opacity-60" />

      {/* Barbs spaced along wire */}
      {[100, 250, 400, 550, 700].map((x) => (
        <g key={x}>
          {/* 4-point barb knots */}
          <line x1={x - 8} y1="4" x2={x + 8} y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1={x + 8} y1="4" x2={x - 8} y2="20" stroke="currentColor" strokeWidth="2" />
          <circle cx={x} cy="12" r="3" fill="#FF1E44" />
        </g>
      ))}
    </svg>
  );
}

// Sketchy marker arrows (like "-> Here <-" in Figma)
export function DoodleArrow({ direction = "right", className = "w-8 h-8 text-[#FF1E44]" }) {
  return (
    <svg
      viewBox="0 0 60 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} ${direction === "left" ? "scale-x-[-1]" : ""}`}
    >
      <path d="M5 20 H50" />
      <path d="M35 8 L52 20 L35 32" />
      <path d="M38 12 L50 20 L38 28" className="opacity-70" />
    </svg>
  );
}

// Hand-drawn cross / spark
export function GothicCross({ className = "w-6 h-6 text-[#FF1E44]" }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <line x1="20" y1="4" x2="20" y2="36" />
      <line x1="6" y1="18" x2="34" y2="18" />
      <line x1="10" y1="8" x2="30" y2="28" strokeWidth="1" className="opacity-50" />
      <line x1="30" y1="8" x2="10" y2="28" strokeWidth="1" className="opacity-50" />
    </svg>
  );
}
