import useSEO from '../hooks/useSEO';
import { useStore } from '../context/storeState';
import SectionTitle from '../components/ui/SectionTitle';
import CornerMarks from '../components/ui/CornerMarks';

export default function AboutPage() {
  const { settings } = useStore();
  useSEO("Tentang Kami", `Profil usaha ${settings.brandName}, ${settings.businessType.toLowerCase()} yang berlokasi di Sidoarjo yang dikelola oleh ${settings.ownerName}.`);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <SectionTitle title="Tentang Kami" className="text-center" />
      <div className="relative bg-cream-100 p-6 sm:p-8 md:p-14 border border-line text-choco-600 text-base sm:text-lg leading-relaxed space-y-5 sm:space-y-6">
        <CornerMarks />
        <p>
          <strong>{settings.brandName}</strong> adalah sebuah {settings.businessType.toLowerCase()} yang berlokasi di Sidoarjo, Jawa Timur. Usaha ini dimiliki dan dikelola langsung oleh <strong>{settings.ownerName}</strong>.
        </p>
        <p>
          Kami hadir untuk mempermudah pelanggan di sekitar wilayah Sidoarjo yang sedang mencari berbagai macam produk roti dan kue. Semua informasi spesifikasi dan kategori produk kami dapat ditemukan secara rapi melalui website katalog ini.
        </p>
        <p>
          Bagi Anda yang ingin menanyakan harga, memesan produk, maupun melakukan pesanan dalam jumlah besar, silakan hubungi kami secara langsung melalui layanan WhatsApp.
        </p>
      </div>
    </div>
  );
}
