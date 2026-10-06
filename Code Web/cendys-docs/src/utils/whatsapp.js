import { business } from "../data/business.js";

export const generateWhatsAppLink = (message) => {
  const text = encodeURIComponent(message || "Halo Cendys Donuts, saya ingin bertanya.");
  return `https://wa.me/${business.whatsapp.number}?text=${text}`;
};
