"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { deckOrder, projects, type Language } from "../content/site";

export default function HeroDeck({ language, viewLabel, deckLabel }: { language: Language; viewLabel: string; deckLabel: string }) {
  const [activeProject, setActiveProject] = useState(0);
  const [paused, setPaused] = useState(false);
  const columnRef = useRef<HTMLDivElement>(null);
  const currentProject = projects[deckOrder[activeProject]];

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActiveProject((value) => (value + 1) % deckOrder.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [paused]);

  const positions = useMemo(
    () => deckOrder.map((_, index) => (index - activeProject + deckOrder.length) % deckOrder.length),
    [activeProject],
  );

  return (
    <div
      className="deck-col"
      ref={columnRef}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!columnRef.current?.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="deck">
        {deckOrder.map((key, index) => (
          <figure
            key={key}
            data-pos={positions[index]}
            style={{ backgroundImage: `url(${projects[key].image})` }}
            role="img"
            aria-label={projects[key].alt[language]}
          />
        ))}
      </div>
      <div className="deck-meta">
        <div>
          <p className="label">{currentProject.category[language]}</p>
          <p className="deck-name">{currentProject.name}</p>
        </div>
        <div className="deck-dots" role="group" aria-label={deckLabel}>
          {deckOrder.map((key, index) => (
            <button
              key={key}
              type="button"
              aria-label={`${viewLabel} ${projects[key].name}`}
              aria-current={activeProject === index}
              onClick={() => setActiveProject(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
