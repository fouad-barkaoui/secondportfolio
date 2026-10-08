'use client';

import { AnimatePresence } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Project } from '@/content/site';
import { useNavigation } from '@/lib/navigation';
import { Lightbox, type Rect } from './Lightbox';

const cardAt = (rail: HTMLElement | null, i: number) => rail?.querySelector<HTMLElement>(`[data-index="${i}"]`) ?? null;

/** Card rect if it is on screen, otherwise null (the lightbox then fades instead of flying). */
function visibleRect(el: HTMLElement | null) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const onScreen = r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.top < window.innerHeight;
  return onScreen ? { left: r.left, top: r.top, width: r.width, height: r.height } : null;
}

interface NextPage {
  href: string;
  title: string;
  kind: 'work' | 'explore';
}

/**
 * Horizontal strip of screenshots.
 * - vertical wheel scrolls it sideways until an edge, then the page scrolls
 * - drag with the mouse
 * - keep pulling past the end (on the last strip) to open the next page
 * - click a shot to open it in the lightbox (shared-element animation)
 */
export function Rail({ project, next, delayBase = 0 }: { project: Project; next?: NextPage; delayBase?: number }) {
  const rail = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const suppressClick = useRef(false);
  const { navigate } = useNavigation();
  const [open, setOpen] = useState<number | null>(null);
  const [origin, setOrigin] = useState<Rect | null>(null);
  const [exitTarget, setExitTarget] = useState<Rect | null>(null);

  useEffect(() => {
    const r = rail.current;
    const t = track.current;
    if (!r || !t) return;

    let pull = 0;
    let relax: number | undefined;
    let done = false;
    const maxX = () => r.scrollWidth - r.clientWidth;
    const atEnd = () => r.scrollLeft >= maxX() - 2;
    const atStart = () => r.scrollLeft <= 1;
    const pageAtBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    const paint = () => {
      nextBtn.current?.style.setProperty('--progress', pull.toFixed(3));
      t.style.setProperty('--pull', `${(-pull * 28).toFixed(1)}px`);
    };
    const setPulling = (on: boolean) => {
      for (const el of [t, nextBtn.current]) {
        if (!el) continue;
        if (on) el.setAttribute('data-pulling', '');
        else el.removeAttribute('data-pulling');
      }
    };
    const addPull = (amount: number) => {
      if (!next || done) return;
      pull = Math.min(1, Math.max(0, pull + amount));
      setPulling(true);
      paint();
      window.clearTimeout(relax);
      if (pull >= 1) {
        done = true;
        navigate(next.href);
        return;
      }
      relax = window.setTimeout(() => {
        setPulling(false);
        pull = 0;
        paint();
      }, 160);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || document.querySelector('[data-lightbox-open]')) return;
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = (horizontal ? e.deltaX : e.deltaY) * (e.deltaMode === 1 ? 32 : 1);
      if (delta > 0 && atEnd()) {
        if (next && (horizontal || pageAtBottom())) {
          e.preventDefault();
          addPull(delta / 700);
        }
        return;
      }
      if (delta < 0 && atStart()) return;
      if (!horizontal) {
        e.preventDefault();
        r.scrollLeft += delta;
      }
    };

    let drag: { x: number; left: number; moved: boolean; id: number } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: r.scrollLeft, moved: false, id: e.pointerId };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 5) {
        drag.moved = true;
        r.setPointerCapture(drag.id);
        r.setAttribute('data-dragging', '');
      }
      if (drag.moved) r.scrollLeft = drag.left - dx;
    };
    const onUp = () => {
      if (drag?.moved) {
        suppressClick.current = true;
        window.setTimeout(() => {
          suppressClick.current = false;
          r.removeAttribute('data-dragging');
        }, 0);
      }
      drag = null;
    };

    r.addEventListener('wheel', onWheel, { passive: false });
    r.addEventListener('pointerdown', onDown);
    r.addEventListener('pointermove', onMove);
    r.addEventListener('pointerup', onUp);
    r.addEventListener('pointercancel', onUp);
    return () => {
      window.clearTimeout(relax);
      r.removeEventListener('wheel', onWheel);
      r.removeEventListener('pointerdown', onDown);
      r.removeEventListener('pointermove', onMove);
      r.removeEventListener('pointerup', onUp);
      r.removeEventListener('pointercancel', onUp);
    };
  }, [next, navigate]);

  const openRef = useRef<number | null>(null);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const step = useCallback(
    (dir: 1 | -1) => {
      const i = openRef.current;
      if (i === null) return;
      const n = i + dir;
      if (n < 0 || n >= project.screens.length) return;
      // bring the target card into view so the shot animates from where it lives
      cardAt(rail.current, n)?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'instant' });
      setOpen(n);
    },
    [project.screens.length],
  );

  const close = useCallback(() => {
    const i = openRef.current;
    const card = i === null ? null : cardAt(rail.current, i);
    setExitTarget(visibleRect(card));
    setOpen(null);
    if (card) window.setTimeout(() => card.focus({ preventScroll: true }), 0);
  }, []);

  return (
    <>
      <div ref={rail} className="rail" role="region" aria-label={`${project.name} screens`} tabIndex={0}>
        <div ref={track} className="track">
          <div className="rail-lead" aria-hidden="true" />
          {project.screens.map((s, i) => (
            <figure
              key={s.file}
              className="piece reveal"
              style={{ '--ratio': (s.width / s.height).toFixed(4), '--delay': `${Math.min(70 + i * 35, 140) + delayBase}ms` } as React.CSSProperties}
            >
              <button
                type="button"
                className="card"
                data-index={i}
                aria-label={`Open: ${s.caption}`}
                data-open={open === i || undefined}
                onClick={(e) => {
                  if (suppressClick.current) return;
                  setOrigin(visibleRect(e.currentTarget));
                  setOpen(i);
                }}
              >
                <div className="shot">
                  {/* eslint-disable-next-line @next/next/no-img-element -- fixed-height rail; next/image adds nothing in a static export */}
                  <img src={s.file} width={s.width} height={s.height} alt={s.alt} draggable={false} decoding="async" loading={i < 3 ? 'eager' : 'lazy'} />
                </div>
              </button>
              <figcaption>{s.caption}</figcaption>
            </figure>
          ))}
          {next && (
            <div className="rail-end reveal" style={{ '--delay': '140ms' } as React.CSSProperties}>
              <button
                ref={nextBtn}
                type="button"
                className="next"
                aria-label={`Next page: ${next.title}`}
                data-kind={next.kind}
                onClick={() => navigate(next.href)}
              >
                <span className="next-content">
                  <span className="next-swatch" />
                  <span>{next.title}</span>
                </span>
                <span className="next-arrow" aria-hidden="true">
                  <svg width="6" height="11" viewBox="0 0 6 11" fill="none">
                    <path d="M.7 10.4a.7.7 0 0 1-.5-1.2l4.1-4L.2 1.2A.7.7 0 0 1 1.2.2l4.5 4.5a.7.7 0 0 1 0 1L1.2 10.2a.7.7 0 0 1-.5.2Z" fill="currentColor" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence custom={exitTarget}>
        {open !== null && <Lightbox key="lightbox" project={project} index={open} origin={origin} onClose={close} onStep={step} />}
      </AnimatePresence>
    </>
  );
}
