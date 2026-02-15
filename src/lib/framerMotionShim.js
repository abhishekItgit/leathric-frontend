import { createElement, forwardRef, useEffect, useMemo, useRef, useState } from 'react';

function combineRefs(...refs) {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    });
  };
}

function styleFromMotionConfig(config = {}) {
  const style = {};
  const transforms = [];

  if (config.opacity !== undefined) style.opacity = config.opacity;
  if (config.scale !== undefined) transforms.push(`scale(${config.scale})`);
  if (config.x !== undefined) transforms.push(`translateX(${typeof config.x === 'number' ? `${config.x}px` : config.x})`);
  if (config.y !== undefined) transforms.push(`translateY(${typeof config.y === 'number' ? `${config.y}px` : config.y})`);

  if (transforms.length) {
    style.transform = transforms.join(' ');
  }

  return style;
}

function transitionFromConfig(config = {}) {
  const duration = config.duration ?? 0.6;
  const ease = Array.isArray(config.ease) ? 'ease' : config.ease ?? 'ease-out';
  const delay = config.delay ?? 0;
  return `all ${duration}s ${ease} ${delay}s`;
}

const motion = new Proxy(
  {},
  {
    get: (_, tag) =>
      forwardRef(function MotionTag(
        { initial, animate, whileInView, whileHover, transition, style, onMouseEnter, onMouseLeave, ...props },
        ref
      ) {
        const elementRef = useRef(null);
        const [isInView, setIsInView] = useState(false);
        const [isHover, setIsHover] = useState(false);

        useEffect(() => {
          if (!whileInView || !elementRef.current) return;
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setIsInView(true);
                observer.disconnect();
              }
            },
            { threshold: 0.2 }
          );

          observer.observe(elementRef.current);
          return () => observer.disconnect();
        }, [whileInView]);

        const activeConfig = useMemo(() => {
          if (isHover && whileHover) return whileHover;
          if (whileInView) return isInView ? whileInView : initial;
          return animate ?? initial;
        }, [animate, initial, isHover, isInView, whileHover, whileInView]);

        return createElement(tag, {
          ...props,
          ref: combineRefs(ref, elementRef),
          onMouseEnter: (event) => {
            setIsHover(true);
            onMouseEnter?.(event);
          },
          onMouseLeave: (event) => {
            setIsHover(false);
            onMouseLeave?.(event);
          },
          style: {
            ...style,
            ...styleFromMotionConfig(activeConfig),
            transition: transitionFromConfig(transition),
            willChange: 'transform, opacity',
          },
        });
      }),
  }
);

export function AnimatePresence({ children }) {
  return children;
}

export { motion };
