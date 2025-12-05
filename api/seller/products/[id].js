import connectDB from '../lib/db.js';
import Product from '../../server/models/Product.js';
import { protect, seller } from '../lib/auth.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    const user = await protect(req);
    seller(user);
    const { id } = req.query;

    if (req.method === 'PUT') {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.seller.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      res.json(updatedProduct);
    } else if (req.method === 'DELETE') {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.seller.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      await Product.findByIdAndDelete(id);
      res.json({ message: 'Product deleted' });
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

