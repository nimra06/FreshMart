import connectDB from '../lib/db.js';
import Order from '../../server/models/Order.js';
import { protect } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const user = await protect(req);

    const orders = await Order.find({ user: user._id })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

