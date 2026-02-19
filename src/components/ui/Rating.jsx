import { useState } from 'react';
import { motion } from 'framer-motion';

export function Rating({
  value = 0,
  onChange,
  readOnly = false,
  size = 'md',
  showCount = false,
  reviewCount = 0,
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            onClick={() => !readOnly && onChange?.(star)}
            disabled={readOnly}
            className={`transition ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <span
              className={`${sizes[size]} transition ${
                star <= (hoverValue || value)
                  ? 'text-leather-accent'
                  : 'text-stone-600'
              }`}
            >
              ★
            </span>
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-1 text-sm">
        <span className="font-semibold">{value.toFixed(1)}</span>
        {showCount && (
          <span className="text-stone-400">({reviewCount} reviews)</span>
        )}
      </div>
    </div>
  );
}
