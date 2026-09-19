import React, { useRef, useEffect, useState } from 'react';

const REVIEWS = [
  {
    id: 1,
    rating: 5,
    title: 'Substantial weight and razor-sharp bevels.',
    comment: 'The Lunar Silver Ring exceeded all expectations. In person the liquid rhodium mirror finish has incredible depth. The beveled facets catch light effortlessly.',
    author: 'Alexander V.',
    location: 'London, UK',
    product: 'Lunar Silver Ring',
    verified: true,
  },
  {
    id: 2,
    rating: 5,
    title: 'Closest thing to wearable liquid chrome.',
    comment: 'The Celestial Pendant curb chain is diamond-cut to perfection. The bespoke twist clasp mechanism feels like aerospace engineering. Pure luxury.',
    author: 'Elena R.',
    location: 'Milan, IT',
    product: 'Celestial Pendant',
    verified: true,
  },
  {
    id: 3,
    rating: 5,
    title: 'The monolith presentation box is a work of art.',
    comment: 'Unboxing was an event in itself. The Orbit Bracelet contours naturally without any uncomfortable pressure. Solid S925 with undeniable presence.',
    author: 'Marcus K.',
    location: 'Zurich, CH',
    product: 'Orbit Bracelet',
    verified: true,
  },
  {
    id: 4,
    rating: 5,
    title: 'Architectural, minimal, and permanent.',
    comment: 'The Nova Studs have threaded security backs that never come loose during travel or workouts. The geometric profile is distinct yet refined.',
    author: 'Sora T.',
    location: 'Tokyo, JP',
    product: 'Nova Studs',
    verified: true,
  },
  {
    id: 5,
    rating: 5,
    title: 'Flawless express courier to Mumbai.',
    comment: 'Delivered in pristine condition within 48 hours. The silver certificate and hallmark stamp confirm the authenticity. Will be back for the FW26 drop.',
    author: 'Devendra S.',
    location: 'Mumbai, IN',
    product: 'Lunar Silver Ring',
    verified: true,
  },
];

export default function CustomerReviews() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If reached the end, loop smoothly to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      className="w-full bg-[#050505] py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-white/10 font-aileron"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 px-1 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-amber-400 text-sm tracking-widest">★★★★★</span>
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#808080] font-mono">
                4.9 / 5.0 Average Patron Rating
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.2em] text-white font-normal">
              Customer Reviews
            </h2>
          </div>

          <div className="text-xs text-[#808080] uppercase tracking-[0.2em] font-mono">
            Verified Global Buyers • 140+ Reviews
          </div>
        </div>

        {/* Horizontal Slider (Touch friendly, auto scroll, focus on readability) */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="shrink-0 w-[84vw] sm:w-[380px] md:w-[400px] snap-start bg-[#0a0a0a] border border-white/10 p-6 md:p-8 flex flex-col justify-between hover:border-white/30 transition-colors"
            >
              <div className="space-y-4">
                {/* Stars and Product Tag */}
                <div className="flex items-center justify-between">
                  <div className="text-amber-400 tracking-wider text-sm">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#606060] font-mono">
                    {rev.product}
                  </span>
                </div>

                {/* Review Headline & Content */}
                <div className="space-y-2">
                  <h3 className="text-sm md:text-base text-white font-medium uppercase tracking-wider">
                    "{rev.title}"
                  </h3>
                  <p className="text-xs md:text-sm text-[#A0A0A0] font-light leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              </div>

              {/* Author & Verification */}
              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-white font-medium">
                    — {rev.author}
                  </div>
                  <div className="text-[10px] text-[#606060] font-mono">
                    {rev.location}
                  </div>
                </div>

                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-emerald-400/90 font-mono">
                    <span>✓</span> Verified Patron
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
