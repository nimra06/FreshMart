import connectDB from '../lib/db.js';
import Product from '../../server/models/Product.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { id } = req.query;

    const product = await Product.findById(id).populate(
      'seller',
      'name email'
    );

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

