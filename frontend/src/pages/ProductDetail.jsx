import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';
import { toast } from 'react-toastify';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

const ProductDetail = () => {
  const { shoeId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchShoe = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/shoes/${shoeId}`);
        setShoe(response.data);
        // Set the first available size as the default
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
      } catch (error) {
        toast.error('Could not fetch product details.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchShoe();
  }, [shoeId]);

  // --- NEW: Handler for the quantity counter ---
  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    // Prevent quantity from going below 1 or above available stock
    if (newQuantity >= 1 && newQuantity <= shoe.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!selectedSize) {
      toast.warn('Please select a size.');
      return;
    }
    // Pass the selected quantity to the cart
    addToCart(shoe.id, selectedSize, quantity);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  if (!shoe) {
    return <p className="text-center text-xl">Product not found.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 text-white">
      {/* Image Gallery */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-4">
        <img src={shoe.image} alt={shoe.name} className="w-full h-auto object-cover rounded-md" />
      </div>

      {/* Product Info */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{shoe.name}</h1>
        <p className="text-lg text-gray-400 mb-4">{shoe.brand}</p>
        <p className="text-3xl font-bold text-pink-500 mb-6">KES {shoe.price}</p>
        
        <p className="mb-4 text-gray-300">{shoe.description}</p>
        <p className="mb-6 text-sm text-gray-400">{shoe.details}</p>

        {/* --- NEW: Stock Display --- */}
        <div className="mb-6">
          <p className={`font-semibold ${shoe.stock > 5 ? 'text-green-500' : 'text-red-500'}`}>
            {shoe.stock > 0 ? `${shoe.stock} in stock` : 'Out of Stock'}
          </p>
        </div>

        {/* Size Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Size</h3>
          <div className="flex flex-wrap gap-2">
            {shoe.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 rounded-md border-2 transition-colors ${
                  selectedSize === size
                    ? 'bg-pink-500 text-white border-pink-500'
                    : 'bg-slate-700 border-slate-600 hover:border-pink-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* --- UPDATED: Quantity and Add to Cart Section --- */}
        <div className="flex items-center gap-4 mt-6">
          {/* Quantity Counter */}
          <div className="flex items-center border border-slate-600 rounded-lg">
            <button 
              onClick={() => handleQuantityChange(-1)} 
              className="px-4 py-2 text-lg font-bold hover:bg-slate-700 rounded-l-lg disabled:opacity-50"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="px-4 py-2 text-lg font-semibold bg-slate-800">{quantity}</span>
            <button 
              onClick={() => handleQuantityChange(1)} 
              className="px-4 py-2 text-lg font-bold hover:bg-slate-700 rounded-r-lg disabled:opacity-50"
              disabled={quantity >= shoe.stock}
            >
              +
            </button>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={shoe.stock === 0}
            className="flex-1 bg-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-pink-700 transition-transform transform hover:scale-105 shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;