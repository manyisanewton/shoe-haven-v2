import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../api/apiService';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

const OrderStatus = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await apiService.get(`/orders/${orderId}`);
        setOrder(response.data);
        if (response.data.status === 'pending') {
          // If status is still pending, check again after 5 seconds
          setTimeout(checkStatus, 5000);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch order status', error);
        setLoading(false);
      }
    };
    
    // Initial check
    checkStatus();

  }, [orderId]);

  const renderStatus = () => {
    if (loading || !order || order.status === 'pending') {
      return (
        <div className="text-center">
          <FiLoader className="mx-auto text-4xl text-blue-500 animate-spin" />
          <h2 className="text-2xl font-bold mt-4">Waiting for Payment Confirmation...</h2>
          <p className="mt-2">Please keep this page open. We are checking your M-Pesa payment.</p>
        </div>
      );
    }
    if (order.status === 'completed') {
      return (
        <div className="text-center">
          <FiCheckCircle className="mx-auto text-6xl text-green-500" />
          <h2 className="text-2xl font-bold mt-4">Payment Successful!</h2>
          <p className="mt-2">Thank you for your purchase. Your order #{order.id} is confirmed.</p>
          <div className="mt-6 flex justify-center space-x-4">
             <a href={`http://127.0.0.1:5000/api/orders/${order.id}/receipt`} target="_blank" rel="noopener noreferrer" className="bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-600">
                Download Receipt
              </a>
            <Link to="/store" className="bg-gray-200 dark:bg-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600">
              Continue Shopping
            </Link>
          </div>
        </div>
      );
    }
    if (order.status === 'cancelled') {
      return (
        <div className="text-center">
          <FiXCircle className="mx-auto text-6xl text-red-500" />
          <h2 className="text-2xl font-bold mt-4">Payment Cancelled</h2>
          <p className="mt-2">Your payment was not completed. Your order has been cancelled.</p>
          <Link to="/cart" className="mt-6 inline-block bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-600">
            Return to Cart
          </Link>
        </div>
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
      {renderStatus()}
    </div>
  );
};

export default OrderStatus;