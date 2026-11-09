import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative mb-4 sm:mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="text-choco-600" size={18} strokeWidth={1.5} />
      </div>
      <input
        type="text"
        aria-label="Cari produk"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        className="block w-full pl-10 pr-12 py-3 bg-transparent border-0 border-b border-choco-900 rounded-none text-choco-900 text-[16px] sm:text-base placeholder:text-choco-600/70 focus:outline-none focus:ring-0 focus:border-brand-500 transition-colors"
        placeholder="Cari roti, donat, bolu..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          aria-label="Hapus pencarian"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 px-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-choco-600 hover:text-brand-500 active:opacity-70 transition-colors"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
