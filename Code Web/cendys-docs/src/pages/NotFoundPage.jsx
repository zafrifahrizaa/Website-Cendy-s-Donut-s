import useSEO from '../hooks/useSEO';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  useSEO("Halaman Tidak Ditemukan", "Halaman yang Anda cari tidak ditemukan.");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
      <h1 className="text-5xl font-display font-bold text-choco-900 mb-6">404</h1>
      <p className="text-xl text-choco-600 mb-8">Halaman tidak ditemukan.</p>
      <Link to="/">
        <Button>Kembali ke Beranda</Button>
      </Link>
    </div>
  );
}
