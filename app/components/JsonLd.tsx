import { CONTACT_EMAIL, CONTACT_PHONE, SITE_URL, type Language } from "../content/site";
import type { SiteCopy } from "../content/es";

export default function JsonLd({ language, description }: { language: Language; description: SiteCopy["meta"]["description"] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#ethrovs`,
    name: "ETHROVS",
    url: language === "es" ? `${SITE_URL}/` : `${SITE_URL}/en`,
    description,
    image: `${SITE_URL}/og.jpg`,
    logo: `${SITE_URL}/assets/ethrovs-favicon.png`,
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    priceRange: "$300+",
    currenciesAccepted: "USD, MXN",
    areaServed: [
      { "@type": "City", name: "Laredo", address: { "@type": "PostalAddress", addressRegion: "TX", addressCountry: "US" } },
      { "@type": "City", name: "Nuevo Laredo", address: { "@type": "PostalAddress", addressRegion: "Tamaulipas", addressCountry: "MX" } },
      { "@type": "State", name: "Texas" },
      { "@type": "Country", name: "México" },
    ],
    knowsLanguage: ["es", "en"],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
