import useSEO from '../hooks/useSEO';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { business } from '../data/business';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { generateWhatsAppLink } from '../utils/whatsapp';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import ProductGrid from '../components/product/ProductGrid';

export default function HomePage() {
  useSEO("Beranda", "Selamat datang di Cendys Donuts. Kami melayani pelanggan di sekitar Sidoarjo dengan berbagai pilihan roti dan kue.");

  const bestSellers = products.filter(p => p.subcategory === 'best-seller').slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-500 text-white py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">{business.name}</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-cream-100">
            {business.type} yang melayani pelanggan di sekitar Sidoarjo dengan berbagai pilihan roti dan kue.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/katalog">
              <Button className="bg-white text-brand-600 hover:bg-cream-50 text-lg px-8 py-3">
                Lihat Katalog
              </Button>
            </Link>
            <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" className="text-lg px-8 py-3 bg-wa-600 hover:bg-wa-500 border border-wa-500">
                <MessageCircle className="mr-2" /> Pesan Sekarang
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-cream-50 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionTitle title="Kategori Produk" className="text-center" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.filter(c => c.slug !== 'semua').map(cat => (
              <Link key={cat.slug} to={`/katalog?kategori=${cat.slug}`} className="bg-white p-6 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow border border-cream-100 group">
                <h3 className="font-display font-semibold text-lg text-choco-900 group-hover:text-brand-500 transition-colors">{cat.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-16 bg-white px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-8">
              <SectionTitle title="Best Seller" className="mb-0" />
              <Link to="/katalog?sub=best-seller" className="text-brand-500 font-medium hover:text-brand-600 flex items-center mb-2">
                Lihat Semua <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <ProductGrid products={bestSellers} />
          </div>
        </section>
      )}

      {/* CTA Bottom */}
      <section className="py-20 bg-cream-100 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-choco-900 mb-4">Ingin Memesan Roti atau Kue?</h2>
          <p className="text-choco-600 mb-8 text-lg">Hubungi kami secara langsung melalui WhatsApp untuk melakukan pemesanan.</p>
          <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" className="text-lg px-8 py-3">
              <MessageCircle className="mr-2" size={24} /> Hubungi via WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
