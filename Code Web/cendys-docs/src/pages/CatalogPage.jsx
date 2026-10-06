import useSEO from '../hooks/useSEO';
import { useMemo, useCallback } from 'react';
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
  useSEO("Katalog Produk", "Lihat katalog lengkap produk roti, donat, bolu, dan kue basah dari Cendys Donuts.");

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
