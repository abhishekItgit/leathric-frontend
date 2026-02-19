import { motion } from 'framer-motion';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}) {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        ← Previous
      </motion.button>

      {start > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition"
          >
            1
          </motion.button>
          {start > 2 && <span className="text-stone-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <motion.button
          key={page}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg transition ${
            currentPage === page
              ? 'bg-leather-accent text-black font-semibold'
              : 'border border-white/20 hover:bg-white/5'
          }`}
        >
          {page}
        </motion.button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-stone-400">...</span>}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition"
          >
            {totalPages}
          </motion.button>
        </>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next →
      </motion.button>
    </div>
  );
}
