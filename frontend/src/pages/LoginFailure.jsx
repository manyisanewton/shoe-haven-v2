import { Link } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';

const LoginFailure = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FiXCircle className="text-6xl text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-white mb-2">Login Failed</h1>
      <p className="text-gray-400 mb-6">
        Something went wrong during the authentication process. Please try again.
      </p>
      <Link
        to="/login"
        className="bg-pink-600 text-white font-bold py-2 px-6 rounded-full hover:bg-pink-700 transition-colors"
      >
        Return to Login
      </Link>
    </div>
  );
};

export default LoginFailure;