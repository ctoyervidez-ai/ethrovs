import type { ProjectKey } from "./site";
import type { SiteCopy } from "./es";

const en: SiteCopy = {
  meta: {
    title: "ETHROVS — Website Design in Laredo, TX & Nuevo Laredo",
    description:
      "Bilingual web studio on the border. Professional websites for local businesses, delivered in 24 hours, from $300 USD or $5,900 MXN.",
    ogDescription: "Websites that move businesses. Bilingual studio · Laredo / Nuevo Laredo.",
  },
  nav: { work: "Work", services: "Services", process: "Process", pricing: "Pricing", faq: "FAQ", contact: "Start a project", contactShort: "Start" },
  suggest: { text: "Este sitio también está disponible en español.", cta: "Ver en español", dismiss: "Stay in English" },
  hero: {
    kicker: "Bilingual web studio · Laredo / Nuevo Laredo",
    line1: "Websites that",
    line2: "move businesses.",
    text: "Strategic design, fast development and smart technology for businesses ready to grow.",
    primary: "Build my site",
    secondary: "See our work",
    proof: ["Fastest delivery", "Sites live", "Bilingual", "From"],
    deckLabel: "Projects",
    deckView: "View",
  },
  work: {
    label: "Selected work · 2026",
    title: "Designed to look right. Built to work.",
    visit: "View live",
    descriptions: {
      costa: "A warm, direct experience for a seafood restaurant, tuned to turn visits into reservations.",
      vsr: "A limited-release editorial store joining fashion, music and an identity built under pressure.",
      beck: "A refined editorial experience that presents treatments, builds medical trust and reaches new patients.",
      excessive: "A bilingual experience for premium auto detailing, built to show results and turn visits into bookings.",
      ciao: "A warm, flavor-forward experience for an artisan pizzeria, designed to build appetite and turn visits into orders.",
    } as Record<ProjectKey, string>,
  },
  services: {
    title: "Everything you need to launch with force.",
    items: [
      { title: "Design", text: "Visual direction, structure and copy so your business feels trustworthy in the first second.", bullets: ["Identity and palette", "Hierarchy and copy", "Mobile-first layout"] },
      { title: "Development", text: "Fast sites that load well on any phone and are ready to grow with you.", bullets: ["Loads in seconds", "WhatsApp, map and call", "Your domain connected"] },
      { title: "Growth", text: "Basic SEO, analytics and automation so the site works even when you don't.", bullets: ["Google Business", "Visitor analytics", "Automated replies"] },
    ],
  },
  process: {
    title: "From idea to internet in three moves.",
    steps: [
      { title: "You send your content", text: "Your logo, photos, services and the essentials. If something is missing, we tell you exactly what we need and how to get it.", when: "Day 0 · 15 min" },
      { title: "We design and build", text: "We set a clear visual direction and build the whole page in a single production run, with no back-and-forth.", when: "Same day" },
      { title: "You review, we publish", text: "You get one round of changes, we connect your domain and hand over the live site, ready for customers.", when: "Under 24 h" },
    ],
  },
  pricing: {
    label: "Launch offer",
    from: "From",
    description: "A professional page of up to six sections, ready to present your business and start bringing in customers.",
    items: ["Custom design, not a template", "Optimized mobile version", "Call, map and WhatsApp buttons", "Basic SEO and domain setup", "One round of changes"],
    terms: "50% to start · 50% before we publish",
    cta: "Book my page",
    whatsappMessage: "Hi ETHROVS, I want to book my Express 24H website",
    extrasTitle: "Add-ons",
    extrasText: "Add them when you need them. Charged once and added to the total before we start.",
    extras: ["Extra rounds of changes", "Bilingual ES / EN version", "Google Business profile", "Additional page"],
  },
  faq: {
    title: "The questions we always get.",
    items: [
      ["Really in 24 hours?", "Yes, as long as we have all your content up front: logo, photos, services and copy. The clock starts when we receive everything, not when you pay. If something is missing, we tell you the same day."],
      ["I have no logo or photos. Can I still start?", "Yes. We can create a simple wordmark and generate custom imagery for your brand. Tell us when you write and we adjust the proposal before charging anything."],
      ["What happens after we publish?", "The site is yours: domain, content and access. We hand it over live and working. If you later want changes or new sections, we quote them separately, with no mandatory monthly fee."],
      ["Do you work on both sides of the border?", "Yes. We serve Laredo, Nuevo Laredo and the rest of Texas and Mexico. We charge in dollars or pesos, and your site can be in Spanish, English or both."],
      ["What if I don't like the design?", "You get one round of changes included and we use it to fix whatever needs fixing. Since you only pay half up front, you don't release the rest until the site convinces you."],
    ] as Array<[string, string]>,
  },
  testimonials: {
    title: "What the businesses that already launched say.",
    // TODO(daniel): replace with real client quotes (name + business) before enabling
    // the section in app/components/Home.tsx (SHOW_TESTIMONIALS).
    items: [
      { quote: "PENDING: real client quote.", name: "Name", role: "Costa Grill" },
      { quote: "PENDING: real client quote.", name: "Name", role: "BECK" },
      { quote: "PENDING: real client quote.", name: "Name", role: "Excessive Detailing" },
    ],
  },
  contact: {
    label: "Launch offer · Website Express 24 h",
    line1: "Let's make something people",
    line2: "remember.",
    text: "Tell us what you sell and what you need. We reply with a clear proposal, no endless calls and no hidden pricing.",
    whatsapp: "Talk on WhatsApp",
    whatsappMessage: "Hi ETHROVS, I want a website",
    email: "Send an email",
    emailSubject: "I want a website",
    note: "Same-day reply · 50% to start, 50% before we publish.",
  },
  footer: "Digital energy in motion",
};

export default en;
