import { useState } from 'react';
import { Cookie } from 'lucide-react';

export default function ImageWithFallback({ src, alt = "Produk", className = "" }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`bg-cream-100 flex items-center justify-center text-choco-600 ${className}`}>
        <Cookie size={44} strokeWidth={1} opacity={0.6} />
      </div>
    );
  }

  const resolvedSrc = src?.startsWith('/')
    ? `${import.meta.env.BASE_URL}${src.replace(/^\/+/, '')}`
    : src;

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
