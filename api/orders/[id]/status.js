import connectDB from '../lib/db.js';
import Order from '../../server/models/Order.js';
import { protect } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const user = await protect(req);
    const { id } = req.query;
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
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

