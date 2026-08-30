"use client";

import { useEffect, useState } from "react";
import { pricingByMarket, tierOrder, whatsappHref, type Language, type Market } from "../content/site";
import type { SiteCopy } from "../content/es";

/**
 * Escalera de paquetes. Deliberadamente NO son tres tarjetas iguales en
 * columnas: eso es el patrón genérico de cualquier página de precios y rompe
 * la retícula editorial del sitio. Son filas con hairlines, como la sección de
 * Proceso, y en móvil se leen sin apretujarse.
 */
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
    <>
      <div className="cur" role="group" aria-label="Currency">
        <button type="button" aria-pressed={market === "us"} onClick={() => chooseMarket("us")}>USA · USD</button>
        <button type="button" aria-pressed={market === "mx"} onClick={() => chooseMarket("mx")}>México · MXN</button>
      </div>

      <div className="tiers">
        {tierOrder.map((key) => {
          const tier = copy.tiers[key];
          return (
            <article className="tier rv" key={key}>
              <div className="tier-main">
                <h3>{tier.name}</h3>
                <p className="tier-for">{tier.for}</p>
                <ul>
                  {tier.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="tier-buy">
                <p className="tier-price">
                  <b>{pricing.tiers[key]}</b>
                  <span>{pricing.currency}</span>
                </p>
                <p className="label tier-when">{tier.when}</p>
                <a className="btn btn-acid btn-wide" href={whatsappHref(tier.whatsappMessage)} target="_blank" rel="noreferrer">
                  {copy.cta} <span className="arw">↗</span>
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <div className="price-foot">
        <p className="price-flex">{copy.flexible}</p>
        <p className="terms">{copy.terms}</p>
      </div>

      <div className="after-tiers">
        <div className="care rv">
          <div className="care-head">
            <h3>{copy.care.title}</h3>
            <p className="care-amt">
              <b>{pricing.care}</b>
              <span>{pricing.currency} {copy.care.per}</span>
            </p>
          </div>
          <p>{copy.care.text}</p>
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
    </>
  );
}
