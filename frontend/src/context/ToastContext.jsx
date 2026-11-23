import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, title, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const notifySuccess = useCallback((message, title = 'Success') => {
    return addToast({ title, message, type: 'success' });
  }, [addToast]);

  const notifyError = useCallback((message, title = 'Error') => {
    return addToast({ title, message, type: 'error', duration: 6000 });
  }, [addToast]);

  const notifyWarning = useCallback((message, title = 'Warning') => {
    return addToast({ title, message, type: 'warning', duration: 5000 });
  }, [addToast]);

  const notifyInfo = useCallback((message, title = 'Notice') => {
    return addToast({ title, message, type: 'info' });
  }, [addToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="meta-toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`meta-toast meta-toast-${toast.type}`}>
            <div className="meta-toast-icon">
              {toast.type === 'success' && '🛡️'}
              {toast.type === 'error' && '🚨'}
              {toast.type === 'warning' && '⚠️'}
              {toast.type === 'info' && 'ℹ️'}
            </div>
            <div className="meta-toast-content">
              {toast.title && <div className="meta-toast-title">{toast.title}</div>}
              <div className="meta-toast-msg">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="meta-toast-close"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
