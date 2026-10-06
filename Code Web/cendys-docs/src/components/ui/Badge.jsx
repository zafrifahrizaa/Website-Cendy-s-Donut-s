export default function Badge({ children, className = "" }) {
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full bg-brand-500 text-white ${className}`}>
      {children}
    </span>
  );
}
