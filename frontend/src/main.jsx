import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { PayPalScriptProvider } from '@paypal/react-paypal-js'; // <-- Import PayPal Provider

// Get the client ID from environment variables
const initialOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "USD", // Must match the currency used in the backend
  intent: "capture",
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PayPalScriptProvider options={initialOptions}> {/* <-- Wrap the App */}
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </PayPalScriptProvider>
  </React.StrictMode>
);