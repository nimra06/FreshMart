import connectDB from '../lib/db.js';
import Order from '../../server/models/Order.js';
import Product from '../../server/models/Product.js';
import { protect, seller } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const user = await protect(req);
    seller(user);

    const sellerProducts = await Product.find({ seller: user._id });
    const productIds = sellerProducts.map((p) => p._id);

    const orders = await Order.find({
      'items.product': { $in: productIds },
    })
      .populate('user', 'name email phone')
      .populate('items.product', 'name image price seller')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    if (error.message.includes('Not authorized') || error.message.includes('Access denied')) {
      return res.status(error.message.includes('Not authorized') ? 401 : 403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

