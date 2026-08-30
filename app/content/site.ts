export type Language = "es" | "en";
export type Market = "us" | "mx";
export type ProjectKey = "costa" | "vsr" | "beck" | "excessive" | "ciao";

export const SITE_URL = "https://ethrovs.com";
export const WHATSAPP_NUMBER = "19569511763";
export const CONTACT_EMAIL = "ethernaldevops@gmail.com";
export const CONTACT_PHONE = "+1-956-951-1763";

export const pricingByMarket = {
  us: { price: "$300", currency: "USD", extras: ["+$20", "+$30", "+$35", "+$25"] },
  mx: { price: "$5,900", currency: "MXN", extras: ["+$390", "+$590", "+$690", "+$490"] },
} as const;

export const projects = {
  costa: {
    name: "Costa Grill",
    href: "https://costagrillmx.com/",
    image: "/assets/shots/costa-grill.jpg",
    alt: { es: "Portada del sitio de Costa Grill", en: "Homepage of the Costa Grill website" },
    category: { es: "Restaurante · Nuevo Laredo", en: "Restaurant · Nuevo Laredo" },
  },
  vsr: {
    name: "VSR 444",
    href: "https://vsr444.com/",
    image: "/assets/shots/vsr444.jpg",
    alt: { es: "Portada del sitio de VSR 444", en: "Homepage of the VSR 444 website" },
    category: { es: "Edición limitada · H-Town", en: "Limited release · H-Town" },
  },
  beck: {
    name: "BECK",
    href: "https://beckcentrodebelleza.com/",
    image: "/assets/shots/beck.jpg",
    alt: { es: "Portada del sitio de BECK", en: "Homepage of the BECK website" },
    category: { es: "Medicina estética · Nuevo Laredo", en: "Aesthetic medicine · Nuevo Laredo" },
  },
  excessive: {
    name: "Excessive Detailing",
    href: "https://excessivedetailing.com/",
    image: "/assets/shots/excessive.jpg",
    alt: { es: "Portada del sitio de Excessive Detailing", en: "Homepage of the Excessive Detailing website" },
    category: { es: "Detallado móvil · DFW", en: "Mobile detailing · DFW" },
  },
  ciao: {
    name: "Ciao Kitchen",
    href: "https://ciaokitchenmx.com/",
    image: "/assets/shots/ciao.jpg",
    alt: { es: "Portada del sitio de Ciao Kitchen", en: "Homepage of the Ciao Kitchen website" },
    category: { es: "Pizza artesanal · Nuevo Laredo", en: "Artisan pizza · Nuevo Laredo" },
  },
} as const;

export const deckOrder: ProjectKey[] = ["beck", "excessive", "costa", "vsr", "ciao"];
export const workOrder: ProjectKey[] = ["costa", "vsr", "beck", "excessive", "ciao"];

export const whatsappHref = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
