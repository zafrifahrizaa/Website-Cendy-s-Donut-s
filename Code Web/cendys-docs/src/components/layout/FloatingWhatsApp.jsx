import { generateWhatsAppLink } from '../../utils/whatsapp';
import { useStore } from '../../context/storeState';

export default function FloatingWhatsApp() {
  const { settings } = useStore();

  return (
    <a
      href={generateWhatsAppLink(undefined, settings.whatsappNumber, settings.brandName)}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
        right: 'calc(1rem + env(safe-area-inset-right, 0px))'
      }}
      className="fixed bg-wa-500 hover:bg-wa-600 active:bg-brand-500 text-cream-50 p-3 rounded-none border border-cream-50/20 shadow-lg active:scale-95 transition-all duration-200 z-40 flex items-center justify-center min-w-[50px] min-h-[50px] touch-manipulation"
      aria-label="Pesan via WhatsApp"
    >
      <span className="w-7 h-7 flex items-center justify-center overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}images/Maroon_WhatsApp.webp`}
          alt="WhatsApp"
          className="w-full h-full object-cover object-center scale-[1.45]"
        />
      </span>
    </a>
  );
}
