'use client';

import { AnimatePresence, motion, type Variants } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '@/content/site';

/** Card rectangle the lightbox grows out of / shrinks back into. */
export type Rect = { left: number; top: number; width: number; height: number };

type Box = Rect;

const EASE_OPEN = [0.22, 0.8, 0.2, 1] as const;
const EASE_CLOSE = [0.34, 0, 0.2, 1] as const;

function fit(w: number, h: number, vw: number, vh: number): Box {
  const pad = vw < 700 ? 16 : 48;
  const scale = Math.min((vw - pad * 2) / w, (vh - pad * 2 - 56) / h, 1.6);
  const width = Math.round(w * scale);
  const height = Math.round(h * scale);
  return { left: Math.round((vw - width) / 2), top: Math.round((vh - height - 44) / 2), width, height };
}

/** Transform that makes `box` look like it sits exactly on `rect`. */
const toRect = (rect: Rect | null, box: Box) =>
  rect
    ? { x: rect.left - box.left, y: rect.top - box.top, scaleX: rect.width / box.width, scaleY: rect.height / box.height, opacity: 1 }
    : { x: 0, y: 12, scaleX: 0.96, scaleY: 0.96, opacity: 0 };

export function Lightbox({
  project,
  index,
  origin,
  onClose,
  onStep,
}: {
  project: Project;
  index: number;
  /** where the shot was when it was opened */
  origin: Rect | null;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const shot = project.screens[index]!;
  const [viewport, setViewport] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const box = fit(shot.width, shot.height, viewport.w, viewport.h);
  const stage = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    // capture phase, so global shortcuts never see keys while the lightbox is open
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onStep(1);
      else if (e.key === 'ArrowLeft') onStep(-1);
      else if (e.key !== 'Tab') return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.key === 'Tab') stage.current?.focus();
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) > 4) onClose();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('wheel', onWheel, { passive: false });
    document.body.setAttribute('data-lightbox-open', '');
    stage.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('wheel', onWheel);
      document.body.removeAttribute('data-lightbox-open');
    };
  }, [onClose, onStep]);

  // grow from the card on open; shrink back into whichever card is current on close (passed via AnimatePresence `custom`)
  const stageVariants: Variants = {
    from: () => toRect(origin, box),
    open: { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, transition: { duration: 0.42, ease: EASE_OPEN } },
    exit: (target: Rect | null) => ({ ...toRect(target, box), transition: { duration: 0.28, ease: EASE_CLOSE } }),
  };

  const swipe = useRef<number | null>(null);

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={shot.caption}
      onPointerDown={(e) => {
        if (e.pointerType !== 'mouse') swipe.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (swipe.current === null) return;
        const dx = e.clientX - swipe.current;
        swipe.current = null;
        if (Math.abs(dx) > 40) onStep(dx < 0 ? 1 : -1);
      }}
    >
      <motion.div
        className="lightbox-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.36, ease: [0.16, 1, 0.3, 1] } }}
        exit={{ opacity: 0, transition: { duration: 0.26 } }}
      />
      <motion.button
        ref={stage}
        type="button"
        className="lightbox-stage"
        aria-label="Close"
        onClick={onClose}
        variants={stageVariants}
        initial="from"
        animate="open"
        exit="exit"
        style={{ originX: 0, originY: 0, left: box.left, top: box.top, width: box.width, height: box.height }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={shot.file}
            className="shot"
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)', transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- sized by the stage, no optimisation needed */}
            <img src={shot.file} width={shot.width} height={shot.height} alt={shot.alt} draggable={false} />
          </motion.div>
        </AnimatePresence>
      </motion.button>
      <motion.p
        className="lightbox-caption"
        style={{ top: box.top + box.height + 14 }}
        initial={{ opacity: 0, y: 3, filter: 'blur(3px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: 0.12, duration: 0.35 } }}
        exit={{ opacity: 0, transition: { duration: 0.12 } }}
        aria-live="polite"
      >
        <span>
          {shot.caption}
          <span className="lightbox-count">
            {index + 1} / {project.screens.length}
          </span>
        </span>
      </motion.p>
    </div>,
    document.body,
  );
}
