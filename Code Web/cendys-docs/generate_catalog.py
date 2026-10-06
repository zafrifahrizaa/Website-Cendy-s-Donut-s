import os

files = {
  "src/components/product/PriceDisplay.jsx": """import { formatPrice } from '../../utils/formatPrice';

export default function PriceDisplay({ price, className = "" }) {
  const isNull = price === null || price === undefined;
  return (
    <span className={`font-medium ${isNull ? 'text-choco-600 text-sm' : 'text-brand-600'} ${className}`}>
      {formatPrice(price)}
    </span>
  );
}
""",

  "src/components/product/ProductCard.jsx": """import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import ImageWithFallback from '../ui/ImageWithFallback';
import PriceDisplay from './PriceDisplay';

export default function ProductCard({ product }) {
  const waMessage = `Halo Cendys Donuts, saya tertarik dengan produk ${product.name}.`;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border border-cream-100">
      <Link to={`/produk/${product.slug}`} className="block relative aspect-square overflow-hidden group">
        <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-1">
          {product.category}
        </span>
        <Link to={`/produk/${product.slug}`} className="hover:text-brand-600 transition-colors">
          <h3 className="font-display font-semibold text-choco-900 leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <PriceDisplay price={product.price} />
          <a
            href={generateWhatsAppLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-wa-500 text-white rounded-full hover:bg-wa-600 transition-colors flex-shrink-0 ml-2"
            aria-label="Pesan via WhatsApp"
            title="Pesan via WhatsApp"
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
""",

  "src/components/product/ProductGrid.jsx": """import ProductCard from './ProductCard';
import EmptyState from '../ui/EmptyState';

export default function ProductGrid({ products, onReset }) {
  if (!products || products.length === 0) {
    return <EmptyState message="Produk tidak ditemukan." onReset={onReset} />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
""",

  "src/components/product/CategoryTabs.jsx": """export default function CategoryTabs({ categories, activeCategory, onSelect }) {
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
""",

  "src/components/product/SubcategoryChips.jsx": """export default function SubcategoryChips({ subcategories, activeSubcategory, onSelect }) {
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
""",

  "src/components/product/SearchBar.jsx": """import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="text-choco-600" size={20} />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-10 py-3 bg-white border border-cream-100 rounded-xl text-choco-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
        placeholder="Cari roti, donat, bolu..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-choco-600 hover:text-brand-500"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
""",

  "src/pages/CatalogPage.jsx": """import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { filterProducts } from '../utils/filterProducts';
import SectionTitle from '../components/ui/SectionTitle';
import SearchBar from '../components/product/SearchBar';
import CategoryTabs from '../components/product/CategoryTabs';
import SubcategoryChips from '../components/product/SubcategoryChips';
import ProductGrid from '../components/product/ProductGrid';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current params from URL
  const categoryParam = searchParams.get('kategori') || 'semua';
  const subcategoryParam = searchParams.get('sub') || '';
  const searchParam = searchParams.get('q') || '';

  // Get active category object to find subcategories
  const activeCategoryObj = categories.find(c => c.slug === categoryParam);
  const availableSubcategories = activeCategoryObj?.subcategories || [];

  // Filter products using utility function
  const filteredProducts = useMemo(() => {
    return filterProducts(products, categoryParam, subcategoryParam, searchParam);
  }, [categoryParam, subcategoryParam, searchParam]);

  // Handlers for updating URL params
  const handleCategoryChange = useCallback((newCategory) => {
    const params = new URLSearchParams(searchParams);
    if (newCategory && newCategory !== 'semua') {
      params.set('kategori', newCategory);
    } else {
      params.delete('kategori');
    }
    // Reset subcategory when category changes
    params.delete('sub');
    
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleSubcategoryChange = useCallback((newSubcategory) => {
    const params = new URLSearchParams(searchParams);
    if (newSubcategory) {
      params.set('sub', newSubcategory);
    } else {
      params.delete('sub');
    }
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleSearchChange = useCallback((newQuery) => {
    const params = new URLSearchParams(searchParams);
    if (newQuery) {
      params.set('q', newQuery);
    } else {
      params.delete('q');
    }
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleReset = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <SectionTitle title="Katalog Produk" subtitle="Temukan berbagai macam roti, donat, dan kue pilihan kami." />
      
      <div className="sticky top-16 z-30 bg-cream-50 pt-2 pb-1 mb-2">
        <SearchBar value={searchParam} onChange={handleSearchChange} />
        <CategoryTabs 
          categories={categories} 
          activeCategory={categoryParam} 
          onSelect={handleCategoryChange} 
        />
        <SubcategoryChips 
          subcategories={availableSubcategories} 
          activeSubcategory={subcategoryParam} 
          onSelect={handleSubcategoryChange} 
        />
      </div>

      <ProductGrid products={filteredProducts} onReset={handleReset} />
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
