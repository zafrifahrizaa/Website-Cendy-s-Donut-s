import { products } from "./src/data/products.js";
import { filterProducts } from "./src/utils/filterProducts.js";

console.log("Total produk:", products.length);

const slugs = products.map(p => p.slug);
const uniqueSlugs = new Set(slugs);
console.log("Slug unik:", uniqueSlugs.size === products.length);

const boluCakeProducts = filterProducts(products, "bolu-cake");
console.log("Total produk di bolu-cake:", boluCakeProducts.length);
const crossCategory = boluCakeProducts.filter(p => p.category !== "bolu-cake");
console.log("Produk lintas kategori (bolu-cake tapi category lain):", crossCategory.length);
crossCategory.forEach(p => console.log("- " + p.name));
