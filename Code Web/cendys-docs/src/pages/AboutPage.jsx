import useSEO from '../hooks/useSEO';
import { business } from '../data/business';
import SectionTitle from '../components/ui/SectionTitle';

export default function AboutPage() {
  useSEO("Tentang Kami", "Profil usaha Cendys Donuts, pabrik roti yang berlokasi di Sidoarjo yang dikelola oleh Ibu Sri Wahyuni.");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      <SectionTitle title="Tentang Kami" className="text-center" />
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-cream-100 text-choco-600 text-lg leading-relaxed space-y-6">
        <p>
          <strong>{business.name}</strong> adalah sebuah {business.type.toLowerCase()} yang berlokasi di Sidoarjo, Jawa Timur. Usaha ini dimiliki dan dikelola langsung oleh <strong>{business.owner}</strong>.
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
