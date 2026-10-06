import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import Button from './Button';

export default function EmptyState({ message = "Produk tidak ditemukan.", onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-choco-600 mb-6">{message}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {onReset && (
          <Button variant="secondary" onClick={onReset}>
            Reset filter
          </Button>
        )}
        <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer">
          <Button variant="whatsapp">
            <MessageCircle className="mr-2" size={20} /> Tanya via WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}
