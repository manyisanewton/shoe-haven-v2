import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';
import { toast } from 'react-toastify';
import Spinner from '../components/common/Spinner';
import PayPalButtonWrapper from '../components/common/PayPalButtonWrapper'; // <-- Import PayPal component

const Checkout = () => {
  const { cartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // 'mpesa' or 'paypal'
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + item.shoe.price * item.quantity, 0);

  const handleMpesaCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiService.post('/orders/checkout', { phone_number: phone });
      const { order_id } = response.data;
      toast.info('Check your phone to complete the M-Pesa payment.');
      navigate(`/order-status/${order_id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side: Order Summary */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-md space-y-4 h-fit">
            <h2 className="text-xl font-semibold text-white mb-4">Your Order</h2>
            {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-gray-300">
                <span>{item.shoe.name} (x{item.quantity})</span>
                <span>KES {item.shoe.price * item.quantity}</span>
                </div>
            ))}
            <div className="border-t border-slate-700 mt-4 pt-4 flex justify-between font-bold text-lg text-white">
                <span>Total</span>
                <span>KES {subtotal.toFixed(2)}</span>
            </div>
        </div>

        {/* Right Side: Payment Details */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4">Payment Details</h2>
            
            {/* Payment Method Selector */}
            <div className="flex rounded-md shadow-sm mb-6">
                <button 
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`flex-1 py-2 px-4 rounded-l-md transition-colors ${paymentMethod === 'mpesa' ? 'bg-pink-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                    M-Pesa
                </button>
                <button 
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex-1 py-2 px-4 rounded-r-md transition-colors ${paymentMethod === 'paypal' ? 'bg-pink-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                    PayPal / Card
                </button>
            </div>

            {/* M-Pesa Form */}
            {paymentMethod === 'mpesa' && (
                <form onSubmit={handleMpesaCheckout}>
                    <p className="mb-4 text-sm text-gray-400">
                        Enter your M-Pesa number (e.g., 07...) to receive a payment prompt.
                    </p>
                    <input
                        type="tel" required
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="e.g., 0712345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button
                        type="submit" disabled={loading}
                        className="w-full mt-4 bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 flex justify-center items-center disabled:bg-pink-400"
                    >
                        {loading ? <Spinner /> : `Pay KES ${subtotal.toFixed(2)}`}
                    </button>
                </form>
            )}

            {/* PayPal Buttons */}
            {paymentMethod === 'paypal' && (
                <div>
                     <p className="mb-4 text-sm text-center text-gray-400">
                        Pay securely with PayPal or a Debit/Credit Card.
                    </p>
                    <PayPalButtonWrapper currency="USD" showSpinner={true} />
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;