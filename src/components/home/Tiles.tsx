'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { pageOrder, pages, type PageId } from '@/content/site';
import { NavLink } from '@/lib/navigation';

function Tile({ id, offset }: { id: PageId; offset: number }) {
  const page = pages[id];
  const [active, setActive] = useState(0);

  // crossfade between the two previews; tiles are offset so they never swap together
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => setActive((n) => (n + 1) % page.previews.length), 3200);
    }, offset);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [offset, page.previews.length]);

  return (
    <NavLink
      href={page.href}
      className={`tile tile--${page.kind}`}
      data-page={id}
      aria-label={page.title}
      aria-keyshortcuts={page.key}
      aria-describedby="tile-help"
      draggable={false}
    >
      <span className="tile-preview" aria-hidden="true">
        {page.previews.map((src, i) => (
          <Image key={src} src={src} alt="" fill sizes="200px" draggable={false} data-active={i === active} priority={i === 0} />
        ))}
      </span>
      <span className="tile-label" aria-hidden="true">
        {page.title} <span className="shortcut">[{page.key}]</span>
      </span>
      <kbd className="tile-key" aria-hidden="true">
        {page.key}
      </kbd>
    </NavLink>
  );
}

/** The two square doors on the home page, with a label that follows the cursor. */
export function Tiles() {
  const nav = useRef<HTMLElement>(null);
  const tip = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState<PageId | null>(null);

  useEffect(() => {
    const el = nav.current;
    const label = tip.current;
    if (!el || !label) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const tile = (e.target as HTMLElement).closest<HTMLElement>('.tile');
      if (!tile) return hide();
      label.style.setProperty('--x', `${e.clientX}px`);
      label.style.setProperty('--y', `${e.clientY}px`);
      label.style.fontSize = `${Math.round(tile.clientWidth * 0.06)}px`;
      setHovered(tile.dataset.page as PageId);
    };
    const hide = () => setHovered(null);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', hide);
    el.addEventListener('click', hide);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', hide);
      el.removeEventListener('click', hide);
    };
  }, []);

  const shown = hovered ? pages[hovered] : null;
  return (
    <nav ref={nav} className="tiles reveal" style={{ '--delay': '100ms' } as React.CSSProperties} aria-label="Explore" data-pointer={hovered ? '' : undefined}>
      {pageOrder.map((id, n) => (
        <Tile key={id} id={id} offset={n * 1600} />
      ))}
      <span className="sr-only" id="tile-help">
        Click or press Enter to open. Press S for Selected work or E for Explorations.
      </span>
      <span ref={tip} className="cursor-label" data-kind={shown?.kind} data-on={shown ? '' : undefined} aria-hidden="true">
        {shown && (
          <>
            {shown.title} <span className="shortcut">[{shown.key}]</span>
          </>
        )}
      </span>
    </nav>
  );
}
