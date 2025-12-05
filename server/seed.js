import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Fresh Organic Tomatoes',
    description: 'Farm-fresh organic tomatoes, perfect for salads and cooking. Rich in vitamins and flavor.',
    price: 4.99,
    originalPrice: 6.99,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1546470427-e26264be0b88?w=400',
    stock: 50,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Sweet Red Apples',
    description: 'Crisp and juicy red apples, perfect for snacking. Locally sourced and fresh.',
    price: 3.99,
    originalPrice: 5.99,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    stock: 75,
    rating: 4.8,
    numReviews: 25,
  },
  {
    name: 'Fresh Whole Milk',
    description: 'Farm-fresh whole milk, rich and creamy. Perfect for your morning coffee.',
    price: 5.49,
    originalPrice: 6.99,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    stock: 30,
    rating: 4.6,
    numReviews: 18,
  },
  {
    name: 'Organic Carrots',
    description: 'Fresh organic carrots, crunchy and sweet. Great for cooking or snacking.',
    price: 2.99,
    originalPrice: 4.49,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
    stock: 60,
    rating: 4.4,
    numReviews: 15,
  },
  {
    name: 'Fresh Bananas',
    description: 'Ripe and sweet bananas, perfect for breakfast or smoothies.',
    price: 1.99,
    originalPrice: 2.99,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    stock: 100,
    rating: 4.7,
    numReviews: 30,
  },
  {
    name: 'Coca Cola 2L',
    description: 'Refreshing cola drink, perfect for parties and gatherings.',
    price: 2.49,
    originalPrice: 3.49,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    stock: 40,
    rating: 4.3,
    numReviews: 20,
  },
  {
    name: 'Fresh Bread Loaf',
    description: 'Artisan bread, freshly baked daily. Soft and delicious.',
    price: 3.99,
    originalPrice: 5.49,
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    stock: 25,
    rating: 4.6,
    numReviews: 22,
  },
  {
    name: 'Potato Chips',
    description: 'Crispy and crunchy potato chips, perfect snack for any time.',
    price: 2.99,
    originalPrice: 4.99,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1616634375264-2b2c0be7e3e0?w=400',
    stock: 80,
    rating: 4.5,
    numReviews: 35,
  },
  {
    name: 'Organic Brown Rice',
    description: 'Premium quality brown rice, healthy and nutritious.',
    price: 6.99,
    originalPrice: 8.99,
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    stock: 45,
    rating: 4.4,
    numReviews: 16,
  },
  {
    name: 'Fresh Broccoli',
    description: 'Crisp and fresh broccoli, packed with nutrients.',
    price: 3.49,
    originalPrice: 4.99,
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400',
    stock: 35,
    rating: 4.5,
    numReviews: 14,
  },
  {
    name: 'Fresh Strawberries',
    description: 'Sweet and juicy strawberries, perfect for desserts.',
    price: 5.99,
    originalPrice: 7.99,
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
    stock: 40,
    rating: 4.8,
    numReviews: 28,
  },
  {
    name: 'Fresh Eggs (12 pack)',
    description: 'Farm-fresh eggs, free-range and organic.',
    price: 4.99,
    originalPrice: 6.49,
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
    stock: 50,
    rating: 4.7,
    numReviews: 32,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Check if seller (admin) exists, if not create one
    // Note: Sellers are admins and cannot be created through public registration
    let seller = await User.findOne({ email: 'seller@freshmart.com' });
    
    if (!seller) {
      seller = await User.create({
        name: 'FreshMart Admin',
        email: 'seller@freshmart.com',
        password: 'seller123',
        role: 'seller', // Admin/Seller role
        phone: '+1234567890',
      });
      console.log('✅ Created admin/seller account: seller@freshmart.com / seller123');
    } else {
      console.log('✅ Using existing admin/seller account');
    }

    // Create products
    const products = sampleProducts.map((product) => ({
      ...product,
      seller: seller._id,
    }));

    await Product.insertMany(products);
    console.log(`✅ Created ${products.length} sample products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Admin/Seller Login credentials:');
    console.log('   Email: seller@freshmart.com');
    console.log('   Password: seller123');
    console.log('\n💡 Note: Sellers are admins and must be created manually.');
    console.log('   Customers can register through the signup page.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

