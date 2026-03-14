import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export function ImageGallery({
  images = [],
  alt = 'Product image',
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const sanitizedImages = (Array.isArray(images) ? images : [])
    .map((img) => (typeof img === 'string' ? img : img?.src))
    .filter(Boolean)
    .map((src) => ({ src }));

  const currentImage =
    sanitizedImages[selectedIndex]?.src ||
    sanitizedImages[0]?.src ||
    '';

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPos({ x, y });
  };

  if (!currentImage) {
    return (
      <div className="space-y-4">
        <div className="flex h-96 items-center justify-center rounded-2xl border border-stone-300 bg-stone-100 text-sm text-stone-600 sm:h-[500px]">
          Product image not available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full overflow-hidden rounded-2xl bg-stone-100"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <div
          ref={imageRef}
          className="relative h-96 cursor-zoom-in sm:h-[500px]"
        >
          <img
            src={currentImage}
            alt={alt}
            className={`h-full w-full object-cover transition-transform duration-300 ${
              zoom ? 'scale-150' : 'scale-100'
            }`}
            style={{
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            }}
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden';
            }}
          />
        </div>

        {zoom && (
          <div className="absolute bottom-4 right-4 rounded bg-black/70 px-3 py-1 text-xs text-white">
            Zoomed
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-4 gap-3">
        {sanitizedImages.map((img, idx) => (
          <motion.button
            key={`${img.src}-${idx}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedIndex(idx)}
            className={`h-20 overflow-hidden rounded-lg border-2 transition ${
              selectedIndex === idx
                ? 'border-leather-accent'
                : 'border-stone-300 hover:border-stone-400'
            }`}
          >
            <img
              src={img.src}
              alt={`${alt} ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
