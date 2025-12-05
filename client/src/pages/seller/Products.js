import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import './Seller.css';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { error: showError, success } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/seller/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/seller/products/${productId}`);
        success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        showError('Failed to delete product');
      }
    }
  };

  const handleToggleActive = async (product) => {
    try {
      await axios.put(`/api/seller/products/${product._id}`, {
        ...product,
        isActive: !product.isActive,
      });
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="seller-products">
      <div className="container">
        <div className="page-header">
          <h1>My Products</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/seller/products/new')}
          >
            Add New Product
          </button>
        </div>

        {products.length === 0 ? (
          <div className="no-products">
            <p>You haven't added any products yet.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/seller/products/new')}
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-thumb"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price}</td>
                    <td>
                      <div className="stock-control">
                        <input
                          type="number"
                          min="0"
                          value={product.stock}
                          onChange={async (e) => {
                            const newStock = parseInt(e.target.value) || 0;
                            try {
                              await axios.put(`/api/seller/products/${product._id}`, {
                                ...product,
                                stock: newStock,
                              });
                              success('Stock updated successfully');
                              fetchProducts();
                            } catch (error) {
                              console.error('Error updating stock:', error);
                              showError('Failed to update stock');
                            }
                          }}
                          className="stock-input"
                        />
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          product.isActive ? 'active' : 'inactive'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-secondary"
                          onClick={() =>
                            navigate(`/seller/products/${product._id}/edit`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;

