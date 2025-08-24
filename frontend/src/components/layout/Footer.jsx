import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import apiService from '../../api/apiService'; // Use our centralized apiService

function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Use the new apiService to hit the correct backend endpoint
      await apiService.post('/newsletter/subscribe', { email });
      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-800 text-gray-300 pt-16 pb-8 px-4">
      <div className="container mx-auto grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Section 1: About the Store */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-10 after:bg-pink-500">
            Shoe Haven
          </h3>
          <p className="text-sm text-gray-400">
            Your destination for premium footwear. Discover the latest styles and enjoy unparalleled comfort and quality.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-pink-500 transition-colors">
              <FaFacebookF size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-pink-500 transition-colors">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-pink-500 transition-colors">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-10 after:bg-pink-500">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-sm text-gray-400 hover:text-pink-500 transition-colors">Home</Link></li>
            <li><Link to="/store" className="text-sm text-gray-400 hover:text-pink-500 transition-colors">Store</Link></li>
            <li><Link to="/cart" className="text-sm text-gray-400 hover:text-pink-500 transition-colors">Your Cart</Link></li>
            <li><Link to="/about" className="text-sm text-gray-400 hover:text-pink-500 transition-colors">About Us</Link></li>
          </ul>
        </div>

        {/* Section 3: Contact Us */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-10 after:bg-pink-500">
            Contact Us
          </h3>
          <div className="text-sm text-gray-400 space-y-2">
            <p>Email: support@shoestore.com</p>
            <p>Phone: +254 799 425417</p> {/* <-- YOUR UPDATED NUMBER */}
            <p>Address: 123 Shoe Lane, Nairobi, Kenya</p>
          </div>
        </div>

        {/* Section 4: Newsletter */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-10 after:bg-pink-500">
            Stay Updated
          </h3>
          <p className="text-sm text-gray-400">
            Subscribe to our newsletter for the latest arrivals and exclusive offers.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Enter your email for newsletter"
              className="flex-grow w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Subscribe to newsletter"
              className="bg-pink-600 text-white font-bold px-4 py-2 rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-400"
            >
              {loading ? '...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto text-center border-t border-slate-700 mt-12 pt-6">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Shoe Haven. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;