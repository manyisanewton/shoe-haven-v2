import { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import apiService from "../api/apiService";
import { useAuth } from '../hooks/useAuth'; // We need this to know if the user is logged in

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth(); // Get auth state

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      // If user logs out, clear the cart on the frontend immediately
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.get('/cart/');
      setCartItems(response.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
      // Don't show an error toast on initial fetch
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (shoeId, size, quantity = 1) => {
    try {
      await apiService.post('/cart/', { shoe_id: shoeId, size, quantity });
      toast.success('Item added to cart!');
      fetchCart(); // Refresh cart from server
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add item');
    }
  };

  const removeFromCart = async (cartItemId) => {
     try {
      await apiService.delete(`/cart/${cartItemId}`);
      toast.info('Item removed from cart');
      fetchCart(); // Refresh cart from server
    } catch (error)
    {
      toast.error(error.response?.data?.error || 'Failed to remove item');
    }
  };
  
  // --- NEW FUNCTION TO UPDATE ITEM QUANTITY ---
  const updateCartItemQuantity = async (cartItemId, newQuantity) => {
    // If the new quantity is 0 or less, just remove the item
    if (newQuantity < 1) {
      removeFromCart(cartItemId);
      return;
    }
    
    try {
      await apiService.put(`/cart/${cartItemId}`, { quantity: newQuantity });
      // We don't show a toast here to avoid annoying the user on every click.
      // The visual change in the cart is enough feedback.
      fetchCart(); // Refresh cart from server to get updated totals and stock checks
    } catch (error) {
      // The backend will send an error if stock is insufficient, which we show here.
      toast.error(error.response?.data?.error || 'Could not update quantity');
    }
  };

  // --- IMPROVED cartItemCount to sum quantities instead of counting line items ---
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        loading, 
        addToCart, 
        removeFromCart,
        updateCartItemQuantity, // <-- Export the new function
        cartItemCount // <-- Use the improved count
      }}
    >
      {children}
    </CartContext.Provider>
  );
};