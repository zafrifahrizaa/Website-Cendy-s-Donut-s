import { Cookie } from 'lucide-react';

export default function ImageWithFallback({ src, alt, className = "" }) {
  // Assuming images aren't present yet, always show fallback for now.
  // We can add actual fallback logic if requested later.
  return (
    <div className={`bg-cream-100 flex items-center justify-center text-choco-600 ${className}`}>
      <Cookie size={48} opacity={0.5} />
    </div>
  );
}
