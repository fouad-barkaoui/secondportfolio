'use client';

import { useTheme } from 'next-themes';
import { useCallback, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

const subscribe = () => () => {};
/** true once hydrated — avoids rendering theme-dependent text on the server. */
export const useMounted = () => useSyncExternalStore(subscribe, () => true, () => false);

/**
 * Light/dark switch with a circular "ink" reveal that grows from the
 * point you clicked (View Transitions API), falling back to an instant swap.
 */
export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const current: Theme = resolvedTheme === 'dark' ? 'dark' : 'light';

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;
      const apply = () => {
        root.setAttribute('data-theme', next);
        root.style.colorScheme = next;
        setTheme(next);
      };

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce || typeof document.startViewTransition !== 'function') {
        apply();
        return;
      }

      const x = origin?.x ?? window.innerWidth - 40;
      const y = origin?.y ?? 40;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

      root.dataset.themeSwitch = '';
      const transition = document.startViewTransition(apply);
      transition.ready
        .then(() => {
          root.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 560, easing: 'cubic-bezier(.22, 1, .36, 1)', pseudoElement: '::view-transition-new(root)' },
          );
        })
        .catch(() => {});
      transition.finished.finally(() => delete root.dataset.themeSwitch);
    },
    [current, setTheme],
  );

  return { theme: current, toggle, mounted };
}
