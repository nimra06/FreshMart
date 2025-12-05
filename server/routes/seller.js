import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect, seller } from '../middleware/auth.js';

const router = express.Router();

// All routes require seller authentication
router.use(protect);
router.use(seller);

// Get seller products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seller orders
router.get('/orders', async (req, res) => {
  try {
    // Get all products by this seller
    const sellerProducts = await Product.find({ seller: req.user._id });
    const productIds = sellerProducts.map((p) => p._id);

    // Find orders containing seller's products
    const orders = await Order.find({
      'items.product': { $in: productIds },
    })
      .populate('user', 'name email phone')
      .populate('items.product', 'name image price seller')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seller dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const sellerProducts = await Product.find({ seller: req.user._id });
    const productIds = sellerProducts.map((p) => p._id);

    const orders = await Order.find({
      'items.product': { $in: productIds },
    }).populate('items.product', 'seller');

    const totalProducts = sellerProducts.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => {
      const sellerItems = order.items.filter(
        (item) => item.product.seller.toString() === req.user._id.toString()
      );
      return (
        sum +
        sellerItems.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
      );
    }, 0);

    const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
    const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;



