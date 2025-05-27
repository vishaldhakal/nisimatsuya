"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/features/cart/CartContext";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import {EmptyCartMessage , OrderCompleteScreen, CheckoutForm, OrderSummary} from "../../components/features/checkout";
export default function CheckoutPage() {
  const router = useRouter();
  const [orderSummary, setOrderSummary] = useState(null);
  const { cartItems, totalAmount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [orderNumber, setOrderNumber] = useState("");
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
    paymentMethod: "visa", cardNumber: "", cardName: "", expiryDate: "", cvv: "", savePaymentInfo: false,
  });

  const logoConfig = {
    src: "images/ui/logo.svg",
    width: 120,
    height: 40,
    alt: "Babli Store"
  };

  // Calculation functions
  const calculateShipping = () => (totalAmount >= 499 ? 0 : 99).toFixed(2);
  const calculateTotal = () => (parseFloat(totalAmount)).toFixed(2);

  if (cartItems.length === 0 && !orderComplete) {
    return <EmptyCartMessage />;
  }

  if (orderComplete) {
    return (
      <OrderCompleteScreen 
        orderNumber={orderNumber}
        orderSummary={orderSummary}
        logoConfig={logoConfig}
      />
    );
  }

  // Input Change Handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: "" });
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    ["fullName", "email", "phone", "address", "city", "state", "pincode"].forEach(field => {
      if (!formData[field].trim()) errors[field] = "This field is required";
    });
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Please enter a valid email address";
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) errors.phone = "Please enter a valid 10-digit phone number";
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) errors.pincode = "Please enter a valid 6-digit pincode";
    if (["visa", "mastercard"].includes(formData.paymentMethod)) {
      if (!formData.cardNumber.trim()) errors.cardNumber = "Card number is required";
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) errors.cardNumber = "Please enter a valid 16-digit card number";
      if (!formData.cardName.trim()) errors.cardName = "Name on card is required";
      if (!formData.expiryDate.trim()) errors.expiryDate = "Expiry date is required";
      else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) errors.expiryDate = "Please use MM/YY format";
      if (!formData.cvv.trim()) errors.cvv = "CVV is required";
      else if (!/^\d{3,4}$/.test(formData.cvv)) errors.cvv = "CVV should be 3 or 4 digits";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { 
      window.scrollTo({ top: 0, behavior: "smooth" }); 
      return; 
    }
    setIsSubmitting(true);

    // Transform cart items for backend
    const items = cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price.toString(),
    }));

    // Build order object for backend
    const orderObj = {
      full_name: formData.fullName,
      shipping_address: formData.address,
      phone_number: formData.phone,
      email: formData.email,
      total_amount: calculateTotal(),
      delivery_fee: calculateShipping(),
      city: formData.city,
      state: formData.state,
      zip_code: formData.pincode,
      status: "pending",
      items,
    };

    try {
      const authSession = JSON.parse(localStorage.getItem("auth_session") || "{}");
      const token = authSession.accessToken;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(orderObj),
      });

      if (!response.ok) {
        throw new Error("Failed to place order. Please try again.");
      }

      const data = await response.json();
      setOrderSummary(orderObj);

      setTimeout(() => {
        setOrderNumber(data.order_number || "ORD" + Math.floor(100000 + Math.random() * 900000));
        clearCart();
        setOrderComplete(true);
        setIsSubmitting(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      alert(error.message || "Order failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/cart" className="inline-flex items-center text-pink-600 hover:text-pink-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
          </Link>
          <div className="flex items-center">
            <Image
              src={logoConfig.src}
              alt={logoConfig.alt}
              width={logoConfig.width}
              height={logoConfig.height}
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <CheckoutForm 
              formData={formData}
              formErrors={formErrors}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
          <div>
            <OrderSummary 
              cartItems={cartItems}
              totalAmount={totalAmount}
              calculateShipping={calculateShipping}
              calculateTotal={calculateTotal}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}