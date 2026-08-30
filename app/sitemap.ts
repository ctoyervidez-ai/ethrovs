import type { MetadataRoute } from "next";
import { SITE_URL } from "./content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = { es: `${SITE_URL}/`, en: `${SITE_URL}/en`, "x-default": `${SITE_URL}/` };
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: `${SITE_URL}/en`, changeFrequency: "monthly", priority: 0.9, alternates: { languages } },
  ];
}
