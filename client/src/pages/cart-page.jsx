// ... other imports remain the same
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// Utility to format price as ₹xx.xx
const formatPrice = (amt) => `₹${amt.toFixed(2)}`;

// Razorpay script loader
function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Use your actual Razorpay test keyId here
const keyId = "rzp_test_GSJiWRjhbGJDup"; // <-- Update this value

export default function CartPage() {
  const queryClient = useQueryClient();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentCart = queryClient.getQueryData(["/cart-items"]) || [];
    setCart(currentCart);
    const cache = queryClient.getQueryCache();
    const unsubscribe = cache.subscribe(() => {
      setCart(queryClient.getQueryData(["/cart-items"]) || []);
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
      else if (unsubscribe && typeof unsubscribe.unsubscribe === "function") unsubscribe.unsubscribe();
    };
  }, [queryClient]);

  async function handleCheckout() {
    setLoading(true);
    const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    // Wait for Razorpay to be available in global scope
    let tries = 0;
    while (typeof window.Razorpay === "undefined" && tries < 10) {
      await new Promise((r) => setTimeout(r, 150));
      tries++;
    }

    if (typeof window.Razorpay === "undefined") {
      alert("Razorpay SDK not available on window. Please reload the page.");
      setLoading(false);
      return;
    }

    const amount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    if (amount <= 0) {
      alert("Cart total must be greater than zero.");
      setLoading(false);
      return;
    }

    const options = {
      key: keyId,
      amount: amount * 100,
      currency: "INR",
      name: "Food Order",
      description: "Thank you for your order!",
      handler: (response) => {
        setLoading(false);
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "vasanthapandiyan R",
        email: "vasanthudesh@gmail.com",
        contact: "8778362367",
      },
      theme: { color: "#6366f1" },
      modal: {
        ondismiss: () => {
          setLoading(false);
          alert("Payment cancelled or closed.");
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      alert("Oops! Something went wrong while initiating payment.");
      setLoading(false);
    }
  }

  if (!cart.length) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          fontSize: "1.2rem",
          color: "#999",
        }}
      >
        Your cart is empty.
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "24px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        background: "#fafbfc",
        boxShadow: "0 2px 10px 0 rgba(0,0,0,0.06)",
        fontFamily: "sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#374151",
          marginBottom: "24px",
        }}
      >
        Your Cart
      </h2>
      <div>
        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              padding: "8px 0",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <span style={{ fontWeight: 500, color: "#222" }}>{item.name}</span>
            <span style={{ color: "#888", fontSize: "0.95rem" }}>
              x {item.quantity}
            </span>
            <span style={{ fontWeight: 500, color: "#6366f1" }}>
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: "20px",
          marginBottom: "24px",
          fontWeight: 600,
          fontSize: "1.15rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Total:</span>
        <span style={{ color: "#10b981" }}>
          {formatPrice(cart.reduce((total, item) => total + item.price * item.quantity, 0))}
        </span>
      </div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px 0",
          background: loading ? "#a5b4fc" : "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 1px 4px 0 rgba(99,102,241,0.12)",
          transition: "background 0.2s",
        }}
      >
        {loading ? "Processing..." : "Pay with Razorpay"}
      </button>
    </div>
  );
}