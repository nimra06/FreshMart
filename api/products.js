import connectDB from './lib/db.js';
import Product from '../server/models/Product.js';

export default async function handler(req, res) {
  await connectDB();
  
  const { method, url, query } = req;
  const path = url.split('?')[0];

  try {
    // Get all products
    if (method === 'GET' && path === '/api/products') {
      const {
        category,
        search,
        sort,
        page = 1,
        limit = 12,
      } = query;

      const queryObj = { isActive: true };

      if (category && category !== 'All') {
        queryObj.category = category;
      }

      if (search) {
        queryObj.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      const sortOptions = {};
      if (sort === 'price-low') {
        sortOptions.price = 1;
      } else if (sort === 'price-high') {
        sortOptions.price = -1;
      } else if (sort === 'rating') {
        sortOptions.rating = -1;
      } else {
        sortOptions.createdAt = -1;
      }

      const products = await Product.find(queryObj)
        .populate('seller', 'name email')
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Product.countDocuments(queryObj);

      res.json({
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      });
      return;
    }

    // Get single product
    if (method === 'GET' && path.startsWith('/api/products/')) {
      const id = path.split('/api/products/')[1];
      const product = await Product.findById(id).populate(
        'seller',
        'name email'
      );

      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
      return;
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

