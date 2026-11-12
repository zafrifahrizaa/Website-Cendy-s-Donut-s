import { business } from "../data/business.js";

export const generateWhatsAppLink = (message, customNumber, customName) => {
  const number = (customNumber || business.whatsapp.number).replace(/\D/g, '');
  const brand = customName || business.name;
  const text = encodeURIComponent(message || `Halo ${brand}, saya ingin bertanya.`);
  return `https://wa.me/${number}?text=${text}`;
};
