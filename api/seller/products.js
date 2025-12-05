import connectDB from '../lib/db.js';
import Product from '../../server/models/Product.js';
import { protect, seller } from '../lib/auth.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    const user = await protect(req);
    seller(user);

    if (req.method === 'GET') {
      const products = await Product.find({ seller: user._id }).sort({
        createdAt: -1,
      });
      res.json(products);
    } else if (req.method === 'POST') {
      const product = await Product.create({
        ...req.body,
        seller: user._id,
      });
      res.status(201).json(product);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    if (error.message.includes('Not authorized') || error.message.includes('Access denied')) {
      return res.status(error.message.includes('Not authorized') ? 401 : 403).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

