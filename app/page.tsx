"use client";

import { useEffect, useMemo, useState } from "react";

type Language = "es" | "en";
type Market = "us" | "mx";
type ProjectKey = "costa" | "vsr" | "beck" | "excessive" | "ciao";

const pricingByMarket = {
  us: { price: "$200", currency: "USD", extras: ["+$20", "+$30", "+$35", "+$25"] },
  mx: { price: "$3,900", currency: "MXN", extras: ["+$390", "+$590", "+$690", "+$490"] },
} as const;

const projects = {
  costa: { name: "Costa Grill", href: "https://costagrillmx.com/", image: "var(--shot-costa)", alt: "Portada del sitio de Costa Grill", category: { es: "Restaurante · Nuevo Laredo", en: "Restaurant · Nuevo Laredo" } },
  vsr: { name: "VSR 444", href: "https://vsr444.com/", image: "var(--shot-vsr)", alt: "Portada del sitio de VSR 444", category: { es: "Edición limitada · H-Town", en: "Limited release · H-Town" } },
  beck: { name: "BECK", href: "https://beckcentrodebelleza.com/", image: "var(--shot-beck)", alt: "Portada del sitio de BECK", category: { es: "Medicina estética · Nuevo Laredo", en: "Aesthetic medicine · Nuevo Laredo" } },
  excessive: { name: "Excessive Detailing", href: "https://excessivedetailing.com/", image: "var(--shot-exc)", alt: "Portada del sitio de Excessive Detailing", category: { es: "Detallado móvil · DFW", en: "Mobile detailing · DFW" } },
  ciao: { name: "Ciao Kitchen", href: "https://ciaokitchenmx.com/", image: "var(--shot-ciao)", alt: "Portada del sitio de Ciao Kitchen", category: { es: "Pizza artesanal · Nuevo Laredo", en: "Artisan pizza · Nuevo Laredo" } },
} as const;

const copy = {
  es: {
    nav: { work: "Trabajo", services: "Servicios", process: "Proceso", pricing: "Precio", faq: "Dudas", contact: "Iniciar proyecto" },
    hero: { kicker: "Estudio web bilingüe · Laredo / Nuevo Laredo", line1: "Páginas web que", line2: "mueven negocios.", text: "Diseño estratégico, desarrollo rápido y tecnología inteligente para negocios que están listos para crecer.", primary: "Crear mi página", secondary: "Ver nuestro trabajo", proof: ["Entrega mínima", "Sitios en vivo", "Bilingüe", "Desde"] },
    work: {
      label: "Trabajo seleccionado · 2026", title: "Diseñado para verse bien. Construido para funcionar.", visit: "Ver en vivo",
      descriptions: {
        costa: "Una experiencia cálida y directa para un restaurante de mariscos, optimizada para convertir visitas en reservaciones.",
        vsr: "Una tienda editorial de edición limitada que une moda, música y una identidad visual construida desde la presión.",
        beck: "Una experiencia editorial y refinada para presentar tratamientos, dar confianza médica y conectar con nuevos pacientes.",
        excessive: "Una experiencia bilingüe para detallado automotriz premium, diseñada para mostrar resultados y convertir visitas en citas.",
        ciao: "Una experiencia cálida y llena de sabor para una pizzería artesanal, diseñada para abrir el apetito y convertir visitas en pedidos.",
      },
    },
    services: {
      label: "Lo que hacemos", title: "Todo lo necesario para lanzar con fuerza.",
      items: [
        { title: "Diseño", text: "Dirección visual, estructura y textos para que tu negocio se sienta confiable en el primer segundo.", bullets: ["Identidad y paleta", "Jerarquía y textos", "Diseño móvil primero"] },
        { title: "Desarrollo", text: "Sitios rápidos que cargan bien en cualquier teléfono y quedan listos para crecer contigo.", bullets: ["Carga en segundos", "WhatsApp, mapa y llamada", "Tu dominio conectado"] },
        { title: "Crecimiento", text: "SEO básico, analítica y automatizaciones para que la página trabaje también cuando tú no estás.", bullets: ["Google Business", "Analítica de visitas", "Respuestas automáticas"] },
      ],
    },
    process: {
      label: "Proceso express", title: "De idea a internet en tres movimientos.",
      steps: [
        { title: "Nos mandas tu contenido", text: "Tu logo, fotos, servicios y lo esencial del negocio. Si algo te falta, te decimos exactamente qué necesitamos y cómo conseguirlo.", when: "Día 0 · 15 min" },
        { title: "Diseñamos y construimos", text: "Definimos una dirección visual clara y desarrollamos la página completa en una sola producción, sin pasarnos la pelota.", when: "Mismo día" },
        { title: "Revisas y publicamos", text: "Haces una ronda de cambios, conectamos tu dominio y te entregamos el sitio en vivo, listo para recibir clientes.", when: "Antes de 24 h" },
      ],
    },
    pricing: { label: "Oferta de lanzamiento", from: "Desde", description: "Una página profesional de hasta seis secciones, lista para presentar tu negocio y empezar a recibir clientes.", items: ["Diseño personalizado, no plantilla", "Versión móvil optimizada", "Botones de llamada, mapa y WhatsApp", "SEO básico y conexión de dominio", "Una ronda de cambios"], terms: "50% para comenzar · 50% antes de publicar", cta: "Reservar mi página", extrasTitle: "Extras", extrasText: "Agrégalos cuando los necesites. Se cobran una sola vez y se suman al total antes de empezar.", extras: ["Cambios generales adicionales", "Versión bilingüe ES / EN", "Perfil de Google Business", "Página adicional"] },
    faq: {
      label: "Antes de escribirnos", title: "Las dudas que siempre nos hacen.",
      items: [
        ["¿De verdad en 24 horas?", "Sí, siempre que tengamos tu contenido completo desde el inicio: logo, fotos, servicios y textos. El reloj empieza cuando recibimos todo, no cuando pagas. Si falta material, te avisamos el mismo día."],
        ["No tengo logo ni fotos. ¿Puedo empezar?", "Sí. Podemos crear un logotipo sencillo y generar imágenes a la medida de tu marca. Nos lo dices al escribir y lo ajustamos en la propuesta antes de cobrarte nada."],
        ["¿Qué pasa después de publicar?", "El sitio es tuyo: dominio, contenido y acceso. Te dejamos publicado y funcionando. Si más adelante quieres cambios o secciones nuevas, se cotizan aparte, sin mensualidad obligatoria."],
        ["¿Trabajan de los dos lados de la frontera?", "Sí. Atendemos Laredo, Nuevo Laredo y el resto de Texas y México. Cobramos en dólares o en pesos, y el sitio puede quedar en español, en inglés o en los dos idiomas."],
        ["¿Y si no me gusta el diseño?", "Tienes una ronda de cambios incluida y la usamos para afinar lo que haga falta. Como solo pagas la mitad al inicio, no liberas el resto hasta que el sitio te convenza."],
      ],
    },
    contact: { label: "Oferta de lanzamiento · Website Express 24 h", line1: "Hagamos algo que la gente", line2: "recuerde.", text: "Cuéntanos qué vendes y qué necesitas. Te respondemos con una propuesta clara, sin llamadas eternas ni precios escondidos.", whatsapp: "Hablar por WhatsApp", email: "Enviar un correo", note: "Respuesta el mismo día · 50% para comenzar, 50% antes de publicar." },
    footer: "Energía digital en movimiento",
  },
  en: {
    nav: { work: "Work", services: "Services", process: "Process", pricing: "Pricing", faq: "FAQ", contact: "Start a project" },
    hero: { kicker: "Bilingual web studio · Laredo / Nuevo Laredo", line1: "Websites that", line2: "move businesses.", text: "Strategic design, fast development and smart technology for businesses ready to grow.", primary: "Build my site", secondary: "See our work", proof: ["Fastest delivery", "Sites live", "Bilingual", "From"] },
    work: {
      label: "Selected work · 2026", title: "Designed to look right. Built to work.", visit: "View live",
      descriptions: {
        costa: "A warm, direct experience for a seafood restaurant, tuned to turn visits into reservations.",
        vsr: "A limited-release editorial store joining fashion, music and an identity built under pressure.",
        beck: "A refined editorial experience that presents treatments, builds medical trust and reaches new patients.",
        excessive: "A bilingual experience for premium auto detailing, built to show results and turn visits into bookings.",
        ciao: "A warm, flavor-forward experience for an artisan pizzeria, designed to build appetite and turn visits into orders.",
      },
    },
    services: {
      label: "What we do", title: "Everything you need to launch with force.",
      items: [
        { title: "Design", text: "Visual direction, structure and copy so your business feels trustworthy in the first second.", bullets: ["Identity and palette", "Hierarchy and copy", "Mobile-first layout"] },
        { title: "Development", text: "Fast sites that load well on any phone and are ready to grow with you.", bullets: ["Loads in seconds", "WhatsApp, map and call", "Your domain connected"] },
        { title: "Growth", text: "Basic SEO, analytics and automation so the site works even when you don't.", bullets: ["Google Business", "Visitor analytics", "Automated replies"] },
      ],
    },
    process: {
      label: "Express process", title: "From idea to internet in three moves.",
      steps: [
        { title: "You send your content", text: "Your logo, photos, services and the essentials. If something is missing, we tell you exactly what we need and how to get it.", when: "Day 0 · 15 min" },
        { title: "We design and build", text: "We set a clear visual direction and build the whole page in a single production run, with no back-and-forth.", when: "Same day" },
        { title: "You review, we publish", text: "You get one round of changes, we connect your domain and hand over the live site, ready for customers.", when: "Under 24 h" },
      ],
    },
    pricing: { label: "Launch offer", from: "From", description: "A professional page of up to six sections, ready to present your business and start bringing in customers.", items: ["Custom design, not a template", "Optimized mobile version", "Call, map and WhatsApp buttons", "Basic SEO and domain setup", "One round of changes"], terms: "50% to start · 50% before we publish", cta: "Book my page", extrasTitle: "Add-ons", extrasText: "Add them when you need them. Charged once and added to the total before we start.", extras: ["Extra rounds of changes", "Bilingual ES / EN version", "Google Business profile", "Additional page"] },
    faq: {
      label: "Before you write", title: "The questions we always get.",
      items: [
        ["Really in 24 hours?", "Yes, as long as we have all your content up front: logo, photos, services and copy. The clock starts when we receive everything, not when you pay. If something is missing, we tell you the same day."],
        ["I have no logo or photos. Can I still start?", "Yes. We can create a simple wordmark and generate custom imagery for your brand. Tell us when you write and we adjust the proposal before charging anything."],
        ["What happens after we publish?", "The site is yours: domain, content and access. We hand it over live and working. If you later want changes or new sections, we quote them separately—no mandatory monthly fee."],
        ["Do you work on both sides of the border?", "Yes. We serve Laredo, Nuevo Laredo and the rest of Texas and Mexico. We charge in dollars or pesos, and your site can be in Spanish, English or both."],
        ["What if I don't like the design?", "You get one round of changes included and we use it to fix whatever needs fixing. Since you only pay half up front, you don't release the rest until the site convinces you."],
      ],
    },
    contact: { label: "Launch offer · Website Express 24 h", line1: "Let's make something people", line2: "remember.", text: "Tell us what you sell and what you need. We reply with a clear proposal, no endless calls and no hidden pricing.", whatsapp: "Talk on WhatsApp", email: "Send an email", note: "Same-day reply · 50% to start, 50% before we publish." },
    footer: "Digital energy in motion",
  },
} as const;

const deckOrder: ProjectKey[] = ["beck", "excessive", "costa", "vsr", "ciao"];
const workOrder: ProjectKey[] = ["costa", "vsr", "beck", "excessive", "ciao"];

export default function Home() {
  const [language, setLanguage] = useState<Language>("es");
  const [market, setMarket] = useState<Market>("us");
  const [activeProject, setActiveProject] = useState(0);
  const [deckPaused, setDeckPaused] = useState(false);
  const c = copy[language];
  const pricing = pricingByMarket[market];
  const currentDeckProject = projects[deckOrder[activeProject]];

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("ethrovs-language");
    const savedMarket = window.localStorage.getItem("ethrovs-market");
    const languageWasChosen = window.localStorage.getItem("ethrovs-language-manual") === "1";
    const fallbackLanguage: Language = window.navigator.language.toLowerCase().startsWith("en") ? "en" : "es";

    if (languageWasChosen && (savedLanguage === "es" || savedLanguage === "en")) {
      setLanguage(savedLanguage);
    } else {
      setLanguage(fallbackLanguage);
      const controller = new AbortController();
      fetch("/api/locale", { cache: "no-store", signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject(new Error("Locale unavailable")))
        .then((data: { language?: Language }) => {
          if (data.language === "es" || data.language === "en") setLanguage(data.language);
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") return;
          setLanguage(fallbackLanguage);
        });

      if (savedMarket === "us" || savedMarket === "mx") setMarket(savedMarket);
      return () => controller.abort();
    }
    if (savedMarket === "us" || savedMarket === "mx") setMarket(savedMarket);
  }, []);

  useEffect(() => { document.documentElement.lang = language; window.localStorage.setItem("ethrovs-language", language); }, [language]);
  useEffect(() => { window.localStorage.setItem("ethrovs-market", market); }, [market]);
  useEffect(() => {
    if (deckPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActiveProject((value) => (value + 1) % deckOrder.length), 4200);
    return () => window.clearInterval(timer);
  }, [deckPaused]);

  const deckPositions = useMemo(() => deckOrder.map((_, index) => (index - activeProject + deckOrder.length) % deckOrder.length), [activeProject]);

  function chooseLanguage(nextLanguage: Language) {
    window.localStorage.setItem("ethrovs-language-manual", "1");
    setLanguage(nextLanguage);
  }

  return <>
    <nav className="nav" aria-label="Main navigation"><div className="wrap nav-in">
      <a className="mark" href="#top" aria-label="ETHROVS home"><span className="mark-symbol" aria-hidden="true" />ETHROVS</a>
      <div className="nav-links"><a href="#trabajo">{c.nav.work}</a><a href="#servicios">{c.nav.services}</a><a href="#proceso">{c.nav.process}</a><a href="#precio">{c.nav.pricing}</a><a href="#dudas">{c.nav.faq}</a></div>
      <div className="lang" role="group" aria-label="Language">{(["es", "en"] as const).map((option) => <button key={option} type="button" aria-pressed={language === option} onClick={() => chooseLanguage(option)}>{option.toUpperCase()}</button>)}</div>
      <a className="btn btn-solid btn-sm nav-cta" href="#contacto">{c.nav.contact} <span className="arw">↗</span></a>
    </div></nav>

    <header className="hero" id="top"><div className="grid-rules" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index} />)}</div><div className="wrap hero-in">
      <div><div className="eyebrow"><span className="dash" /><p className="label">{c.hero.kicker}</p></div><h1>{c.hero.line1}<span className="serif">{c.hero.line2}</span></h1><p className="lead">{c.hero.text}</p><div className="hero-cta"><a className="btn btn-solid" href="#contacto">{c.hero.primary} <span className="arw">↗</span></a><a className="btn btn-ghost" href="#trabajo">{c.hero.secondary} <span>↓</span></a></div><div className="proof"><div><b>24 h</b><p className="label">{c.hero.proof[0]}</p></div><div><b>5</b><p className="label">{c.hero.proof[1]}</p></div><div><b>ES · EN</b><p className="label">{c.hero.proof[2]}</p></div><div><b>{pricing.price}</b><p className="label">{c.hero.proof[3]}, {pricing.currency}</p></div></div></div>
      <div className="deck-col" onPointerEnter={() => setDeckPaused(true)} onPointerLeave={() => setDeckPaused(false)}><div className="deck">{deckOrder.map((key, index) => <figure key={key} data-pos={deckPositions[index]} style={{ backgroundImage: projects[key].image }} role="img" aria-label={projects[key].alt} />)}</div><div className="deck-meta"><div><p className="label">{currentDeckProject.category[language]}</p><p className="deck-name">{currentDeckProject.name}</p></div><div className="deck-dots" role="tablist" aria-label="Proyectos">{deckOrder.map((key, index) => <button key={key} type="button" aria-label={`${language === "es" ? "Ver" : "View"} ${projects[key].name}`} aria-current={activeProject === index} onClick={() => setActiveProject(index)} />)}</div></div></div>
    </div></header>

    <main>
      <section className="sec wrap" id="trabajo"><div className="sec-head"><h2>{c.work.title}</h2><p className="label">{c.work.label}</p></div><div className="work-grid">{workOrder.map((key, index) => { const project = projects[key]; return <a className={`case rv${key === "ciao" ? " case--wide" : ""}`} href={project.href} target="_blank" rel="noreferrer" key={key}><div className="case-shot"><div className="img" style={{ backgroundImage: project.image }} role="img" aria-label={project.alt} /><span className="go" aria-hidden="true">↗</span></div><div className="case-bar"><span className="idx">{String(index + 1).padStart(2, "0")}</span><p className="label">{project.category[language]}</p></div><h3>{project.name}</h3><p>{c.work.descriptions[key]}</p><span className="live">{c.work.visit} <span className="arw">↗</span></span></a>; })}</div></section>

      <section className="sec wrap" id="servicios"><div className="sec-head"><h2>{c.services.title}</h2><p className="label">{c.services.label}</p></div><div className="svc rv">{c.services.items.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></article>)}</div></section>

      <section className="sec wrap" id="proceso"><div className="sec-head"><h2>{c.process.title}</h2><p className="label">{c.process.label}</p></div><div className="steps">{c.process.steps.map((step, index) => <div className="step rv" key={step.title}><span className="step-n">{index + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div><p className="label when">{step.when}</p></div>)}</div></section>

      <section className="sec wrap" id="precio"><div className="sec-head"><h2>Website Express <span className="serif">24 h.</span></h2><p className="label">{c.pricing.label}</p></div><div className="price-grid"><div className="card rv"><div className="cur" role="group" aria-label="Currency"><button type="button" aria-pressed={market === "us"} onClick={() => setMarket("us")}>USA · USD</button><button type="button" aria-pressed={market === "mx"} onClick={() => setMarket("mx")}>México · MXN</button></div><div className="amount"><span className="from">{c.pricing.from}</span><span className="fig">{pricing.price}</span><span className="cc">{pricing.currency}</span></div><p className="price-description">{c.pricing.description}</p><ul className="incl">{c.pricing.items.map((item) => <li key={item}><span className="ck" aria-hidden="true">✓</span><span>{item}</span></li>)}</ul><p className="terms">{c.pricing.terms}</p><a className="btn btn-acid btn-wide" href="https://wa.me/19562513072?text=Hola%20ETHROVS%2C%20quiero%20reservar%20mi%20p%C3%A1gina%20Express%2024H" target="_blank" rel="noreferrer">{c.pricing.cta} <span className="arw">↗</span></a></div><div className="card extras rv"><h3>{c.pricing.extrasTitle}</h3><p>{c.pricing.extrasText}</p><dl>{c.pricing.extras.map((extra, index) => <div className="ext-row" key={extra}><dt>{extra}</dt><dd>{pricing.extras[index]}</dd></div>)}</dl></div></div></section>

      <section className="sec wrap" id="dudas"><div className="sec-head"><h2>{c.faq.title}</h2><p className="label">{c.faq.label}</p></div><div className="faq rv">{c.faq.items.map(([question, answer]) => <details key={question}><summary>{question}</summary><p className="ans">{answer}</p></details>)}</div></section>

      <section className="sec wrap" id="contacto"><div className="cta rv"><div className="cta-in"><div><p className="label">{c.contact.label}</p><h2>{c.contact.line1} <span className="serif">{c.contact.line2}</span></h2><p>{c.contact.text}</p></div><div className="cta-actions"><a className="btn btn-acid btn-wide" href="https://wa.me/19562513072?text=Hola%20ETHROVS%2C%20quiero%20una%20p%C3%A1gina%20web" target="_blank" rel="noreferrer">{c.contact.whatsapp} <span className="arw">↗</span></a><a className="btn btn-line btn-wide" href="mailto:ethernaldevops@gmail.com?subject=Quiero%20una%20p%C3%A1gina%20web">{c.contact.email} <span className="arw">↗</span></a><p className="cta-note">{c.contact.note}</p></div></div></div></section>
    </main>

    <footer className="wrap"><div className="foot-in"><p className="label">© 2026 ETHROVS · Laredo, TX · Nuevo Laredo, MX</p><p className="label">{c.footer}</p></div></footer>
  </>;
}
