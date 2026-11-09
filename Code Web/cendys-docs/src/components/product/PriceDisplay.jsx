import { formatPrice } from '../../utils/formatPrice';

export default function PriceDisplay({ price, className = "" }) {
  const isNull = price === null || price === undefined;
  return (
    <span className={`${isNull ? 'font-mono text-[10px] sm:text-[11px] uppercase tracking-wider leading-tight text-choco-600' : 'font-display text-xl text-brand-500'} ${className}`}>
      {formatPrice(price)}
    </span>
  );
}
