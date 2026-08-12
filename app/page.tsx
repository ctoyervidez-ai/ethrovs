"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Language = "en" | "es";

const copy = {
  en: {
    nav: { home: "Home", services: "Services", portfolio: "Portfolio", contact: "Contact Us", menu: "Toggle navigation", aria: "Main navigation" },
    hero: {
      eyebrow: "Modern Web Solutions for Ambitious Brands",
      subtitle: "Custom websites, SEO, software & design – tailored to your business.",
      primary: "Get Started Now",
      pricing: "Plans & Pricing",
      tech: "Technologies we work with",
    },
    features: {
      aria: "Core capabilities",
      webTitle: "💻 Web Development",
      webCopy: "We build fast, secure, and mobile-friendly websites tailored to your goals. Whether it's a landing page, eCommerce, or custom solution — we make it happen.",
      webTags: ["✅ Responsive & optimized for SEO  🌟", "✅ Custom CMS or WordPress  🌐", "✅ Secure hosting & performance tuning  🌟"],
      insightsTitle: "Enterprise Insights",
      insightsCopy: "Get real-time insights into customer behavior, market trends, and digital performance with powerful dashboards and data tracking tools.",
      insightTags: ["🟠 🔍 Sentiment analysis  🌟", "📈 User interaction metrics  🌐"],
      industries: ["Web Business", "E-commerce Brands", "SaaS Startups", "Tech Innovators", "Marketing Agencies", "Creative Studios"],
    },
    portfolio: {
      title: "PORTFOLIO",
      line1: "Modern Web Solutions for Ambitious Brands",
      line2: "Custom websites, SEO, software & design – tailored to your business.",
      aria: "View Costa Grill project",
      alt: "Costa Grill website project",
      caption: "Costa Grill · Website & local brand experience",
    },
    data: {
      businessTitle: "Business Data Solutions",
      businessCopy: "Make data-driven decisions using our analytics solutions designed to uncover growth opportunities and reduce business risks.",
      growth: "See Growth",
      visits: "Monthly Visits",
      lastDay: "Last 24hrs",
      score: "100% score anytime",
      stats: "Watch stats and growth like a pro",
      start: "Start Growing Now",
      salesTitle: "Boost Sales",
      salesCopy: "Drive more revenue with sales automation, targeted marketing, and conversion optimization strategies tailored to your niche.",
      salesMetrics: ["Retention", "Top Referrals", "Conversion", "Grow Income"],
    },
    benefits: {
      label: "BENEFITS",
      title: "Why Choose Us?",
      subtitle: "From web development to creative branding, we build your digital presence from the ground up.",
      services: [
        { icon: "⌖", title: "Web Development", text: "Custom-built websites that are responsive, lightning-fast, and fully optimized — built to convert and scale with your business." },
        { icon: "✣", title: "SEO Optimization", text: "Get found online. Our SEO strategies increase your visibility, grow your traffic, and position your brand exactly where it matters most." },
        { icon: "◉", title: "Graphic Design", text: "Stand out with custom logos, brand identity, and visuals designed to communicate your vision with clarity, consistency, and creativity." },
      ],
      marquee1: ["Web Development", "Flexible Payments", "Smart Spending", "Customizable Plans", "Smart Insights"],
      marquee2: ["Automatic Adjustments", "Real-Time Reports", "Secure Transactions", "Dedicated Support", "Growth With AI"],
    },
    pricing: {
      label: "24-HOUR WEBSITE",
      title: "Your Professional Website, Live in 24 Hours",
      subtitle: "A clear, professional online presence for local businesses — without long waits or agency prices.",
      plan: "Website Express 24H",
      promo: "Launch Offer",
      price: "$149 USD",
      mxPrice: "or $2,900 MXN",
      regular: "Regular price: $199 USD / $3,900 MXN",
      payment: "50% to start · 50% before launch",
      cta: "Reserve My Website",
      includes: "Includes:",
      items: [
        "One professional scrolling website with up to 6 sections",
        "Mobile responsive design",
        "Call, WhatsApp, map and contact buttons",
        "Domain connection and basic SEO",
        "One revision round",
        "Delivery within 24 hours after payment and content are received",
      ],
      addonsTitle: "Simple Add-ons",
      addonsSubtitle: "Choose only what your business needs.",
      addons: [
        ["Bilingual version", "+$75"],
        ["Google Business setup", "+$99"],
        ["Additional page", "+$50"],
        ["Monthly care", "$29/mo"],
      ],
      addonNote: "Online stores, booking systems and custom software are quoted separately.",
    },
    founder: {
      label: "FOUNDERS NOTE",
      quoteStart: "“ We don't just build websites.",
      quoteAccent: "We decode what your audience wants.",
      quoteMiddle: "We analyze your site's data, understand your ideal customer, and help your brand stand out.",
      quoteEnd: "The best part? We turn insights into real, actionable solutions.”",
      byline: "Co-founder & Lead Engineer at Ethernal DevOps",
    },
    comparison: {
      label: "COMPARISON",
      title: "Why Ethernal DevOps Stands Out",
      subtitle: "See how we outperform typical web service providers in speed, scale, and innovation.",
      others: "Others",
      good: ["🌍 Seamless local and global collaboration", "🚀 Fast, flexible, and custom-built solutions", "📊 Powerful dashboard control", "📈 Integrated data analytics and reporting", "🧠 Intuitive, user-first interface design"],
      bad: ["Limited collaboration", "Rigid and non-scalable options", "Basic dashboard functionality", "Lack of useful analytics", "Outdated and complex interfaces"],
    },
    ai: {
      label: "AI-DRIVEN EFFICIENCY",
      title: "Never Miss an Opportunity",
      subtitle: "Capture leads, analyze trends, and centralize powerful insights to grow smarter.",
      services: [
        { icon: "↻", title: "Effortless Integration", text: "Your data is synced in real-time across devices, ensuring you stay connected and informed—online or offline." },
        { icon: "⬡", title: "Secure & Scalable", text: "Enterprise-grade encryption protects your information, while flexible tools adapt to your business needs." },
        { icon: "✣", title: "Actionable Insights", text: "Leverage AI-powered analytics to identify trends, predict outcomes, and optimize your workflow effortlessly." },
      ],
      strip: ["Smart Analytics", "Real-Time Collaboration", "Task Prioritization"],
    },
    cta: {
      label: "READY TO GROW?",
      title: "Grow Now with Ethernal Dev0ps",
      subtitle: "Launch a polished website quickly and give your customers a better way to find, trust and contact you.",
      pricing: "See Pricing",
      meeting: "Book a Meeting",
      imageAlt: "Ethernal DevOps website interface",
    },
    contact: {
      label: "LET'S WORK TOGETHER",
      title: "Start Your Website Today",
      pricing: "See Express Offer",
      support: "Direct Support:",
      supportText: "Connect with our team anytime.",
      schedule: "Fast Delivery:",
      scheduleText: "Your Website Express project starts as soon as we receive your content and deposit.",
      reach: "Reach Out to Us",
      emailCopy: "Have questions? We're here to help.",
      phoneCopy: "Need assistance? Call us—we're at your service.",
      fields: { name: "Name", fullName: "Full Name", email: "Email", yourEmail: "Your Email", subject: "Subject of Interest", product: "Website Express 24H", message: "Message", messagePlaceholder: "Tell us about your business...", submit: "Submit" },
      success: "Thank you — we'll reach out shortly.",
    },
    footer: { aria: "Footer navigation", home: "Home", services: "Services", contact: "Contact", pricing: "Pricing", meeting: "Book a meeting", copyright: "© 2026 Ethernal DevOps — Custom web solutions built for growth." },
  },
  es: {
    nav: { home: "Inicio", services: "Servicios", portfolio: "Portafolio", contact: "Contáctanos", menu: "Abrir navegación", aria: "Navegación principal" },
    hero: {
      eyebrow: "Soluciones Web Modernas para Marcas Ambiciosas",
      subtitle: "Páginas web, SEO, software y diseño adaptados a tu negocio.",
      primary: "Comenzar Ahora",
      pricing: "Planes y Precios",
      tech: "Tecnologías que utilizamos",
    },
    features: {
      aria: "Capacidades principales",
      webTitle: "💻 Desarrollo Web",
      webCopy: "Creamos páginas rápidas, seguras y adaptadas a celulares. Desde una landing page hasta comercio electrónico o una solución personalizada.",
      webTags: ["✅ Responsive y optimizada para SEO  🌟", "✅ CMS personalizado o WordPress  🌐", "✅ Hosting seguro y alto rendimiento  🌟"],
      insightsTitle: "Información para tu Negocio",
      insightsCopy: "Obtén información clara sobre tus clientes, tendencias y desempeño digital con paneles y herramientas de seguimiento.",
      insightTags: ["🟠 🔍 Análisis de opiniones  🌟", "📈 Métricas de interacción  🌐"],
      industries: ["Negocios Locales", "Comercio Electrónico", "Startups SaaS", "Empresas de Tecnología", "Agencias de Marketing", "Estudios Creativos"],
    },
    portfolio: {
      title: "PORTAFOLIO",
      line1: "Soluciones Web Modernas para Marcas Ambiciosas",
      line2: "Páginas web, SEO, software y diseño adaptados a tu negocio.",
      aria: "Ver proyecto Costa Grill",
      alt: "Proyecto web de Costa Grill",
      caption: "Costa Grill · Página web y experiencia de marca local",
    },
    data: {
      businessTitle: "Soluciones de Datos para Negocios",
      businessCopy: "Toma mejores decisiones con análisis diseñados para descubrir oportunidades de crecimiento y reducir riesgos.",
      growth: "Ver Crecimiento",
      visits: "Visitas Mensuales",
      lastDay: "Últimas 24 horas",
      score: "Puntuación de 100%",
      stats: "Observa tus estadísticas y crecimiento",
      start: "Comienza a Crecer",
      salesTitle: "Aumenta tus Ventas",
      salesCopy: "Genera más ingresos con automatización, marketing dirigido y estrategias de conversión adaptadas a tu negocio.",
      salesMetrics: ["Retención", "Referencias", "Conversión", "Más Ingresos"],
    },
    benefits: {
      label: "BENEFICIOS",
      title: "¿Por Qué Elegirnos?",
      subtitle: "Desde desarrollo web hasta branding creativo, construimos tu presencia digital desde cero.",
      services: [
        { icon: "⌖", title: "Desarrollo Web", text: "Páginas personalizadas, rápidas, adaptables y optimizadas para convertir visitantes en clientes y crecer con tu negocio." },
        { icon: "✣", title: "Optimización SEO", text: "Haz que encuentren tu negocio. Nuestras estrategias mejoran tu visibilidad y posicionan tu marca donde importa." },
        { icon: "◉", title: "Diseño Gráfico", text: "Destaca con logotipos, identidad de marca y elementos visuales que comuniquen tu visión con claridad y creatividad." },
      ],
      marquee1: ["Desarrollo Web", "Pagos Flexibles", "Inversión Inteligente", "Planes Personalizables", "Datos Inteligentes"],
      marquee2: ["Ajustes Automáticos", "Reportes en Tiempo Real", "Transacciones Seguras", "Soporte Dedicado", "Crecimiento con IA"],
    },
    pricing: {
      label: "PÁGINA EN 24 HORAS",
      title: "Tu Página Profesional Lista en 24 Horas",
      subtitle: "Una presencia digital clara y profesional para negocios locales, sin largas esperas ni precios de agencia.",
      plan: "Website Express 24H",
      promo: "Oferta de Lanzamiento",
      price: "$149 USD",
      mxPrice: "o $2,900 MXN",
      regular: "Precio regular: $199 USD / $3,900 MXN",
      payment: "50% para comenzar · 50% antes de publicar",
      cta: "Reservar Mi Página",
      includes: "Incluye:",
      items: [
        "Una página profesional de hasta 6 secciones",
        "Diseño adaptable a celulares",
        "Botones de llamada, WhatsApp, mapa y contacto",
        "Conexión de dominio y SEO básico",
        "Una ronda de cambios",
        "Entrega en 24 horas después de recibir pago y contenido",
      ],
      addonsTitle: "Extras Sencillos",
      addonsSubtitle: "Elige solamente lo que necesita tu negocio.",
      addons: [
        ["Versión bilingüe", "+$75"],
        ["Google Business", "+$99"],
        ["Página adicional", "+$50"],
        ["Mantenimiento", "$29/mes"],
      ],
      addonNote: "Tiendas online, sistemas de reservación y software personalizado se cotizan por separado.",
    },
    founder: {
      label: "NOTA DEL FUNDADOR",
      quoteStart: "“ No solamente creamos páginas web.",
      quoteAccent: "Descubrimos lo que quiere tu audiencia.",
      quoteMiddle: "Analizamos los datos de tu página, entendemos a tu cliente ideal y ayudamos a que tu marca destaque.",
      quoteEnd: "¿Lo mejor? Convertimos la información en soluciones reales y prácticas.”",
      byline: "Cofundador e Ingeniero Principal de Ethernal DevOps",
    },
    comparison: {
      label: "COMPARACIÓN",
      title: "Por Qué Ethernal DevOps Destaca",
      subtitle: "Descubre cómo superamos a los proveedores tradicionales en velocidad, flexibilidad e innovación.",
      others: "Otros",
      good: ["🌍 Colaboración local y global", "🚀 Soluciones rápidas, flexibles y personalizadas", "📊 Control claro de tus resultados", "📈 Análisis de datos integrado", "🧠 Diseño intuitivo pensado para el usuario"],
      bad: ["Colaboración limitada", "Opciones rígidas y difíciles de ampliar", "Funciones básicas", "Falta de datos útiles", "Interfaces anticuadas y complicadas"],
    },
    ai: {
      label: "EFICIENCIA IMPULSADA POR IA",
      title: "Nunca Pierdas una Oportunidad",
      subtitle: "Captura prospectos, analiza tendencias y reúne información útil para crecer mejor.",
      services: [
        { icon: "↻", title: "Integración Sencilla", text: "Tus datos se sincronizan en tiempo real para que siempre estés conectado e informado desde cualquier dispositivo." },
        { icon: "⬡", title: "Seguro y Escalable", text: "Protegemos tu información mientras nuestras herramientas flexibles se adaptan al crecimiento de tu negocio." },
        { icon: "✣", title: "Información Accionable", text: "Usa análisis con IA para identificar tendencias, anticipar resultados y mejorar tu operación con facilidad." },
      ],
      strip: ["Análisis Inteligente", "Colaboración en Tiempo Real", "Prioridad de Tareas"],
    },
    cta: {
      label: "¿LISTO PARA CRECER?",
      title: "Crece Ahora con Ethernal Dev0ps",
      subtitle: "Lanza una página profesional rápidamente y ofrece a tus clientes una mejor forma de encontrarte, confiar y contactarte.",
      pricing: "Ver Precios",
      meeting: "Agendar una Reunión",
      imageAlt: "Interfaz web de Ethernal DevOps",
    },
    contact: {
      label: "TRABAJEMOS JUNTOS",
      title: "Comienza tu Página Hoy",
      pricing: "Ver Oferta Express",
      support: "Soporte Directo:",
      supportText: "Comunícate con nuestro equipo cuando lo necesites.",
      schedule: "Entrega Rápida:",
      scheduleText: "Tu proyecto Website Express comienza al recibir tu contenido y anticipo.",
      reach: "Contáctanos",
      emailCopy: "¿Tienes preguntas? Estamos para ayudarte.",
      phoneCopy: "¿Necesitas ayuda? Llámanos; estamos a tu servicio.",
      fields: { name: "Nombre", fullName: "Nombre Completo", email: "Correo", yourEmail: "Tu Correo", subject: "Servicio de Interés", product: "Website Express 24H", message: "Mensaje", messagePlaceholder: "Cuéntanos sobre tu negocio...", submit: "Enviar" },
      success: "Gracias. Nos comunicaremos contigo muy pronto.",
    },
    footer: { aria: "Navegación del pie de página", home: "Inicio", services: "Servicios", contact: "Contacto", pricing: "Precios", meeting: "Agendar reunión", copyright: "© 2026 Ethernal DevOps — Soluciones web personalizadas para crecer." },
  },
} as const;

function BrandMark({ small = false }: { small?: boolean }) {
  return <img className={small ? "brand-mark brand-mark--small" : "brand-mark"} src="/assets/ethernal-mark.png" alt="Ethernal DevOps" />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="section-label">{children}</span>;
}

function MiniChart() {
  return <div className="mini-chart" aria-hidden="true"><div className="chart-line" /><div className="chart-shadow" /></div>;
}

function Header({ language, setLanguage, menuOpen, setMenuOpen }: { language: Language; setLanguage: (language: Language) => void; menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const c = copy[language].nav;
  return (
    <header className="site-header">
      <a className="logo-link" href="#home" aria-label="Ethernal DevOps" onClick={() => setMenuOpen(false)}><BrandMark small /></a>
      <nav className={menuOpen ? "main-nav main-nav--open" : "main-nav"} aria-label={c.aria}>
        <a href="#home" onClick={() => setMenuOpen(false)}>{c.home}</a>
        <a href="#services" onClick={() => setMenuOpen(false)}>{c.services}</a>
        <a href="#portfolio" onClick={() => setMenuOpen(false)}>{c.portfolio}</a>
        <a className="button button--small" href="#contact" onClick={() => setMenuOpen(false)}>{c.contact}</a>
      </nav>
      <div className="header-actions">
        <button className="language-toggle" type="button" onClick={() => setLanguage(language === "es" ? "en" : "es")} aria-label={language === "es" ? "Switch to English" : "Cambiar a español"}>
          <span className={language === "es" ? "active" : ""}>ES</span><i /><span className={language === "en" ? "active" : ""}>EN</span>
        </button>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label={c.menu} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      </div>
    </header>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("es");
  const [languageReady, setLanguageReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const pageRef = useRef<HTMLElement>(null);
  const c = copy[language];

  useEffect(() => {
    const saved = window.localStorage.getItem("ethernal-language");
    if (saved === "en" || saved === "es") setLanguage(saved);
    else if (window.navigator.language.toLowerCase().startsWith("en")) setLanguage("en");
    setLanguageReady(true);
  }, []);

  useEffect(() => {
    if (!languageReady) return;
    document.documentElement.lang = language;
    window.localStorage.setItem("ethernal-language", language);
    setSubmitted(false);
  }, [language, languageReady]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("is-visible"); }), { rootMargin: "0px 0px -8%", threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        pageRef.current?.style.setProperty("--pointer-x", `${event.clientX}px`);
        pageRef.current?.style.setProperty("--pointer-y", `${event.clientY}px`);
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", move); };
  }, []);

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <main ref={pageRef} className="site-shell">
      <div className="pointer-glow" aria-hidden="true" />
      <Header language={language} setLanguage={setLanguage} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="hero section-grid" id="home">
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" /><div className="hero-orbit hero-orbit--two" aria-hidden="true" />
        <div className="hero-copy" data-reveal>
          <BrandMark /><h1>Ethernal Dev<span>0</span>ps</h1>
          <p className="hero-subtitle"><strong>{c.hero.eyebrow}</strong>{c.hero.subtitle}</p>
          <div className="button-row"><a className="button" href="#contact">{c.hero.primary}</a><a className="button" href="#pricing">{c.hero.pricing}</a></div>
          <div className="tech-row" aria-label={c.hero.tech}><span>Google <b>Analytics</b></span><span className="tech-react">⚛ React</span><span>♦ mongoDB</span><span className="tech-framer"><img src="/assets/framer-mark.png" alt="" /> Framer</span></div>
        </div>
      </section>

      <section className="feature-bento content-width" aria-label={c.features.aria}>
        <article className="glass-card web-card" data-reveal><h3>{c.features.webTitle}</h3><p>{c.features.webCopy}</p><div className="floating-tags floating-tags--web">{c.features.webTags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>
        <article className="glass-card insights-card" data-reveal>
          <h3>{c.features.insightsTitle}</h3><p>{c.features.insightsCopy}</p>
          <div className="insight-dashboard"><div className="floating-tags">{c.features.insightTags.map((tag) => <span key={tag}>{tag}</span>)}</div><MiniChart /><div className="business-grid">{c.features.industries.map((item) => <span key={item}>{item} ↗</span>)}</div></div>
        </article>
      </section>

      <section className="portfolio section-block" id="portfolio">
        <div className="section-heading" data-reveal><h2 className="portfolio-title">{c.portfolio.title}</h2><p>{c.portfolio.line1}<br />{c.portfolio.line2}</p></div>
        <a className="project-showcase" href="https://costagrillmx.com/" target="_blank" rel="noreferrer" data-reveal aria-label={c.portfolio.aria}><img src="/assets/costa-grill.png" alt={c.portfolio.alt} /><span className="project-arrow project-arrow--left">‹</span><span className="project-arrow project-arrow--right">›</span><span className="project-caption">{c.portfolio.caption}</span></a>
      </section>

      <section className="data-solutions content-width">
        <article className="glass-card data-card data-card--large" data-reveal>
          <h3>{c.data.businessTitle}</h3><p>{c.data.businessCopy}</p>
          <div className="data-visual"><strong>{c.data.growth}</strong><div className="metric-pills"><span>▥ {c.data.visits}</span><span>◷ {c.data.lastDay}</span></div><MiniChart /><div className="profile-line"><BrandMark small /> Ethernal DevOps&nbsp; 🌟</div><div className="growth-list"><b>{c.data.growth}&nbsp;⌃</b><span>☑ {c.data.score}</span><span>☑ {c.data.stats}</span><span>☑ {c.data.start}</span></div></div>
        </article>
        <article className="glass-card data-card" data-reveal><h3>{c.data.salesTitle}</h3><p>{c.data.salesCopy}</p><div className="sales-board"><span>▥ {c.data.visits}</span><span>◷ {c.data.lastDay}</span>{c.data.salesMetrics.map((item) => <span key={item}>{item}</span>)}<div className="profile-line"><BrandMark small /> Ethernal DevOps&nbsp; 🌟</div></div></article>
      </section>

      <section className="services section-block" id="services">
        <div className="section-heading" data-reveal><SectionLabel>{c.benefits.label}</SectionLabel><h2>{c.benefits.title}</h2><p><em>{c.benefits.subtitle}</em></p></div>
        <div className="card-grid content-width">{c.benefits.services.map((service) => <article className="glass-card service-card" data-reveal key={service.title}><span className="icon-box">{service.icon}</span><h3>{service.title}</h3><p>{service.text}</p></article>)}</div>
        <div className="marquees" aria-hidden="true"><div className="marquee"><div>{[...c.benefits.marquee1, ...c.benefits.marquee1].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div></div><div className="marquee marquee--reverse"><div>{[...c.benefits.marquee2, ...c.benefits.marquee2].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div></div></div>
      </section>

      <section className="pricing section-block" id="pricing">
        <div className="section-heading" data-reveal><SectionLabel>{c.pricing.label}</SectionLabel><h2>{c.pricing.title}</h2><p>{c.pricing.subtitle}</p></div>
        <div className="pricing-grid content-width">
          <article className="glass-card price-card price-card--featured express-card" data-reveal>
            <p className="plan-name">{c.pricing.plan} <span>{c.pricing.promo}</span></p>
            <div className="price price--stacked"><strong>{c.pricing.price}</strong><span>{c.pricing.mxPrice}</span></div>
            <p className="price-original">{c.pricing.regular}</p><p className="payment-note">{c.pricing.payment}</p>
            <a className="button" href="#contact">{c.pricing.cta}</a><p>{c.pricing.includes}</p>
            <ul>{c.pricing.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article className="glass-card price-card addon-card" data-reveal>
            <p className="plan-name">{c.pricing.addonsTitle}</p><p className="addon-intro">{c.pricing.addonsSubtitle}</p>
            <div className="addon-grid">{c.pricing.addons.map(([name, price]) => <div key={name}><span>{name}</span><strong>{price}</strong></div>)}</div>
            <p className="addon-note">{c.pricing.addonNote}</p><a className="button" href="#contact">{c.pricing.cta}</a>
          </article>
        </div>
        <div className="brand-divider">Ethernal DevOps</div>
      </section>

      <section className="founder-note section-block"><div className="founder-inner" data-reveal><SectionLabel>{c.founder.label}</SectionLabel><blockquote>{c.founder.quoteStart} <em>{c.founder.quoteAccent}</em><br /><span>{c.founder.quoteMiddle}</span> {c.founder.quoteEnd}</blockquote><div className="founder-byline"><BrandMark small /><span>{c.founder.byline}</span></div></div></section>

      <section className="comparison section-block">
        <div className="section-heading" data-reveal><SectionLabel>{c.comparison.label}</SectionLabel><h2>{c.comparison.title}</h2><p><em>{c.comparison.subtitle}</em></p></div>
        <div className="comparison-grid content-width"><div data-reveal><BrandMark /><ul className="comparison-list comparison-list--good">{c.comparison.good.map((item) => <li key={item}>{item}</li>)}</ul></div><div data-reveal><h3>▱ {c.comparison.others}</h3><ul className="comparison-list comparison-list--other">{c.comparison.bad.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
      </section>

      <section className="ai-efficiency section-block">
        <div className="ai-arc" aria-hidden="true"><span /></div><div className="section-heading" data-reveal><SectionLabel>{c.ai.label}</SectionLabel><h2>{c.ai.title}</h2><p><em>{c.ai.subtitle}</em></p></div>
        <div className="card-grid content-width">{c.ai.services.map((service) => <article className="glass-card service-card" data-reveal key={service.title}><span className="icon-box">{service.icon}</span><h3>{service.title}</h3><p>{service.text}</p></article>)}</div>
        <div className="insight-strip" data-reveal><span>⌁&nbsp; {c.ai.strip[0]}</span><i /><span>♧&nbsp; {c.ai.strip[1]}</span><i /><span>☷&nbsp; {c.ai.strip[2]}</span></div>
      </section>

      <section className="cta section-block"><div className="section-heading" data-reveal><SectionLabel>{c.cta.label}</SectionLabel><h2>{c.cta.title}</h2><p>{c.cta.subtitle}</p><div className="button-row"><a className="button" href="#pricing">{c.cta.pricing}</a><a className="button" href="#contact">{c.cta.meeting}</a></div></div><div className="tilted-preview" data-reveal><img src="/assets/hero-preview.png" alt={c.cta.imageAlt} /></div></section>

      <section className="contact section-block" id="contact">
        <div className="contact-inner content-width">
          <div className="contact-copy" data-reveal><SectionLabel>{c.contact.label}</SectionLabel><h2>{c.contact.title}</h2><a className="button" href="#pricing">{c.contact.pricing}</a><p className="support-line">✳ <strong>{c.contact.support}</strong> {c.contact.supportText}</p><p className="support-line">✳ <strong>{c.contact.schedule}</strong> {c.contact.scheduleText}</p><div className="contact-cards"><article className="glass-card"><span className="icon-box">▣</span><h3>{c.contact.reach}</h3><p>{c.contact.emailCopy}</p><a href="mailto:ethernaldevops@gmail.com">ethernaldevops@gmail.com</a></article><article className="glass-card"><span className="icon-box">●</span><h3>{c.contact.reach}</h3><p>{c.contact.phoneCopy}</p><a href="tel:+19562513072">+1 (956)-251-3072</a></article></div></div>
          <form className="contact-form glass-card" onSubmit={submitForm} data-reveal>
            <label>{c.contact.fields.name}<input name="name" placeholder={c.contact.fields.fullName} required /></label><label>{c.contact.fields.email}<input name="email" type="email" placeholder={c.contact.fields.yourEmail} required /></label><label>{c.contact.fields.subject}<input name="subject" placeholder={c.contact.fields.product} required /></label><label>{c.contact.fields.message}<textarea name="message" placeholder={c.contact.fields.messagePlaceholder} rows={4} required /></label><button className="button" type="submit">{c.contact.fields.submit}</button><p className={submitted ? "form-success form-success--visible" : "form-success"} role="status">{c.contact.success}</p>
          </form>
        </div>
      </section>

      <footer className="site-footer"><div className="footer-top content-width"><BrandMark small /><nav aria-label={c.footer.aria}><a href="#home">{c.footer.home}</a><a href="#services">{c.footer.services}</a><a href="#contact">{c.footer.contact}</a><a href="#pricing">{c.footer.pricing}</a></nav><a href="mailto:ethernaldevops@gmail.com">ethernaldevops@gmail.com</a><a className="button button--small" href="#contact">{c.footer.meeting}</a></div><div className="footer-bottom content-width"><a href="https://www.instagram.com/ethernal_devops/" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a><p>{c.footer.copyright}</p></div></footer>
    </main>
  );
}
