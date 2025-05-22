"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/Cart/CartContext";
import { CheckCircle, ArrowLeft, CreditCard, Truck, AlertCircle, PackageOpen, Calendar, CheckCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const [orderSummary, setOrderSummary] = useState(null);
  const { cartItems, totalAmount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [orderNumber, setOrderNumber] = useState("");
  const [showTracking, setShowTracking] = useState(false);
  const [trackingSteps] = useState([
    { label: "Order Placed", completed: true },
    { label: "Processing", completed: false },
    { label: "Shipped", completed: false },
    { label: "Out for Delivery", completed: false },
    { label: "Delivered", completed: false },
  ]);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
    paymentMethod: "visa", cardNumber: "", cardName: "", expiryDate: "", cvv: "", savePaymentInfo: false,
  });

  const paymentMethods = [
    { id: "visa", name: "Visa", icon: "/payment-icons/visa.webp" },
    { id: "mastercard", name: "Mastercard", icon: "/payment-icons/mastercard.png" },
    { id: "apple", name: "Apple Pay", icon: "/payment-icons/apple.webp" },
    { id: "google", name: "Google Pay", icon: "/payment-icons/google.webp" },
    { id: "paypal", name: "PayPal", icon: "/payment-icons/paypal.png" },
    { id: "cod", name: "Cash on Delivery", icon: "/payment-icons/cod.png" },
  ];

  const logoConfig = {
    src: "/logo.svg",
    width: 120,
    height: 40,
    alt: "Babli Store"
  };

  // Calculation functions
  const calculateTax = () => (totalAmount * 0.18).toFixed(2);
  const calculateShipping = () => (totalAmount >= 499 ? 0 : 99).toFixed(2);
  const calculateTotal = () => (parseFloat(totalAmount) + parseFloat(calculateTax()) + parseFloat(calculateShipping())).toFixed(2);

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-16 h-16 text-pink-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some products to your cart before proceeding to checkout.</p>
              <Link href="/products" className="bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors duration-200 flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Order Complete Screen
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
            <div className="text-center flex flex-col items-center justify-center py-8">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <div className="mb-2">
                <Image
                  src={logoConfig.src}
                  alt={logoConfig.alt}
                  width={logoConfig.width}
                  height={logoConfig.height}
                  className="mx-auto"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
              <div className="bg-gray-50 px-6 py-4 rounded-xl w-full max-w-md mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Order Number</p>
                    <p className="text-gray-800 font-medium">{orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Order Date</p>
                    <p className="text-gray-800 font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">Payment Method</p>
                    <p className="text-gray-800 font-medium">
                      {paymentMethods.find(method => method.id === orderSummary?.paymentMethod)?.name || "Card"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Amount</p>
                    <p className="text-green-600 font-medium">₹{orderSummary?.total}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 mb-4 w-full max-w-md">
                <Link href="/" className="flex-1 bg-white border border-pink-500 text-pink-600 px-6 py-3 rounded-lg font-medium hover:bg-pink-50 transition-colors duration-200 flex items-center justify-center">
                  Return to Home
                </Link>
                <button
                  className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors duration-200 flex items-center justify-center"
                  onClick={() => setShowTracking((prev) => !prev)}
                  type="button"
                >
                  {showTracking ? "Hide Tracking" : "Track Order"}
                </button>
              </div>
              {showTracking && (
                <div className="bg-white border border-pink-200 rounded-xl p-6 mt-2 w-full max-w-md mx-auto">
                  <h3 className="text-lg font-bold mb-4 text-pink-600 flex items-center">
                    <PackageOpen className="w-5 h-5 mr-2" /> Order Tracking
                  </h3>
                  <ol className="relative border-l border-pink-200">
                    {trackingSteps.map((step, idx) => (
                      <li key={idx} className="mb-6 ml-6">
                        <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ${step.completed ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                          {step.completed ? <CheckCheck className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                        </span>
                        <h4 className={`font-medium ${step.completed ? 'text-pink-700' : 'text-gray-700'}`}>{step.label}</h4>
                        {idx === 0 && <p className="text-xs text-gray-500">Just now</p>}
                        {idx === 1 && <p className="text-xs text-gray-500">Processing soon</p>}
                        {idx === 2 && <p className="text-xs text-gray-500">Will be shipped</p>}
                        {idx === 3 && <p className="text-xs text-gray-500">Out for delivery</p>}
                        {idx === 4 && <p className="text-xs text-gray-500">Expected in 3-5 days</p>}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setIsSubmitting(true);

    // Build order object for localStorage
    const orderObj = {
      id: Date.now(),
      orderNumber: "ORD" + Math.floor(100000 + Math.random() * 900000),
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      paymentMethod: formData.paymentMethod,
      date: new Date().toISOString(),
      totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      tax: calculateTax(),
      shipping: calculateShipping(),
      total: calculateTotal(),
      status: "pending",
      items: cartItems,
    };

    // Save order to localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...storedOrders, orderObj]));

    // Save order summary for UI
    setOrderSummary(orderObj);

    setTimeout(() => {
      setOrderNumber(orderObj.orderNumber);
      clearCart();
      setOrderComplete(true);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1500);
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
          {/* Main checkout form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
                      placeholder="Enter your full name" />
                    {formErrors.fullName && <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
                        placeholder="Enter your email" />
                      {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
                        placeholder="10-digit mobile number" />
                      {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>
              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex items-center mb-4">
                  <Truck className="h-5 w-5 text-pink-500 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border ${formErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
                      placeholder="Street address, apartment, suite, etc." />
                    {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${formErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
                        placeholder="City" />
                      {formErrors.city && <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                      <input type="text" id="state" name="state" value={formData.state} onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${formErrors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
                        placeholder="State" />
                      {formErrors.state && <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>}
                    </div>
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                      <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border ${formErrors.pincode ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
                        placeholder="6-digit pincode" />
                      {formErrors.pincode && <p className="mt-1 text-sm text-red-600">{formErrors.pincode}</p>}
                    </div>
                  </div>
                </div>
              </div>
              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-5 w-5 text-pink-500 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${formData.paymentMethod === method.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-200 hover:bg-pink-50/30'}`}
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}>
                        <div className="flex flex-col items-center h-12 mb-2">
                          <div className="h-6 mb-2 flex items-center justify-center">
                            <Image src={method.icon} alt={method.name} width={24} height={24} className="object-contain" />
                          </div>
                          <span className="text-xs font-medium text-gray-700">{method.name}</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <input type="radio" id={method.id} name="paymentMethod" value={method.id}
                            checked={formData.paymentMethod === method.id} onChange={handleInputChange}
                            className="w-4 h-4 text-pink-600 focus:ring-pink-500" />
                          <label htmlFor={method.id} className="ml-2 text-xs text-gray-500">Select</label>
                        </div>
                      </div>
                    ))}
                  </div>

                  {["visa", "mastercard"].includes(formData.paymentMethod) && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4 mt-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                        <div className="relative">
                          <input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border ${formErrors.cardNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-pink-500 pl-10`}
                            placeholder="1234 5678 9012 3456" />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Image src={formData.paymentMethod === "visa" ? "/payment-icons/visa.webp" : "/payment-icons/mastercard.png"}
                              width={20} height={20} alt="Card" />
                          </div>
                        </div>
                        {formErrors.cardNumber && <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>}
                      </div>
                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card *</label>
                        <input type="text" id="cardName" name="cardName" value={formData.cardName} onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border ${formErrors.cardName ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
                          placeholder="Enter name as on card" />
                        {formErrors.cardName && <p className="mt-1 text-sm text-red-600">{formErrors.cardName}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                          <input type="text" id="expiryDate" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border ${formErrors.expiryDate ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
                            placeholder="MM/YY" />
                          {formErrors.expiryDate && <p className="mt-1 text-sm text-red-600">{formErrors.expiryDate}</p>}
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                          <input type="password" id="cvv" name="cvv" value={formData.cvv} onChange={handleInputChange}
                            className={`w-full px-4 py-3 rounded-lg border ${formErrors.cvv ? 'border-red-300 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-pink-500`}
                            placeholder="123" maxLength="4" />
                          {formErrors.cvv && <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="savePaymentInfo" name="savePaymentInfo" checked={formData.savePaymentInfo} onChange={handleInputChange}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded" />
                        <label htmlFor="savePaymentInfo" className="ml-2 block text-sm text-gray-700">Save this card for future payments</label>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "apple" && (
                    <div className="bg-gray-50 p-6 rounded-lg text-center mt-4">
                      <div className="mb-4">
                        <Image src="/payment-icons/apple.webp" width={60} height={30} alt="Apple Pay" className="mx-auto" />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">Click the button below to pay with Apple Pay</p>
                      <button type="button" className="bg-black text-white py-3 px-6 rounded-lg font-medium w-full sm:w-64">Pay with Apple Pay</button>
                    </div>
                  )}

                  {formData.paymentMethod === "google" && (
                    <div className="bg-gray-50 p-6 rounded-lg text-center mt-4">
                      <div className="mb-4">
                        <Image src="/payment-icons/google.webp" width={60} height={30} alt="Google Pay" className="mx-auto" />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">Click the button below to pay with Google Pay</p>
                      <button type="button" className="bg-white border border-gray-300 py-3 px-6 rounded-lg font-medium shadow-sm w-full sm:w-64">
                        <div className="flex items-center justify-center">
                          <Image src="/payment-icons/google.webp" width={80} height={20} alt="Google Pay" />
                        </div>
                      </button>
                    </div>
                  )}

                  {formData.paymentMethod === "paypal" && (
                    <div className="bg-gray-50 p-6 rounded-lg text-center mt-4">
                      <div className="mb-4">
                        <Image src="/payment-icons/paypal.png" width={60} height={30} alt="PayPal" className="mx-auto" />
                      </div>
                      <p className="text-sm text-gray-600 mb-4">Click the button below to pay with PayPal</p>
                      <button type="button" className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium w-full sm:w-64">Pay with PayPal</button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="max-h-64 overflow-y-auto mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center py-3 border-b border-gray-100">
                    <div className="w-16 h-16 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={item.image} alt={item.name} fill className="object-contain" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium text-sm text-gray-800">{item.name}</div>
                      <div className="flex justify-between mt-1">
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium text-gray-800">₹{totalAmount.toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Tax (18% GST)</p>
                  <p className="font-medium text-gray-800">₹{calculateTax()}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Delivery</p>
                  <p className="font-medium text-gray-800">{parseFloat(calculateShipping()) === 0 ? 'Free' : `₹${calculateShipping()}`}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-lg font-bold text-gray-900">Total</p>
                <p className="text-lg font-bold text-pink-600">₹{calculateTotal()}</p>
              </div>
              <button type="submit" onClick={handleSubmit} disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-pink-700 hover:to-pink-600 transition-colors duration-200 disabled:opacity-70">
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg> Processing...
                  </span>
                ) : "Confirm & Pay"}
              </button>
              <div className="flex items-center justify-center mt-4 space-x-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center">
                    <div className="w-10 h-6">
                      <Image src={method.icon} width={40} height={24} alt={method.name} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                By clicking "Confirm & Pay", you agree to our Terms and Conditions and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}