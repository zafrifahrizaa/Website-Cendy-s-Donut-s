import { useState } from 'react';
import { Cookie } from 'lucide-react';

export default function ImageWithFallback({ src, alt = "Produk", className = "" }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

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
      className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
