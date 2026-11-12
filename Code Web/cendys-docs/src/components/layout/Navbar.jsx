import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useStore } from '../../context/storeState';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useStore();

  const links = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Katalog', path: '/katalog' },
    { name: 'Kontak', path: '/kontak' },
  ];

  return (
    <nav className="bg-cream-50 border-b border-line fixed w-full top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16 items-center">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 sm:gap-3 text-2xl font-display italic text-choco-900 hover:text-brand-500 active:opacity-80 transition-colors group"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/Logo Header.webp`}
              alt={`Logo ${settings.brandName}`}
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <span>{settings.brandName}</span>
          </Link>

          <div className="hidden md:flex space-x-10">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-choco-900 hover:text-brand-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button
              aria-label="Menu navigasi"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              className="text-choco-900 min-w-[44px] min-h-[44px] flex items-center justify-center p-2 focus:outline-none active:bg-cream-100 transition-colors"
            >
              {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-cream-50/98 backdrop-blur-md border-t border-line shadow-lg transition-all animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="px-4 py-2 space-y-1">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center min-h-[48px] px-3 font-mono text-xs uppercase tracking-[0.18em] text-choco-900 hover:text-brand-500 active:bg-cream-100 border-b border-line last:border-b-0 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
