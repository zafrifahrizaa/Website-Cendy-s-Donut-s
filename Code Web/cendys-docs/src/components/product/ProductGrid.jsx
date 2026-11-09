import ProductCard from './ProductCard';
import EmptyState from '../ui/EmptyState';

export default function ProductGrid({ products, onReset }) {
  if (!products || products.length === 0) {
    return <EmptyState message="Produk tidak ditemukan." onReset={onReset} />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:gap-x-6 md:gap-y-14">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
