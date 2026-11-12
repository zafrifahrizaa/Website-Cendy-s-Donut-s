import { createContext, useContext } from 'react';
import { products as staticProducts } from '../data/products';
import { business } from '../data/business';

export const defaultSettings = {
  brandName: business.name,
  heroDescription:
    'Pabrik dan rumah produksi roti di Sidoarjo yang memproduksi aneka donat, roti lembut, bolu, hingga kue basah segar setiap hari. Melayani pembelian harian, pesanan acara keluarga, syukuran, hingga kebutuhan konsumsi partai besar.',
  heroImage: '/images/Donat header.webp',
  ownerName: business.owner,
  businessType: business.type,
  address: business.address,
  whatsappDisplay: business.whatsapp.display,
  whatsappNumber: business.whatsapp.number,
  instagram: business.instagram,
};

export const StoreContext = createContext({
  products: staticProducts,
  settings: defaultSettings,
  hasDbProducts: false,
  loading: false,
  isSupabaseConfigured: false,
  refreshStore: async () => {},
});

export function useStore() {
  return useContext(StoreContext);
}

