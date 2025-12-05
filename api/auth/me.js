import connectDB from '../lib/db.js';
import User from '../../server/models/User.js';
import { protect } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const user = await protect(req);
    const userData = await User.findById(user._id).select('-password');
    res.json(userData);
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

