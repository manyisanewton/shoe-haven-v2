import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      toast.success('Logged in successfully with Google!');
      // Force a window reload to ensure all contexts are updated correctly
      // This is a simple and effective way to sync the login state.
      window.location.href = '/store';
    } else {
      toast.error('Google login failed. Please try again.');
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <h1 className="text-2xl font-semibold">Logging you in...</h1>
      <p className="mt-2">Please wait while we redirect you.</p>
    </div>
  );
};

export default LoginSuccess;