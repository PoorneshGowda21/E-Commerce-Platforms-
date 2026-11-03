import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import UpiPaymentModal from '../components/UpiPaymentModal';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Lock,
  ArrowRight,
  AlertCircle,
  Building2,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  QrCode,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, shippingPrice, taxPrice, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [authModalOpen, setAuthModalOpen] = useState(!isAuthenticated);
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Shipping Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI (Fast QR / Mobile App)');

  useEffect(() => {
    if (user?.name && !fullName) {
      setFullName(user.name);
    }
  }, [user]);

  // If cart is empty, redirect to home
  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-slate-400 mb-6">Add items to your bag before checking out.</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 text-white"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Handle placing order (Direct or trigger UPI modal)
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    if (!address.trim() || !city.trim() || !postalCode.trim() || !phone.trim()) {
      setErrorMsg('Please complete all shipping address fields.');
      return;
    }

    // If UPI is chosen, launch the UPI QR / Intent modal
    if (paymentMethod === 'UPI (Fast QR / Mobile App)') {
      setUpiModalOpen(true);
      return;
    }

    // Otherwise proceed with standard checkout
    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
        })),
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
          phone,
        },
        paymentMethod,
        isPaid: false,
      };

      const res = await axios.post('/api/orders', orderData);
      clearCart();
      navigate(`/order-success/${res.data._id}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Called when UPI payment is verified in UpiPaymentModal
  const handleUpiSuccess = async (upiResult) => {
    setLoading(true);
    setUpiModalOpen(false);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
        })),
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
          phone,
        },
        paymentMethod: 'UPI (QR / Direct Intent)',
        isPaid: true,
        paymentResult: {
          id: upiResult.id,
          status: 'SUCCESS',
          method: 'UPI',
          upiId: upiResult.upiId,
          amountInr: upiResult.inrAmount,
          update_time: upiResult.update_time,
        },
      };

      const res = await axios.post('/api/orders', orderData);
      clearCart();
      navigate(`/order-success/${res.data._id}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to record UPI order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">Order Checkout</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review your items, provide shipping address, and choose your payment method.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Shipping Form & Payment Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address Card */}
          <div className="p-6 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-800">
              <Truck className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-white">Shipping Address</h2>
            </div>

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Recipient Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Street Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 42 Silicon Boulevard, Suite 100"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 560001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Payment Method Selector */}
          <div className="p-6 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Payment Method</h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                UPI Enabled
              </span>
            </div>

            {/* Payment Options */}
            <div className="space-y-3 mb-4">
              {/* OPTION 1: UPI Fast Gateway (Featured) */}
              <label
                className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'UPI (Fast QR / Mobile App)'
                    ? 'bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-indigo-950/40 border-purple-500/60 shadow-lg shadow-purple-950/30'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI (Fast QR / Mobile App)'}
                  onChange={() => setPaymentMethod('UPI (Fast QR / Mobile App)')}
                  className="mt-1 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-bold text-white">
                        UPI Gateway (QR Code / Direct App Intent)
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-extrabold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                      Recommended
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Shows dynamic QR code on laptop/desktop or launches GPay, PhonePe, Paytm, BHIM with 1-tap on mobile.
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-[10px] font-semibold text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      Google Pay
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      PhonePe
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      Paytm
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      BHIM / Cred
                    </span>
                  </div>
                </div>
              </label>

              {/* OPTION 2: Instant Direct Checkout (Sandbox) */}
              <label
                className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'Gateway Ready (Mock Sandbox)'
                    ? 'bg-purple-950/30 border-purple-500/50'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Gateway Ready (Mock Sandbox)'}
                  onChange={() => setPaymentMethod('Gateway Ready (Mock Sandbox)')}
                  className="mt-0.5 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Instant Direct Checkout (Dev Sandbox)
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Sandbox
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Instantly verifies and places order without external app redirection.
                  </p>
                </div>
              </label>

              {/* OPTION 3: Cash on Delivery */}
              <label
                className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'bg-purple-950/30 border-purple-500/50'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="mt-0.5 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-white">Cash on Delivery</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pay securely in cash or physical UPI scan when your parcel arrives.
                  </p>
                </div>
              </label>
            </div>

            {/* Security Guarantee */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">NPCI Certified:</strong> UPI QR codes & deep links are formatted in accordance with NPCI specifications.
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800 sticky top-28">
            <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
              Order Summary ({cartItems.length} items)
            </h3>

            {/* Items mini list */}
            <div className="max-h-60 overflow-y-auto space-y-3 mb-5 pr-1">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                    <p className="text-[11px] text-slate-400">Qty: {item.qty}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculation summary */}
            <div className="space-y-2 py-4 border-t border-b border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-200">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Shipping</span>
                <span className={shippingPrice === 0 ? 'text-emerald-400 font-semibold' : 'text-slate-200'}>
                  {shippingPrice === 0 ? 'Free Shipping' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Sales Tax (8%)</span>
                <span className="text-slate-200">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="pt-2 flex justify-between items-baseline text-base font-extrabold text-white">
                <span>Total Amount</span>
                <div className="text-right">
                  <span className="text-purple-400">${cartTotal.toFixed(2)}</span>
                  <span className="text-xs text-slate-400 block font-normal">
                    ≈ ₹{Math.round(cartTotal * 85.5).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Auth status notification */}
            {!isAuthenticated ? (
              <div className="mt-4 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-300">
                <div className="font-semibold mb-1">Customer Account Required</div>
                <p className="text-[11px] text-slate-400 mb-2">
                  Please sign in or create your customer account to confirm your order.
                </p>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full py-2 rounded-lg font-bold bg-purple-600 text-white text-xs hover:bg-purple-500 transition"
                >
                  Sign In / Register Customer
                </button>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Checking out as <strong>{user.name}</strong> ({user.email})</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={loading || !isAuthenticated}
              className="mt-6 w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'UPI (Fast QR / Mobile App)'
                      ? 'Proceed to UPI Payment'
                      : 'Confirm & Place Order'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal Trigger */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
        message="Sign in or register to complete your order checkout."
      />

      {/* UPI Fast Gateway Modal */}
      <UpiPaymentModal
        isOpen={upiModalOpen}
        onClose={() => setUpiModalOpen(false)}
        totalAmountUsd={cartTotal}
        customerName={fullName}
        onPaymentSuccess={handleUpiSuccess}
      />
    </div>
  );
}
