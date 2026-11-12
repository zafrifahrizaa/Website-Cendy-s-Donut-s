import { useState, useEffect, useCallback } from 'react';
import { products as staticProducts } from '../data/products';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { StoreContext, defaultSettings } from './storeState';

function mapRowToProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    alsoInCategories: Array.isArray(row.also_in_categories) ? row.also_in_categories : [],
    subcategory: row.subcategory || null,
    price: row.price ?? null,
    priceVariants: Array.isArray(row.price_variants) ? row.price_variants : [],
    image: row.image || '',
    description: row.description || '',
    sortOrder: row.sort_order ?? 0,
  };
}

function mapRowToSettings(row) {
  if (!row) return defaultSettings;
  return {
    brandName: row.brand_name || defaultSettings.brandName,
    heroDescription: row.hero_description || defaultSettings.heroDescription,
    heroImage: row.hero_image || defaultSettings.heroImage,
    ownerName: row.owner_name || defaultSettings.ownerName,
    businessType: row.business_type || defaultSettings.businessType,
    address: row.address || defaultSettings.address,
    whatsappDisplay: row.whatsapp_display || defaultSettings.whatsappDisplay,
    whatsappNumber: row.whatsapp_number || defaultSettings.whatsappNumber,
    instagram: row.instagram || defaultSettings.instagram,
  };
}

async function fetchStoreData() {
  const [productsRes, settingsRes] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true }),
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
  ]);
  return { productsRes, settingsRes };
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(staticProducts);
  const [settings, setSettings] = useState(defaultSettings);
  const [hasDbProducts, setHasDbProducts] = useState(false);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const applyStoreData = useCallback(({ productsRes, settingsRes }) => {
    if (!productsRes.error && productsRes.data) {
      if (productsRes.data.length > 0) {
        setProducts(productsRes.data.map(mapRowToProduct));
        setHasDbProducts(true);
      } else {
        setProducts(staticProducts);
        setHasDbProducts(false);
      }
    }
    if (!settingsRes.error && settingsRes.data) {
      setSettings(mapRowToSettings(settingsRes.data));
    }
  }, []);

  const refreshStore = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const result = await fetchStoreData();
      applyStoreData(result);
    } catch {
      // Fallback ke data statis jika koneksi bermasalah
    } finally {
      setLoading(false);
    }
  }, [applyStoreData]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    let cancelled = false;
    fetchStoreData()
      .then((result) => {
        if (!cancelled) applyStoreData(result);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applyStoreData]);

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        hasDbProducts,
        loading,
        isSupabaseConfigured,
        refreshStore,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
