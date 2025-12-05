import jwt from 'jsonwebtoken';
import User from '../../server/models/User.js';

export const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const protect = async (req) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new Error('Not authorized, no token');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error(error.message || 'Not authorized');
  }
};

export const seller = (user) => {
  if (user && user.role === 'seller') {
    return true;
  }
  throw new Error('Access denied. Seller only.');
};

export const client = (user) => {
  if (user && user.role === 'client') {
    return true;
  }
  throw new Error('Access denied. Client only.');
};

