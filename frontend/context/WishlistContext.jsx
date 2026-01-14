import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { API_BASE_URL } from '../constants.js';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user, token]);

  const fetchWishlist = async () => {
    if (!user || !token) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setWishlist(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    if (!user || !token) {
      throw new Error('Please login to add to wishlist');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setWishlist(data.products || []);
        return true;
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user || !token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setWishlist(data.products || []);
        return true;
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      throw error;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((product) => product._id === productId || product === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchWishlist,
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

