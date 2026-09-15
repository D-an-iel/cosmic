import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { Trash2, ArrowRight, ArrowLeft, Sparkles, Gem, ShoppingBag } from 'lucide-react';
import FloatingBuyNowDrawer from './FloatingBuyNowDrawer.jsx';

export default function LuxuryWishlistVault() {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const [selectedProductForBuyNow, setSelectedProductForBuyNow] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C0C0C0] selection:text-black antialiased py-12 px-4 sm:px-8 max-w-4xl mx-auto space-y-10">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <Link
            to="/"
            className="text-xs text-[#707070] hover:text-white transition-colors inline-flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Maison Showroom</span>
          </Link>
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#707070] block font-mono">
            Maison Vault • Private Curation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl uppercase tracking-wider text-white font-light">
            Your Collection
          </h1>
        </div>

        <div className="text-right">
          <span className="font-mono text-sm text-[#C0C0C0]">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'Creation' : 'Creations'}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-[0.3em] text-[#707070]">
            Accessing Private Vault...
          </p>
        </div>
      ) : wishlistItems.length === 0 ? (
        /* Empty State */
        <div className="py-24 text-center space-y-6 max-w-md mx-auto border border-white/10 p-8 sm:p-12 bg-[#060606] rounded-sm">
          <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mx-auto text-[#C0C0C0]">
            <Gem className="w-5 h-5" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-2xl uppercase tracking-wider text-white">
              No Saved Pieces Yet
            </h3>
            <p className="text-xs text-[#808080] font-light leading-relaxed">
              Your personal curation vault is empty. Explore our catalog of hand-finished solid 925 silver creations and tap the collection emblem (♡) to preserve your favored designs.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/#curated-collection"
              className="inline-block px-8 py-3.5 chrome-button text-xs uppercase tracking-[0.25em] font-bold rounded-sm shadow-[0_0_20px_rgba(192,192,192,0.3)]"
            >
              Discover Creations →
            </Link>
          </div>
        </div>
      ) : (
        /* Collection Items: Floating Premium Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlistItems.map((item) => {
            const product = item.product || item;
            const imgUrl =
              product.images?.[0]?.src ||
              product.gallery?.[0]?.src ||
              product.image ||
              '/assets/lunar_collection.jpg';

            return (
              <div
                key={item.id}
                className="bg-[#080808] border border-white/15 p-5 rounded-sm flex flex-col justify-between space-y-4 hover:border-white/35 transition-all shadow-[0_15px_40px_rgba(0,0,0,0.8)] group"
              >
                {/* Image & Header */}
                <div className="space-y-3">
                  <div
                    onClick={() => navigate(`/product/${product.slug || ''}`)}
                    className="aspect-square relative overflow-hidden bg-[#030303] border border-white/10 rounded-sm cursor-pointer"
                  >
                    <img
                      src={imgUrl}
                      alt={product.name}
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = '/assets/lunar_collection.jpg';
                      }}
                    />
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] font-mono block">
                      {product.category || 'Fine Jewelry'}
                    </span>
                    <h3
                      onClick={() => navigate(`/product/${product.slug || ''}`)}
                      className="font-serif text-xl tracking-wide text-white cursor-pointer hover:text-[#C0C0C0] transition-colors"
                    >
                      {product.name}
                    </h3>
                    <div className="font-mono text-sm text-white pt-1">
                      ₹{Number(product.price).toLocaleString('en-IN')} INR
                    </div>
                  </div>
                </div>

                {/* Actions: Remove & Move To Checkout */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id || item.productId)}
                    className="text-xs text-[#707070] hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProductForBuyNow(product)}
                    className="px-5 py-2.5 chrome-button text-xs uppercase tracking-[0.2em] font-bold text-black rounded-sm flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(192,192,192,0.3)] transition-all hover:scale-105"
                  >
                    <span>Move To Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating In-Place Buy Now Drawer when "Move To Checkout" is tapped */}
      {selectedProductForBuyNow && (
        <FloatingBuyNowDrawer
          isOpen={Boolean(selectedProductForBuyNow)}
          onClose={() => setSelectedProductForBuyNow(null)}
          product={selectedProductForBuyNow}
        />
      )}
    </div>
  );
}
