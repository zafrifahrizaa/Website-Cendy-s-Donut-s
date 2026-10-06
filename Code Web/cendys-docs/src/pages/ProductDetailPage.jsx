import useSEO from '../hooks/useSEO';
import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { MessageCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { PLACEHOLDER_DESCRIPTION } from '../utils/constants';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import Button from '../components/ui/Button';
import PriceDisplay from '../components/product/PriceDisplay';
import EmptyState from '../components/ui/EmptyState';
import ProductGrid from '../components/product/ProductGrid';

export default function ProductDetailPage() {
  const { slug } = useParams();

  const product = useMemo(() => products.find((p) => p.slug === slug), [slug]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  
  const title = product ? product.name : 'Tidak Ditemukan';
  const desc = product ? `Pesan ${product.name} di Cendys Donuts. ${product.description || ''}`.substring(0, 150) : 'Produk tidak ditemukan.';
  useSEO(title, desc);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <EmptyState message="Produk yang Anda cari tidak ditemukan." />
        <div className="text-center mt-4">
          <Link to="/katalog">
            <Button variant="secondary">
              <ArrowLeft className="mr-2" size={20} /> Kembali ke Katalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryObj = categories.find((c) => c.slug === product.category) || {};
  const categoryLabel = categoryObj.label || product.category;
  
  const waMessage = `Halo Cendys Donuts, saya tertarik memesan produk ${product.name}.`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-choco-600 mb-6 items-center flex-wrap gap-y-2">
        <Link to="/" className="hover:text-brand-500 transition-colors">Beranda</Link>
        <ChevronRight size={16} className="mx-1 flex-shrink-0" />
        <Link to="/katalog" className="hover:text-brand-500 transition-colors">Katalog</Link>
        <ChevronRight size={16} className="mx-1 flex-shrink-0" />
        <Link to={`/katalog?kategori=${product.category}`} className="hover:text-brand-500 transition-colors">
          {categoryLabel}
        </Link>
        <ChevronRight size={16} className="mx-1 flex-shrink-0" />
        <span className="text-choco-900 font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
        <div className="aspect-square rounded-2xl overflow-hidden bg-cream-100 border border-cream-100 relative">
          <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-brand-500 uppercase tracking-wider mb-2">
            {categoryLabel}
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-choco-900 mb-4">
            {product.name}
          </h1>
          
          <div className="text-2xl mb-8">
            {product.priceVariants && product.priceVariants.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-choco-600 font-medium">Varian Ukuran / Harga:</p>
                <ul className="space-y-2">
                  {product.priceVariants.map((variant, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-cream-50 px-4 py-3 rounded-xl border border-cream-100">
                      <span className="text-choco-900 font-medium">{variant.label}</span>
                      <PriceDisplay price={variant.price} className="text-lg" />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <PriceDisplay price={product.price} />
            )}
          </div>

          <div className="prose prose-choco mb-8">
            <h3 className="text-lg font-display font-semibold mb-3 text-choco-900">Deskripsi Produk</h3>
            <p className="text-choco-600 leading-relaxed whitespace-pre-wrap">
              {product.description || PLACEHOLDER_DESCRIPTION}
            </p>
          </div>

          <div className="mt-auto pt-4 border-t border-cream-100">
            <a href={generateWhatsAppLink(waMessage)} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="whatsapp" className="w-full text-lg py-4 shadow-sm hover:shadow-md">
                <MessageCircle className="mr-2" size={24} /> Pesan via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-8 border-t border-cream-100 pt-12">
          <h2 className="text-2xl font-display font-bold text-choco-900 mb-8">Produk Serupa</h2>
          <ProductGrid products={similarProducts} />
        </div>
      )}
    </div>
  );
}
