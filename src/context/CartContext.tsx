'use client' // Context usage requires client components

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// Define the structure of a cart item
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

// Define the shape of the context value
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  itemCount: number; // Number of unique items (cart lines)
  totalQuantity: number; // Total number of items including quantities
  getItemQuantity: (itemId: string) => number;
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((itemToAdd: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemToAdd.id);
      if (existingItem) {
        // Increase quantity if item already exists
        return prevItems.map(item =>
          item.id === itemToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
    // console.log('Added to cart:', itemToAdd.name);
  }, []);

  // Implement removeFromCart
  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemId);
      if (!existingItem) return prevItems; // Item not found

      if (existingItem.quantity > 1) {
        // Decrease quantity
        return prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        // Remove item completely
        return prevItems.filter(item => item.id !== itemId);
      }
    });
    // console.log('Removed one instance from cart, item ID:', itemId);
  }, []);

  // Helper function to get quantity of a specific item
  const getItemQuantity = useCallback((itemId: string): number => {
      const item = cartItems.find(item => item.id === itemId);
      return item ? item.quantity : 0;
  }, [cartItems]);

  // Calculate number of unique items (cart lines)
  const itemCount = cartItems.length;

  // Calculate total quantity of all items
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = { cartItems, addToCart, removeFromCart, itemCount, totalQuantity, getItemQuantity };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Create a custom hook for easy context usage
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 