import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function CustomerOrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders/myorders');
        setOrders(res.data || []);
      } catch (err) {
        console.error('Error fetching customer orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">My Orders</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track status and order histories for {user?.email}
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/30 border border-purple-500/30 hover:bg-purple-900/40 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop More Items</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-slate-800 p-8">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No orders yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
            You haven't placed any orders yet. Discover our latest collection and start shopping.
          </p>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-5 sm:p-6 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
                <div>
                  <span className="font-mono text-slate-400">Order #{order._id}</span>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : order.status === 'Shipped'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : order.status === 'Processing'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-extrabold text-white">
                    ${Number(order.totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.qty} • ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
                <span>Shipping to: {order.shippingAddress?.city}, {order.shippingAddress?.country}</span>
                <span className="text-purple-400 font-mono text-[11px]">{order.paymentMethod}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

