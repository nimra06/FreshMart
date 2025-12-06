import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/axios';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const { success } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    success(`${quantity} ${product.name}(s) added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="py-10 min-h-screen">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-10 rounded-xl shadow-md">
          <div className="w-full">
            <img src={product.image} alt={product.name} className="w-full h-[500px] object-cover rounded-xl bg-gray-100" />
          </div>

          <div>
            <h1 className="text-3xl mb-2.5 text-gray-800">{product.name}</h1>
            <p className="text-[#667eea] text-base mb-4 font-semibold">{product.category}</p>
            <div className="flex gap-2.5 mb-5 text-gray-600">
              <span>⭐ {product.rating || 'No ratings yet'}</span>
              <span>({product.numReviews} reviews)</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-bold text-[#667eea]">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-2xl text-gray-400 line-through">${product.originalPrice}</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-xl mb-2.5 text-gray-800">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {product.stock === 0 && (
              <div className="bg-red-500 text-white px-5 py-3 rounded-lg font-semibold mb-5 text-center text-base">
                <span>⚠️ Out of Stock</span>
              </div>
            )}

            <div className="mb-8">
              <label className="block mb-2.5 font-semibold text-gray-800">Quantity:</label>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 border-2 border-gray-200 bg-white rounded-lg text-xl font-bold transition-all duration-300 hover:border-[#667eea] hover:bg-[#667eea] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                  max={product.stock}
                  className="w-20 h-10 text-center border-2 border-gray-200 rounded-lg text-lg font-semibold"
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 border-2 border-gray-200 bg-white rounded-lg text-xl font-bold transition-all duration-300 hover:border-[#667eea] hover:bg-[#667eea] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                className="btn btn-primary flex-1 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-success flex-1 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

