import React, { useEffect, useState } from 'react';
import api from '../config/axios';

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
    <div className="py-10 min-h-screen">
      <div className="container">
        <h1 className="text-4xl mb-8 text-gray-800">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-20 px-5 bg-white rounded-xl">
            <p className="text-lg text-gray-600">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <>
            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl mb-5 text-gray-800 pb-2.5 border-b-2 border-gray-200">Active Orders</h2>
                <div className="flex flex-col gap-6">
                  {activeOrders.map((order) => (
                    <div key={order._id} className="bg-white rounded-xl p-8 shadow-md">
                      <div className="flex justify-between items-center mb-5 pb-5 border-b-2 border-gray-200">
                        <div>
                          <h3 className="text-xl text-gray-800 mb-1">Order #{order._id.slice(-8)}</h3>
                          <p className="text-gray-600 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-5">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-4 mb-4 pb-4 border-b border-gray-100 last:border-0">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="text-base mb-1 text-gray-800">{item.product.name}</h4>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × ${item.price}
                              </p>
                            </div>
                            <div className="text-lg font-semibold text-gray-800">
                              ${(item.quantity * item.price).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-start pt-5 border-t-2 border-gray-200 md:flex-row flex-col md:gap-0 gap-5">
                        <div className="flex-1">
                          <strong className="block mb-2 text-gray-800">Shipping Address:</strong>
                          <p className="text-gray-600 leading-relaxed">
                            {order.shippingAddress.street},{' '}
                            {order.shippingAddress.city},{' '}
                            {order.shippingAddress.state}{' '}
                            {order.shippingAddress.zipCode}
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-[#667eea]">
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
              <div>
                <h2 className="text-2xl mb-5 text-gray-800 pb-2.5 border-b-2 border-gray-200">Previous Orders</h2>
                <div className="flex flex-col gap-6">
                  {previousOrders.map((order) => (
                    <div key={order._id} className="bg-white rounded-xl p-8 shadow-md opacity-90">
                      <div className="flex justify-between items-center mb-5 pb-5 border-b-2 border-gray-200 md:flex-row flex-col md:gap-0 gap-4">
                        <div>
                          <h3 className="text-xl text-gray-800 mb-1">Order #{order._id.slice(-8)}</h3>
                          <p className="text-gray-600 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                            {order.status === 'Delivered' && order.deliveredAt && (
                              <span className="text-gray-600">
                                {' '}• Delivered on{' '}
                                {new Date(order.deliveredAt).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </div>
                        {order.status === 'Shipped' && (
                          <div className="px-4 py-2 rounded-full font-semibold text-sm bg-blue-500 text-white">🚚 Shipped</div>
                        )}
                        {order.status === 'Delivered' && (
                          <div className="px-4 py-2 rounded-full font-semibold text-sm bg-green-500 text-white">✅ Delivered</div>
                        )}
                      </div>

                      <div className="mb-5">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-4 mb-4 pb-4 border-b border-gray-100 last:border-0">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="text-base mb-1 text-gray-800">{item.product.name}</h4>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × ${item.price}
                              </p>
                            </div>
                            <div className="text-lg font-semibold text-gray-800">
                              ${(item.quantity * item.price).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-start pt-5 border-t-2 border-gray-200 md:flex-row flex-col md:gap-0 gap-5">
                        <div className="flex-1">
                          <strong className="block mb-2 text-gray-800">Shipping Address:</strong>
                          <p className="text-gray-600 leading-relaxed">
                            {order.shippingAddress.street},{' '}
                            {order.shippingAddress.city},{' '}
                            {order.shippingAddress.state}{' '}
                            {order.shippingAddress.zipCode}
                          </p>
                        </div>
                        <div className="text-2xl font-bold text-[#667eea]">
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

