import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Database,
  ExternalLink,
  Check,
  X,
  Lock,
  Eye,
} from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useStore } from '../context/storeState';
import { products as staticProducts } from '../data/products';
import { categories } from '../data/categories';
import { compressImageToWebP } from '../utils/imageCompress';
import { formatPrice } from '../utils/formatPrice';
import Button from '../components/ui/Button';
import ImageWithFallback from '../components/ui/ImageWithFallback';
import CornerMarks from '../components/ui/CornerMarks';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const EMPTY_PRODUCT = {
  id: null,
  isNew: true,
  originalSlug: '',
  name: '',
  slug: '',
  category: 'roti',
  alsoInCategories: [],
  subcategory: '',
  price: '',
  priceVariants: [],
  image: '',
  description: '',
  sortOrder: '',
};

export default function AdminPage() {
  useSEO('Admin Panel', 'Halaman pengelola produk dan tampilan Cendy\'s Donut\'s.');

  const { products, settings, hasDbProducts, refreshStore } = useStore();

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);

  const [activeTab, setActiveTab] = useState('products');
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'ok' | 'err', text: string }

  // Product list state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState('semua');
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Settings state (derived from store settings until user edits)
  const [draftSettings, setDraftSettings] = useState(null);
  const formSettings = draftSettings ?? settings;
  const setFormSettings = (updater) => {
    setDraftSettings((prev) => {
      const base = prev ?? settings;
      return typeof updater === 'function' ? updater(base) : updater;
    });
  };
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session || null);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const showNotice = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setAuthError('');
    setLoginBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        const msg = error.message || '';
        if (msg.toLowerCase().includes('email not confirmed')) {
          setAuthError(
            'Email belum dikonfirmasi. Buka Supabase Dashboard -> Authentication -> Users, lalu aktifkan Auto Confirm pada akun ini.'
          );
        } else if (msg.toLowerCase().includes('invalid login credentials')) {
          setAuthError('Email atau password salah. Pastikan akun sudah dibuat di Supabase Auth.');
        } else {
          setAuthError(`Gagal login: ${msg}`);
        }
      }
    } catch {
      setAuthError('Gagal terhubung ke server autentikasi.');
    } finally {
      setLoginBusy(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const uploadToSupabaseStorage = async (file, folder = 'products', maxDim = 800) => {
    const webpBlob = await compressImageToWebP(file, maxDim, 0.84);
    const cleanName = slugify(file.name.replace(/\.[^.]+$/, '')) || 'foto';
    const filePath = `${folder}/${Date.now()}-${cleanName}.webp`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, webpBlob, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const seedStaticProductsToDb = async () => {
    const rows = staticProducts.map((p, index) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      also_in_categories: p.alsoInCategories || [],
      subcategory: p.subcategory || null,
      price: p.price ?? null,
      price_variants: p.priceVariants || [],
      image: p.image || '',
      description: p.description || '',
      sort_order: index + 1,
    }));

    const { data, error } = await supabase
      .from('products')
      .upsert(rows, { onConflict: 'slug' })
      .select('id, slug');
    if (error) throw error;
    return data || [];
  };

  const handleSeedInitialProducts = async () => {
    if (!supabase) return;
    setSeeding(true);
    try {
      const seeded = await seedStaticProductsToDb();
      await refreshStore();
      showNotice('ok', `Berhasil mengimpor ${seeded.length || staticProducts.length} produk awal ke database Supabase!`);
    } catch (err) {
      showNotice('err', `Gagal import: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const openNewProduct = () => {
    setEditingProduct({ ...EMPTY_PRODUCT });
  };

  const openEditProduct = (p) => {
    setEditingProduct({
      id: p.id,
      isNew: false,
      originalSlug: p.slug,
      name: p.name,
      slug: p.slug,
      category: p.category,
      alsoInCategories: Array.isArray(p.alsoInCategories) ? [...p.alsoInCategories] : [],
      subcategory: p.subcategory || '',
      price: p.price === null || p.price === undefined ? '' : String(p.price),
      priceVariants: Array.isArray(p.priceVariants) ? p.priceVariants.map((v) => ({ ...v })) : [],
      image: p.image || '',
      description: p.description || '',
      sortOrder: p.sortOrder !== undefined && p.sortOrder !== null ? String(p.sortOrder) : '',
    });
  };

  const handleProductImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setUploadingImg(true);
    try {
      const publicUrl = await uploadToSupabaseStorage(file, 'products', 800);
      setEditingProduct((prev) => ({ ...prev, image: publicUrl }));
      showNotice('ok', 'Foto berhasil dikompres ke WebP & diupload.');
    } catch (err) {
      showNotice('err', `Gagal upload foto: ${err.message}`);
    } finally {
      setUploadingImg(false);
      e.target.value = '';
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!supabase || !editingProduct) return;

    const cleanName = editingProduct.name.trim();
    const cleanSlug = (editingProduct.slug || slugify(cleanName)).trim();
    if (!cleanName || !cleanSlug) {
      showNotice('err', 'Nama produk dan slug tidak boleh kosong.');
      return;
    }

    const parsedPrice = editingProduct.price === '' ? null : parseInt(editingProduct.price, 10);
    const parsedSort = editingProduct.sortOrder === '' ? null : parseInt(editingProduct.sortOrder, 10);
    const cleanedVariants = (editingProduct.priceVariants || [])
      .filter((v) => v.label && v.label.trim())
      .map((v) => ({
        label: v.label.trim(),
        price: v.price === '' || v.price === null ? null : parseInt(v.price, 10),
      }));

    const payload = {
      name: cleanName,
      slug: cleanSlug,
      category: editingProduct.category,
      also_in_categories: (editingProduct.alsoInCategories || []).filter(
        (catSlug) => catSlug && catSlug !== editingProduct.category
      ),
      subcategory: editingProduct.subcategory || null,
      price: Number.isNaN(parsedPrice) ? null : parsedPrice,
      price_variants: cleanedVariants,
      image: editingProduct.image.trim(),
      description: editingProduct.description.trim(),
      ...(parsedSort !== null && !Number.isNaN(parsedSort) ? { sort_order: parsedSort } : {}),
    };

    setSavingProduct(true);
    try {
      let seededRows = [];
      if (!hasDbProducts) {
        seededRows = await seedStaticProductsToDb();
      }

      if (!editingProduct.isNew) {
        let query = supabase.from('products').update(payload);
        if (hasDbProducts && editingProduct.id) {
          query = query.eq('id', editingProduct.id);
        } else {
          const matched = seededRows.find((r) => r.slug === editingProduct.originalSlug);
          query = matched ? query.eq('id', matched.id) : query.eq('slug', editingProduct.originalSlug);
        }
        const { error } = await query;
        if (error) throw error;
        showNotice('ok', `Produk "${cleanName}" berhasil diperbarui.`);
      } else {
        const nextOrder =
          payload.sort_order ?? (hasDbProducts ? products.length + 1 : staticProducts.length + 1);
        const { error } = await supabase
          .from('products')
          .insert([{ ...payload, sort_order: nextOrder }]);
        if (error) throw error;
        showNotice('ok', `Produk "${cleanName}" berhasil ditambahkan.`);
      }
      setEditingProduct(null);
      await refreshStore();
    } catch (err) {
      showNotice('err', `Gagal menyimpan produk: ${err.message}`);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (p) => {
    if (!supabase) return;
    if (!window.confirm(`Hapus produk "${p.name}" secara permanen?`)) return;

    try {
      if (!hasDbProducts) {
        await seedStaticProductsToDb();
      }
      const query = hasDbProducts && p.id
        ? supabase.from('products').delete().eq('id', p.id)
        : supabase.from('products').delete().eq('slug', p.slug);

      const { error } = await query;
      if (error) throw error;
      await refreshStore();
      showNotice('ok', `Produk "${p.name}" telah dihapus.`);
    } catch (err) {
      showNotice('err', `Gagal menghapus: ${err.message}`);
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !supabase) return;
    setUploadingHero(true);
    try {
      const publicUrl = await uploadToSupabaseStorage(file, 'hero', 1000);
      setFormSettings((prev) => ({ ...prev, heroImage: publicUrl }));
      showNotice('ok', 'Foto hero berhasil dikompres & diupload. Jangan lupa klik Simpan Pengaturan.');
    } catch (err) {
      showNotice('err', `Gagal upload foto hero: ${err.message}`);
    } finally {
      setUploadingHero(false);
      e.target.value = '';
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setSavingSettings(true);
    try {
      const { error } = await supabase.from('site_settings').upsert({
        id: 1,
        brand_name: formSettings.brandName.trim(),
        hero_description: formSettings.heroDescription.trim(),
        hero_image: formSettings.heroImage.trim(),
        owner_name: formSettings.ownerName.trim(),
        business_type: formSettings.businessType.trim(),
        address: formSettings.address.trim(),
        whatsapp_display: formSettings.whatsappDisplay.trim(),
        whatsapp_number: formSettings.whatsappNumber.replace(/\D/g, ''),
        instagram: formSettings.instagram.trim(),
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setDraftSettings(null);
      await refreshStore();
      showNotice('ok', 'Tampilan & profil toko berhasil diperbarui di seluruh website!');
    } catch (err) {
      showNotice('err', `Gagal menyimpan pengaturan: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = filterCat === 'semua' || p.category === filterCat;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [products, filterCat, searchQuery]);

  const activeCategorySubcategories = useMemo(() => {
    if (!editingProduct) return [];
    const cat = categories.find((c) => c.slug === editingProduct.category);
    return cat?.subcategories || [];
  }, [editingProduct]);

  // 1. Jika Supabase belum dihubungkan via env
  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="relative bg-cream-100 border border-line p-6 sm:p-10">
          <CornerMarks />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-500 block mb-2">
            Admin Setup Required
          </span>
          <h1 className="text-3xl sm:text-5xl text-choco-900 mb-4">Panel Admin Belum Terhubung</h1>
          <p className="text-choco-600 text-sm sm:text-base leading-relaxed mb-6">
            Untuk mengaktifkan login admin, edit harga, upload foto, dan pengaturan tampilan secara online, hubungkan proyek ini ke database <strong>Supabase</strong> gratis terlebih dahulu:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-sm sm:text-base text-choco-900 mb-8 bg-cream-50 p-5 border border-dashed border-line">
            <li>Buat proyek gratis di <strong>supabase.com</strong>.</li>
            <li>Jalankan isi file <code className="font-mono text-xs bg-cream-100 px-1.5 py-0.5">supabase-schema.sql</code> di menu <strong>SQL Editor</strong> Supabase.</li>
            <li>Buat 1 akun admin di menu <strong>Authentication → Users → Add User</strong>.</li>
            <li>Masukkan <code className="font-mono text-xs bg-cream-100 px-1.5 py-0.5">VITE_SUPABASE_URL</code> dan <code className="font-mono text-xs bg-cream-100 px-1.5 py-0.5">VITE_SUPABASE_ANON_KEY</code> ke file <code className="font-mono text-xs bg-cream-100 px-1.5 py-0.5">.env.local</code> (untuk lokal) dan GitHub Secrets (untuk GitHub Pages).</li>
          </ol>
          <Link to="/">
            <Button variant="secondary">Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center font-mono text-xs uppercase tracking-[0.2em] text-choco-600">
        Memeriksa sesi admin...
      </div>
    );
  }

  // 2. Halaman Login Admin
  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="relative bg-cream-100 border border-line p-6 sm:p-10">
          <CornerMarks />
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-brand-500 mb-3">
            <Lock size={13} strokeWidth={1.5} /> Akses Pengelola
          </div>
          <h1 className="text-4xl sm:text-5xl text-choco-900 mb-2">Login Admin</h1>
          <p className="text-sm text-choco-600 mb-8">Masuk untuk mengelola katalog produk, harga, dan tampilan toko.</p>

          {authError && (
            <div className="mb-6 p-3.5 border border-brand-500 bg-brand-500/10 text-brand-600 text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-2">
                Email Admin
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cendysdonuts.com"
                className="w-full px-3.5 py-3 bg-cream-50 border border-line text-choco-900 text-[16px] focus:border-choco-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-3 bg-cream-50 border border-line text-choco-900 text-[16px] focus:border-choco-900 focus:outline-none"
              />
            </div>

            <Button type="submit" disabled={loginBusy} className="w-full py-3.5">
              {loginBusy ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // 3. Dashboard Admin
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b-4 border-double border-line">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-500 block mb-1">
            Dashboard Pengelola • {session.user?.email}
          </span>
          <h1 className="text-4xl sm:text-5xl text-choco-900">Admin Panel</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link to="/">
            <Button variant="secondary" className="!px-4 !py-2.5 !text-[11px]">
              <ExternalLink size={14} className="mr-1.5" /> Lihat Web
            </Button>
          </Link>
          <Button onClick={handleLogout} className="!bg-choco-900 !border-choco-900 !px-4 !py-2.5 !text-[11px]">
            <LogOut size={14} className="mr-1.5" /> Keluar
          </Button>
        </div>
      </div>

      {/* Status Notice */}
      {statusMsg && (
        <div
          className={`mb-6 p-4 border flex items-center justify-between text-sm ${
            statusMsg.type === 'ok'
              ? 'border-choco-900 bg-cream-100 text-choco-900'
              : 'border-brand-500 bg-brand-500/10 text-brand-600'
          }`}
        >
          <span>{statusMsg.text}</span>
          <button type="button" onClick={() => setStatusMsg(null)} className="ml-4 p-1">
            <X size={16} />
          </button>
        </div>
      )}

      {/* One-Click Seed Banner if DB products table is empty */}
      {!hasDbProducts && (
        <div className="mb-8 p-5 sm:p-6 bg-maroon text-cream-50 border border-choco-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream-100/70 mb-1">
              Langkah Awal Database
            </p>
            <p className="text-sm sm:text-base">
              Tabel produk di Supabase masih kosong. Impor otomatis seluruh <strong>{staticProducts.length} produk</strong> bawaan ke database agar bisa diedit &amp; dihapus?
            </p>
          </div>
          <Button
            onClick={handleSeedInitialProducts}
            disabled={seeding}
            className="!bg-cream-50 !text-maroon !border-cream-50 hover:!bg-cream-100 flex-shrink-0"
          >
            <Database size={15} className="mr-2" />
            {seeding ? 'Mengimpor...' : `Impor ${staticProducts.length} Produk`}
          </Button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <div className="p-4 bg-cream-100 border border-line">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 block mb-1">
            Total Produk
          </span>
          <p className="font-display text-3xl text-choco-900">{products.length}</p>
        </div>
        <div className="p-4 bg-cream-100 border border-line">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 block mb-1">
            Jumlah Kategori
          </span>
          <p className="font-display text-3xl text-choco-900">
            {categories.filter((c) => c.slug !== 'semua').length}
          </p>
        </div>
        <div className="p-4 bg-cream-100 border border-line">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 block mb-1">
            Status Database
          </span>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-choco-900 mt-2">
            {hasDbProducts ? '● Tersinkron ke Supabase' : '○ Data Bawaan (Auto-Sync saat diubah)'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-line pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] border transition-colors ${
            activeTab === 'products'
              ? 'bg-choco-900 text-cream-50 border-choco-900'
              : 'bg-cream-50 text-choco-600 border-line hover:border-choco-900'
          }`}
        >
          Kelola Produk ({products.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('appearance')}
          className={`px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] border transition-colors ${
            activeTab === 'appearance'
              ? 'bg-choco-900 text-cream-50 border-choco-900'
              : 'bg-cream-50 text-choco-600 border-line hover:border-choco-900'
          }`}
        >
          Tampilan &amp; Profil Toko
        </button>
      </div>

      {/* TAB 1: PRODUCTS */}
      {activeTab === 'products' && (
        <div>
          <div className="flex flex-col sm:flex-row gap-3 justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-3 flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama produk..."
                className="px-3.5 py-2.5 bg-cream-50 border border-line text-[16px] sm:text-sm text-choco-900 focus:border-choco-900 focus:outline-none sm:w-64"
              />
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="px-3.5 py-2.5 bg-cream-50 border border-line text-[16px] sm:text-sm text-choco-900 focus:border-choco-900 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={openNewProduct} className="flex-shrink-0">
              <Plus size={16} className="mr-1.5" /> Tambah Produk
            </Button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-10 text-center bg-cream-100 border border-dashed border-line text-choco-600 text-sm">
              Tidak ada produk yang cocok dengan pencarian atau filter kategori saat ini.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((p) => {
                const variantMin =
                  p.priceVariants?.length > 0
                    ? Math.min(
                        ...p.priceVariants
                          .map((v) => v.price)
                          .filter((val) => typeof val === 'number' && !Number.isNaN(val))
                      )
                    : null;

                return (
                  <div
                    key={p.id || p.slug}
                    className="flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-cream-50 border border-dashed border-line"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 border border-line bg-cream-100 flex-shrink-0 overflow-hidden">
                        <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-brand-500 block">
                          {p.category} {p.subcategory ? `• ${p.subcategory}` : ''}
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl text-choco-900 truncate">{p.name}</h3>
                        <p className="text-xs sm:text-sm text-choco-600">
                          {p.priceVariants?.length > 0
                            ? `${
                                Number.isFinite(variantMin) ? `Mulai ${formatPrice(variantMin)} • ` : ''
                              }${p.priceVariants.length} varian`
                            : formatPrice(p.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        to={`/produk/${p.slug}`}
                        className="min-w-[40px] min-h-[40px] p-2 border border-line text-choco-600 hover:border-choco-900 hover:text-choco-900 transition-colors flex items-center justify-center"
                        title="Lihat detail produk"
                        aria-label={`Lihat ${p.name}`}
                      >
                        <Eye size={15} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEditProduct(p)}
                        className="min-w-[40px] min-h-[40px] p-2 border border-choco-900 text-choco-900 hover:bg-choco-900 hover:text-cream-50 transition-colors flex items-center justify-center"
                        title="Edit produk"
                        aria-label={`Edit ${p.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p)}
                        className="min-w-[40px] min-h-[40px] p-2 border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-cream-50 transition-colors flex items-center justify-center"
                        title="Hapus produk"
                        aria-label={`Hapus ${p.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPEARANCE & PROFILE SETTINGS */}
      {activeTab === 'appearance' && (
        <form onSubmit={handleSaveSettings} className="max-w-3xl bg-cream-100 border border-line p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-2">
                Nama Brand (Header &amp; Hero)
              </label>
              <input
                type="text"
                required
                value={formSettings.brandName}
                onChange={(e) => setFormSettings({ ...formSettings, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-2">
                Nama Pemilik
              </label>
              <input
                type="text"
                required
                value={formSettings.ownerName}
                onChange={(e) => setFormSettings({ ...formSettings, ownerName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-2">
              Deskripsi Beranda (Teks di bawah judul Hero)
            </label>
            <textarea
              rows={3}
              required
              value={formSettings.heroDescription}
              onChange={(e) => setFormSettings({ ...formSettings, heroDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-cream-50 border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-2">
              Gambar Utama Hero (Sisi Kanan Beranda)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                type="text"
                value={formSettings.heroImage}
                onChange={(e) => setFormSettings({ ...formSettings, heroImage: e.target.value })}
                placeholder="/images/Donat header.webp"
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
              />
              <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2.5 border border-choco-900 bg-cream-50 text-choco-900 hover:bg-choco-900 hover:text-cream-50 font-mono text-[11px] uppercase tracking-[0.14em] flex-shrink-0">
                <Upload size={14} className="mr-2" />
                {uploadingHero ? 'Mengupload...' : 'Upload Foto'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  disabled={uploadingHero}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-2">
                Nomor WhatsApp (Tampilan)
              </label>
              <input
                type="text"
                required
                value={formSettings.whatsappDisplay}
                onChange={(e) => setFormSettings({ ...formSettings, whatsappDisplay: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-2">
                Nomor WhatsApp Link (628...)
              </label>
              <input
                type="text"
                required
                value={formSettings.whatsappNumber}
                onChange={(e) => setFormSettings({ ...formSettings, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-2">
                Instagram
              </label>
              <input
                type="text"
                required
                value={formSettings.instagram}
                onChange={(e) => setFormSettings({ ...formSettings, instagram: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-2">
                Jenis Usaha
              </label>
              <input
                type="text"
                required
                value={formSettings.businessType}
                onChange={(e) => setFormSettings({ ...formSettings, businessType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-cream-50 border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-2">
              Alamat Lengkap
            </label>
            <textarea
              rows={2}
              required
              value={formSettings.address}
              onChange={(e) => setFormSettings({ ...formSettings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-cream-50 border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
            />
          </div>

          <Button type="submit" disabled={savingSettings} className="w-full sm:w-auto px-8 py-3.5">
            <Check size={16} className="mr-2" />
            {savingSettings ? 'Menyimpan...' : 'Simpan Pengaturan Tampilan'}
          </Button>
        </form>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-choco-900/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-cream-50 border border-choco-900 w-full max-w-xl max-h-[90dvh] overflow-y-auto p-6 sm:p-8 relative">
            <div className="flex justify-between items-center pb-4 mb-6 border-b border-line">
              <h2 className="text-3xl font-display text-choco-900">
                {editingProduct.isNew ? 'Tambah Produk Baru' : 'Edit Produk'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-2 text-choco-600 hover:text-choco-900"
                aria-label="Tutup modal"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-1.5">
                  Nama Produk
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => {
                    const nameVal = e.target.value;
                    setEditingProduct((prev) => ({
                      ...prev,
                      name: nameVal,
                      slug: prev.isNew ? slugify(nameVal) : prev.slug,
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-1.5">
                    Kategori Utama
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        category: e.target.value,
                        subcategory: '',
                      }))
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
                  >
                    {categories
                      .filter((c) => c.slug !== 'semua')
                      .map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-1.5">
                    Subkategori
                  </label>
                  <select
                    value={editingProduct.subcategory}
                    onChange={(e) => setEditingProduct((prev) => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-white border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
                  >
                    <option value="">-- Tidak ada --</option>
                    {activeCategorySubcategories.map((sub) => (
                      <option key={sub.slug} value={sub.slug}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-2">
                  Tampilkan Juga di Kategori Lain (Opsional)
                </label>
                <div className="flex flex-wrap gap-3">
                  {categories
                    .filter((c) => c.slug !== 'semua' && c.slug !== editingProduct.category)
                    .map((c) => {
                      const checked = (editingProduct.alsoInCategories || []).includes(c.slug);
                      return (
                        <label
                          key={c.slug}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-line text-xs text-choco-900 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const current = editingProduct.alsoInCategories || [];
                              const next = e.target.checked
                                ? [...current, c.slug]
                                : current.filter((s) => s !== c.slug);
                              setEditingProduct((prev) => ({ ...prev, alsoInCategories: next }));
                            }}
                          />
                          <span>{c.label}</span>
                        </label>
                      );
                    })}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-1.5">
                  Harga Satuan (Rp) — kosongkan jika belum ada / pakai varian
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Contoh: 3000"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-white border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
                />
              </div>

              {/* Varian Harga */}
              <div className="p-4 bg-cream-100 border border-dashed border-line">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600">
                    Varian Harga (Opsional)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        priceVariants: [...(prev.priceVariants || []), { label: '', price: '' }],
                      }))
                    }
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-500 hover:text-choco-900"
                  >
                    + Tambah Varian
                  </button>
                </div>
                {(editingProduct.priceVariants || []).map((v, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Ukuran/Label (misal: Box isi 6)"
                      value={v.label}
                      onChange={(e) => {
                        const next = [...editingProduct.priceVariants];
                        next[idx] = { ...next[idx], label: e.target.value };
                        setEditingProduct((prev) => ({ ...prev, priceVariants: next }));
                      }}
                      className="flex-grow px-3 py-2 bg-white border border-line text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Harga"
                      value={v.price ?? ''}
                      onChange={(e) => {
                        const next = [...editingProduct.priceVariants];
                        next[idx] = { ...next[idx], price: e.target.value };
                        setEditingProduct((prev) => ({ ...prev, priceVariants: next }));
                      }}
                      className="w-28 px-3 py-2 bg-white border border-line text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = editingProduct.priceVariants.filter((_, i) => i !== idx);
                        setEditingProduct((prev) => ({ ...prev, priceVariants: next }));
                      }}
                      className="px-2 text-brand-500 hover:text-choco-900"
                      aria-label="Hapus varian"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload Foto Produk */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-1.5">
                  Foto Produk (Otomatis dikompres ke WebP ringan)
                </label>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-20 h-20 border border-line bg-cream-100 flex-shrink-0 overflow-hidden">
                    <ImageWithFallback
                      src={editingProduct.image}
                      alt={editingProduct.name || 'Preview'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow space-y-2">
                    <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-choco-900 bg-cream-100 text-choco-900 hover:bg-choco-900 hover:text-cream-50 font-mono text-[10px] uppercase tracking-[0.14em]">
                      <Upload size={13} className="mr-2" />
                      {uploadingImg ? 'Mengompres & Upload...' : 'Pilih Foto dari HP / Laptop'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductImageUpload}
                        disabled={uploadingImg}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="atau tempel URL / path gambar"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct((prev) => ({ ...prev, image: e.target.value }))}
                      className="w-full px-3 py-1.5 bg-white border border-line text-xs text-choco-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-choco-600 mb-1.5">
                  Deskripsi Produk
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Tulis keterangan rasa, isi, atau minimal pemesanan..."
                  className="w-full px-3.5 py-2.5 bg-white border border-line text-[16px] text-choco-900 focus:border-choco-900 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={savingProduct || uploadingImg} className="flex-grow py-3">
                  {savingProduct ? 'Menyimpan...' : 'Simpan Produk'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setEditingProduct(null)}>
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
