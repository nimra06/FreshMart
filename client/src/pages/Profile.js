import React, { useState, useEffect } from 'react';
import api from '../config/axios';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import './Profile.css';

const Profile = () => {
  const { user, loadUser } = useApp();
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.put('/api/auth/profile', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
      });
      await loadUser();
      setMessage('Profile updated successfully!');
      success('Profile updated successfully!');
    } catch (error) {
      const errorMessage = 'Failed to update profile. Please try again.';
      setMessage(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>
        <div className="profile-content">
          <div className="profile-card">
            <h2>Personal Information</h2>
            {message && (
              <div className={message.includes('success') ? 'success' : 'error'}>
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <h3>Address</h3>

              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          <div className="profile-info">
            <h2>Account Information</h2>
            <div className="info-item">
              <strong>Account Type:</strong>
              <span className={`badge ${user?.role === 'seller' ? 'seller' : 'client'}`}>
                {user?.role === 'seller' ? 'Seller' : 'Customer'}
              </span>
            </div>
            {user?.role === 'seller' && (
              <a href="/seller/dashboard" className="btn btn-primary">
                Go to Seller Dashboard
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

