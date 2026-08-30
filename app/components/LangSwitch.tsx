"use client";

import type { Language } from "../content/site";

export default function LangSwitch({ language }: { language: Language }) {
  function remember(next: Language) {
    try {
      window.localStorage.setItem("ethrovs-language", next);
      window.localStorage.setItem("ethrovs-language-manual", "1");
    } catch {
      // storage unavailable (private mode); navigation still works
    }
  }

  // Cada idioma vive bajo su propio root layout (<html lang>), así que el
  // cambio de idioma debe ser una carga completa de documento; el router
  // cliente de vinext beta no navega entre root layouts (RSC prefetch error).
  /* eslint-disable @next/next/no-html-link-for-pages */
  return (
    <div className="lang" role="group" aria-label="Language">
      <a href="/" aria-current={language === "es" ? "page" : undefined} onClick={() => remember("es")} lang="es">ES</a>
      <a href="/en" aria-current={language === "en" ? "page" : undefined} onClick={() => remember("en")} lang="en">EN</a>
    </div>
  );
  /* eslint-enable @next/next/no-html-link-for-pages */
}
