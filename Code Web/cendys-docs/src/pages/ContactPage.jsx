import useSEO from '../hooks/useSEO';
import { MapPin, Phone, AtSign } from 'lucide-react';
import { business } from '../data/business';
import { generateWhatsAppLink } from '../utils/whatsapp';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';

export default function ContactPage() {
  useSEO("Hubungi Kami", "Informasi kontak, lokasi alamat, WhatsApp, dan Instagram resmi Cendys Donuts.");

  const mapQuery = encodeURIComponent(business.address);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <SectionTitle title="Hubungi Kami" subtitle="Informasi kontak dan lokasi Cendys Donuts." className="text-center" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 max-w-4xl mx-auto">
        <div className="flex flex-col space-y-10">
          <div className="flex items-start">
            <div className="bg-brand-500 text-white p-4 rounded-2xl mr-6 flex-shrink-0 shadow-sm">
              <MapPin size={28} />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-choco-900 mb-2">Lokasi Usaha</h3>
              <p className="text-choco-600 leading-relaxed max-w-sm">{business.address}</p>
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-600 font-medium inline-block mt-3">
                Buka di Google Maps &rarr;
              </a>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-wa-500 text-white p-4 rounded-2xl mr-6 flex-shrink-0 shadow-sm">
              <Phone size={28} />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-choco-900 mb-2">WhatsApp</h3>
              <p className="text-choco-600 mb-4">{business.whatsapp.display}</p>
              <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp">Mulai Obrolan</Button>
              </a>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-pink-600 text-white p-4 rounded-2xl mr-6 flex-shrink-0 shadow-sm">
              <AtSign size={28} />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-choco-900 mb-2">Instagram</h3>
              <p className="text-choco-600 mb-3">{business.instagram}</p>
              <a href={`https://instagram.com/${business.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-600 font-medium">
                Kunjungi Profil &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
