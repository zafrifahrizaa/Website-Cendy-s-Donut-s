import useSEO from '../hooks/useSEO';
import { Link } from 'react-router-dom';
import { ArrowRight, FileDown } from 'lucide-react';
import { business } from '../data/business';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { generateWhatsAppLink } from '../utils/whatsapp';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import ProductGrid from '../components/product/ProductGrid';
import CornerMarks from '../components/ui/CornerMarks';

export default function HomePage() {
  useSEO("Beranda", "Selamat datang di Cendy's Donut's. Kami melayani pelanggan di sekitar Sidoarjo dengan berbagai pilihan roti dan kue.");

  const bestSellers = products.filter(p => p.subcategory === 'best-seller').slice(0, 4);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-maroon halftone text-cream-50 py-16 sm:py-24 md:py-36 px-4 sm:px-6 border-b-4 border-double border-cream-50/30">
        <CornerMarks inside className="text-cream-50/60" />
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-[clamp(2.75rem,11vw,11rem)] leading-[0.9] sm:leading-[0.85] tracking-tight italic mb-6 sm:mb-10 break-words">
            {business.name}
          </h1>
          <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] mb-8 sm:mb-12 max-w-2xl mx-auto text-cream-100/70 leading-relaxed sm:leading-loose px-2">
            Pabrik dan rumah produksi roti di Sidoarjo yang memproduksi aneka donat, roti lembut, bolu, hingga kue basah segar setiap hari. Melayani pembelian harian, pesanan acara keluarga, syukuran, hingga kebutuhan konsumsi partai besar.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
            <Link to="/katalog" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto !bg-cream-50 !text-maroon !border-cream-50 hover:!bg-choco-900 hover:!border-choco-900 hover:!text-cream-50 active:!bg-choco-900 active:!text-cream-50 px-8 py-3.5 sm:py-4">
                Lihat Katalog
              </Button>
            </Link>
            <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button variant="whatsapp" className="w-full sm:w-auto !bg-transparent !border-cream-50/50 hover:!bg-cream-50 hover:!text-maroon active:!bg-cream-50 active:!text-maroon px-8 py-3.5 sm:py-4">
                Pesan Sekarang
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 sm:py-20 bg-cream-50 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Kategori Produk" className="text-center" />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line">
            <CornerMarks />
            {categories.filter(c => c.slug !== 'semua').map((cat, i) => (
              <Link
                key={cat.slug}
                to={`/katalog?kategori=${cat.slug}`}
                className="bg-cream-50 p-5 sm:p-6 md:p-8 text-center hover:bg-choco-900 active:bg-choco-900 transition-colors duration-200 group touch-manipulation"
              >
                <span className="block font-mono text-[10px] tracking-[0.2em] text-brand-500 mb-2 sm:mb-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-choco-900 group-hover:text-cream-50 group-active:text-cream-50 transition-colors">
                  {cat.label}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="relative overflow-hidden py-14 sm:py-20 bg-cream-50 border-t-4 border-double border-line px-4 sm:px-6">
          <div className="relative max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-6 sm:mb-8 flex-wrap gap-2">
              <SectionTitle title="Best Seller" className="mb-0" />
              <div className="flex items-center gap-3 sm:gap-5 mb-2">
                <a
                  href="/Cendy's%20Donut's%20Catalog.pdf"
                  download="Cendy's Donut's Catalog.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-brand-500 hover:text-choco-900 flex items-center border-b border-brand-500 hover:border-choco-900 pb-0.5 transition-colors flex-shrink-0"
                >
                  <FileDown size={13} strokeWidth={1.5} className="mr-1" /> Unduh PDF
                </a>
                <Link
                  to="/katalog?sub=best-seller"
                  className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-choco-900 hover:text-brand-500 flex items-center border-b border-choco-900 hover:border-brand-500 pb-0.5 sm:pb-1 transition-colors flex-shrink-0"
                >
                  Lihat Semua <ArrowRight size={14} strokeWidth={1.5} className="ml-1 sm:ml-2" />
                </Link>
              </div>
            </div>
            <ProductGrid products={bestSellers} />
          </div>
        </section>
      )}

      {/* CTA Bottom */}
      <section className="py-16 sm:py-24 bg-cream-100 halftone-ink border-t-4 border-double border-line px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl md:text-7xl leading-[1.05] sm:leading-[0.95] text-choco-900 mb-4 sm:mb-6">
            Ingin Memesan <em className="text-brand-500">Roti atau Kue?</em>
          </h2>
          <p className="text-choco-600 mb-8 sm:mb-10 text-base sm:text-lg max-w-lg mx-auto">
            Hubungi kami secara langsung melalui WhatsApp untuk melakukan pemesanan.
          </p>
          <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto">
            <Button variant="whatsapp" className="w-full sm:w-auto px-8 py-3.5 sm:py-4 flex items-center justify-center">
              <span className="w-5 h-5 flex items-center justify-center overflow-hidden mr-2.5 flex-shrink-0">
                <img
                  src="/images/Maroon_WhatsApp.webp"
                  alt="WhatsApp"
                  className="w-full h-full object-cover object-center scale-[1.45]"
                />
              </span>
              Hubungi via WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
