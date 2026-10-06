export const formatPrice = (price) => {
  if (price === null || price === undefined) return "Hubungi kami untuk harga";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};
