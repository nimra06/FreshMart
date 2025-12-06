import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products?limit=8');
      // Handle different response structures
      const productsData = res.data.products || res.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Vegetables', icon: '🥬' },
    { name: 'Fruits', icon: '🍎' },
    { name: 'Dairy', icon: '🥛' },
    { name: 'Beverages', icon: '🥤' },
    { name: 'Snacks', icon: '🍿' },
    { name: 'Bakery', icon: '🍞' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-20 text-center">
        <div className="container">
          <div>
            <h1 className="text-5xl mb-5 font-bold">Fresh Groceries, Delivered to Your Door</h1>
            <p className="text-xl mb-8 opacity-90">Quality products at unbeatable prices. Shop now and experience the convenience!</p>
            <div className="flex gap-5 justify-center flex-wrap">
              <Link to="/products" className="btn btn-primary">
                Shop Now
              </Link>
              <Link to="/products?category=Vegetables" className="btn btn-secondary">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white" id="categories">
        <div className="container">
          <h2 className="text-center text-4xl mb-10 text-gray-800">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center transition-all duration-300 cursor-pointer hover:border-[#667eea] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#667eea]/20"
              >
                <div className="text-5xl mb-2.5">{category.icon}</div>
                <h3 className="text-gray-800 text-lg">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-100">
        <div className="container">
          <h2 className="text-center text-4xl mb-10 text-gray-800">Featured Products</h2>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="bg-white rounded-xl overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="w-full h-48 overflow-hidden bg-gray-100 relative">
                    {product.stock === 0 && (
                      <div className="absolute top-2.5 right-2.5 bg-red-500/95 text-white px-4 py-2 rounded-full text-xs font-semibold z-10 shadow-md">Out of Stock</div>
                    )}
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg mb-2 text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.category}</p>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl font-bold text-[#667eea]">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-base text-gray-400 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p>No featured products available at the moment.</p>
            </div>
          )}
          <div className="text-center">
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-center text-4xl mb-10 text-gray-800">Why Choose FreshMart?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8">
              <div className="text-6xl mb-5">🚚</div>
              <h3 className="text-xl mb-3 text-gray-800">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">Get your groceries delivered in under 30 minutes</p>
            </div>
            <div className="text-center p-8">
              <div className="text-6xl mb-5">✨</div>
              <h3 className="text-xl mb-3 text-gray-800">Fresh Quality</h3>
              <p className="text-gray-600 leading-relaxed">Only the freshest products from trusted suppliers</p>
            </div>
            <div className="text-center p-8">
              <div className="text-6xl mb-5">💰</div>
              <h3 className="text-xl mb-3 text-gray-800">Best Prices</h3>
              <p className="text-gray-600 leading-relaxed">Competitive prices with regular deals and discounts</p>
            </div>
            <div className="text-center p-8">
              <div className="text-6xl mb-5">🛡️</div>
              <h3 className="text-xl mb-3 text-gray-800">Secure Shopping</h3>
              <p className="text-gray-600 leading-relaxed">Safe and secure payment options for your peace of mind</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

