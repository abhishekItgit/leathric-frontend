import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

export function Modal({
  isOpen,
  title,
  children,
  onClose,
  actions = [],
  size = 'md',
}) {
  if (!isOpen) return null;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prev = typeof document !== 'undefined' ? document.body.style.overflow : '';
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = prev || '';
    };
  }, []);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  if (!mounted || typeof document === 'undefined' || !document.body) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full mx-auto sm:mx-0 bg-stone-900 rounded-2xl border border-white/10 max-h-[90vh] overflow-y-auto ${sizes[size]}`}
        style={{
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
        }}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-3 border-t border-white/10 p-6 justify-end">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  action.variant === 'danger'
                    ? 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
                    : action.variant === 'secondary'
                      ? 'bg-stone-800 border border-white/20 text-white hover:bg-stone-700'
                      : 'bg-leather-accent text-black hover:bg-leather-accent/80'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>,
    document.body
  );
}
