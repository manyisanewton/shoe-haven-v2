import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../api/apiService";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

const PayPalButtonWrapper = ({ currency, showSpinner }) => {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: { ...options, currency: currency },
    });
  }, [currency, showSpinner, dispatch]);

  const createOrder = async () => {
    try {
      // Ask our backend to create an order with PayPal
      const response = await apiService.post('/orders/paypal/create');
      // The backend returns { orderID: '...' } which we pass to PayPal
      return response.data.orderID;
    } catch (error) {
      toast.error("Could not initiate PayPal transaction. Please try again.");
      console.error("PayPal Create Order Error:", error);
      // Return a rejected promise to stop the flow
      return Promise.reject(error);
    }
  };

  const onApprove = async (data) => {
    try {
      // Ask our backend to "capture" the payment now that the user has approved it
      const response = await apiService.post(`/orders/paypal/${data.orderID}/capture`);
      toast.success("Payment successful!");
      // Redirect to the order status page with our internal order ID
      navigate(`/order-status/${response.data.order_id}`);
    } catch (error) {
      toast.error("Payment failed after approval. Please contact support.");
      console.error("PayPal Capture Error:", error);
    }
  };

  const onError = (err) => {
    toast.error("A PayPal error occurred. Please try another payment method.");
    console.error("PayPal Button Error:", err);
  };

  return (
    <>
      {(showSpinner && isPending) && <Spinner />}
      <PayPalButtons
        style={{ layout: "vertical", label: "pay" }}
        disabled={false}
        forceReRender={[currency]}
        fundingSource={undefined}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
      />
    </>
  );
};

export default PayPalButtonWrapper;