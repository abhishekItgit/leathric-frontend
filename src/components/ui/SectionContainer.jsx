export function SectionContainer({ className = '', children }) {
  return <section className={`mx-auto w-full max-w-7xl px-4 md:px-6 ${className}`}>{children}</section>;
}
