"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deckOrder, projects, type Language } from "../content/site";

const AUTOPLAY_MS = 4600;
const MAX_TILT = 10; // grados
const SWIPE_DISTANCE = 56; // px
const SWIPE_VELOCITY = 0.11; // px/ms (umbral de flick)

/**
 * Baraja 3D del hero. El escenario vive en espacio tridimensional real
 * (perspective + preserve-3d): las tarjetas se separan en Z, se inclinan con el
 * puntero y se arrastran con el dedo.
 *
 * Reglas de rendimiento: el puntero y el arrastre NUNCA pasan por el estado de
 * React. Se escriben transforms directamente sobre dos elementos dentro de un
 * rAF, así que mover el mouse no re-renderiza el árbol. Bajo
 * `prefers-reduced-motion` no hay inclinación, ni brillo, ni autoplay.
 */
export default function HeroDeck({ language, viewLabel, deckLabel }: { language: Language; viewLabel: string; deckLabel: string }) {
  const [activeProject, setActiveProject] = useState(0);
  const [paused, setPaused] = useState(false);
  const columnRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLSpanElement>(null);

  // Estado de movimiento fuera de React: se lee y escribe en el rAF.
  const motion = useRef({ tiltX: 0, tiltY: 0, targetX: 0, targetY: 0, drag: 0, frame: 0, dragging: false, awake: false });
  const wake = useRef<() => void>(() => {});
  const gesture = useRef({ startX: 0, startTime: 0, pointerId: -1 });

  const currentProject = projects[deckOrder[activeProject]];
  const positions = useMemo(
    () => deckOrder.map((_, index) => (index - activeProject + deckOrder.length) % deckOrder.length),
    [activeProject],
  );

  const advance = useCallback((delta: number) => {
    setActiveProject((value) => (value + delta + deckOrder.length) % deckOrder.length);
  }, []);

  /**
   * Bucle de render con suspensión: solo corre mientras hay algo que animar.
   * Cuando la baraja vuelve al reposo se detiene sola, para no dejar un rAF
   * eterno consumiendo batería en el teléfono del visitante.
   */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const state = motion.current;
    const render = () => {
      state.tiltX += (state.targetX - state.tiltX) * 0.09;
      state.tiltY += (state.targetY - state.tiltY) * 0.09;
      stage.style.transform = `rotateX(${state.tiltX.toFixed(3)}deg) rotateY(${state.tiltY.toFixed(3)}deg) translate3d(${state.drag.toFixed(1)}px, 0, 0)`;
      if (sheenRef.current) {
        sheenRef.current.style.transform = `translate3d(${(state.tiltY * 6).toFixed(1)}%, ${(state.tiltX * -4).toFixed(1)}%, 0)`;
      }
      const settled =
        !state.dragging &&
        Math.abs(state.targetX - state.tiltX) < 0.01 &&
        Math.abs(state.targetY - state.tiltY) < 0.01 &&
        Math.abs(state.drag) < 0.5;
      if (settled) {
        state.awake = false;
        stage.style.willChange = "auto";
        return;
      }
      state.frame = requestAnimationFrame(render);
    };

    wake.current = () => {
      if (state.awake) return;
      state.awake = true;
      stage.style.willChange = "transform";
      state.frame = requestAnimationFrame(render);
    };

    // Si la pestaña se oculta a media animación, el navegador pausa el rAF:
    // el frame pendiente quedaría en el aire y `will-change` mantendría viva
    // una capa de composición. Se cierra aquí y la baraja vuelve al reposo.
    const handleVisibility = () => {
      if (!document.hidden) return;
      cancelAnimationFrame(state.frame);
      state.awake = false;
      state.dragging = false;
      state.targetX = 0;
      state.targetY = 0;
      state.tiltX = 0;
      state.tiltY = 0;
      state.drag = 0;
      stage.style.transform = "";
      stage.style.willChange = "auto";
      if (sheenRef.current) sheenRef.current.style.transform = "";
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(state.frame);
      state.awake = false;
    };
  }, []);

  // Autoplay: pausa con hover, foco, arrastre o pestaña oculta.
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) advance(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, advance]);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const state = motion.current;
    if (state.dragging) {
      const dx = event.clientX - gesture.current.startX;
      // Fricción creciente: la baraja cede pero no se despega.
      state.drag = Math.sign(dx) * Math.min(Math.abs(dx) * 0.55, 64);
      wake.current();
      return;
    }
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - bounds.left) / bounds.width - 0.5;
    const ny = (event.clientY - bounds.top) / bounds.height - 0.5;
    state.targetY = nx * MAX_TILT * 2;
    state.targetX = -ny * MAX_TILT;
    wake.current();
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    const state = motion.current;
    if (state.dragging) return; // ignora dedos adicionales
    state.dragging = true;
    gesture.current = { startX: event.clientX, startTime: event.timeStamp, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
    wake.current();
    setPaused(true);
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const state = motion.current;
    if (!state.dragging) return;
    state.dragging = false;
    const dx = event.clientX - gesture.current.startX;
    const elapsed = Math.max(event.timeStamp - gesture.current.startTime, 1);
    const velocity = Math.abs(dx) / elapsed;
    state.drag = 0;
    wake.current();
    if (Math.abs(dx) > SWIPE_DISTANCE || velocity > SWIPE_VELOCITY) advance(dx < 0 ? 1 : -1);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function rest() {
    const state = motion.current;
    state.targetX = 0;
    state.targetY = 0;
    state.drag = 0;
    wake.current();
  }

  return (
    <div
      className="deck-col"
      ref={columnRef}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => {
        rest();
        motion.current.dragging = false;
        setPaused(false);
      }}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!columnRef.current?.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      {/* Puntero solamente: inclinar y arrastrar son mejoras de mouse/tacto.
          El teclado opera la baraja desde los puntos, que son botones reales. */}
      <div
        className="deck"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="deck-stage" ref={stageRef}>
          {deckOrder.map((key, index) => (
            <figure
              key={key}
              data-pos={positions[index]}
              style={{ backgroundImage: `url(${projects[key].image})` }}
              role="img"
              aria-label={projects[key].alt[language]}
            >
              <span className="deck-edge" aria-hidden="true" />
            </figure>
          ))}
          <span className="deck-sheen" ref={sheenRef} aria-hidden="true" />
        </div>
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
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") { advance(1); event.preventDefault(); }
                if (event.key === "ArrowLeft") { advance(-1); event.preventDefault(); }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
