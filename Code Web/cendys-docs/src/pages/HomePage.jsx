import useSEO from '../hooks/useSEO';
import { Link } from 'react-router-dom';
import { ArrowRight, FileDown } from 'lucide-react';
import { categories } from '../data/categories';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { useStore } from '../context/storeState';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import ProductGrid from '../components/product/ProductGrid';
import CornerMarks from '../components/ui/CornerMarks';

export default function HomePage() {
  const { products, settings } = useStore();
  useSEO("Beranda", `Selamat datang di ${settings.brandName}. Kami melayani pelanggan di sekitar Sidoarjo dengan berbagai pilihan roti dan kue.`);

  const bestSellers = products.filter(p => p.subcategory === 'best-seller').slice(0, 4);
  const heroImageSrc = settings.heroImage?.startsWith('/')
    ? `${import.meta.env.BASE_URL}${settings.heroImage.replace(/^\/+/, '')}`
    : settings.heroImage || `${import.meta.env.BASE_URL}images/Donat header.webp`;

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-maroon halftone text-cream-50 py-10 sm:py-16 md:py-24 px-4 sm:px-6 border-b-4 border-double border-cream-50/30">
        <CornerMarks inside className="text-cream-50/60" />
        <div className="relative max-w-6xl mx-auto grid grid-cols-12 md:grid-cols-2 items-center gap-x-3 sm:gap-x-6 md:gap-x-10 lg:gap-x-14 gap-y-6 md:gap-y-0">
          {/* Atas/Kiri: Judul + Deskripsi */}
          <div className="col-span-7 md:col-span-1 md:col-start-1 md:row-start-1 md:self-end text-left">
            <h1 className="text-[clamp(2rem,8.5vw,6.25rem)] leading-[0.95] tracking-tight italic mb-3 sm:mb-6 break-words">
              {settings.brandName}
            </h1>
            <p className="font-mono text-[10px] sm:text-[11px] md:text-xs uppercase tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.18em] md:mb-8 max-w-xl text-cream-100/75 leading-relaxed sm:leading-loose">
              {settings.heroDescription}
            </p>
          </div>

          {/* Kanan: Gambar donat (tetap sejajar di samping judul pada mobile) */}
          <div className="col-span-5 md:col-span-1 md:col-start-2 md:row-start-1 md:row-span-2 flex justify-center md:justify-end">
            <img
              src={heroImageSrc}
              alt={`Aneka donat ${settings.brandName}`}
              className="w-full max-w-[170px] sm:max-w-[260px] md:max-w-full lg:max-w-md max-h-[240px] sm:max-h-[340px] md:max-h-[520px] object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.35)]"
            />
          </div>

          {/* Bawah (Mobile) / Kiri Bawah (Desktop): Tombol + Statistik */}
          <div className="col-span-12 md:col-span-1 md:col-start-1 md:row-start-2 md:self-start text-center md:text-left">
            <div className="grid grid-cols-2 sm:flex sm:flex-row justify-center md:justify-start gap-2.5 sm:gap-4 w-full sm:w-auto">
              <Link to="/katalog" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto !bg-cream-50 !text-maroon !border-cream-50 hover:!bg-choco-900 hover:!border-choco-900 hover:!text-cream-50 active:!bg-choco-900 active:!text-cream-50 !px-3 sm:!px-8 py-3.5 sm:py-4 !text-[11px] sm:!text-[13px]">
                  Lihat Katalog
                </Button>
              </Link>
              <a href={generateWhatsAppLink(undefined, settings.whatsappNumber, settings.brandName)} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="whatsapp" className="w-full sm:w-auto !bg-transparent !border-cream-50/50 hover:!bg-cream-50 hover:!text-maroon active:!bg-cream-50 active:!text-maroon !px-3 sm:!px-8 py-3.5 sm:py-4 !text-[11px] sm:!text-[13px]">
                  Pesan Sekarang
                </Button>
              </a>
            </div>

            {/* Statistik mikro (diambil dari data produk) */}
            <dl className="mt-6 sm:mt-10 pt-5 border-t border-dashed border-cream-50/30 grid grid-cols-3 gap-3 sm:gap-6 max-w-md mx-auto md:mx-0 text-center md:text-left">
              {[
                { value: `${products.length}`, label: 'Varian Produk' },
                { value: `${categories.filter(c => c.slug !== 'semua').length}`, label: 'Kategori' },
                { value: 'Harian', label: 'Produksi Sidoarjo' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display italic text-2xl sm:text-4xl leading-none text-cream-50">{stat.value}</dt>
                  <dd className="mt-1.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.16em] text-cream-100/60 leading-snug">{stat.label}</dd>
                </div>
              ))}
            </dl>
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
                  href={`${import.meta.env.BASE_URL}Cendy's%20Donut's%20Catalog.pdf`}
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
          <a href={generateWhatsAppLink(undefined, settings.whatsappNumber, settings.brandName)} target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto">
            <Button variant="whatsapp" className="w-full sm:w-auto px-8 py-3.5 sm:py-4 flex items-center justify-center">
              <span className="w-5 h-5 flex items-center justify-center overflow-hidden mr-2.5 flex-shrink-0">
                <img
                  src={`${import.meta.env.BASE_URL}images/Maroon_WhatsApp.webp`}
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
