import { projects, workOrder, type Language } from "../content/site";
import type { SiteCopy } from "../content/es";

export default function Work({ copy, language }: { copy: SiteCopy["work"]; language: Language }) {
  return (
    <section className="sec wrap" id="trabajo">
      <div className="sec-head">
        <h2>{copy.title}</h2>
        <p className="label">{copy.label}</p>
      </div>
      <div className="work-grid">
        {workOrder.map((key, index) => {
          const project = projects[key];
          return (
            <a className={`case rv${key === "ciao" ? " case--wide" : ""}`} href={project.href} target="_blank" rel="noreferrer" key={key}>
              <div className="case-shot">
                <img
                  className="img"
                  src={project.image}
                  alt={project.alt[language]}
                  width={1600}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                />
                <span className="go" aria-hidden="true">↗</span>
              </div>
              <div className="case-bar">
                <span className="idx">{String(index + 1).padStart(2, "0")}</span>
                <p className="label">{project.category[language]}</p>
              </div>
              <h3>{project.name}</h3>
              <p>{copy.descriptions[key]}</p>
              <span className="live">{copy.visit} <span className="arw">↗</span></span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
