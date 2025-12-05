import connectDB from '../lib/db.js';
import User from '../../server/models/User.js';
import { generateToken, protect } from '../lib/auth.js';

export default async function handler(req, res) {
  await connectDB();
  
  const { method } = req;
  // Handle slug - it can be an array or a string
  let slug = req.query.slug;
  if (!slug) slug = [];
  if (typeof slug === 'string') slug = [slug];
  if (!Array.isArray(slug)) slug = [];
  
  const route = slug[0] || '';

  try {
    // Register
    if (method === 'POST' && route === 'register') {
      const { name, email, password, phone } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: 'client',
        phone: phone || undefined,
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ message: 'Invalid user data' });
      }
      return;
    }

    // Login
    if (method === 'POST' && route === 'login') {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (user && (await user.comparePassword(password))) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
      return;
    }

    // Get current user
    if (method === 'GET' && route === 'me') {
      const user = await protect(req);
      const userData = await User.findById(user._id).select('-password');
      res.json(userData);
      return;
    }

    // Update profile
    if (method === 'PUT' && route === 'profile') {
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
      return;
    }

    res.status(405).json({ message: `Method ${method} not allowed for route: ${route || 'root'}` });
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

