"use client";

import { useState } from "react";

export default function PayButton({ amount, bookingId }: { amount: number, bookingId: string }) {
  const [loading, setLoading] = useState(false);

  // Helper function to dynamically load the Razorpay SDK script
  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Load the script
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // 2. Create the Order on your Backend
      const orderRes = await fetch("https://construction-marketplace-ttob.onrender.com/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Your controller expects 'amount' in the body
        body: JSON.stringify({ amount }), 
      });
      
      const order = await orderRes.json();

      // 3. Open the Razorpay Payment Window
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_SvHJ7DGZNkDglW", // Your exact Test Key ID is saved here!
        amount: order.amount,
        currency: order.currency,
        name: "Construction Marketplace",
        description: `Payment for Booking: ${bookingId}`,
        order_id: order.id,
        handler: async function (response: any) {
          // 4. Verify Payment on your Backend
          const verifyRes = await fetch("https://construction-marketplace-ttob.onrender.com/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingId, // <-- NEW: WE ARE NOW SENDING THE BOOKING ID
            }),
          });
          
          const verifyData = await verifyRes.json();
          
          if (verifyData.success) {
            alert("Payment Successful! 🎉");
            window.location.reload(); // <-- NEW: REFRESH THE PAGE TO HIDE THE BUTTON
          } else {
            alert("Payment Verification Failed.");
          }
        },
        theme: {
          color: "#2563eb", // Tailwind Blue-600
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
      
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong initializing the payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
    >
      {loading ? "Processing..." : `Pay ₹${amount}`}
    </button>
  );
}