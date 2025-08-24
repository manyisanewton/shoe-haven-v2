import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const ProductCard = ({ shoe }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Redirect to login if user is not authenticated
      navigate('/login');
      return;
    }
    // For simplicity, we'll add the first available size.
    // A more advanced version would have a size selector on the card.
    const defaultSize = shoe.sizes[0];
    if (defaultSize) {
      addToCart(shoe.id, defaultSize);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
      <Link to={`/shoe/${shoe.id}`} className="block">
        <img
          // --- THIS IS THE FIX ---
          // The src now correctly points to the public folder of the frontend app,
          // instead of trying to fetch the image from the backend server URL.
          src={shoe.image}
          alt={shoe.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate text-gray-900 dark:text-white">{shoe.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{shoe.brand}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-bold text-pink-500">KES {shoe.price}</p>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-colors"
            aria-label="Add to cart"
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;