
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import './ToastContext.scss';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    
    // Use a ref to keep track of toast IDs to avoid stale closures in timeouts if needed,
    // though functional updates to state are usually sufficient.
    
    const showToast = useCallback((type, title, message) => {
        const id = Date.now().toString();
        const newToast = { id, type, title, message, exiting: false };
        
        setToasts(prev => [...prev, newToast]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
        
        // Wait for animation to finish before actual removal
        setTimeout(() => {
             setToasts(prev => prev.filter(t => t.id !== id));
        }, 200);
    }, []);

    const success = (message, title = 'نجاح') => showToast('success', title, message);
    const error = (message, title = 'خطأ') => showToast('error', title, message);
    const warning = (message, title = 'تحذير') => showToast('warning', title, message);
    const info = (message, title = 'معلومة') => showToast('info', title, message);

    return (
        <ToastContext.Provider value={{ success, error, warning, info }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div 
                        key={toast.id} 
                        className={`toast toast-${toast.type} ${toast.exiting ? 'toast-exit' : 'toast-enter'}`}
                    >
                        <div className="toast-icon">
                            <i className={`fas ${getIcon(toast.type)}`}></i>
                        </div>
                        <div className="toast-content">
                            <div className="toast-title">{toast.title}</div>
                            {toast.message && <div className="toast-body">{toast.message}</div>}
                        </div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const getIcon = (type) => {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-times-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-bell';
    }
};
