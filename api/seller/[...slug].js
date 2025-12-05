import connectDB from '../lib/db.js';
import Product from '../../server/models/Product.js';
import Order from '../../server/models/Order.js';
import { protect, seller } from '../lib/auth.js';

export default async function handler(req, res) {
  await connectDB();
  
  const { method, query } = req;
  // Handle slug - it can be an array or a string
  let slug = req.query.slug;
  if (!slug) slug = [];
  if (typeof slug === 'string') slug = [slug];
  if (!Array.isArray(slug)) slug = [];
  
  const route = slug[0] || '';
  const subRoute = slug[1] || '';
  const id = slug[2] || '';

  try {
    const user = await protect(req);
    seller(user);

    // Get seller products: /api/seller/products
    if (method === 'GET' && route === 'products' && !subRoute) {
      const products = await Product.find({ seller: user._id }).sort({
        createdAt: -1,
      });
      res.json(products);
      return;
    }

    // Create product: /api/seller/products
    if (method === 'POST' && route === 'products') {
      const product = await Product.create({
        ...req.body,
        seller: user._id,
      });
      res.status(201).json(product);
      return;
    }

    // Update or delete product: /api/seller/products/[id]
    if ((method === 'PUT' || method === 'DELETE') && route === 'products' && subRoute && !id) {
      const productId = subRoute;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.seller.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      if (method === 'PUT') {
        const updatedProduct = await Product.findByIdAndUpdate(
          productId,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );
        res.json(updatedProduct);
      } else {
        await Product.findByIdAndDelete(productId);
        res.json({ message: 'Product deleted' });
      }
      return;
    }

    // Get seller orders: /api/seller/orders
    if (method === 'GET' && route === 'orders') {
      const sellerProducts = await Product.find({ seller: user._id });
      const productIds = sellerProducts.map((p) => p._id);

      const orders = await Order.find({
        'items.product': { $in: productIds },
      })
        .populate('user', 'name email phone')
        .populate('items.product', 'name image price seller')
        .sort({ createdAt: -1 });

      res.json(orders);
      return;
    }

    // Get seller dashboard: /api/seller/dashboard
    if (method === 'GET' && route === 'dashboard') {
      const sellerProducts = await Product.find({ seller: user._id });
      const productIds = sellerProducts.map((p) => p._id);

      const orders = await Order.find({
        'items.product': { $in: productIds },
      }).populate('items.product', 'seller');

      const totalProducts = sellerProducts.length;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => {
        const sellerItems = order.items.filter(
          (item) => item.product.seller.toString() === user._id.toString()
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
      return;
    }

    res.status(404).json({ message: 'Route not found' });
  } catch (error) {
    if (error.message.includes('Not authorized') || error.message.includes('Access denied')) {
      return res.status(error.message.includes('Not authorized') ? 401 : 403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

