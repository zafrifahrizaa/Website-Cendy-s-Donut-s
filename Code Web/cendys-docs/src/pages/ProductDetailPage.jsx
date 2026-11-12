import useSEO from '../hooks/useSEO';
import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { categories } from '../data/categories';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { PLACEHOLDER_DESCRIPTION } from '../utils/constants';
import { useStore } from '../context/storeState';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import Button from '../components/ui/Button';
import PriceDisplay from '../components/product/PriceDisplay';
import EmptyState from '../components/ui/EmptyState';
import ProductGrid from '../components/product/ProductGrid';
import PriceTicket from '../components/product/PriceTicket';
import CornerMarks from '../components/ui/CornerMarks';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { products, settings } = useStore();

  const product = useMemo(() => products.find((p) => p.slug === slug), [products, slug]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  const title = product ? product.name : 'Tidak Ditemukan';
  const desc = product ? `Pesan ${product.name} di ${settings.brandName}. ${product.description || ''}`.substring(0, 150) : 'Produk tidak ditemukan.';
  useSEO(title, desc);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <EmptyState message="Produk yang Anda cari tidak ditemukan." />
        <div className="text-center mt-4">
          <Link to="/katalog">
            <Button variant="secondary">
              <ArrowLeft className="mr-2" size={18} strokeWidth={1.5} /> Kembali ke Katalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryObj = categories.find((c) => c.slug === product.category) || {};
  const categoryLabel = categoryObj.label || product.category;
  
  const waMessage = `Halo ${settings.brandName}, saya tertarik memesan produk ${product.name}.`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-choco-600 mb-6 sm:mb-8 items-center flex-wrap gap-y-2">
        <Link to="/" className="hover:text-brand-500 active:text-brand-500 transition-colors">Beranda</Link>
        <ChevronRight size={14} className="mx-1 flex-shrink-0" />
        <Link to="/katalog" className="hover:text-brand-500 active:text-brand-500 transition-colors">Katalog</Link>
        <ChevronRight size={14} className="mx-1 flex-shrink-0" />
        <Link to={`/katalog?kategori=${product.category}`} className="hover:text-brand-500 active:text-brand-500 transition-colors">
          {categoryLabel}
        </Link>
        <ChevronRight size={14} className="mx-1 flex-shrink-0" />
        <span className="text-choco-900 font-medium truncate max-w-[150px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-12 sm:mb-16">
        <div className="relative p-2 border border-dashed border-line self-start">
          <CornerMarks />
          <div className="aspect-square overflow-hidden bg-cream-100 border border-line">
            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="flex flex-col">
          <span className="font-mono text-[10px] sm:text-[11px] text-brand-500 uppercase tracking-[0.2em] mb-2 sm:mb-3">
            {categoryLabel}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl leading-[1.0] sm:leading-[0.95] text-choco-900 mb-4 sm:mb-6">
            {product.name}
          </h1>
          
          <div className="text-xl sm:text-2xl mb-6 sm:mb-8">
            {product.priceVariants && product.priceVariants.length > 0 ? (
              <div className="space-y-2.5 sm:space-y-3">
                <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-choco-600">Varian Ukuran / Harga:</p>
                <ul className="space-y-2">
                  {product.priceVariants.map((variant, idx) => (
                    <li key={idx} className="ticket flex justify-between items-center px-5 py-2.5 sm:py-3">
                      <span className="text-choco-900 font-medium text-sm sm:text-base">{variant.label}</span>
                      <PriceDisplay price={variant.price} className="text-base sm:text-lg" />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <PriceTicket price={product.price} code={`No. ${String(product.id).padStart(3, '0')}`} className="inline-flex" />
            )}
          </div>

          <div className="prose prose-choco mb-8">
            <h3 className="text-xl sm:text-2xl font-display mb-2 sm:mb-3 text-choco-900">Deskripsi Produk</h3>
            <p className="text-choco-600 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {product.description || PLACEHOLDER_DESCRIPTION}
            </p>
          </div>

          <div className="mt-auto pt-4 border-t border-line">
            <a href={generateWhatsAppLink(waMessage, settings.whatsappNumber, settings.brandName)} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="whatsapp" className="w-full py-3.5 sm:py-4 flex items-center justify-center">
                <span className="w-5 h-5 flex items-center justify-center overflow-hidden mr-2.5 flex-shrink-0">
                  <img
                    src={`${import.meta.env.BASE_URL}images/Maroon_WhatsApp.webp`}
                    alt="WhatsApp"
                    className="w-full h-full object-cover object-center scale-[1.45]"
                  />
                </span>
                Pesan via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="relative overflow-hidden mt-8 border-t-4 border-double border-line pt-10 sm:pt-12">
          <h2 className="relative text-3xl sm:text-4xl md:text-5xl text-choco-900 mb-6 sm:mb-10">Produk Serupa</h2>
          <div className="relative"><ProductGrid products={similarProducts} /></div>
        </div>
      )}
    </div>
  );
}
