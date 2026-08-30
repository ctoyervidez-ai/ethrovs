"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deckOrder, projects, type Language } from "../content/site";

const AUTOPLAY_MS = 4600;
const MAX_TILT = 10; // grados
const SWIPE_DISTANCE = 56; // px
const SWIPE_VELOCITY = 0.11; // px/ms (umbral de flick)
const EXIT_MS = 700;

/**
 * Resorte. Valores elegidos simulando el integrador, no a ojo: con
 * rigidez 300 y amortiguación 26 (razón de amortiguamiento 0.75) el
 * escenario vuelve al centro en 0.30 s con un sobrepaso de 0.11 grados
 * (vida, sin rebote de juguete) y sigue al cursor con 2 grados de retraso.
 * Bajarlo a 168/22 lo hacía flotar medio segundo; subirlo más lo endurecía
 * sin ganar nada perceptible.
 */
const STIFFNESS = 300;
const DAMPING = 26;
// Velocidad del gesto heredada al resorte. Con 1600, un flick suave llega a
// 40 px y uno fuerte a 84 px, y ambos asientan en ~0.32 s: la fuerza del
// gesto se ve, sin alargar la animación.
const FLICK_CARRY = 1600;
const FLICK_CAP = 2200;
const GRAB_SCALE = 0.982;

type Direction = "fwd" | "back";

/**
 * Baraja 3D del hero.
 *
 * Movimiento: un integrador de resorte corre en rAF y escribe transforms
 * directamente sobre el escenario. El puntero NUNCA pasa por el estado de
 * React, así que mover el mouse no re-renderiza nada. El bucle se suspende
 * solo al llegar al reposo.
 *
 * Profundidad: las tarjetas viven separadas en Z bajo `preserve-3d`, así que
 * la perspectiva produce el paralaje sola: al inclinar o arrastrar el
 * escenario, las tarjetas del fondo se desplazan menos en pantalla que la de
 * enfrente. No hace falta animarlas por separado.
 */
export default function HeroDeck({ language, viewLabel, deckLabel }: { language: Language; viewLabel: string; deckLabel: string }) {
  const [activeProject, setActiveProject] = useState(0);
  const [paused, setPaused] = useState(false);
  const [exiting, setExiting] = useState<{ key: string; dir: Direction } | null>(null);

  const columnRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sheensRef = useRef<HTMLElement[]>([]);

  // Estado físico fuera de React: posición, velocidad y objetivo por eje.
  const motion = useRef({
    tiltX: 0, tiltY: 0, velX: 0, velY: 0, targetX: 0, targetY: 0,
    drag: 0, dragVel: 0, dragTarget: 0,
    scale: 1, scaleTarget: 1,
    frame: 0, last: 0, dragging: false, awake: false,
  });
  const gesture = useRef({ startX: 0, startTime: 0, lastX: 0, lastTime: 0, velocity: 0 });
  const wake = useRef<() => void>(() => {});
  const activeRef = useRef(0);
  const exitTimer = useRef(0);

  const currentProject = projects[deckOrder[activeProject]];
  const positions = useMemo(
    () => deckOrder.map((_, index) => (index - activeProject + deckOrder.length) % deckOrder.length),
    [activeProject],
  );

  useEffect(() => { activeRef.current = activeProject; }, [activeProject]);

  /**
   * Cambia de tarjeta marcando la saliente con su dirección, para que salga
   * volando hacia ese lado en vez de solo desvanecerse.
   */
  const goTo = useCallback((nextIndex: number, dir: Direction) => {
    const current = activeRef.current;
    if (nextIndex === current) return;
    setExiting({ key: deckOrder[current], dir });
    window.clearTimeout(exitTimer.current);
    exitTimer.current = window.setTimeout(() => setExiting(null), EXIT_MS);
    setActiveProject(nextIndex);
  }, []);

  const advance = useCallback((delta: number) => {
    const next = (activeRef.current + delta + deckOrder.length) % deckOrder.length;
    goTo(next, delta > 0 ? "fwd" : "back");
  }, [goTo]);

  useEffect(() => () => window.clearTimeout(exitTimer.current), []);

  // Integrador de resorte. Se duerme al asentarse y apaga will-change.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const state = motion.current;
    sheensRef.current = Array.from(stage.querySelectorAll<HTMLElement>(".deck-sheen"));

    const step = (value: number, velocity: number, target: number, dt: number) => {
      const accel = -STIFFNESS * (value - target) - DAMPING * velocity;
      const nextVel = velocity + accel * dt;
      return [value + nextVel * dt, nextVel] as const;
    };

    const render = (now: number) => {
      // dt real, acotado: tras un frame perdido no se dispara la simulación.
      const dt = Math.min((now - (state.last || now)) / 1000, 1 / 30) || 1 / 60;
      state.last = now;

      [state.tiltX, state.velX] = step(state.tiltX, state.velX, state.targetX, dt);
      [state.tiltY, state.velY] = step(state.tiltY, state.velY, state.targetY, dt);
      [state.drag, state.dragVel] = step(state.drag, state.dragVel, state.dragTarget, dt);
      state.scale += (state.scaleTarget - state.scale) * Math.min(dt * 12, 1);

      stage.style.transform =
        `rotateX(${state.tiltX.toFixed(3)}deg) rotateY(${state.tiltY.toFixed(3)}deg) ` +
        `translate3d(${state.drag.toFixed(2)}px, 0, 0) scale(${state.scale.toFixed(4)})`;
      const glare = `translate3d(${(state.tiltY * 3.4 + state.drag * 0.3).toFixed(1)}%, ${(state.tiltX * -2.4).toFixed(1)}%, 0)`;
      for (const sheen of sheensRef.current) sheen.style.transform = glare;

      // Umbrales por debajo de lo perceptible (0.05 grados, 0.15 px): dormir
      // ahí ahorra frames sin que se note un corte.
      const still =
        Math.abs(state.targetX - state.tiltX) < 0.05 && Math.abs(state.velX) < 0.2 &&
        Math.abs(state.targetY - state.tiltY) < 0.05 && Math.abs(state.velY) < 0.2 &&
        Math.abs(state.dragTarget - state.drag) < 0.15 && Math.abs(state.dragVel) < 0.6 &&
        Math.abs(state.scaleTarget - state.scale) < 0.001;

      if (still && !state.dragging) {
        state.awake = false;
        state.last = 0;
        stage.style.willChange = "auto";
        return;
      }
      state.frame = requestAnimationFrame(render);
    };

    wake.current = () => {
      if (state.awake) return;
      state.awake = true;
      state.last = 0;
      stage.style.willChange = "transform";
      state.frame = requestAnimationFrame(render);
    };

    // Si la pestaña se oculta a media animación el navegador pausa el rAF: se
    // cancela el frame pendiente y se libera la capa de composición.
    const handleVisibility = () => {
      if (!document.hidden) return;
      cancelAnimationFrame(state.frame);
      Object.assign(state, {
        awake: false, dragging: false, last: 0,
        tiltX: 0, tiltY: 0, velX: 0, velY: 0, targetX: 0, targetY: 0,
        drag: 0, dragVel: 0, dragTarget: 0, scale: 1, scaleTarget: 1,
      });
      stage.style.transform = "";
      stage.style.willChange = "auto";
      for (const sheen of sheensRef.current) sheen.style.transform = "";
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
      state.dragTarget = Math.sign(dx) * Math.min(Math.abs(dx) * 0.6, 72);
      // Velocidad instantánea, para que un flick corto pero rápido cuente.
      const dt = event.timeStamp - gesture.current.lastTime;
      if (dt > 0) gesture.current.velocity = (event.clientX - gesture.current.lastX) / dt;
      gesture.current.lastX = event.clientX;
      gesture.current.lastTime = event.timeStamp;
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
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const state = motion.current;
    if (state.dragging) return; // ignora dedos adicionales
    state.dragging = true;
    state.scaleTarget = GRAB_SCALE; // retroalimentación táctil: la baraja cede al agarrarla
    gesture.current = {
      startX: event.clientX, startTime: event.timeStamp,
      lastX: event.clientX, lastTime: event.timeStamp, velocity: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    wake.current();
    setPaused(true);
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const state = motion.current;
    if (!state.dragging) return;
    state.dragging = false;
    state.scaleTarget = 1;

    const dx = event.clientX - gesture.current.startX;
    const elapsed = Math.max(event.timeStamp - gesture.current.startTime, 1);
    // Se toma la mayor entre la velocidad instantánea y el promedio del gesto.
    const velocity = Math.max(Math.abs(gesture.current.velocity), Math.abs(dx) / elapsed);
    const flick = velocity > SWIPE_VELOCITY && Math.abs(dx) > 8;

    if (Math.abs(dx) > SWIPE_DISTANCE || flick) {
      // La velocidad del gesto se hereda al resorte: entre más fuerte el
      // arrastre, más lejos llega la baraja antes de regresar.
      state.dragVel = Math.sign(dx) * Math.min(velocity * FLICK_CARRY, FLICK_CAP);
      advance(dx < 0 ? 1 : -1);
    }
    state.dragTarget = 0;
    wake.current();

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function rest() {
    const state = motion.current;
    state.targetX = 0;
    state.targetY = 0;
    state.dragTarget = 0;
    state.scaleTarget = 1;
    wake.current();
  }

  return (
    <div
      className="deck-col"
      ref={columnRef}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => {
        motion.current.dragging = false;
        rest();
        setPaused(false);
      }}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!columnRef.current?.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      {/* Puntero solamente: inclinar y arrastrar son mejoras de mouse/tacto.
          El teclado opera la baraja con flechas desde los puntos, que son
          botones reales. */}
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
              data-exit={exiting?.key === key ? exiting.dir : undefined}
              style={{ backgroundImage: `url(${projects[key].image})` }}
              role="img"
              aria-label={projects[key].alt[language]}
            >
              <span className="deck-sheen" aria-hidden="true" />
              <span className="deck-edge" aria-hidden="true" />
            </figure>
          ))}
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
              onClick={() => goTo(index, index > activeRef.current ? "fwd" : "back")}
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
