import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  Truck,
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  Package,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function AdminOrders() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
  }, [isAdmin, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status: res.data.status } : ord))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    filterStatus === 'All'
      ? orders
      : orders.filter((o) => o.status?.toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Orders Fulfillment & Status Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch parcels, update tracking stages, and inspect customer delivery addresses
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/30 border border-purple-500/30 hover:bg-purple-900/40 transition self-start sm:self-auto"
        >
          Refresh Orders
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === status
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-400">
          No orders found under "{filterStatus}".
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="p-6 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800 space-y-5"
            >
              {/* Order Meta Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-300">
                      #{order._id}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="mt-1 text-xs">
                    <span className="text-white font-semibold">
                      Customer: {order.user?.name || order.shippingAddress?.fullName || 'Anonymous'}
                    </span>
                    <span className="text-slate-400 ml-2">({order.user?.email || 'N/A'})</span>
                  </div>
                </div>

                {/* Status Switcher Dropdown */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400">Update Status:</span>
                  <select
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-purple-500 cursor-pointer disabled:opacity-50"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <span className="text-base font-extrabold text-purple-400 ml-2">
                    ${Number(order.totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order items preview & Shipping details side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Items */}
                <div className="md:col-span-7 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Purchased SKUs ({order.orderItems?.length || 0})
                  </span>
                  <div className="space-y-2">
                    {order.orderItems?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-400">
                            Qty: {item.qty} × ${item.price}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-300">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment info */}
                <div className="md:col-span-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Fulfillment Destination
                  </span>
                  <div className="flex items-start gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>
                      {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                      {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{order.shippingAddress?.phone}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                    <span>Payment: <strong className="text-slate-200">{order.paymentMethod}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

