export default function Badge({ children, className = "" }) {
  return (
    <span className={`inline-block px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] rounded-none bg-brand-500 text-cream-50 ${className}`}>
      {children}
    </span>
  );
}
