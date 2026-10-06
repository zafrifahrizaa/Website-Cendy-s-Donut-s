import os
import re

# 1. robots.txt
os.makedirs("public", exist_ok=True)
with open("public/robots.txt", "w", encoding="utf-8") as f:
    f.write("User-agent: *\nAllow: /\n")

# 2. index.html
with open("index.html", "r", encoding="utf-8") as f:
    index_html = f.read()

index_html = index_html.replace('lang="en"', 'lang="id"')
meta_tags = """
    <meta name="description" content="Katalog produk dan profil UMKM Cendys Donuts di Sidoarjo." />
    <meta property="og:title" content="Cendys Donuts" />
    <meta property="og:description" content="Katalog produk dan profil UMKM Cendys Donuts di Sidoarjo." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/images/logo.png" />
"""
if "og:title" not in index_html:
    index_html = index_html.replace('</title>', '</title>\n' + meta_tags)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(index_html)

# 3. useSEO.js
os.makedirs("src/hooks", exist_ok=True)
with open("src/hooks/useSEO.js", "w", encoding="utf-8") as f:
    f.write("""import { useEffect } from 'react';

export default function useSEO(title, description) {
  useEffect(() => {
    document.title = `${title} | Cendys Donuts`;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', document.title);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, [title, description]);
}
""")

# 4. Update Pages
pages_seo = {
    "src/pages/HomePage.jsx": ("Beranda", "Selamat datang di Cendys Donuts. Kami melayani pelanggan di sekitar Sidoarjo dengan berbagai pilihan roti dan kue."),
    "src/pages/AboutPage.jsx": ("Tentang Kami", "Profil usaha Cendys Donuts, pabrik roti yang berlokasi di Sidoarjo yang dikelola oleh Ibu Sri Wahyuni."),
    "src/pages/CatalogPage.jsx": ("Katalog Produk", "Lihat katalog lengkap produk roti, donat, bolu, dan kue basah dari Cendys Donuts."),
    "src/pages/ContactPage.jsx": ("Hubungi Kami", "Informasi kontak, lokasi alamat, WhatsApp, dan Instagram resmi Cendys Donuts."),
    "src/pages/NotFoundPage.jsx": ("Halaman Tidak Ditemukan", "Halaman yang Anda cari tidak ditemukan.")
}

for page_path, (title, desc) in pages_seo.items():
    if os.path.exists(page_path):
        with open(page_path, "r", encoding="utf-8") as f:
            code = f.read()
        
        if "useSEO(" not in code:
            code = f"import useSEO from '../hooks/useSEO';\n" + code
            # find export default function ...() {
            code = re.sub(r'(export default function \w+\([^)]*\)\s*\{)', r'\1\n  useSEO("' + title + '", "' + desc + '");\n', code)
            with open(page_path, "w", encoding="utf-8") as f:
                f.write(code)

# ProductDetailPage needs dynamic SEO
pdp_path = "src/pages/ProductDetailPage.jsx"
if os.path.exists(pdp_path):
    with open(pdp_path, "r", encoding="utf-8") as f:
        pdp_code = f.read()
    
    if "useSEO(" not in pdp_code:
        pdp_code = f"import useSEO from '../hooks/useSEO';\n" + pdp_code
        # Insert hook after useMemo
        hook_call = """
  const title = product ? product.name : 'Tidak Ditemukan';
  const desc = product ? `Pesan ${product.name} di Cendys Donuts. ${product.description || ''}`.substring(0, 150) : 'Produk tidak ditemukan.';
  useSEO(title, desc);
"""
        pdp_code = pdp_code.replace('if (!product) {', hook_call + '\n  if (!product) {')
        with open(pdp_path, "w", encoding="utf-8") as f:
            f.write(pdp_code)

# 5. Accessibility updates
# Layout Navbar button aria-label
navbar_path = "src/components/layout/Navbar.jsx"
if os.path.exists(navbar_path):
    with open(navbar_path, "r", encoding="utf-8") as f:
        nb_code = f.read()
    nb_code = nb_code.replace('<button onClick={() => setIsOpen(!isOpen)}', '<button aria-label="Menu navigasi" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}')
    with open(navbar_path, "w", encoding="utf-8") as f:
        f.write(nb_code)

# SearchBar input aria-label
search_path = "src/components/product/SearchBar.jsx"
if os.path.exists(search_path):
    with open(search_path, "r", encoding="utf-8") as f:
        sb_code = f.read()
    sb_code = sb_code.replace('<input\n        type="text"', '<input\n        type="text"\n        aria-label="Cari produk"')
    sb_code = sb_code.replace('<button\n          onClick={() => onChange("")}', '<button\n          aria-label="Hapus pencarian"\n          onClick={() => onChange("")}')
    with open(search_path, "w", encoding="utf-8") as f:
        f.write(sb_code)

# index.css for focus-visible
css_path = "src/index.css"
if os.path.exists(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()
    if "focus-visible" not in css:
        css += """
@layer base {
  a:focus-visible, button:focus-visible, input:focus-visible {
    @apply outline-none ring-2 ring-brand-500 ring-offset-2;
  }
}
"""
        with open(css_path, "w", encoding="utf-8") as f:
            f.write(css)

print("SEO and a11y generated successfully.")
