import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login, error, user } = useApp();
  const navigate = useNavigate();
  const { error: showError, success } = useToast();

  useEffect(() => {
    if (user) {
      if (user.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) {
      success('Login successful!');
    } else if (result.error) {
      showError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#667eea] to-[#764ba2] py-10 px-5">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl p-10 shadow-2xl">
          <h2 className="text-3xl mb-2.5 text-gray-800 text-center">Login to FreshMart</h2>
          <p className="text-center text-gray-600 mb-8">Welcome back! Please login to your account.</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-4 text-lg mt-2.5">
              Login
            </button>
          </form>

          <p className="text-center mt-5 text-gray-600">
            Don't have an account? <Link to="/register" className="text-[#667eea] font-semibold">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

