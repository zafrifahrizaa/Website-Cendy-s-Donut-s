export default function SubcategoryChips({ subcategories, activeSubcategory, onSelect }) {
  if (!subcategories || subcategories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelect("")}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          !activeSubcategory
            ? 'bg-choco-900 text-white'
            : 'bg-cream-100 text-choco-600 hover:bg-cream-50'
        }`}
      >
        Semua Subkategori
      </button>
      {subcategories.map((sub) => {
        const isActive = activeSubcategory === sub.slug;
        return (
          <button
            key={sub.slug}
            onClick={() => onSelect(sub.slug)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              isActive
                ? 'bg-choco-900 text-white'
                : 'bg-cream-100 text-choco-600 hover:bg-cream-50'
            }`}
          >
            {sub.label}
          </button>
        );
      })}
    </div>
  );
}
