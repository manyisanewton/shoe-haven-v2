import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogIn, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // <-- NEW: State for mobile menu

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false); // Close menu on logout
    navigate('/');
  };
  
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-pink-500" onClick={closeMenu}>
          Shoe Haven
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-pink-500 font-semibold" : "hover:text-pink-500 transition-colors"}>Home</NavLink>
          <NavLink to="/store" className={({ isActive }) => isActive ? "text-pink-500 font-semibold" : "hover:text-pink-500 transition-colors"}>Store</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "text-pink-500 font-semibold" : "hover:text-pink-500 transition-colors"}>About Us</NavLink>
        </div>

        {/* Icons and Auth for Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart" className="relative hover:text-pink-500 transition-colors">
            <FiShoppingCart size={24} />
            {isAuthenticated && cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 hover:text-pink-500 transition-colors"><FiUser size={24} /></Link>
              <button onClick={handleLogout} className="flex items-center gap-2 hover:text-pink-500 transition-colors"><FiLogOut size={24} /></button>
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-2 hover:text-pink-500 transition-colors"><FiLogIn size={24} /></Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} absolute top-full left-0 w-full bg-white dark:bg-slate-800 shadow-lg`}>
        <div className="flex flex-col items-center space-y-4 p-4">
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? "text-pink-500 font-semibold" : "hover:text-pink-500 transition-colors"}>Home</NavLink>
          <NavLink to="/store" onClick={closeMenu} className={({ isActive }) => isActive ? "text-pink-500 font-semibold" : "hover:text-pink-500 transition-colors"}>Store</NavLink>
          <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? "text-pink-500 font-semibold" : "hover:text-pink-500 transition-colors"}>About Us</NavLink>
          <div className="border-t border-gray-200 dark:border-slate-700 w-full my-2"></div>
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={closeMenu} className="flex items-center gap-2 hover:text-pink-500 transition-colors"><FiUser size={24} /> Profile</Link>
              <button onClick={handleLogout} className="flex items-center gap-2 hover:text-pink-500 transition-colors"><FiLogOut size={24} /> Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={closeMenu} className="flex items-center gap-2 hover:text-pink-500 transition-colors"><FiLogIn size={24} /> Login</Link>
          )}
          <Link to="/cart" onClick={closeMenu} className="relative hover:text-pink-500 transition-colors">
            <FiShoppingCart size={24} /> Cart
            {isAuthenticated && cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;