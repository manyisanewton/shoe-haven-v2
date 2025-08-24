// Import useLocation to know the current URL path
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Import all pages
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderStatus from './pages/OrderStatus';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import LoginSuccess from './pages/LoginSuccess';
import LoginFailure from './pages/LoginFailure';
import WhatsAppButton from './components/common/WhatsAppButton';

// Create a new component to contain the logic, since useLocation must be inside a Router
const AppContent = () => {
  const location = useLocation();
  // Define the routes where the footer AND WhatsApp button should be hidden
  const hideElementsOnRoutes = ['/login', '/register'];
  
  const shouldShowFooter = !hideElementsOnRoutes.includes(location.pathname);
  const shouldShowWhatsApp = !hideElementsOnRoutes.includes(location.pathname);
  return (
    <div className="flex flex-col min-h-screen bg-[#0d1117] text-gray-200">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/shoe/:shoeId" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login/success" element={<LoginSuccess />} />
          <Route path="/login/failure" element={<LoginFailure />} />

          {/* Protected Routes */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-status/:orderId" element={<ProtectedRoute><OrderStatus /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
      {shouldShowWhatsApp && <WhatsAppButton />} 
      {/* Conditionally render the footer */}
      {shouldShowFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <ToastContainer position="bottom-right" autoClose={4000} theme="dark" />
    </Router>
  );
}

export default App;