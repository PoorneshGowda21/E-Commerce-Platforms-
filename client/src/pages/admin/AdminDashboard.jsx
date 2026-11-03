import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  Shield,
  ArrowRight,
  PlusCircle,
  Truck,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    statusCounts: { Pending: 0, Processing: 0, Shipped: 0, Delivered: 0 },
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/orders/stats/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching admin dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Admin Sub-bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400">Logged in as {user?.email}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Operations & Analytics Dashboard
          </h1>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-md shadow-purple-600/30 flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4 text-purple-400" />
            <span>Manage Orders</span>
          </Link>
          <Link
            to="/"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800 transition flex items-center gap-1"
          >
            <span>Customer Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Revenue */}
        <div className="p-6 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">
            Verified cumulative sales
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalOrders}</div>
          <span className="text-[11px] text-purple-400 font-medium mt-1 inline-block">
            Across all order states
          </span>
        </div>

        {/* Catalog Items */}
        <div className="p-6 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Products in Catalog</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalProducts}</div>
          <span className="text-[11px] text-indigo-400 font-medium mt-1 inline-block">
            Active SKUs available
          </span>
        </div>

        {/* Customers Count */}
        <div className="p-6 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Customers</span>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalCustomers}</div>
          <span className="text-[11px] text-violet-400 font-medium mt-1 inline-block">
            Customer profiles created
          </span>
        </div>
      </div>

      {/* Orders By Status Bar */}
      <div className="mb-10 p-6 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
          Fulfillment Status Pipeline
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-xs text-amber-300 font-medium block">Pending</span>
            <span className="text-2xl font-bold text-amber-200 mt-1 block">
              {stats.statusCounts?.Pending || 0}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <span className="text-xs text-purple-300 font-medium block">Processing</span>
            <span className="text-2xl font-bold text-purple-200 mt-1 block">
              {stats.statusCounts?.Processing || 0}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <span className="text-xs text-blue-300 font-medium block">Shipped</span>
            <span className="text-2xl font-bold text-blue-200 mt-1 block">
              {stats.statusCounts?.Shipped || 0}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs text-emerald-300 font-medium block">Delivered</span>
            <span className="text-2xl font-bold text-emerald-200 mt-1 block">
              {stats.statusCounts?.Delivered || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-2xl glass-panel bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400">Latest incoming purchases awaiting fulfillment</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats.recentOrders?.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            No orders placed yet. Orders created by customers will appear here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 font-mono text-purple-300">#{order._id.substring(0, 8)}...</td>
                    <td className="py-3">
                      <span className="font-semibold text-white block">{order.user?.name || 'Customer'}</span>
                      <span className="text-[11px] text-slate-500">{order.user?.email}</span>
                    </td>
                    <td className="py-3 text-slate-300">{order.orderItems?.length || 0} items</td>
                    <td className="py-3 font-bold text-white">${order.totalPrice?.toFixed(2)}</td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${
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
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to="/admin/orders"
                        className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold"
                      >
                        <span>Manage</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

