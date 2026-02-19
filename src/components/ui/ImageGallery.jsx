import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export function ImageGallery({
  images = [],
  alt = 'Product image',
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const currentImage = images[selectedIndex]?.src || images[0]?.src || '';

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPos({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full overflow-hidden rounded-2xl bg-stone-900"
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
          />
        </div>

        {/* Zoom Indicator */}
        {zoom && (
          <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-1 rounded text-xs text-white">
            Zoomed
          </div>
        )}
      </motion.div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedIndex(idx)}
            className={`h-20 overflow-hidden rounded-lg border-2 transition ${
              selectedIndex === idx
                ? 'border-leather-accent'
                : 'border-white/20 hover:border-white/40'
            }`}
          >
            <img
              src={img.src || img}
              alt={`${alt} ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
