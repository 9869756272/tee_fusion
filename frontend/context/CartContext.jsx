import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, customization = null) => {
    setCartItems((prevItems) => {
      // Check if exact item exists (same product + same customization)
      const existingItemIndex = prevItems.findIndex((item) => {
        const isSameProduct = item.product === product._id;
        
        if (!isSameProduct) return false;

        // If one has custom and other doesn't
        if ((item.customization && !customization) || (!item.customization && customization)) {
          return false;
        }

        // If both have custom, check equality (color & decalUrl)
        // We ignore snapshot string for equality check to avoid issues with re-captures of same state
        if (item.customization && customization) {
          return (
            item.customization.color === customization.color &&
            item.customization.decalUrl === customization.decalUrl
          );
        }

        // Both are standard products
        return true;
      });

      if (existingItemIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].qty += quantity;
        return newItems;
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            qty: quantity,
            customization, // contains { color, decalUrl, snapshot }
          },
        ];
      }
    });
  };

  const removeFromCart = (id, customization) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => {
        // Keep item if ID is different
        if (item.product !== id) return true;
        
        // If ID matches, check customization
        if ((item.customization && !customization) || (!item.customization && customization)) {
            return true;
        }
        
        if (item.customization && customization) {
            return !(
                item.customization.color === customization.color && 
                item.customization.decalUrl === customization.decalUrl
            );
        }

        // Standard item match
        return false;
      })
    );
  };

  const updateQuantity = (productId, customization, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, customization);
      return;
    }

    setCartItems((prevItems) => 
      prevItems.map((item) => {
        // Check if this is the item to update
        if (item.product !== productId) return item;

        // Check customization match
        if ((item.customization && !customization) || (!item.customization && customization)) {
          return item;
        }

        if (item.customization && customization) {
          const isMatch = 
            item.customization.color === customization.color && 
            item.customization.decalUrl === customization.decalUrl;
          if (!isMatch) return item;
        } else if (!item.customization && !customization) {
          // Both are standard items
        } else {
          return item;
        }

        // Update quantity
        return { ...item, qty: newQuantity };
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);