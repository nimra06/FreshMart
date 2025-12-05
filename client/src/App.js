import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import SellerDashboard from './pages/seller/Dashboard';
import SellerProducts from './pages/seller/Products';
import SellerOrders from './pages/seller/Orders';
import SellerRedirect from './pages/seller/SellerRedirect';
import ProductForm from './pages/seller/ProductForm';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />
              <Route path="/seller" element={<SellerRedirect />} />
              <Route
                path="/seller/dashboard"
                element={
                  <PrivateRoute role="seller">
                    <SellerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/seller/products"
                element={
                  <PrivateRoute role="seller">
                    <SellerProducts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/seller/products/new"
                element={
                  <PrivateRoute role="seller">
                    <ProductForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/seller/products/:id/edit"
                element={
                  <PrivateRoute role="seller">
                    <ProductForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/seller/orders"
                element={
                  <PrivateRoute role="seller">
                    <SellerOrders />
                  </PrivateRoute>
                }
              />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </ToastProvider>
  );
}

export default App;

