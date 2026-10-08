'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { pageOrder, pages } from '@/content/site';
import { useNavigation } from '@/lib/navigation';
import { useThemeToggle } from '@/lib/theme';

/**
 * S → Selected work, E → Explorations (same key again = home),
 * Esc → home, T → toggle theme. Ignored while typing or with modifiers;
 * the lightbox swallows keys while it is open.
 */
export function KeyboardShortcuts() {
  const pathname = usePathname();
  const { navigate } = useNavigation();
  const { toggle } = useThemeToggle();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (document.querySelector('[data-lightbox-open]')) return;

      const key = e.key.toLowerCase();
      const onHome = pathname === '/';
      if (key === 'escape' && !onHome) {
        e.preventDefault();
        navigate('/');
        return;
      }
      if (key === 't') {
        e.preventDefault();
        toggle();
        return;
      }
      const hit = pageOrder.find((id) => pages[id].key.toLowerCase() === key);
      if (!hit) return;
      e.preventDefault();
      const page = pages[hit];
      navigate(pathname === page.href || pathname === page.href.slice(0, -1) ? '/' : page.href);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pathname, navigate, toggle]);

  return null;
}
