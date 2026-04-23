import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    try {
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Error parsing cart from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Find existing item by ID and Flavor
      const existingItem = prevItems.find((item) => item.id === product.id && item.flavor === product.flavor);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.flavor === product.flavor ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, flavor) => {
    setCartItems((prevItems) => prevItems.filter((item) => !(item.id === productId && item.flavor === flavor)));
  };

  const updateQuantity = (productId, flavor, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.flavor === flavor ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const updateFlavor = (productId, oldFlavor, newFlavor) => {
    setCartItems((prevItems) => {
      const itemToUpdate = prevItems.find(item => item.id === productId && item.flavor === oldFlavor);
      if (!itemToUpdate) return prevItems;

      const otherItems = prevItems.filter(item => !(item.id === productId && item.flavor === oldFlavor));
      const existingWithNewFlavor = otherItems.find(item => item.id === productId && item.flavor === newFlavor);

      if (existingWithNewFlavor) {
        return otherItems.map(item => 
          item.id === productId && item.flavor === newFlavor 
            ? { ...item, quantity: item.quantity + itemToUpdate.quantity } 
            : item
        );
      }

      return [...otherItems, { ...itemToUpdate, flavor: newFlavor }];
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, updateFlavor, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
