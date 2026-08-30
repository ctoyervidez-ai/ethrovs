import { whatsappHref, CONTACT_EMAIL, pricingByMarket, type Language } from "../content/site";
import type { SiteCopy } from "../content/es";
import HeroDeck from "./HeroDeck";
import LangSwitch from "./LangSwitch";
import LocaleSuggest from "./LocaleSuggest";
import PricingGrid from "./Pricing";
import Reveal from "./Reveal";
import Work from "./Work";
import JsonLd from "./JsonLd";

// TODO(daniel): activar cuando existan frases reales de clientes en app/content/{es,en}.ts.
const SHOW_TESTIMONIALS = false;

export default function Home({ copy, language }: { copy: SiteCopy; language: Language }) {
  const heroPricing = pricingByMarket[language === "es" ? "mx" : "us"];

  return (
    <>
      <link rel="preload" href="/fonts/archivo-normal-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/instrument-serif-italic-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <JsonLd language={language} description={copy.meta.description} />
      <Reveal />

      <nav className="nav" aria-label="Main navigation">
        <div className="wrap nav-in">
          <a className="mark" href="#top" aria-label="ETHROVS home"><span className="mark-symbol" aria-hidden="true" />ETHROVS</a>
          <div className="nav-links">
            <a href="#trabajo">{copy.nav.work}</a>
            <a href="#servicios">{copy.nav.services}</a>
            <a href="#proceso">{copy.nav.process}</a>
            <a href="#precio">{copy.nav.pricing}</a>
            <a href="#dudas">{copy.nav.faq}</a>
          </div>
          <LangSwitch language={language} />
          <a className="btn btn-solid btn-sm nav-cta" href="#contacto">
            <span className="nav-cta-full">{copy.nav.contact}</span>
            <span className="nav-cta-short">{copy.nav.contactShort}</span>
            <span className="arw">↗</span>
          </a>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="grid-rules" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index} />)}</div>
        <div className="wrap hero-in">
          <div>
            <div className="eyebrow"><span className="dash" /><p className="label">{copy.hero.kicker}</p></div>
            <h1>{copy.hero.line1}<span className="serif">{copy.hero.line2}</span></h1>
            <p className="lead">{copy.hero.text}</p>
            <div className="hero-cta">
              <a className="btn btn-solid" href="#contacto">{copy.hero.primary} <span className="arw">↗</span></a>
              <a className="btn btn-ghost" href="#trabajo">{copy.hero.secondary} <span>↓</span></a>
            </div>
            <div className="proof">
              <div><b>24 h</b><p className="label">{copy.hero.proof[0]}</p></div>
              <div><b>5</b><p className="label">{copy.hero.proof[1]}</p></div>
              <div><b>ES · EN</b><p className="label">{copy.hero.proof[2]}</p></div>
              <div><b>{heroPricing.price}</b><p className="label">{copy.hero.proof[3]}, {heroPricing.currency}</p></div>
            </div>
          </div>
          <HeroDeck language={language} viewLabel={copy.hero.deckView} deckLabel={copy.hero.deckLabel} />
        </div>
      </header>

      <main>
        <Work copy={copy.work} language={language} />

        <section className="sec wrap" id="servicios">
          <div className="sec-head"><h2>{copy.services.title}</h2></div>
          <div className="svc">
            {copy.services.items.map((item, index) => (
              <article className="rv" style={{ transitionDelay: `${index * 70}ms` }} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="sec wrap" id="proceso">
          <div className="sec-head"><h2>{copy.process.title}</h2></div>
          <div className="steps">
            {copy.process.steps.map((step, index) => (
              <div className="step rv" style={{ transitionDelay: `${index * 70}ms` }} key={step.title}>
                <span className="step-n">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
                <p className="label when">{step.when}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="sec wrap" id="precio">
          <div className="sec-head">
            <h2>Website Express <span className="serif">24 h.</span></h2>
            <p className="label">{copy.pricing.label}</p>
          </div>
          <PricingGrid copy={copy.pricing} language={language} />
        </section>

        {SHOW_TESTIMONIALS && (
          <section className="sec wrap" id="testimonios">
            <div className="sec-head"><h2>{copy.testimonials.title}</h2></div>
            <div className="quotes">
              {copy.testimonials.items.map((item) => (
                <figure className="quote rv" key={item.role}>
                  <blockquote>{item.quote}</blockquote>
                  <figcaption>{item.name} · {item.role}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="sec wrap" id="dudas">
          <div className="sec-head"><h2>{copy.faq.title}</h2></div>
          <div className="faq rv">
            {copy.faq.items.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p className="ans">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="sec wrap" id="contacto">
          <div className="cta rv">
            <div className="cta-in">
              <div>
                <p className="label">{copy.contact.label}</p>
                <h2>{copy.contact.line1} <span className="serif">{copy.contact.line2}</span></h2>
                <p>{copy.contact.text}</p>
              </div>
              <div className="cta-actions">
                <a className="btn btn-acid btn-wide" href={whatsappHref(copy.contact.whatsappMessage)} target="_blank" rel="noreferrer">
                  {copy.contact.whatsapp} <span className="arw">↗</span>
                </a>
                <a className="btn btn-line btn-wide" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(copy.contact.emailSubject)}`}>
                  {copy.contact.email} <span className="arw">↗</span>
                </a>
                <p className="cta-note">{copy.contact.note}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap">
        <div className="foot-in">
          <p className="label">© 2026 ETHROVS · Laredo, TX · Nuevo Laredo, MX</p>
          <p className="label">{copy.footer}</p>
        </div>
      </footer>

      <LocaleSuggest language={language} copy={copy.suggest} />
    </>
  );
}
