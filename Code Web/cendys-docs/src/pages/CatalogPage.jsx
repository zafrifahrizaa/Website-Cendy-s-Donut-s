import useSEO from '../hooks/useSEO';
import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileDown } from 'lucide-react';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { filterProducts } from '../utils/filterProducts';
import SectionTitle from '../components/ui/SectionTitle';
import SearchBar from '../components/product/SearchBar';
import CategoryTabs from '../components/product/CategoryTabs';
import SubcategoryChips from '../components/product/SubcategoryChips';
import ProductGrid from '../components/product/ProductGrid';
import Watermark from '../components/ui/Watermark';

export default function CatalogPage() {
  useSEO("Katalog Produk", "Lihat katalog lengkap produk roti, donat, bolu, dan kue basah dari Cendy's Donut's.");

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <SectionTitle
          title="Katalog Produk"
          subtitle="Temukan berbagai macam roti, donat, dan kue pilihan kami."
          className="!mb-0"
        />
        <a
          href="/Cendy's%20Donut's%20Catalog.pdf"
          download="Cendy's Donut's Catalog.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] border border-choco-900 bg-cream-100/50 text-choco-900 hover:bg-choco-900 hover:text-cream-50 active:scale-95 transition-all duration-200 self-start sm:self-auto flex-shrink-0 touch-manipulation"
        >
          <FileDown size={15} strokeWidth={1.5} className="mr-2 text-brand-500" /> Unduh Katalog PDF
        </a>
      </div>
      
      <div className="sticky top-16 z-30 bg-cream-50/95 backdrop-blur-md pt-2 pb-1 mb-4 border-b-4 border-double border-line">
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

      <div className="relative overflow-hidden pt-2">
        <Watermark className="text-choco-900 left-0 top-10">Slow-Ferment</Watermark>
        <div className="relative">
          <ProductGrid products={filteredProducts} onReset={handleReset} />
        </div>
      </div>
    </div>
  );
}
