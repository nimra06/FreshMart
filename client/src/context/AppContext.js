import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../config/axios';

const AppContext = createContext();

const initialState = {
  user: null,
  cart: [],
  products: [],
  loading: false,
  error: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'USER_LOADED':
      return { ...state, user: action.payload, loading: false };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      // Store user without token in state
      const { token, ...userData } = action.payload;
      return { ...state, user: userData, loading: false };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...state, user: null, cart: [] };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(
        (item) => item.product._id === action.payload.product._id
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.product._id === action.payload.product._id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(
          (item) => item.product._id !== action.payload
        ),
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product._id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    }
  }, []);

  // Load user from token
  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await api.get('/api/auth/me');
      dispatch({ type: 'USER_LOADED', payload: res.data });
    } catch (error) {
      localStorage.removeItem('token');
    }
  };

  // Register
  const register = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.post('/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      // Load full user profile after registration
      const userRes = await api.get('/api/auth/me');
      dispatch({ type: 'LOGIN_SUCCESS', payload: { ...res.data, ...userRes.data } });
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Registration failed',
      });
      return { success: false, error: error.response?.data?.message };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      // Load full user profile after login
      const userRes = await api.get('/api/auth/me');
      dispatch({ type: 'LOGIN_SUCCESS', payload: { ...res.data, ...userRes.data } });
      return { success: true };
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.message || 'Login failed',
      });
      return { success: false, error: error.response?.data?.message };
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  // Update cart quantity
  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({
        type: 'UPDATE_CART_QUANTITY',
        payload: { productId, quantity },
      });
    }
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Get cart total
  const getCartTotal = () => {
    return state.cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  // Get cart item count
  const getCartItemCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        loadUser,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

