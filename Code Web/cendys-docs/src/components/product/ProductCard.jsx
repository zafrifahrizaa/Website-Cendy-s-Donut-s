import { Link } from 'react-router-dom';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import ImageWithFallback from '../ui/ImageWithFallback';
import PriceTicket from './PriceTicket';

export default function ProductCard({ product }) {
  const waMessage = `Halo Cendy's Donut's, saya tertarik dengan produk ${product.name}.`;
  const code = `No. ${String(product.id).padStart(3, '0')}`;
  const isBestSeller = product.subcategory === 'best-seller';

  return (
    <div className="group flex flex-col h-full border border-dashed border-line p-2 sm:p-3 bg-cream-50/70">
      <Link
        to={`/produk/${product.slug}`}
        className="block relative aspect-square overflow-hidden border border-line bg-cream-100 active:opacity-90 transition-opacity"
      >
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {isBestSeller && (
          <span className="ribbon absolute top-0 right-2 sm:right-3 px-2 pt-1.5 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.16em] leading-tight text-center">
            Best<br />Seller
          </span>
        )}

        <span className="sticker absolute left-2 bottom-2 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-choco-900">
          {product.category}
        </span>
      </Link>

      <div className="pt-3 sm:pt-4 flex flex-col flex-grow">
        <Link to={`/produk/${product.slug}`} className="hover:text-brand-600 active:text-brand-600 transition-colors">
          <h3 className="font-display text-xl sm:text-2xl text-choco-900 leading-[1.1] mb-3 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <PriceTicket price={product.price} code={code} className="mt-auto">
          <a
            href={generateWhatsAppLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[40px] min-h-[40px] p-2 text-choco-900 hover:text-brand-500 active:text-brand-500 active:scale-95 transition-all duration-200 flex items-center justify-center touch-manipulation"
            aria-label={`Pesan ${product.name} via WhatsApp`}
            title="Pesan via WhatsApp"
          >
            <span className="w-5 h-5 flex items-center justify-center overflow-hidden">
              <img
                src="/images/Maroon_WhatsApp.webp"
                alt="Pesan via WhatsApp"
                className="w-full h-full object-cover object-center scale-[1.45]"
              />
            </span>
          </a>
        </PriceTicket>
      </div>
    </div>
  );
}
