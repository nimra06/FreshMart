import React, { useEffect, useState } from 'react';
import api from '../config/axios';
import { useApp } from '../context/AppContext';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders/myorders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Separate orders into active and previous
  const activeOrders = orders.filter(
    (order) => order.status === 'Pending' || order.status === 'Processing'
  );
  const previousOrders = orders.filter(
    (order) =>
      order.status === 'Shipped' ||
      order.status === 'Delivered' ||
      order.status === 'Cancelled'
  );

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <>
            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <div className="orders-section">
                <h2>Active Orders</h2>
                <div className="orders-list">
                  {activeOrders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div>
                          <h3>Order #{order._id.slice(-8)}</h3>
                          <p className="order-date">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                      />
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
                        </div>
                        <div className="order-total">
                          <strong>Total: ${order.totalPrice.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Previous Orders */}
            {previousOrders.length > 0 && (
              <div className="orders-section">
                <h2>Previous Orders</h2>
                <div className="orders-list">
                  {previousOrders.map((order) => (
                    <div key={order._id} className="order-card previous-order">
                      <div className="order-header">
                        <div>
                          <h3>Order #{order._id.slice(-8)}</h3>
                          <p className="order-date">
                            {new Date(order.createdAt).toLocaleDateString()}
                            {order.status === 'Delivered' && order.deliveredAt && (
                              <span className="delivered-date">
                                {' '}• Delivered on{' '}
                                {new Date(order.deliveredAt).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </div>
                        {order.status === 'Shipped' && (
                          <div className="shipped-badge">🚚 Shipped</div>
                        )}
                        {order.status === 'Delivered' && (
                          <div className="delivered-badge">✅ Delivered</div>
                        )}
                      </div>

                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                            />
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
                        </div>
                        <div className="order-total">
                          <strong>Total: ${order.totalPrice.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;

