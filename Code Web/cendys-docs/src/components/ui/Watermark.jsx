/** Teks watermark raksasa (outline tipis, opacity ~7%) untuk kesan kedalaman. Parent: `relative overflow-hidden`. */
export default function Watermark({ children, className = "" }) {
  return (
    <span aria-hidden="true" className={`watermark ${className}`}>
      {children}
    </span>
  );
}

