import json
import os

business_code = """export const business = {
  name: "Cendys Donuts",
  owner: "Sri Wahyuni",
  type: "Pabrik roti / produksi roti",
  address: "Jl. Sunan Muria, RT.01/RW.01, Waras, Sugihwaras, Kec. Candi, Kabupaten Sidoarjo, Jawa Timur 61271",
  whatsapp: {
    display: "+62 857-3533-9708",
    number: "6285735339708"
  },
  instagram: "@cendysd"
};"""

categories_code = """export const categories = [
  { slug: "semua", label: "Semua" },
  {
    slug: "roti", label: "Roti",
    subcategories: [
      { slug: "best-seller", label: "Best Seller" },
      { slug: "sosis-keju", label: "Sosis & Keju" },
      { slug: "abon", label: "Abon" },
      { slug: "wijen-vanilla", label: "Wijen & Vanilla" },
      { slug: "keju-coklat", label: "Keju & Coklat" },
      { slug: "kepang-molen", label: "Kepang & Molen" },
      { slug: "roti-lainnya", label: "Roti Lainnya" },
      { slug: "roti-ukuran-besar", label: "Roti Ukuran Besar / Utuh" },
    ],
  },
  { slug: "donat", label: "Donat" },
  { slug: "bolu-cake", label: "Bolu & Cake" },
  {
    slug: "kue-basah", label: "Kue Basah",
    subcategories: [
      { slug: "kue-tradisional", label: "Kue Tradisional" },
      { slug: "putu-pastel", label: "Putu & Pastel" },
      { slug: "kue-lainnya", label: "Kue Lainnya" },
    ],
  },
];"""

table = [
    [1, "Donat", "donat", "donat", None, [], 3000],
    [2, "Roti Gembul", "roti-gembul", "roti", "best-seller", [], None],
    [3, "Roti Bulet", "roti-bulet", "roti", "best-seller", [], None],
    [4, "Roti Roll Abon", "roti-roll-abon", "roti", "best-seller", [], None],
    [5, "Roti Bolen", "roti-bolen", "roti", "best-seller", [], None],
    [6, "Roti Bulat Variasi", "roti-bulat-variasi", "roti", "best-seller", [], None],
    [7, "Roti Kotak Topping Basah", "roti-kotak-topping-basah", "roti", "best-seller", [], None],
    [8, "Roti Kotak Topping Kering", "roti-kotak-topping-kering", "roti", "best-seller", [], None],
    [9, "Roti Sosis Keju", "roti-sosis-keju", "roti", "sosis-keju", [], None],
    [10, "Roti Sosis Bulat", "roti-sosis-bulat", "roti", "sosis-keju", [], None],
    [11, "Roti Kepang Sosis", "roti-kepang-sosis", "roti", "sosis-keju", [], None],
    [12, "Roti Sosis Biasa", "roti-sosis-biasa", "roti", "sosis-keju", [], None],
    [13, "Roti Beef", "roti-beef", "roti", "sosis-keju", [], None],
    [14, "Roti Abon Oval", "roti-abon-oval", "roti", "abon", [], None],
    [15, "Roti Abon Bulat", "roti-abon-bulat", "roti", "abon", [], None],
    [16, "Roti Mini Kepang Abon", "roti-mini-kepang-abon", "roti", "abon", [], None],
    [17, "Roti Wijen Oval", "roti-wijen-oval", "roti", "wijen-vanilla", [], None],
    [18, "Roti Wijen Lava", "roti-wijen-lava", "roti", "wijen-vanilla", [], None],
    [19, "Roti Wijen", "roti-wijen", "roti", "wijen-vanilla", [], None],
    [20, "Roti Vanilla Sugar", "roti-vanilla-sugar", "roti", "wijen-vanilla", [], None],
    [21, "Roti Vanilla", "roti-vanilla", "roti", "wijen-vanilla", [], None],
    [22, "Roti Kepang Keju Coklat", "roti-kepang-keju-coklat", "roti", "keju-coklat", [], None],
    [23, "Roti Gelung Keju Coklat", "roti-gelung-keju-coklat", "roti", "keju-coklat", [], None],
    [24, "Roti Oval Keju & Misses", "roti-oval-keju-dan-misses", "roti", "keju-coklat", [], None],
    [25, "Roti Cup Kepang", "roti-cup-kepang", "roti", "keju-coklat", [], None],
    [26, "Roti Cup 2 Rasa", "roti-cup-2-rasa", "roti", "keju-coklat", [], None],
    [27, "Roti Kepang Kecil", "roti-kepang-kecil", "roti", "kepang-molen", [], None],
    [28, "Roti Kepang Besar", "roti-kepang-besar", "roti", "kepang-molen", [], None],
    [29, "Roti Molen Kecil", "roti-molen-kecil", "roti", "kepang-molen", [], None],
    [30, "Roti Molen Isi Pisang", "roti-molen-isi-pisang", "roti", "kepang-molen", [], None],
    [31, "Roti Otok-Otok", "roti-otok-otok", "roti", "roti-lainnya", [], None],
    [32, "Roti Golong Open", "roti-golong-open", "roti", "roti-lainnya", [], None],
    [33, "Roti Sakura", "roti-sakura", "roti", "roti-lainnya", [], None],
    [34, "Roti Krumpul UK 15", "roti-krumpul-uk-15", "roti", "roti-lainnya", [], None],
    [35, "Roti Roll Misses", "roti-roll-misses", "roti", "roti-lainnya", [], None],
    [36, "Roti Mawar", "roti-mawar", "roti", "roti-lainnya", [], None],
    [37, "Roti Sobek 4 Rasa", "roti-sobek-4-rasa", "roti", "roti-lainnya", [], None],
    [38, "Roti Caramel Size 28", "roti-caramel-size-28", "roti", "roti-ukuran-besar", ["bolu-cake"], None],
    [39, "Bolu Antep Size 28", "bolu-antep-size-28", "roti", "roti-ukuran-besar", ["bolu-cake"], None],
    [40, "Roti Golong Utuh", "roti-golong-utuh", "roti", "roti-ukuran-besar", [], None],
    [41, "Roti Gulung Utuh Kecil", "roti-gulung-utuh-kecil", "roti", "roti-ukuran-besar", [], None],
    [42, "Roti Surabaya / Spiku Utuh", "roti-surabaya-spiku-utuh", "roti", "roti-ukuran-besar", ["bolu-cake"], None],
    [43, "SponCake", "sponcake", "roti", "roti-ukuran-besar", ["bolu-cake"], None],
    [44, "Roti Bolu Original", "roti-bolu-original", "bolu-cake", None, [], None],
    [45, "Roti Bolu Pandan", "roti-bolu-pandan", "bolu-cake", None, [], None],
    [46, "Roti Bolu Coklat", "roti-bolu-coklat", "bolu-cake", None, [], None],
    [47, "Brownies", "brownies", "bolu-cake", None, [], None],
    [48, "Kue Lemper", "kue-lemper", "kue-basah", "kue-tradisional", [], None],
    [49, "Koci-Koci", "koci-koci", "kue-basah", "kue-tradisional", [], None],
    [50, "Nagasari / Berubi", "nagasari-berubi", "kue-basah", "kue-tradisional", [], None],
    [51, "Kue Bikang Besar", "kue-bikang-besar", "kue-basah", "kue-tradisional", [], None],
    [52, "Kue Apem", "kue-apem", "kue-basah", "kue-tradisional", [], None],
    [53, "Kue Sus", "kue-sus", "kue-basah", "kue-tradisional", [], None],
    [54, "Putu Ayu", "putu-ayu", "kue-basah", "putu-pastel", [], None],
    [55, "Putu Kacang", "putu-kacang", "kue-basah", "putu-pastel", [], None],
    [56, "Pastel", "pastel", "kue-basah", "putu-pastel", [], None],
    [57, "Kue Lapis", "kue-lapis", "kue-basah", "kue-lainnya", [], None],
    [58, "Bikang Kecil", "bikang-kecil", "kue-basah", "kue-lainnya", [], None],
    [59, "Cruncum", "cruncum", "kue-basah", "kue-lainnya", [], None],
    [60, "Kue Pie Buah", "kue-pie-buah", "kue-basah", "kue-lainnya", [], None],
    [61, "Brownies Kukus Misses", "brownies-kukus-misses", "kue-basah", "kue-lainnya", [], None],
]

products_code = """// src/data/products.js — SUMBER TUNGGAL data produk.
// price: null = belum ada data → tampilkan "Hubungi kami untuk harga".
const EMPTY = "";

export const products = [
"""

for item in table:
    pid, name, slug, cat, subcat, also, price = item
    subcat_val = f'"{subcat}"' if subcat else 'null'
    price_val = price if price is not None else 'null'
    also_val = json.dumps(also)
    products_code += f"""  {{
    id: {pid},
    slug: "{slug}",
    name: "{name}",
    category: "{cat}",
    alsoInCategories: {also_val},
    subcategory: {subcat_val},
    price: {price_val},
    priceVariants: [],
    image: "/images/products/{slug}.jpg",
    description: EMPTY,
  }},
"""
products_code += "];\n"

with open("src/data/business.js", "w", encoding="utf-8") as f: f.write(business_code)
with open("src/data/categories.js", "w", encoding="utf-8") as f: f.write(categories_code)
with open("src/data/products.js", "w", encoding="utf-8") as f: f.write(products_code)
