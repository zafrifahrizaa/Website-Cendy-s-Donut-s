import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="text-choco-600" size={20} />
      </div>
      <input
        type="text"
        aria-label="Cari produk"
        className="block w-full pl-10 pr-10 py-3 bg-white border border-cream-100 rounded-xl text-choco-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
        placeholder="Cari roti, donat, bolu..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          aria-label="Hapus pencarian"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-choco-600 hover:text-brand-500"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
