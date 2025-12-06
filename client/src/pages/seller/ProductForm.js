import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../config/axios';
import { useToast } from '../../context/ToastContext';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Vegetables',
    image: '',
    stock: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { error: showError, success } = useToast();

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/api/seller/products`);
      const product = res.data.find((p) => p._id === id);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          originalPrice: product.originalPrice?.toString() || '',
          category: product.category,
          image: product.image,
          stock: product.stock.toString(),
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : undefined,
        category: formData.category,
        image: formData.image,
        stock: parseInt(formData.stock),
      };

      if (isEditMode) {
        await api.put(`/api/seller/products/${id}`, productData);
        success('Product updated successfully!');
      } else {
        await api.post('/api/seller/products', productData);
        success('Product added successfully!');
      }

      navigate('/seller/products');
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save product';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Vegetables',
    'Fruits',
    'Dairy',
    'Beverages',
    'Snacks',
    'Bakery',
    'Grains',
    'Meat',
    'Frozen',
    'Other',
  ];

  return (
    <div className="product-form-page">
      <div className="container">
        <div className="page-header">
          <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/seller/products')}
          >
            ← Back to Products
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-control"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="form-control"
              rows="4"
              placeholder="Enter product description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="form-control"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Original Price ($) (Optional)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="form-control"
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="form-control"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Image URL *</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="image-preview"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/seller/products')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

