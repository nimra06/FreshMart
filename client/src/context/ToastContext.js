import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-5 right-5 z-[10000] flex flex-col gap-3 pointer-events-none md:left-auto left-5">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

const Toast = ({ toast, removeToast }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 bg-white rounded-lg shadow-lg min-w-[300px] max-w-[400px] md:max-w-[400px] max-w-full pointer-events-auto cursor-pointer animate-[slideIn_0.3s_ease-out] border-l-4 ${getBorderColor()} transition-all duration-200 hover:-translate-x-1`}
      onClick={() => removeToast(toast.id)}
    >
      <span className="text-xl flex-shrink-0">{getIcon()}</span>
      <span className="flex-1 text-sm text-gray-800 leading-snug">{toast.message}</span>
      <button
        className="bg-none border-none text-2xl text-gray-400 cursor-pointer p-0 w-6 h-6 flex items-center justify-center flex-shrink-0 transition-colors duration-200 hover:text-gray-800"
        onClick={(e) => {
          e.stopPropagation();
          removeToast(toast.id);
        }}
      >
        ×
      </button>
    </div>
  );
};




