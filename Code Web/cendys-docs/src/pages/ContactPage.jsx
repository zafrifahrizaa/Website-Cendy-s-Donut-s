import useSEO from '../hooks/useSEO';
import { MapPin, Phone, AtSign } from 'lucide-react';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { useStore } from '../context/storeState';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';

export default function ContactPage() {
  const { settings } = useStore();
  useSEO("Hubungi Kami", `Informasi kontak, lokasi alamat, WhatsApp, dan Instagram resmi ${settings.brandName}.`);

  const mapQuery = encodeURIComponent(settings.address);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <SectionTitle title="Hubungi Kami" subtitle={`Informasi kontak dan lokasi ${settings.brandName}.`} className="text-center" />
      
      <div className="mt-8 sm:mt-12 max-w-2xl mx-auto">
        <div className="flex flex-col space-y-8 sm:space-y-10">
          <div className="flex items-start">
            <div className="border border-choco-900 text-choco-900 p-3 sm:p-4 mr-4 sm:mr-6 flex-shrink-0 min-w-[48px] min-h-[48px] flex items-center justify-center">
              <MapPin size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-display text-choco-900 mb-2">Lokasi</h3>
              <p className="text-choco-600 text-sm sm:text-base leading-relaxed">{settings.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-500 hover:text-choco-900 active:text-choco-900 font-mono text-[11px] uppercase tracking-[0.16em] border-b border-current inline-block mt-3"
              >
                Buka di Google Maps &rarr;
              </a>
            </div>
          </div>

          <div className="flex items-start">
            <div className="border border-choco-900 text-choco-900 p-3 sm:p-4 mr-4 sm:mr-6 flex-shrink-0 min-w-[48px] min-h-[48px] flex items-center justify-center">
              <Phone size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-display text-choco-900 mb-2">WhatsApp</h3>
              <p className="text-choco-600 text-sm sm:text-base mb-4">{settings.whatsappDisplay}</p>
              <a
                href={generateWhatsAppLink(undefined, settings.whatsappNumber, settings.brandName)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="whatsapp">Mulai Obrolan</Button>
              </a>
            </div>
          </div>

          <div className="flex items-start">
            <div className="border border-choco-900 text-choco-900 p-3 sm:p-4 mr-4 sm:mr-6 flex-shrink-0 min-w-[48px] min-h-[48px] flex items-center justify-center">
              <AtSign size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-display text-choco-900 mb-2">Instagram</h3>
              <p className="text-choco-600 text-sm sm:text-base mb-3">{settings.instagram}</p>
              <a
                href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-500 hover:text-choco-900 active:text-choco-900 font-mono text-[11px] uppercase tracking-[0.16em] border-b border-current inline-block"
              >
                Kunjungi Profil &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
