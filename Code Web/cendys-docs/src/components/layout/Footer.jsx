import { business } from '../../data/business';

export default function Footer() {
  return (
    <footer className="bg-choco-900 text-cream-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center md:text-left">
        <h3 className="text-xl font-display font-bold mb-4 text-brand-500">{business.name}</h3>
        <p className="mb-2">{business.address}</p>
        <p className="mb-4">Instagram: {business.instagram}</p>
        <p className="text-choco-600 text-sm mt-8">&copy; {new Date().getFullYear()} {business.name}. Hak Cipta Dilindungi.</p>
      </div>
    </footer>
  );
}
