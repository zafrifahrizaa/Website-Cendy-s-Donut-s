import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../../utils/whatsapp';

export default function FloatingWhatsApp() {
  return (
    <a
      href={generateWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-wa-500 hover:bg-wa-600 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 z-40 flex items-center justify-center min-w-[48px] min-h-[48px]"
      aria-label="Pesan via WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
