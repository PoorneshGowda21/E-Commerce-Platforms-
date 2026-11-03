import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  MapPin,
} from 'lucide-react';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#3b82f6', '#10b981'],
      });
    } catch (e) {
      // safe fallback
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order receipt:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
          Order Successfully Placed!
        </h1>
        <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
          Thank you for choosing AURA. Your order has been registered in our database and our fulfillment team is preparing your package.
        </p>
        <div className="mt-3 inline-block font-mono text-xs text-purple-400 bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-lg">
          Order ID: #{id}
        </div>
      </div>

      {loading ? (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse h-64" />
      ) : order ? (
        <div className="p-6 sm:p-8 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800 space-y-6">
          {/* Order Status header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block">Status</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 mt-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {order.status || 'Pending'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Payment Method</span>
              <span className="text-xs font-semibold text-slate-200">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Items List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Items Ordered</h4>
            <div className="space-y-3">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.qty} × ${item.price}</p>
                  </div>
                  <span className="text-xs font-bold text-white">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery destination */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-white block mb-0.5">Shipping Destination:</span>
              <p className="text-slate-300">
                {order.shippingAddress?.fullName} • {order.shippingAddress?.phone}
              </p>
              <p className="text-slate-400">
                {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
              </p>
            </div>
          </div>

          {/* Total breakdown */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-sm font-bold">
            <span className="text-slate-300">Grand Total Paid:</span>
            <span className="text-lg text-purple-400">${order.totalPrice?.toFixed(2)}</span>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/my-orders"
          className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>View All My Orders</span>
        </Link>
        <Link
          to="/"
          className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}

