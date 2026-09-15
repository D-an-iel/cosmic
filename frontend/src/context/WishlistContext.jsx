import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist from server if user is logged in
  const fetchWishlist = async () => {
    if (!token) {
      // Load guest wishlist from localStorage
      const cached = localStorage.getItem('cosmic_guest_wishlist');
      if (cached) {
        try {
          setWishlistItems(JSON.parse(cached));
        } catch (e) {
          setWishlistItems([]);
        }
      } else {
        setWishlistItems([]);
      }
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setWishlistItems(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some(
      (item) =>
        item.productId === productId ||
        item.id === productId ||
        item.product?.id === productId
    );
  };

  const addToWishlist = async (product) => {
    if (!product) return;
    const productId = product.productId || product.id;

    if (isInWishlist(productId)) return;

    if (!token) {
      // Guest local update
      const guestItem = {
        id: `guest-${productId}`,
        productId: productId,
        createdAt: new Date().toISOString(),
        product: {
          id: productId,
          name: product.name,
          slug: product.slug,
          price: product.price,
          category: product.category,
          images: product.images || (product.image ? [{ src: product.image }] : []),
        },
      };
      const updated = [guestItem, ...wishlistItems];
      setWishlistItems(updated);
      localStorage.setItem('cosmic_guest_wishlist', JSON.stringify(updated));
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setWishlistItems((prev) => [data.data, ...prev.filter((i) => i.productId !== productId)]);
      }
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!productId) return;

    // Optimistic local update
    setWishlistItems((prev) =>
      prev.filter(
        (item) =>
          item.productId !== productId &&
          item.id !== productId &&
          item.product?.id !== productId
      )
    );

    if (!token) {
      const cached = localStorage.getItem('cosmic_guest_wishlist');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const filtered = parsed.filter(
            (i) => i.productId !== productId && i.id !== productId
          );
          localStorage.setItem('cosmic_guest_wishlist', JSON.stringify(filtered));
        } catch (e) {}
      }
      return;
    }

    try {
      await fetch(`http://localhost:4000/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      // Rollback if needed
      fetchWishlist();
    }
  };

  const toggleWishlist = (product) => {
    const pid = product?.productId || product?.id;
    if (isInWishlist(pid)) {
      removeFromWishlist(pid);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        wishlistCount: wishlistItems.length,
        loading,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
