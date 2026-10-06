export default function CategoryTabs({ categories, activeCategory, onSelect }) {
  return (
    <div className="flex overflow-x-auto hide-scrollbar space-x-2 pb-2 mb-4">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug || (!activeCategory && cat.slug === 'semua');
        return (
          <button
            key={cat.slug}
            onClick={() => onSelect(cat.slug)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-colors ${
              isActive
                ? 'bg-brand-500 text-white'
                : 'bg-cream-100 text-choco-600 hover:bg-cream-50 hover:text-brand-500'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
