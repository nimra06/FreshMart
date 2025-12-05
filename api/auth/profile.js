import connectDB from '../lib/db.js';
import User from '../../server/models/User.js';
import { protect } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const user = await protect(req);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

