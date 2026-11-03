import Product from '../models/Product.js';
import { isMongoConnected } from '../config/db.js';

// Initial curated catalog
export let inMemoryProducts = [
  {
    _id: '67c570010000000000000001',
    name: 'AeroPulse Pro Wireless Headphones',
    description: 'Studio-grade acoustic architecture with active noise cancellation, transparency mode, and 40-hour ultra battery life.',
    price: 249.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 18,
    rating: 4.9,
    reviewsCount: 124,
    isFeatured: true,
  },
  {
    _id: '67c570010000000000000002',
    name: 'Chronos Minimalist Chronograph',
    description: 'Precision Japanese movement encased in surgical stainless steel with scratch-resistant sapphire crystal and Italian leather strap.',
    price: 320.00,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 12,
    rating: 4.8,
    reviewsCount: 88,
    isFeatured: true,
  },
  {
    _id: '67c570010000000000000003',
    name: 'Lumina Ergonomic Mechanical Keyboard',
    description: 'Custom lubed linear switches, hot-swappable PCB, double-shot PBT keycaps, and customizable per-key dynamic RGB backlighting.',
    price: 169.50,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    stock: 25,
    rating: 4.7,
    reviewsCount: 65,
    isFeatured: true,
  },
  {
    _id: '67c570010000000000000004',
    name: 'Nordic Ceramic Brewer & Pour-Over Set',
    description: 'Artisanal matte black ceramic dripper and heat-retaining carafe engineered for the perfect extraction and morning ritual.',
    price: 78.00,
    category: 'Home & Living',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    stock: 30,
    rating: 4.9,
    reviewsCount: 42,
    isFeatured: false,
  },
  {
    _id: '67c570010000000000000005',
    name: 'Voyager Waterproof Tech Backpack 24L',
    description: 'Cordura weatherproof ballistic nylon, dedicated suspended 16-inch laptop chamber, magnetic Fidlock buckles, and ergonomic straps.',
    price: 185.00,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    stock: 15,
    rating: 4.8,
    reviewsCount: 96,
    isFeatured: true,
  },
  {
    _id: '67c570010000000000000006',
    name: 'OmniSphere 360 Smart Ambient Speaker',
    description: 'Room-filling high-fidelity spatial audio with integrated voice assistance, AirPlay 2, multi-room sync, and acoustic fabric finish.',
    price: 219.00,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    stock: 14,
    rating: 4.6,
    reviewsCount: 39,
    isFeatured: false,
  },
  {
    _id: '67c570010000000000000007',
    name: 'Solaris Polarized Titanium Sunglasses',
    description: 'Ultra-lightweight Japanese beta-titanium frames with polarized UV400 anti-reflective lenses for supreme clarity.',
    price: 145.00,
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
    stock: 22,
    rating: 4.9,
    reviewsCount: 51,
    isFeatured: false,
  },
  {
    _id: '67c570010000000000000008',
    name: 'Apex Precision Aluminum Laptop Stand',
    description: 'CNC machined aerospace-grade aluminum, dual-axis angle adjustment, silicone heat-dissipation pads, and foldable travel design.',
    price: 64.00,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    stock: 40,
    rating: 4.7,
    reviewsCount: 77,
    isFeatured: false,
  }
];

export const sampleProducts = inMemoryProducts;

// @desc    Get all products with filtering, search, sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { keyword, category, sort, featured } = req.query;

    if (isMongoConnected()) {
      try {
        const query = {};
        if (keyword) query.name = { $regex: keyword, $options: 'i' };
        if (category && category !== 'All') query.category = category;
        if (featured === 'true') query.isFeatured = true;

        let sortOptions = { createdAt: -1 };
        if (sort === 'price-asc') sortOptions = { price: 1 };
        if (sort === 'price-desc') sortOptions = { price: -1 };
        if (sort === 'rating') sortOptions = { rating: -1 };

        const products = await Product.find(query).sort(sortOptions);
        if (products.length > 0) {
          return res.json({ products, total: products.length });
        }
      } catch (dbErr) {
        console.warn('DB getProducts fallback:', dbErr.message);
      }
    }

    // In-memory catalog query
    let result = [...inMemoryProducts];

    if (keyword) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (category && category !== 'All') {
      result = result.filter((p) => p.category === category);
    }

    if (featured === 'true') {
      result = result.filter((p) => p.isFeatured);
    }

    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);

    res.json({
      products: result,
      total: result.length,
    });
  } catch (error) {
    res.json({
      products: inMemoryProducts,
      total: inMemoryProducts.length,
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    if (isMongoConnected()) {
      try {
        const product = await Product.findById(req.params.id);
        if (product) return res.json(product);
      } catch (e) {
        // Fall through
      }
    }

    const fallback = inMemoryProducts.find((p) => p._id === req.params.id);
    if (fallback) return res.json(fallback);

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    const fallback = inMemoryProducts.find((p) => p._id === req.params.id);
    if (fallback) return res.json(fallback);
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private / Admin
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, image, stock, isFeatured } = req.body;

    if (!name || price === undefined || !description || !category || !image) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newProd = {
      _id: '67c57' + Date.now().toString(16).padStart(19, '0').slice(0, 19),
      name,
      price: Number(price),
      description,
      category,
      image,
      images: [image],
      stock: Number(stock) || 10,
      rating: 4.8,
      reviewsCount: 1,
      isFeatured: Boolean(isFeatured),
      createdAt: new Date(),
    };

    if (isMongoConnected()) {
      try {
        const product = new Product(newProd);
        const createdProduct = await product.save();
        inMemoryProducts.unshift(createdProduct);
        return res.status(201).json(createdProduct);
      } catch (dbErr) {
        console.warn('DB createProduct fallback:', dbErr.message);
      }
    }

    inMemoryProducts.unshift(newProd);
    res.status(201).json(newProd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private / Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, image, stock, isFeatured } = req.body;

    if (isMongoConnected()) {
      try {
        const product = await Product.findById(req.params.id);
        if (product) {
          product.name = name ?? product.name;
          product.price = price !== undefined ? Number(price) : product.price;
          product.description = description ?? product.description;
          product.category = category ?? product.category;
          product.image = image ?? product.image;
          product.stock = stock !== undefined ? Number(stock) : product.stock;
          product.isFeatured = isFeatured !== undefined ? Boolean(isFeatured) : product.isFeatured;

          const updatedProduct = await product.save();
          return res.json(updatedProduct);
        }
      } catch (dbErr) {
        console.warn('DB updateProduct fallback:', dbErr.message);
      }
    }

    const index = inMemoryProducts.findIndex((p) => p._id === req.params.id);
    if (index !== -1) {
      inMemoryProducts[index] = {
        ...inMemoryProducts[index],
        name: name ?? inMemoryProducts[index].name,
        price: price !== undefined ? Number(price) : inMemoryProducts[index].price,
        description: description ?? inMemoryProducts[index].description,
        category: category ?? inMemoryProducts[index].category,
        image: image ?? inMemoryProducts[index].image,
        stock: stock !== undefined ? Number(stock) : inMemoryProducts[index].stock,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : inMemoryProducts[index].isFeatured,
      };
      return res.json(inMemoryProducts[index]);
    }

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private / Admin
export const deleteProduct = async (req, res) => {
  try {
    if (isMongoConnected()) {
      try {
        await Product.deleteOne({ _id: req.params.id });
      } catch (e) {
        // Fall through
      }
    }

    inMemoryProducts = inMemoryProducts.filter((p) => p._id !== req.params.id);
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all distinct categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const cats = new Set(['All', 'Electronics', 'Accessories', 'Apparel', 'Home & Living']);
    inMemoryProducts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    res.json(Array.from(cats));
  } catch (error) {
    res.json(['All', 'Electronics', 'Accessories', 'Apparel', 'Home & Living']);
  }
};
