export function Card({ children, className = '' }) {
  return <article className={`panel overflow-hidden ${className}`}>{children}</article>;
}
