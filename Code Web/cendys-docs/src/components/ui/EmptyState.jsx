import { generateWhatsAppLink } from '../../utils/whatsapp';
import { useStore } from '../../context/storeState';
import Button from './Button';

export default function EmptyState({ message = "Produk tidak ditemukan.", onReset }) {
  const { settings } = useStore();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-line">
      <p className="font-display text-3xl text-choco-900 mb-8">{message}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {onReset && (
          <Button variant="secondary" onClick={onReset}>
            Reset filter
          </Button>
        )}
        <a
          href={generateWhatsAppLink(undefined, settings.whatsappNumber, settings.brandName)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="whatsapp" className="flex items-center justify-center">
            <span className="w-5 h-5 flex items-center justify-center overflow-hidden mr-2 flex-shrink-0">
              <img
                src={`${import.meta.env.BASE_URL}images/Maroon_WhatsApp.webp`}
                alt="WhatsApp"
                className="w-full h-full object-cover object-center scale-[1.45]"
              />
            </span>
            Tanya via WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}
