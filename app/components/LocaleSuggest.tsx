"use client";

import { useEffect, useState } from "react";
import type { Language } from "../content/site";
import type { SiteCopy } from "../content/es";

/**
 * Discreet banner suggesting the other language when geolocation disagrees
 * with the page's locale. Never redirects on its own; a manual choice (via
 * this banner or the nav toggle) is remembered and stops future suggestions.
 */
export default function LocaleSuggest({ language, copy }: { language: Language; copy: SiteCopy["suggest"] }) {
  const [visible, setVisible] = useState(false);
  const otherHref = language === "es" ? "/en" : "/";
  const otherLanguage: Language = language === "es" ? "en" : "es";

  useEffect(() => {
    try {
      if (window.localStorage.getItem("ethrovs-language-manual") === "1") return;
    } catch {
      // storage unavailable; fall through to the geo check
    }
    const controller = new AbortController();
    fetch("/api/locale", { cache: "no-store", signal: controller.signal })
      .then(async (response) => (response.ok ? ((await response.json()) as { language?: string }) : null))
      .then((data) => {
        if (data?.language && data.language !== language) setVisible(true);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [language]);

  function remember(next: Language) {
    try {
      window.localStorage.setItem("ethrovs-language", next);
      window.localStorage.setItem("ethrovs-language-manual", "1");
    } catch {
      // storage unavailable
    }
  }

  if (!visible) return null;

  return (
    <div className="locale-suggest" lang={otherLanguage} role="status">
      <p>{copy.text}</p>
      <div className="locale-suggest-actions">
        <a href={otherHref} onClick={() => remember(otherLanguage)}>{copy.cta}</a>
        <button
          type="button"
          lang={language}
          onClick={() => {
            remember(language);
            setVisible(false);
          }}
        >
          {copy.dismiss}
        </button>
      </div>
    </div>
  );
}
