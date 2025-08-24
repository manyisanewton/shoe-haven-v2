import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../api/apiService';
import Spinner from '../components/common/Spinner';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await apiService.post('/auth/register', { email, password });
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-slate-800 shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            {/* Email Input */}
            <input
              name="email" type="email" required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
            />
            {/* Password Input */}
            <input
              name="password" type="password" required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            />
            {/* Confirm Password Input */}
            <input
              name="confirm-password" type="password" required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            />
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-300"
            >
              {loading ? <Spinner /> : 'Sign up'}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;