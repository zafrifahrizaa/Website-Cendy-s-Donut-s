import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { business } from '../../data/business';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Katalog', path: '/katalog' },
    { name: 'Kontak', path: '/kontak' },
  ];

  return (
    <nav className="bg-cream-50 shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-display font-bold text-brand-600">
            {business.name}
          </Link>
          
          <div className="hidden md:flex space-x-8">
            {links.map((link) => (
              <Link key={link.name} to={link.path} className="text-choco-900 hover:text-brand-500 font-medium transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button aria-label="Menu navigasi" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} className="text-choco-900 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-cream-50 border-t border-cream-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-choco-900 hover:text-brand-500 hover:bg-cream-100"
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
