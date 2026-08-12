"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const primaryServices = [
  {
    icon: "⌖",
    title: "Web Development",
    copy: "Custom-built websites that are responsive, lightning-fast, and fully optimized — built to convert and scale with your business.",
  },
  {
    icon: "✣",
    title: "SEO Optimization",
    copy: "Get found online. Our SEO strategies increase your visibility, grow your traffic, and position your brand exactly where it matters most.",
  },
  {
    icon: "◉",
    title: "Graphic Design",
    copy: "Stand out with custom logos, brand identity, and visuals designed to communicate your vision with clarity, consistency, and creativity.",
  },
];

const insightServices = [
  {
    icon: "↻",
    title: "Effortless Integration",
    copy: "Your data is synced in real-time across devices, ensuring you stay connected and informed—online or offline.",
  },
  {
    icon: "⬡",
    title: "Secure & Scalable",
    copy: "Enterprise-grade encryption protects your information, while flexible tools adapt to your business needs.",
  },
  {
    icon: "✣",
    title: "Actionable Insights",
    copy: "Leverage AI-powered analytics to identify trends, predict outcomes, and optimize your workflow effortlessly.",
  },
];

const goodReasons = [
  "🌍 Seamless global collaboration",
  "🚀 Scalable, flexible, and custom-built solutions",
  "📊 Powerful & real-time dashboard control",
  "📈 Integrated data analytics and reporting",
  "🧠 Intuitive, user-first interface design",
];

const otherReasons = [
  "Limited global collaboration",
  "Rigid and non-scalable options",
  "Basic dashboard functionalities",
  "Lack of advanced analytics",
  "Outdated and complex interfaces",
];

const marqueeOne = [
  "Web Development",
  "Flexible Payments",
  "Smart Spending",
  "Customizable Plans",
  "Smart Insights",
];

const marqueeTwo = [
  "Automatic Adjustments",
  "Real-Time Reports",
  "Secure Transactions",
  "Dedicated Support",
  "Growth With AI",
];

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <img
      className={small ? "brand-mark brand-mark--small" : "brand-mark"}
      src="/assets/ethernal-mark.png"
      alt="Ethernal DevOps"
    />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="section-label">{children}</span>;
}

function MiniChart() {
  return (
    <div className="mini-chart" aria-hidden="true">
      <div className="chart-line" />
      <div className="chart-shadow" />
    </div>
  );
}

function Header({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  return (
    <header className="site-header">
      <a className="logo-link" href="#home" aria-label="Ethernal DevOps home" onClick={() => setMenuOpen(false)}>
        <BrandMark small />
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
      </button>
      <nav className={menuOpen ? "main-nav main-nav--open" : "main-nav"} aria-label="Main navigation">
        <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
        <a href="#portfolio" onClick={() => setMenuOpen(false)}>Portfolio</a>
        <a className="button button--small" href="#contact" onClick={() => setMenuOpen(false)}>Contact Us</a>
      </nav>
    </header>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }),
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );
    const nodes = document.querySelectorAll("[data-reveal]");
    nodes.forEach((node) => observer.observe(node));
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
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <main ref={pageRef} className="site-shell">
      <div className="pointer-glow" aria-hidden="true" />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="hero section-grid" id="home">
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
        <div className="hero-copy" data-reveal>
          <BrandMark />
          <h1>Ethernal Dev<span>0</span>ps</h1>
          <p className="hero-subtitle">
            <strong>Modern Web Solutions for Ambitious Brands</strong>
            Custom websites, SEO, software &amp; design – tailored to your business.
          </p>
          <div className="button-row">
            <a className="button" href="#contact">Get Started Now</a>
            <a className="button" href="#pricing">Plans &amp; Pricing</a>
          </div>
          <div className="tech-row" aria-label="Technologies we work with">
            <span>Google <b>Analytics</b></span>
            <span className="tech-react">⚛ React</span>
            <span>♦ mongoDB</span>
            <span className="tech-framer"><img src="/assets/framer-mark.png" alt="" /> Framer</span>
          </div>
        </div>
      </section>

      <section className="feature-bento content-width" aria-label="Core capabilities">
        <article className="glass-card web-card" data-reveal>
          <h3>💻 Web Development</h3>
          <p>We build fast, secure, and mobile-friendly websites tailored to your goals. Whether it&apos;s a landing page, eCommerce, or custom solution — we make it happen.</p>
          <div className="floating-tags floating-tags--web">
            <span>✅ Responsive &amp; optimized for SEO&nbsp; 🌟</span>
            <span>✅ Custom CMS or WordPress&nbsp; 🌐</span>
            <span>✅ Secure hosting &amp; performance tuning&nbsp; 🌟</span>
          </div>
        </article>
        <article className="glass-card insights-card" data-reveal>
          <h3>Enterprise Insights</h3>
          <p>Get real-time insights into customer behavior, market trends, and digital performance with powerful dashboards and data tracking tools.</p>
          <div className="insight-dashboard">
            <div className="floating-tags">
              <span>🟠 🔍 Sentiment analysis&nbsp; 🌟</span>
              <span>📈 User interaction metrics&nbsp; 🌐</span>
            </div>
            <MiniChart />
            <div className="business-grid">
              {['Web Business', 'E-commerce Brands', "SAAS Startup’s", 'Tech Innovators', 'Marketing Agencies', 'Creative Studios'].map((item) => <span key={item}>{item} ↗</span>)}
            </div>
          </div>
        </article>
      </section>

      <section className="portfolio section-block" id="portfolio">
        <div className="section-heading" data-reveal>
          <h2 className="portfolio-title">PORTFOLIO</h2>
          <p>Modern Web Solutions for Ambitious Brands<br />Custom websites, SEO, software &amp; design – tailored to your business.</p>
        </div>
        <a className="project-showcase" href="https://costagrillmx.com/" target="_blank" rel="noreferrer" data-reveal aria-label="View Costa Grill project">
          <img src="/assets/costa-grill.png" alt="Costa Grill website project" />
          <span className="project-arrow project-arrow--left">‹</span>
          <span className="project-arrow project-arrow--right">›</span>
          <span className="project-caption">Costa Grill · Website &amp; local brand experience</span>
        </a>
      </section>

      <section className="data-solutions content-width">
        <article className="glass-card data-card data-card--large" data-reveal>
          <h3>Business Data Solutions</h3>
          <p>Make data-driven decisions using our analytics solutions designed to uncover growth opportunities and reduce business risks</p>
          <div className="data-visual">
            <strong>See Growth</strong>
            <div className="metric-pills"><span>▥ Monthly Visits</span><span>◷ Last 24hrs</span></div>
            <MiniChart />
            <div className="profile-line"><BrandMark small /> Ethernal DevOps&nbsp; 🌟</div>
            <div className="growth-list"><b>See Growth&nbsp;⌃</b><span>☑ 100% score anytime</span><span>☑ Watch Stats &amp; Growth like master</span><span>☑ Start Growing Now</span></div>
          </div>
        </article>
        <article className="glass-card data-card" data-reveal>
          <h3>Boost Sales</h3>
          <p>Drive more revenue with sales automation, targeted marketing, and conversion optimization strategies tailored to your niche</p>
          <div className="sales-board">
            {['▥ Monthly Visits','◷ Last 24hrs','⟳ Retention','♧ Top Referrals','% Conversion','▣ Grow Income'].map((item) => <span key={item}>{item}</span>)}
            <div className="profile-line"><BrandMark small /> Ethernal DevOps&nbsp; 🌟</div>
          </div>
        </article>
      </section>

      <section className="services section-block" id="services">
        <div className="section-heading" data-reveal>
          <SectionLabel>BENEFITS</SectionLabel>
          <h2>Why Choose Us?</h2>
          <p><em>From web development to creative branding, we build your<br className="desktop-only" /> digital presence from the ground up.</em></p>
        </div>
        <div className="card-grid content-width">
          {primaryServices.map((service) => (
            <article className="glass-card service-card" data-reveal key={service.title}>
              <span className="icon-box">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </article>
          ))}
        </div>
        <div className="marquees" aria-hidden="true">
          <div className="marquee"><div>{[...marqueeOne, ...marqueeOne].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div></div>
          <div className="marquee marquee--reverse"><div>{[...marqueeTwo, ...marqueeTwo].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div></div>
        </div>
      </section>

      <section className="pricing section-block" id="pricing">
        <div className="section-heading" data-reveal>
          <SectionLabel>PRICING &amp; PLANS</SectionLabel>
          <h2>Flexible Pricing Plans</h2>
          <p>Choose a plan that fits your business needs and unlock the<br className="desktop-only" /> full potential of our platform</p>
        </div>
        <div className="pricing-grid content-width">
          <article className="glass-card price-card" data-reveal>
            <p className="plan-name">Starter</p>
            <div className="price"><strong>$660</strong><span>/half upfront</span></div>
            <a className="button" href="#contact">Get Started Now</a>
            <p>Includes:</p>
            <ul>
              <li>Professional template adapted to your business</li>
              <li>Standard sections (Home, Services, Contact)</li>
              <li>Mobile responsive &amp; basic hosting setup</li>
            </ul>
          </article>
          <article className="glass-card price-card price-card--featured" data-reveal>
            <p className="plan-name">Pro <span>Popular</span></p>
            <div className="price"><strong>$1180</strong><span>/half upfront</span></div>
            <a className="button" href="#contact">Get Started Now</a>
            <p>Includes:</p>
            <ul>
              <li>Fully custom web design tailored to your brand</li>
              <li>Google My Business setup &amp; SEO optimization</li>
              <li>Advanced features and integrations</li>
              <li>Technical support, walkthrough &amp; top-grade security</li>
            </ul>
          </article>
        </div>
        <div className="brand-divider">Ethernal DevOps</div>
      </section>

      <section className="founder-note section-block">
        <div className="founder-inner" data-reveal>
          <SectionLabel>FOUNDERS NOTE</SectionLabel>
          <blockquote>
            “ We don&apos;t just build websites. <em>We decode what your audience wants.</em><br />
            <span>We analyze your site&apos;s data, understand your ideal customer, and help your brand stand out.</span> The best part? We turn insights into real, actionable solutions."
          </blockquote>
          <div className="founder-byline"><BrandMark small /><span>Co-founder &amp; Lead Engineer at Ethernal DevOps</span></div>
        </div>
      </section>

      <section className="comparison section-block">
        <div className="section-heading" data-reveal>
          <SectionLabel>COMPARISON</SectionLabel>
          <h2>Why Ethernal DevOps Stands Out</h2>
          <p><em>See how we outperform typical web service providers in<br className="desktop-only" /> speed, scale, and innovation.</em></p>
        </div>
        <div className="comparison-grid content-width">
          <div data-reveal>
            <BrandMark />
            <ul className="comparison-list comparison-list--good">{goodReasons.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div data-reveal>
            <h3>▱ Others</h3>
            <ul className="comparison-list comparison-list--other">{otherReasons.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="ai-efficiency section-block">
        <div className="ai-arc" aria-hidden="true"><span /></div>
        <div className="section-heading" data-reveal>
          <SectionLabel>AI-DRIVEN EFFICIENCY</SectionLabel>
          <h2>Never Miss an Opportunity</h2>
          <p><em>Capture leads, analyze trends, and centralize powerful<br className="desktop-only" /> insights to grow smarter.</em></p>
        </div>
        <div className="card-grid content-width">
          {insightServices.map((service) => (
            <article className="glass-card service-card" data-reveal key={service.title}>
              <span className="icon-box">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </article>
          ))}
        </div>
        <div className="insight-strip" data-reveal><span>⌁&nbsp; Smart Analytics</span><i /><span>♧&nbsp; Real-Time Collaboration</span><i /><span>☷&nbsp; Task Prioritization</span></div>
      </section>

      <section className="cta section-block">
        <div className="section-heading" data-reveal>
          <SectionLabel>WHAT YOU STILL WAITING FOR</SectionLabel>
          <h2>Grow Now Ethernal Dev<span>0</span>ps</h2>
          <p>Unlock the power of automation, smart analytics, and<br className="desktop-only" /> tailored solutions to scale faster and work smarter.</p>
          <div className="button-row">
            <a className="button" href="#pricing">Plans &amp; Pricing</a>
            <a className="button" href="#contact">Book a Meeting</a>
          </div>
        </div>
        <div className="tilted-preview" data-reveal><img src="/assets/hero-preview.png" alt="Ethernal DevOps website interface" /></div>
      </section>

      <section className="contact section-block" id="contact">
        <div className="contact-inner content-width">
          <div className="contact-copy" data-reveal>
            <SectionLabel>CUSTOMERS FEEDBACK</SectionLabel>
            <h2>Trusted by Our Early Clients</h2>
            <a className="button" href="#pricing">Plans &amp; Pricing</a>
            <p className="support-line">✳ <strong>Direct Support:</strong> Connect with our team anytime.</p>
            <p className="support-line">✳ <strong>Schedule a Meeting Now:</strong> Witness our platform&apos;s performance</p>
            <div className="contact-cards">
              <article className="glass-card">
                <span className="icon-box">▣</span><h3>Reach Out to Us</h3>
                <p>Have questions? We&apos;re here to help reach out!</p>
                <a href="mailto:ethernaldevops@gmail.com">ethernaldevops@gmail.com</a>
              </article>
              <article className="glass-card">
                <span className="icon-box">●</span><h3>Reach Out to Us</h3>
                <p>Need assistance? Ring us up—we&apos;re at your service.</p>
                <a href="tel:+19562513072">+1 (956)-251-3072</a>
              </article>
            </div>
          </div>
          <form className="contact-form glass-card" onSubmit={submitForm} data-reveal>
            <label>Name<input name="name" placeholder="Full Name" required /></label>
            <label>Email<input name="email" type="email" placeholder="Your Email" required /></label>
            <label>Subject of Interest<input name="subject" placeholder="Product related" required /></label>
            <label>Message<textarea name="message" placeholder="message goes here..." rows={4} required /></label>
            <button className="button" type="submit">Submit</button>
            <p className={submitted ? "form-success form-success--visible" : "form-success"} role="status">Thank you — we&apos;ll reach out shortly.</p>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-top content-width">
          <BrandMark small />
          <nav aria-label="Footer navigation"><a href="#home">Home</a><a href="#services">Services</a><a href="#contact">Contact</a><a href="#pricing">Pricing</a></nav>
          <a href="mailto:ethernaldevops@gmail.com">ethernaldevops@gmail.com</a>
          <a className="button button--small" href="#contact">Book a meeting</a>
        </div>
        <div className="footer-bottom content-width"><a href="https://www.instagram.com/ethernal_devops/" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a><p>© 2026 Ethernal DevOps — Custom web solutions built for growth.</p></div>
      </footer>
    </main>
  );
}
