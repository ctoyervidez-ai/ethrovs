"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Language = "es" | "en";

const copy = {
  es: {
    nav: { work: "Trabajo", services: "Servicios", process: "Proceso", pricing: "Precio", contact: "Iniciar proyecto", menu: "Abrir menú" },
    hero: {
      kicker: "Estudio web bilingüe · Laredo / Nuevo Laredo",
      line1: "Páginas web que",
      line2: "mueven negocios.",
      text: "Diseño estratégico, desarrollo rápido y tecnología inteligente para negocios que están listos para crecer.",
      primary: "Crear mi página",
      secondary: "Ver nuestro trabajo",
      note: "Entrega desde 24 horas",
      proof: ["Diseño a tu medida", "Optimizada para celular", "Lista para vender"],
    },
    signal: ["ENERGÍA", "TECNOLOGÍA", "VELOCIDAD", "ETHROVS"],
    manifesto: {
      label: "Nuestra energía",
      title: "Una presencia digital no debería quedarse quieta.",
      text: "ETHROVS combina diseño, tecnología y velocidad para convertir una idea en una experiencia que genera confianza, contactos y movimiento.",
      words: ["Energy", "Technology", "Velocity"],
    },
    work: {
      label: "Trabajo seleccionado",
      title: "Diseñado para verse bien. Construido para funcionar.",
      project: "Costa Grill",
      type: "Estrategia · Diseño · Desarrollo",
      description: "Una experiencia digital cálida y directa para un restaurante local, optimizada para convertir visitas en reservaciones.",
      visit: "Ver proyecto en vivo",
    },
    services: {
      label: "Lo que hacemos",
      title: "Todo lo necesario para lanzar con fuerza.",
      items: [
        ["01", "Web Design", "Dirección visual, estructura y contenido que hacen que tu negocio se sienta confiable desde el primer segundo."],
        ["02", "Development", "Sitios rápidos, adaptables a celular y construidos con una base sólida para crecer contigo."],
        ["03", "Growth + AI", "SEO básico, analítica, automatizaciones y herramientas inteligentes para trabajar mejor."],
      ],
    },
    process: {
      label: "Proceso express",
      title: "De idea a internet en tres movimientos.",
      steps: [
        ["01", "Envíanos tu contenido", "Tu logo, fotos, servicios y la información esencial de tu negocio."],
        ["02", "Diseñamos y construimos", "Creamos una dirección visual clara y desarrollamos tu página en una sola producción."],
        ["03", "Revisas y publicamos", "Hacemos una ronda de cambios, conectamos tu dominio y te dejamos listo para vender."],
      ],
    },
    pricing: {
      label: "Oferta de lanzamiento",
      title: "Website Express",
      time: "24H",
      price: "$149",
      currency: "USD",
      mx: "o $2,900 MXN",
      description: "Una página profesional de hasta seis secciones, lista para presentar tu negocio y recibir clientes.",
      items: ["Diseño personalizado", "Versión móvil", "Botones de llamada, mapa y WhatsApp", "SEO básico y conexión de dominio", "Una ronda de cambios"],
      payment: "50% para comenzar · 50% antes de publicar",
      cta: "Reservar mi página",
      add: "Extras",
      extras: [["Versión bilingüe", "+$75"], ["Google Business", "+$99"], ["Página adicional", "+$50"], ["Mantenimiento", "$29/mes"]],
    },
    contact: {
      label: "¿Listo para moverte?",
      title: "Hagamos algo que la gente recuerde.",
      text: "Cuéntanos qué vendes y qué necesitas. Te respondemos con una propuesta clara, sin llamadas eternas ni precios escondidos.",
      whatsapp: "Hablar por WhatsApp",
      email: "Enviar un correo",
      form: { name: "Nombre", business: "Negocio", email: "Correo", message: "¿Qué necesitas?", placeholder: "Quiero una página para…", send: "Enviar proyecto", success: "Listo. Se abrirá tu correo para enviar la información." },
    },
    footer: "Energía digital en movimiento.",
    top: "Volver arriba",
  },
  en: {
    nav: { work: "Work", services: "Services", process: "Process", pricing: "Pricing", contact: "Start a project", menu: "Open menu" },
    hero: {
      kicker: "Bilingual web studio · Laredo / Nuevo Laredo",
      line1: "Websites that",
      line2: "move business.",
      text: "Strategic design, fast development and smart technology for businesses ready to grow.",
      primary: "Build my website",
      secondary: "See our work",
      note: "Delivery from 24 hours",
      proof: ["Custom design", "Mobile optimized", "Ready to sell"],
    },
    signal: ["ENERGY", "TECHNOLOGY", "VELOCITY", "ETHROVS"],
    manifesto: {
      label: "Our energy",
      title: "A digital presence should never stand still.",
      text: "ETHROVS brings design, technology and velocity together to turn an idea into an experience that creates trust, leads and momentum.",
      words: ["Energy", "Technology", "Velocity"],
    },
    work: {
      label: "Selected work",
      title: "Designed to look sharp. Built to work hard.",
      project: "Costa Grill",
      type: "Strategy · Design · Development",
      description: "A warm, direct digital experience for a local restaurant, optimized to turn visits into reservations.",
      visit: "View live project",
    },
    services: {
      label: "What we do",
      title: "Everything you need to launch with force.",
      items: [
        ["01", "Web Design", "Visual direction, structure and copy that make your business feel trustworthy from the first second."],
        ["02", "Development", "Fast, mobile-ready websites built on a solid foundation that can grow with you."],
        ["03", "Growth + AI", "Basic SEO, analytics, automations and smart tools that help your business work better."],
      ],
    },
    process: {
      label: "Express process",
      title: "From idea to internet in three moves.",
      steps: [
        ["01", "Send your content", "Your logo, photos, services and the essential information about your business."],
        ["02", "We design and build", "We create a clear visual direction and develop your site in one focused production."],
        ["03", "You review, we launch", "We make one round of changes, connect your domain and get you ready to sell."],
      ],
    },
    pricing: {
      label: "Launch offer",
      title: "Website Express",
      time: "24H",
      price: "$149",
      currency: "USD",
      mx: "or $2,900 MXN",
      description: "A professional website with up to six sections, ready to present your business and welcome customers.",
      items: ["Custom design", "Mobile version", "Call, map and WhatsApp buttons", "Basic SEO and domain connection", "One revision round"],
      payment: "50% to start · 50% before launch",
      cta: "Reserve my website",
      add: "Add-ons",
      extras: [["Bilingual version", "+$75"], ["Google Business", "+$99"], ["Additional page", "+$50"], ["Monthly care", "$29/mo"]],
    },
    contact: {
      label: "Ready to move?",
      title: "Let's make something people remember.",
      text: "Tell us what you sell and what you need. We'll reply with a clear proposal—no endless calls or hidden pricing.",
      whatsapp: "Chat on WhatsApp",
      email: "Send an email",
      form: { name: "Name", business: "Business", email: "Email", message: "What do you need?", placeholder: "I need a website for…", send: "Send project", success: "Ready. Your email app will open with the project details." },
    },
    footer: "Digital energy in motion.",
    top: "Back to top",
  },
} as const;

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "logo logo--compact" : "logo"} aria-label="ETHROVS">
      <i className="logo-symbol" aria-hidden="true" />
      <b>ETHROVS</b>
    </span>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("es");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const shellRef = useRef<HTMLElement>(null);
  const c = copy[language];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("ethrovs-language");
      if (saved === "es" || saved === "en") setLanguage(saved);
      else if (window.navigator.language.toLowerCase().startsWith("en")) setLanguage("en");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("ethrovs-language", language);
  }, [language]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach((element) => reveal.observe(element));

    let frame = 0;
    const update = (x: number, y: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const shell = shellRef.current;
        if (!shell) return;
        shell.style.setProperty("--mx", `${(x / window.innerWidth - 0.5) * 2}`);
        shell.style.setProperty("--my", `${(y / window.innerHeight - 0.5) * 2}`);
      });
    };
    const pointer = (event: PointerEvent) => !reduced && update(event.clientX, event.clientY);
    const scroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      shellRef.current?.style.setProperty("--scroll", `${max > 0 ? window.scrollY / max : 0}`);
    };
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => {
      cancelAnimationFrame(frame);
      reveal.disconnect();
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener("scroll", scroll);
    };
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Nuevo proyecto ETHROVS — ${data.get("business") || data.get("name")}`);
    const body = encodeURIComponent(`Nombre: ${data.get("name")}\nNegocio: ${data.get("business")}\nCorreo: ${data.get("email")}\n\nProyecto:\n${data.get("message")}`);
    setSent(true);
    window.location.href = `mailto:ethernaldevops@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <main className="site-shell" ref={shellRef}>
      <div className="scroll-progress" aria-hidden="true" />
      <header className="site-header">
        <a href="#top" className="header-logo" aria-label="ETHROVS home"><Logo compact /></a>
        <nav className={menuOpen ? "nav nav--open" : "nav"} aria-label="Main navigation">
          <a href="#work" onClick={() => setMenuOpen(false)}>{c.nav.work}</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>{c.nav.services}</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>{c.nav.process}</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)}>{c.nav.pricing}</a>
        </nav>
        <div className="header-actions">
          <button className="language" type="button" onClick={() => setLanguage(language === "es" ? "en" : "es")} aria-label={language === "es" ? "Switch to English" : "Cambiar a español"}>{language === "es" ? "EN" : "ES"}</button>
          <a className="header-cta" href="#contact">{c.nav.contact} <span>↗</span></a>
          <button className="menu" type="button" aria-expanded={menuOpen} aria-label={c.nav.menu} onClick={() => setMenuOpen(!menuOpen)}><i /><i /></button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">{c.hero.kicker}</p>
          <h1>{c.hero.line1}<br /><em>{c.hero.line2}</em></h1>
          <div className="hero-bottom">
            <p>{c.hero.text}</p>
            <div className="actions"><a className="button button--dark" href="#contact">{c.hero.primary} <span>↗</span></a><a className="text-link" href="#work">{c.hero.secondary} ↓</a></div>
          </div>
          <div className="hero-proof" aria-label="Website benefits">
            {c.hero.proof.map((item) => <span key={item}>✓ {item}</span>)}
          </div>
        </div>
        <div className="kinetic-stage" aria-hidden="true">
          <div className="orbit orbit--one" /><div className="orbit orbit--two" />
          <div className="kinetic-logo"><i className="kinetic-symbol" /><span>ETHROVS</span></div>
          <p>{c.hero.note}</p>
        </div>
      </section>

      <div className="signal" aria-hidden="true"><div>{[...c.signal, ...c.signal].map((word, index) => <span key={`${word}-${index}`}>{word}<i>✦</i></span>)}</div></div>

      <section className="manifesto section-pad">
        <div className="section-index">01</div>
        <div className="manifesto-main" data-reveal><p className="eyebrow">{c.manifesto.label}</p><h2>{c.manifesto.title}</h2><p className="large-copy">{c.manifesto.text}</p></div>
        <div className="word-stack" aria-hidden="true">{c.manifesto.words.map((word, index) => <span key={word}><i>0{index + 1}</i>{word}</span>)}</div>
      </section>

      <section className="work section-pad section-dark" id="work">
        <div className="section-top"><div className="section-index">02</div><p className="eyebrow">{c.work.label}</p><h2>{c.work.title}</h2></div>
        <a className="project" href="https://costagrillmx.com/" target="_blank" rel="noreferrer" data-reveal>
          <div className="project-logo-stage">
            <div className="project-orbit project-orbit--outer" /><div className="project-orbit project-orbit--inner" />
            <div className="costa-logo-frame">
              {/* The original Costa Grill AVIF stays sharp at every viewport. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://costagrillmx.com/images/logo.avif" alt="Logotipo oficial de Costa Grill" loading="eager" />
            </div>
            <span className="project-arrow">↗</span>
          </div>
          <div className="project-info"><div><span>01</span><h3>{c.work.project}</h3></div><p>{c.work.description}</p><b>{c.work.visit} ↗</b></div>
        </a>
      </section>

      <section className="services section-pad" id="services">
        <div className="section-top"><div className="section-index">03</div><p className="eyebrow">{c.services.label}</p><h2>{c.services.title}</h2></div>
        <div className="service-list">{c.services.items.map(([number, title, text]) => <article key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{text}</p><i>↗</i></article>)}</div>
      </section>

      <section className="process section-pad section-blue" id="process">
        <div className="process-heading" data-reveal><p className="eyebrow">{c.process.label}</p><h2>{c.process.title}</h2><div className="process-symbol" aria-hidden="true"><i /></div></div>
        <div className="steps">{c.process.steps.map(([number, title, text]) => <article key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="pricing section-pad" id="pricing">
        <div className="section-top"><div className="section-index">04</div><p className="eyebrow">{c.pricing.label}</p><h2>{c.pricing.title} <em>{c.pricing.time}</em></h2></div>
        <div className="pricing-layout">
          <article className="price-card" data-reveal>
            <div className="price-line"><strong>{c.pricing.price}</strong><span>{c.pricing.currency}<br /><small>{c.pricing.mx}</small></span></div>
            <p className="price-description">{c.pricing.description}</p>
            <ul>{c.pricing.items.map((item) => <li key={item}>{item}<span>✓</span></li>)}</ul>
            <p className="payment">{c.pricing.payment}</p><a className="button button--light" href="#contact">{c.pricing.cta} ↗</a>
          </article>
          <aside className="extras" data-reveal><h3>{c.pricing.add}</h3>{c.pricing.extras.map(([name, price]) => <div key={name}><span>{name}</span><b>{price}</b></div>)}</aside>
        </div>
      </section>

      <section className="contact section-pad section-dark" id="contact">
        <div className="contact-copy" data-reveal><p className="eyebrow">{c.contact.label}</p><h2>{c.contact.title}</h2><p>{c.contact.text}</p><div className="contact-links"><a href="https://wa.me/19562513072?text=Hola%20ETHROVS%2C%20quiero%20una%20p%C3%A1gina%20web" target="_blank" rel="noreferrer">{c.contact.whatsapp} ↗</a><a href="mailto:ethernaldevops@gmail.com">{c.contact.email} ↗</a></div></div>
        <form className="contact-form" onSubmit={submit} data-reveal>
          <label>{c.contact.form.name}<input name="name" required /></label>
          <label>{c.contact.form.business}<input name="business" required /></label>
          <label>{c.contact.form.email}<input name="email" type="email" required /></label>
          <label>{c.contact.form.message}<textarea name="message" rows={4} placeholder={c.contact.form.placeholder} required /></label>
          <button className="button button--light" type="submit">{c.contact.form.send} ↗</button>
          <p className={sent ? "form-status form-status--visible" : "form-status"} role="status">{c.contact.form.success}</p>
        </form>
      </section>

      <footer className="footer"><Logo /><div><p>{c.footer}</p><a href="#top">{c.top} ↑</a></div><small>© 2026 ETHROVS<br />Laredo, TX · Nuevo Laredo, MX</small></footer>
    </main>
  );
}
