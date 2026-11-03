import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { inMemoryProducts } from './productController.js';
import { mockUsers } from './authController.js';

// Pre-seeded in-memory orders
export let inMemoryOrders = [
  {
    _id: '67c570020000000000000001',
    user: {
      _id: '67c570000000000000000002',
      name: 'Alex Johnson',
      email: 'customer@store.com',
    },
    orderItems: [
      {
        product: '67c570010000000000000001',
        name: 'AeroPulse Pro Wireless Headphones',
        qty: 1,
        price: 249.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      },
    ],
    shippingAddress: {
      fullName: 'Alex Johnson',
      address: '742 Evergreen Terrace',
      city: 'Bangalore',
      postalCode: '560001',
      country: 'India',
      phone: '+91 98765 43210',
    },
    paymentMethod: 'Direct Pay (Gateway Ready)',
    itemsPrice: 249.99,
    shippingPrice: 0.0,
    taxPrice: 20.0,
    totalPrice: 269.99,
    isPaid: false,
    status: 'Processing',
    createdAt: new Date(Date.now() - 3600000 * 4),
  },
];

// @desc    Create new order (Requires logged-in customer)
// @route   POST /api/orders
// @access  Private (Customer)
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, isPaid, paymentResult } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({ message: 'Shipping address is incomplete' });
    }

    // Calculate subtotal
    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.qty),
      0
    );

    // Free shipping over $100, else $15
    const shippingPrice = itemsPrice > 100 ? 0 : 15;
    const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const newOrderData = {
      _id: '67c57' + Date.now().toString(16).padStart(19, '0').slice(0, 19),
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Standard (Gateway Integration Ready)',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: Boolean(isPaid),
      paidAt: isPaid ? new Date() : null,
      paymentResult: paymentResult || null,
      status: isPaid ? 'Processing' : 'Pending',
      createdAt: new Date(),
    };

    if (isMongoConnected()) {
      try {
        const order = new Order({
          user: req.user._id,
          orderItems,
          shippingAddress,
          paymentMethod: newOrderData.paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
          isPaid: Boolean(isPaid),
          paidAt: isPaid ? new Date() : null,
          paymentResult: paymentResult || null,
          status: isPaid ? 'Processing' : 'Pending',
        });

        const createdOrder = await order.save();
        inMemoryOrders.unshift(newOrderData);
        return res.status(201).json(createdOrder);
      } catch (dbErr) {
        console.warn('DB createOrder fallback:', dbErr.message);
      }
    }

    inMemoryOrders.unshift(newOrderData);
    res.status(201).json(newOrderData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    if (isMongoConnected()) {
      try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (order) return res.json(order);
      } catch (e) {
        // Fall through
      }
    }

    const order = inMemoryOrders.find((o) => o._id === req.params.id);
    if (order) return res.json(order);

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private (Customer)
export const getMyOrders = async (req, res) => {
  try {
    if (isMongoConnected()) {
      try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        if (orders.length > 0) return res.json(orders);
      } catch (e) {
        // Fall through
      }
    }

    const myOrders = inMemoryOrders.filter(
      (o) =>
        (o.user?._id && o.user._id.toString() === req.user._id.toString()) ||
        (o.user?.email && o.user.email === req.user.email)
    );
    res.json(myOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private / Admin
export const getAllOrders = async (req, res) => {
  try {
    if (isMongoConnected()) {
      try {
        const orders = await Order.find({})
          .populate('user', 'name email')
          .sort({ createdAt: -1 });
        if (orders.length > 0) return res.json(orders);
      } catch (e) {
        // Fall through
      }
    }

    res.json(inMemoryOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private / Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (isMongoConnected()) {
      try {
        const order = await Order.findById(req.params.id);
        if (order) {
          order.status = status;
          if (status === 'Delivered') order.deliveredAt = Date.now();
          const updated = await order.save();
          return res.json(updated);
        }
      } catch (e) {
        // Fall through
      }
    }

    const order = inMemoryOrders.find((o) => o._id === req.params.id);
    if (order) {
      order.status = status;
      if (status === 'Delivered') order.deliveredAt = new Date();
      return res.json(order);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard metrics & statistics
// @route   GET /api/orders/stats/dashboard
// @access  Private / Admin
export const getDashboardStats = async (req, res) => {
  try {
    if (isMongoConnected()) {
      try {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

        const statusCounts = {
          Pending: await Order.countDocuments({ status: 'Pending' }),
          Processing: await Order.countDocuments({ status: 'Processing' }),
          Shipped: await Order.countDocuments({ status: 'Shipped' }),
          Delivered: await Order.countDocuments({ status: 'Delivered' }),
        };

        const recentOrders = await Order.find({})
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .limit(5);

        return res.json({
          totalRevenue: Number(totalRevenue.toFixed(2)),
          totalOrders,
          totalProducts,
          totalCustomers,
          statusCounts,
          recentOrders,
        });
      } catch (e) {
        // Fall through
      }
    }

    // In-memory stats
    const totalOrders = inMemoryOrders.length;
    const totalProducts = inMemoryProducts.length;
    const totalCustomers = mockUsers.filter((u) => u.role === 'customer').length;
    const totalRevenue = inMemoryOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

    const statusCounts = {
      Pending: inMemoryOrders.filter((o) => o.status === 'Pending').length,
      Processing: inMemoryOrders.filter((o) => o.status === 'Processing').length,
      Shipped: inMemoryOrders.filter((o) => o.status === 'Shipped').length,
      Delivered: inMemoryOrders.filter((o) => o.status === 'Delivered').length,
    };

    res.json({
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      totalProducts,
      totalCustomers,
      statusCounts,
      recentOrders: inMemoryOrders.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
