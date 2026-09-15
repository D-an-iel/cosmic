import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import EditorialProductView from './EditorialProductView.jsx';
import { PRODUCTS as STATIC_PRODUCTS } from '../../data/products.js';
import { ArrowLeft, Layers } from 'lucide-react';

export default function CinematicProductPage({ onAddToCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(() => {
    return STATIC_PRODUCTS.find((p) => p.slug === slug) || STATIC_PRODUCTS[0];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const resp = await fetch(`http://localhost:4000/api/products/${slug}`);
        const data = await resp.json();
        if (data.success && data.data) {
          setProduct(data.data);
        }
      } catch (err) {
        console.warn('Using static fallback for cinematic product view');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (!product && !loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl uppercase tracking-wider mb-4">Piece Not Found</h2>
        <Link to="/cinematic" className="text-xs uppercase tracking-widest text-[#C0C0C0] hover:text-white underline">
          Return to Cinematic Showroom
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black min-h-screen">
      {/* 1. TOP EXPERIMENTAL COMPARISON BANNER */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 px-4 py-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-semibold">EXPERIMENTAL // 4-SCREEN SNAP VIEW</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={`/product/${slug || product?.slug}`}
            className="text-[#C0C0C0] hover:text-white underline underline-offset-4 flex items-center gap-1 transition-colors"
          >
            <Layers className="w-3 h-3" />
            <span>Classic Technical Dossier</span>
          </Link>
          <Link
            to="/cinematic"
            className="text-[#888888] hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Showroom</span>
          </Link>
        </div>
      </div>

      {/* 2. PADDING FOR TOP BANNER */}
      <div className="pt-8">
        <EditorialProductView
          product={product}
          onAddToCart={onAddToCart}
        />
      </div>

      {/* 3. SIDE-BY-SIDE FLOATING COMPARISON RETURN BUTTON */}
      <div className="fixed bottom-24 left-6 z-40">
        <Link
          to={`/product/${slug || product?.slug}`}
          className="px-3.5 py-2 rounded-full bg-black/85 hover:bg-black border border-white/20 hover:border-white/50 text-[9px] uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white backdrop-blur-xl transition-all shadow-[0_10px_30px_rgba(0,0,0,0.85)] flex items-center gap-2 group cursor-pointer"
        >
          <span className="text-white">⇄</span>
          <span>Switch to Classic Dossier</span>
        </Link>
      </div>
    </div>
  );
}
