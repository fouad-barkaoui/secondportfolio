'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * When a link inside the paragraph is hovered it scales up slightly; the words
 * on the same line slide apart to make room instead of being overlapped.
 */
export function HoverFlow({ className = '', style, children }: { className?: string; style?: React.CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const links = Array.from(p.querySelectorAll<HTMLAnchorElement>(':scope > a'));
    const clear = () => p.querySelectorAll(':scope > [data-side]').forEach((n) => n.removeAttribute('data-side'));
    const enter = (a: HTMLAnchorElement) => {
      const kids = Array.from(p.children) as HTMLElement[];
      const index = kids.indexOf(a);
      p.style.setProperty('--room', `${Math.max(1, a.offsetWidth * 0.015)}px`);
      kids.forEach((n, j) => {
        if (j === index || Math.abs(n.offsetTop - a.offsetTop) > 4) return;
        n.setAttribute('data-side', j < index ? 'before' : 'after');
      });
    };
    const offs = links.map((a) => {
      const on = () => enter(a);
      a.addEventListener('mouseenter', on);
      a.addEventListener('focus', on);
      a.addEventListener('mouseleave', clear);
      a.addEventListener('blur', clear);
      return () => {
        a.removeEventListener('mouseenter', on);
        a.removeEventListener('focus', on);
        a.removeEventListener('mouseleave', clear);
        a.removeEventListener('blur', clear);
      };
    });
    return () => offs.forEach((off) => off());
  }, []);

  return (
    <p ref={ref} className={`flow ${className}`} style={style}>
      {children}
    </p>
  );
}
