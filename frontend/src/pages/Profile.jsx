import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../api/apiService';
import { toast } from 'react-toastify';
import Spinner from '../components/common/Spinner';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiService.get('/orders/');
        setOrders(response.data);
      } catch (error) {
        toast.error("Failed to fetch order history.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
          <p className="text-xl text-gray-500">You haven't placed any orders yet.</p>
          <Link to="/store" className="mt-4 inline-block text-lg text-pink-500 hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="font-bold">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-3 py-1 text-sm rounded-full ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </div>
              </div>
              <p>Total: <span className="font-semibold">KES {order.total_amount.toFixed(2)}</span></p>
              {order.status === 'completed' && (
                <a 
                  href={`http://127.0.0.1:5000/api/orders/${order.id}/receipt`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:underline mt-2 inline-block"
                >
                  Download Receipt
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;