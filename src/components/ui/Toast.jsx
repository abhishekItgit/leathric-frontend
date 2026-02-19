import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

const toastVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function ToastItem({ id, message, type, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const bgColor = {
    success: 'bg-green-500/20 border-green-500/50',
    error: 'bg-red-500/20 border-red-500/50',
    info: 'bg-blue-500/20 border-blue-500/50',
    warning: 'bg-amber-500/20 border-amber-500/50',
  }[type];

  const textColor = {
    success: 'text-green-300',
    error: 'text-red-300',
    info: 'text-blue-300',
    warning: 'text-amber-300',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ⓘ',
    warning: '⚠',
  }[type];

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${bgColor}`}
    >
      <span className={`text-lg font-bold ${textColor}`}>{icon}</span>
      <p className={`text-sm ${textColor}`}>{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="ml-auto text-stone-400 hover:text-stone-200"
      >
        ✕
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = { addToast, removeToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              {...toast}
              onRemove={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
