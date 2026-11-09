import { FileDown } from 'lucide-react';
import { business } from '../../data/business';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer
      style={{ paddingBottom: 'calc(3rem + env(safe-area-inset-bottom, 0px))' }}
      className="bg-choco-900 text-cream-50 pt-12 sm:pt-16 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto text-center md:text-left">
        <h3 className="text-4xl sm:text-5xl md:text-7xl font-display italic leading-tight sm:leading-none mb-6 sm:mb-10 text-cream-50">
          {business.name}
        </h3>
        <p className="mb-2 text-sm sm:text-base text-cream-100/80 max-w-md mx-auto md:mx-0">{business.address}</p>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 mb-4">
          <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] text-cream-100 underline decoration-dashed underline-offset-4">
            Instagram: {business.instagram}
          </p>
          <span className="text-cream-100/30 hidden sm:inline">•</span>
          <a
            href="/Cendy's%20Donut's%20Catalog.pdf"
            download="Cendy's Donut's Catalog.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] text-brand-500 hover:text-cream-50 underline decoration-dashed underline-offset-4 transition-colors inline-flex items-center"
          >
            <FileDown size={13} className="mr-1.5" /> Unduh Katalog PDF
          </a>
        </div>
        <p className="text-cream-100/50 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] mt-8 sm:mt-10 pt-6 border-t-4 border-double border-cream-100/20">
          &copy; {currentYear} {business.name}. Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  );
}
