import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminLogin from './AdminLogin.jsx';

export default function AdminGuard({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C0C0C0] block font-light">
              Maison Cosmic
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-[#707070] block">
              Verifying Atelier Credentials...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // If user is not logged in or is not an ADMIN, show luxury admin login screen
  if (!user || user.role !== 'ADMIN') {
    return <AdminLogin />;
  }

  return <>{children}</>;
}
