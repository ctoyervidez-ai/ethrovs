"use client";

import { useEffect, useState } from "react";
import { pricingByMarket, whatsappHref, type Language, type Market } from "../content/site";
import type { SiteCopy } from "../content/es";

export default function PricingGrid({ copy, language }: { copy: SiteCopy["pricing"]; language: Language }) {
  const [market, setMarket] = useState<Market>(language === "es" ? "mx" : "us");
  const pricing = pricingByMarket[market];

  useEffect(() => {
    const controller = new AbortController();
    async function restore(): Promise<Market | null> {
      let saved: string | null = null;
      try {
        saved = window.localStorage.getItem("ethrovs-market");
      } catch {
        saved = null;
      }
      if (saved === "us" || saved === "mx") return saved;
      const response = await fetch("/api/locale", { cache: "no-store", signal: controller.signal });
      if (!response.ok) return null;
      const data = (await response.json()) as { country?: string };
      if (data.country === "MX") return "mx";
      if (data.country === "US") return "us";
      return null;
    }
    restore()
      .then((next) => {
        if (next) setMarket(next);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  function chooseMarket(next: Market) {
    setMarket(next);
    try {
      window.localStorage.setItem("ethrovs-market", next);
    } catch {
      // storage unavailable; selection still applies for this visit
    }
  }

  return (
    <div className="price-grid">
      <div className="card rv">
        <div className="cur" role="group" aria-label="Currency">
          <button type="button" aria-pressed={market === "us"} onClick={() => chooseMarket("us")}>USA · USD</button>
          <button type="button" aria-pressed={market === "mx"} onClick={() => chooseMarket("mx")}>México · MXN</button>
        </div>
        <div className="amount">
          <span className="from">{copy.from}</span>
          <span className="fig">{pricing.price}</span>
          <span className="cc">{pricing.currency}</span>
        </div>
        <p className="price-description">{copy.description}</p>
        <ul className="incl">
          {copy.items.map((item) => (
            <li key={item}><span className="ck" aria-hidden="true">✓</span><span>{item}</span></li>
          ))}
        </ul>
        <p className="price-flex">{copy.flexible}</p>
        <p className="terms">{copy.terms}</p>
        <a className="btn btn-acid btn-wide" href={whatsappHref(copy.whatsappMessage)} target="_blank" rel="noreferrer">
          {copy.cta} <span className="arw">↗</span>
        </a>
      </div>
      <div className="card extras rv">
        <h3>{copy.extrasTitle}</h3>
        <p>{copy.extrasText}</p>
        <dl>
          {copy.extras.map((extra, index) => (
            <div className="ext-row" key={extra}>
              <dt>{extra}</dt>
              <dd>{pricing.extras[index]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
