import type { Metadata } from "next";
import { SITE_URL, type Language } from "./content/site";
import type { SiteCopy } from "./content/es";

export function buildMetadata(language: Language, copy: SiteCopy): Metadata {
  const path = language === "es" ? "/" : "/en";
  return {
    metadataBase: new URL(SITE_URL),
    title: copy.meta.title,
    description: copy.meta.description,
    alternates: {
      canonical: path,
      languages: { es: "/", en: "/en", "x-default": "/" },
    },
    icons: {
      icon: [{ url: "/assets/ethrovs-favicon.png", sizes: "1024x1024", type: "image/png" }],
      shortcut: "/assets/ethrovs-favicon.png",
      apple: [{ url: "/apple-touch-icon.png", sizes: "1024x1024", type: "image/png" }],
    },
    openGraph: {
      title: copy.meta.title,
      description: copy.meta.ogDescription,
      type: "website",
      url: path,
      locale: language === "es" ? "es_MX" : "en_US",
      alternateLocale: language === "es" ? "en_US" : "es_MX",
      siteName: "ETHROVS",
      images: [{ url: "/og.jpg", width: 1536, height: 1024, alt: "ETHROVS" }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.meta.title,
      description: copy.meta.ogDescription,
      images: ["/og.jpg"],
    },
  };
}
