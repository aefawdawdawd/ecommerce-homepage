import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from '../hooks/useAuth';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart({ items: [], total: 0, itemCount: 0 });
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartService.addToCart({ productId, quantity });
      await loadCart();
      window.dispatchEvent(new Event('cart-updated'));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await cartService.updateCartItem(itemId, { quantity });
      await loadCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      await loadCart();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [], total: 0, itemCount: 0 });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};