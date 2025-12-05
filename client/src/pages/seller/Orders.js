import React, { useEffect, useState } from 'react';
import api from '../../config/axios';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import './Seller.css';

const SellerOrders = () => {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error: showError, success } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/seller/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
      success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      showError('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return '#27ae60';
      case 'Shipped':
        return '#3498db';
      case 'Processing':
        return '#f39c12';
      case 'Cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="seller-orders">
      <div className="container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              // Filter items that belong to this seller
              const sellerItems = order.items.filter(
                (item) =>
                  item.product &&
                  item.product.seller &&
                  item.product.seller.toString() === user?._id
              );

              if (sellerItems.length === 0) return null;

              const sellerTotal = sellerItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );

              return (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order._id.slice(-8)}</h3>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="customer-info">
                        Customer: {order.user?.name || 'N/A'} ({order.user?.email})
                      </p>
                    </div>
                    <div className="order-status">
                      <span
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    {sellerItems.map((item, index) => (
                      <div key={index} className="order-item">
                        <img src={item.product.image} alt={item.product.name} />
                        <div className="order-item-info">
                          <h4>{item.product.name}</h4>
                          <p>
                            Quantity: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <div className="order-item-total">
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-address">
                      <strong>Shipping Address:</strong>
                      <p>
                        {order.shippingAddress.street},{' '}
                        {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state}{' '}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p>
                        <strong>Phone:</strong> {order.shippingAddress.phone}
                      </p>
                    </div>
                    <div className="order-actions">
                      <div className="order-total">
                        <strong>Total: ${sellerTotal.toFixed(2)}</strong>
                      </div>
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <div className="status-buttons">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                            className="status-select"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;

