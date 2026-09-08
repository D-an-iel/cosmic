import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import OtpLoginModal from './modals/OtpLoginModal';

/**
 * AuthGuard enforces absolute authentication for protected routes.
 * It ensures that unauthenticated users are trapped in the login flow
 * and cannot see or interact with the protected children.
 */
export default function AuthGuard({ children }) {
  const { user, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Log state for debugging auth leaks
    console.log(`[AuthGuard] Loading: ${isLoading}, User: ${user ? 'Authenticated' : 'Guest'}`);

    if (!isLoading && !user) {
      setIsModalOpen(true);
    }
  }, [user, isLoading]);

  // 1. While determining auth state, show a high-priority luxury loader.
  // This prevents the "flash" of protected content.
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-[2000] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C0C0C0] block">
            Verifying Credentials...
          </span>
        </div >
      </div >
    );
  }

  // 2. If authenticated, render the protected route children.
  if (user && user.id && Object.keys(user).length > 0) {
    return <>{children}</>;
  }

  // 3. If NOT authenticated, we block ALL children.
  // We render the Auth Modal and a stark black background.
  return (
    <div className="fixed inset-0 z-[2000] bg-black overflow-hidden">
      <OtpLoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={() => setIsModalOpen(false)}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-4 opacity-10">
          <span className="font-serif text-2xl uppercase tracking-[0.3em] text-white">
            Authentication Required
          </span>
          <p className="text-xs uppercase tracking-widest text-[#C0C0C0]">
            Secure access to the Maison Cosmic checkout
          </p>
        </div >
      </div >
    </div >
  );
}
