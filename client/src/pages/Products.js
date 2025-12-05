import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { addToCart } = useApp();
  const { success } = useToast();

  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [category, search, sort, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: category !== 'All' ? category : '',
        search,
        sort,
        page: currentPage,
        limit: 12,
      });

      const res = await axios.get(`/api/products?${params}`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All',
    'Vegetables',
    'Fruits',
    'Dairy',
    'Beverages',
    'Snacks',
    'Bakery',
    'Grains',
    'Meat',
    'Frozen',
  ];

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    success(`${product.name} added to cart!`);
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <h1>Our Products</h1>
          <p>Discover our wide range of fresh groceries</p>
        </div>

        <div className="products-filters">
          <div className="category-filters">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className={`category-filter ${category === cat ? 'active' : ''}`}
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="sort-filter">
            <label>Sort by:</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <p>No products found. Try a different search or category.</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <Link to={`/products/${product._id}`}>
                    <div className="product-image">
                      {product.stock === 0 && (
                        <div className="out-of-stock-banner">Out of Stock</div>
                      )}
                      <img src={product.image} alt={product.name} />
                    </div>
                  </Link>
                  <div className="product-info">
                    <Link to={`/products/${product._id}`}>
                      <h3>{product.name}</h3>
                    </Link>
                    <p className="product-category">{product.category}</p>
                    <div className="product-price">
                      <span className="price">${product.price}</span>
                      {product.originalPrice && (
                        <span className="original-price">${product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;

