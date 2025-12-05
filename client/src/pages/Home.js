import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import './Home.css';

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
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Fresh Groceries, Delivered to Your Door</h1>
            <p>Quality products at unbeatable prices. Shop now and experience the convenience!</p>
            <div className="hero-buttons">
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
      <section className="categories" id="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="category-card"
              >
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : products && products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="product-card"
                >
                  <div className="product-image">
                    {product.stock === 0 && (
                      <div className="out-of-stock-banner">Out of Stock</div>
                    )}
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-price">
                      <span className="price">${product.price}</span>
                      {product.originalPrice && (
                        <span className="original-price">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No featured products available at the moment.</p>
            </div>
          )}
          <div className="view-all">
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose FreshMart?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Get your groceries delivered in under 30 minutes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Fresh Quality</h3>
              <p>Only the freshest products from trusted suppliers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive prices with regular deals and discounts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Shopping</h3>
              <p>Safe and secure payment options for your peace of mind</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

