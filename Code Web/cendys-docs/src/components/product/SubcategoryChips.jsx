export default function SubcategoryChips({ subcategories, activeSubcategory, onSelect }) {
  if (!subcategories || subcategories.length === 0) return null;

  const chip = (active) =>
    `min-h-[34px] inline-flex items-center px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] border transition-all duration-200 select-none touch-manipulation active:scale-[0.98] ${
      active
        ? 'bg-brand-500 text-cream-50 border-brand-500'
        : 'bg-cream-100 text-choco-600 border-line hover:border-brand-500 hover:text-brand-600 active:bg-cream-200'
    }`;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button type="button" onClick={() => onSelect("")} className={chip(!activeSubcategory)}>
        Semua Subkategori
      </button>
      {subcategories.map((sub) => (
        <button key={sub.slug} type="button" onClick={() => onSelect(sub.slug)} className={chip(activeSubcategory === sub.slug)}>
          {sub.label}
        </button>
      ))}
    </div>
  );
}
