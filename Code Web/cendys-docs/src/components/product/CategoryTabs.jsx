export default function CategoryTabs({ categories, activeCategory, onSelect }) {
  return (
    <div className="flex overflow-x-auto hide-scrollbar smooth-touch-scroll space-x-2 pb-2 mb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug || (!activeCategory && cat.slug === 'semua');
        return (
          <button
            key={cat.slug}
            type="button"
            onClick={() => onSelect(cat.slug)}
            className={`flex-shrink-0 whitespace-nowrap min-h-[40px] px-4 py-2 border font-mono text-[11px] uppercase tracking-[0.16em] transition-all duration-200 active:scale-[0.98] select-none ${
              isActive
                ? 'bg-choco-900 text-cream-50 border-choco-900'
                : 'bg-cream-50 text-choco-600 border-line hover:border-choco-900 hover:text-choco-900 active:bg-cream-100'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
