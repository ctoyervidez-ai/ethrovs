export type Language = "es" | "en";
export type Market = "us" | "mx";
export type ProjectKey = "costa" | "vsr" | "excessive" | "ciao";

export const SITE_URL = "https://ethrovs.com";
export const WHATSAPP_NUMBER = "19569511763";
export const CONTACT_EMAIL = "ethernaldevops@gmail.com";
export const CONTACT_PHONE = "+1-956-951-1763";

export type TierKey = "express" | "completo" | "tienda";

export const pricingByMarket = {
  us: {
    currency: "USD",
    tiers: { express: "$300", completo: "$650", tienda: "$1,200" },
    care: "$39",
    extras: ["+$30", "+$10", "+$25", "+$20"],
  },
  mx: {
    currency: "MXN",
    tiers: { express: "$5,900", completo: "$12,900", tienda: "$23,900" },
    care: "$790",
    extras: ["+$590", "+$200", "+$490", "+$390"],
  },
} as const;

export const tierOrder: TierKey[] = ["express", "completo", "tienda"];

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

export const deckOrder: ProjectKey[] = ["excessive", "costa", "vsr", "ciao"];
export const workOrder: ProjectKey[] = ["costa", "vsr", "excessive", "ciao"];

export const whatsappHref = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
