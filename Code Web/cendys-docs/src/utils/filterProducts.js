export const filterProducts = (products, categorySlug, subcategorySlug, searchQuery) => {
  return products.filter((product) => {
    const matchCategory =
      !categorySlug ||
      categorySlug === "semua" ||
      product.category === categorySlug ||
      (product.alsoInCategories && product.alsoInCategories.includes(categorySlug));

    const matchSubcategory = !subcategorySlug || product.subcategory === subcategorySlug;
    const matchSearch = !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSubcategory && matchSearch;
  });
};
