import connectDB from '../lib/db.js';
import Order from '../../server/models/Order.js';
import Product from '../../server/models/Product.js';
import { protect, client } from '../lib/auth.js';

export default async function handler(req, res) {
  await connectDB();
  
  const { method, query } = req;
  // Handle slug - it can be an array or a string
  let slug = req.query.slug;
  if (!slug) slug = [];
  if (typeof slug === 'string') slug = [slug];
  if (!Array.isArray(slug)) slug = [];
  
  const route = slug[0] || '';

  try {
    // Create order
    if (method === 'POST' && !route) {
      const user = await protect(req);
      client(user);

      const { items, shippingAddress, paymentMethod, isPaid, paidAt, stripePaymentIntentId } = req.body;

      let totalPrice = 0;

      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({ message: `Product ${item.product} not found` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name}`,
          });
        }
        totalPrice += product.price * item.quantity;
      }

      const order = await Order.create({
        user: user._id,
        items,
        shippingAddress,
        paymentMethod,
        totalPrice,
        isPaid: isPaid || false,
        paidAt: paidAt || null,
        stripePaymentIntentId: stripePaymentIntentId || null,
      });

      // Update product stock
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      const populatedOrder = await Order.findById(order._id)
        .populate('user', 'name email')
        .populate('items.product', 'name image price');

      res.status(201).json(populatedOrder);
      return;
    }

    // Get user orders
    if (method === 'GET' && route === 'myorders') {
      const user = await protect(req);

      const orders = await Order.find({ user: user._id })
        .populate('items.product', 'name image price')
        .sort({ createdAt: -1 });

      res.json(orders);
      return;
    }

    // Update order status: /api/orders/[id]/status
    if (method === 'PUT' && slug.length === 2 && slug[1] === 'status') {
      const user = await protect(req);
      const id = slug[0];
      const { status } = req.body;

      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (user.role !== 'seller' && order.user.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      order.status = status;
      if (status === 'Delivered') {
        order.deliveredAt = new Date();
      }

      await order.save();

      const updatedOrder = await Order.findById(order._id)
        .populate('user', 'name email')
        .populate('items.product', 'name image price');

      res.json(updatedOrder);
      return;
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    if (error.message.includes('Not authorized') || error.message.includes('Access denied')) {
      return res.status(error.message.includes('Not authorized') ? 401 : 403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

