import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import ImageWithFallback from '../ui/ImageWithFallback';
import PriceDisplay from './PriceDisplay';

export default function ProductCard({ product }) {
  const waMessage = `Halo Cendys Donuts, saya tertarik dengan produk ${product.name}.`;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border border-cream-100">
      <Link to={`/produk/${product.slug}`} className="block relative aspect-square overflow-hidden group">
        <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-1">
          {product.category}
        </span>
        <Link to={`/produk/${product.slug}`} className="hover:text-brand-600 transition-colors">
          <h3 className="font-display font-semibold text-choco-900 leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <PriceDisplay price={product.price} />
          <a
            href={generateWhatsAppLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-wa-500 text-white rounded-full hover:bg-wa-600 transition-colors flex-shrink-0 ml-2"
            aria-label="Pesan via WhatsApp"
            title="Pesan via WhatsApp"
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
