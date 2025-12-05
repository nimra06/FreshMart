import connectDB from '../lib/db.js';
import Order from '../../server/models/Order.js';
import Product from '../../server/models/Product.js';
import { protect, client } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Create order
    try {
      await connectDB();
      const user = await protect(req);
      client(user); // Verify client role

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
    } catch (error) {
      if (error.message.includes('Not authorized') || error.message.includes('Access denied')) {
        return res.status(error.message.includes('Not authorized') ? 401 : 403).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

