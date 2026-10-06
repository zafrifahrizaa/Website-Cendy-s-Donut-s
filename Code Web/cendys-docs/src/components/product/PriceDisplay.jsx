import { formatPrice } from '../../utils/formatPrice';

export default function PriceDisplay({ price, className = "" }) {
  const isNull = price === null || price === undefined;
  return (
    <span className={`font-medium ${isNull ? 'text-choco-600 text-sm' : 'text-brand-600'} ${className}`}>
      {formatPrice(price)}
    </span>
  );
}
