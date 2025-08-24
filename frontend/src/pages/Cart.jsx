import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import Spinner from '../components/common/Spinner';

const Cart = () => {
  // NEW: get updateCartItemQuantity from the hook
  const { cartItems, removeFromCart, updateCartItemQuantity, loading } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.shoe.price * item.quantity,
    0
  );
  
  // ... (loading and empty cart returns)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center bg-slate-800 p-4 rounded-lg shadow-md">
              <img src={item.shoe.image} alt={item.shoe.name} className="w-24 h-24 object-cover rounded-md mr-4" />
              <div className="flex-grow">
                <h2 className="font-bold text-lg text-white">{item.shoe.name}</h2>
                <p className="text-gray-400">Size: {item.size}</p>
                
                {/* --- INTERACTIVE QUANTITY COUNTER --- */}
                <div className="flex items-center mt-2">
                  <p className="text-gray-400 mr-2">Quantity:</p>
                  <div className="flex items-center border border-slate-600 rounded-md">
                    <button 
                      onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-lg font-bold hover:bg-slate-700 rounded-l-md"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-md font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.shoe.stock}
                      className="px-3 py-1 text-lg font-bold hover:bg-slate-700 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                <p className="font-semibold mt-2 text-white">KES {(item.shoe.price * item.quantity).toFixed(2)}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 transition-colors ml-4">
                <FiTrash2 size={24} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2 text-gray-300">
            <span>Subtotal</span>
            <span className="font-semibold">KES {subtotal.toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-700 my-4"></div>
          <div className="flex justify-between font-bold text-xl text-white">
            <span>Total</span>
            <span>KES {subtotal.toFixed(2)}</span>
          </div>
          <Link to="/checkout">
            <button className="w-full mt-6 bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition-transform transform hover:scale-105">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;