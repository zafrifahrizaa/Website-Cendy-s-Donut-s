import { business } from "../data/business.js";

export const generateWhatsAppLink = (message) => {
  const text = encodeURIComponent(message || "Halo Cendy's Donut's, saya ingin bertanya.");
  return `https://wa.me/${business.whatsapp.number}?text=${text}`;
};
