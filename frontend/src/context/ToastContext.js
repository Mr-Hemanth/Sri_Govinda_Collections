import { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
          backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: 'white', padding: '1rem 2rem', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.3s ease-in-out'
        }}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
