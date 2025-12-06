import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../config/axios';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const res = await api.get(`/api/products?${params}`);
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
    <div className="py-10 min-h-screen">
      <div className="container">
        <div className="text-center mb-10">
          <h1 className="text-4xl text-gray-800 mb-2.5">Our Products</h1>
          <p className="text-lg text-gray-600">Discover our wide range of fresh groceries</p>
        </div>

        <div className="flex justify-between items-center mb-8 flex-wrap gap-5">
          <div className="flex gap-2.5 flex-wrap">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className={`px-4 py-2 border-2 rounded-full transition-all duration-300 font-medium ${
                  category === cat
                    ? 'border-[#667eea] bg-[#667eea] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-[#667eea]'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <label className="font-semibold text-gray-800">Sort by:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm cursor-pointer"
            >
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
          <div className="text-center py-16 px-5 text-gray-600">
            <p>No products found. Try a different search or category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <Link to={`/products/${product._id}`}>
                    <div className="w-full h-64 overflow-hidden bg-gray-100 relative">
                      {product.stock === 0 && (
                        <div className="absolute top-2.5 right-2.5 bg-red-500/95 text-white px-4 py-2 rounded-full text-xs font-semibold z-10 shadow-md">Out of Stock</div>
                      )}
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </Link>
                  <div className="p-5">
                    <Link to={`/products/${product._id}`}>
                      <h3 className="text-lg mb-2 text-gray-800">{product.name}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-3">{product.category}</p>
                    <div className="flex items-center gap-2.5 mb-4">
                      <span className="text-2xl font-bold text-[#667eea]">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-base text-gray-400 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-400"
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
              <div className="flex justify-center items-center gap-5 mt-10">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="font-semibold text-gray-800">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
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

