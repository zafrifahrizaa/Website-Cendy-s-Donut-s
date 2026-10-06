import os

files = {
  "tailwind.config.js": """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: { 500: '#D97706', 600: '#B45309' },
        cream: { 50: '#FFFBF5', 100: '#FEF3E2' },
        choco: { 600: '#6B4A35', 900: '#3B2314' },
        wa: { 500: '#25D366', 600: '#1EBE5A' }
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
,

  "src/index.css": """@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-cream-50 text-choco-900 font-sans antialiased m-0;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-display font-semibold;
  }
}
,

  "src/App.jsx": import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/katalog" element={<CatalogPage />} />
          <Route path="/produk/:slug" element={<ProductDetailPage />} />
          <Route path="/kontak" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
,

  "src/components/layout/Layout.jsx": """import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import ScrollToTop from './ScrollToTop';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
,

  "src/components/layout/Navbar.jsx": """import { useState } from 'react';
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
            <button onClick={() => setIsOpen(!isOpen)} className="text-choco-900 p-2">
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
,

  "src/components/layout/Footer.jsx": """import { business } from '../../data/business';

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
,

  "src/components/layout/FloatingWhatsApp.jsx": """import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../../utils/whatsapp';

export default function FloatingWhatsApp() {
  return (
    <a
      href={generateWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-wa-500 hover:bg-wa-600 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 z-40 flex items-center justify-center min-w-[48px] min-h-[48px]"
      aria-label="Pesan via WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
,

  "src/components/layout/ScrollToTop.jsx": """import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
,

  "src/components/ui/Button.jsx": """export default function Button({ children, onClick, className = "", variant = "primary", ...props }) {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 font-medium rounded-xl transition-colors";
  const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-600",
    secondary: "bg-cream-100 text-choco-900 hover:bg-cream-50",
    whatsapp: "bg-wa-500 text-white hover:bg-wa-600",
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
,

  "src/components/ui/Badge.jsx": """export default function Badge({ children, className = "" }) {
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full bg-brand-500 text-white ${className}`}>
      {children}
    </span>
  );
}
,

  "src/components/ui/SectionTitle.jsx": """export default function SectionTitle({ title, subtitle, className = "" }) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-display font-bold text-choco-900">{title}</h2>
      {subtitle && <p className="text-choco-600 mt-2">{subtitle}</p>}
    </div>
  );
}
,

  src/components/ui/EmptyState.jsx": """import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import Button from './Button';

export default function EmptyState({ message = "Produk tidak ditemukan.", onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-choco-600 mb-6">{message}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {onReset && (
          <Button variant="secondary" onClick={onReset}>
            Reset filter
          </Button>
        )}
        <a href={generateWhatsAppLink()} target="_blank" rel="noopener noreferrer">
          <Button variant="whatsapp">
            <MessageCircle className="mr-2" size={20} /> Tanya via WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}
,

  "src/components/ui/ImageWithFallback.jsx": """import { Cookie } from 'lucide-react';

export default function ImageWithFallback({ src, alt, className = "" }) {
  // Assuming images aren't present yet, always show fallback for now.
  // We can add actual fallback logic if requested later.
  return (
    <div className={`bg-cream-100 flex items-center justify-center text-choco-600 ${className}`}>
      <Cookie size={48} opacity={0.5} />
    </div>
  );
}
""",

  "src/pages/HomePage.jsx": """export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-display font-bold mb-4">Halaman Beranda</h1>
      <p>Placeholder untuk halaman beranda.</p>
    </div>
  );
}
""",
  "src/pages/AboutPage.jsx": """export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-display font-bold mb-4">Halaman Tentang Kami</h1>
      <p>Placeholder untuk halaman tentang kami.</p>
    </div>
  );
}
""",
  "src/pages/CatalogPage.jsx": """export default function CatalogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-display font-bold mb-4">Halaman Katalog</h1>
      <p>Placeholder untuk halaman katalog.</p>
    </div>
  );
}
""",
  "src/pages/ProductDetailPage.jsx": """export default function ProductDetailPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-display font-bold mb-4">Halaman Detail Produk</h1>
      <p>Placeholder untuk halaman detail produk.</p>
    </div>
  );
}
""",
  "src/pages/ContactPage.jsx": """export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-display font-bold mb-4">Halaman Kontak</h1>
      <p>Placeholder untuk halaman kontak.</p>
    </div>
  );
}
""",
  "src/pages/NotFoundPage.jsx": """import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
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
"""
}

for path, content in files.items():
  dir_name = os.path.dirname(path)
  if dir_name:
    os.makedirs(dir_name, exist_ok=True)
  with open(path, "w", encoding="utf-8") as f:
    f.write(content)
