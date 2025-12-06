import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/axios';

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/seller/dashboard');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="py-10 min-h-screen">
      <div className="container">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-5">
          <h1 className="text-4xl text-gray-800">Seller Dashboard</h1>
          <Link to="/seller/products/new" className="btn btn-primary">
            Add New Product
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 shadow-md flex items-center gap-5">
            <div className="text-5xl">📦</div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800">{stats?.totalProducts || 0}</h3>
              <p className="text-gray-600">Total Products</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md flex items-center gap-5">
            <div className="text-5xl">🛒</div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800">{stats?.totalOrders || 0}</h3>
              <p className="text-gray-600">Total Orders</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md flex items-center gap-5">
            <div className="text-5xl">💰</div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800">${stats?.totalRevenue?.toFixed(2) || '0.00'}</h3>
              <p className="text-gray-600">Total Revenue</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md flex items-center gap-5">
            <div className="text-5xl">⏳</div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800">{stats?.pendingOrders || 0}</h3>
              <p className="text-gray-600">Pending Orders</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/seller/products" className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl mb-2 text-gray-800">Manage Products</h3>
            <p className="text-gray-600">View, add, edit, or delete your products</p>
          </Link>

          <Link to="/seller/orders" className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl mb-2 text-gray-800">View Orders</h3>
            <p className="text-gray-600">Manage and track all your orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;



