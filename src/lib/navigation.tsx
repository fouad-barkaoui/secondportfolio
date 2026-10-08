'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from 'react';

/** Time the outgoing page gets to fade/blur out before the route changes. */
const LEAVE_MS = 230;

interface NavContext {
  /** Animated client navigation: fade the current page out, then push. */
  navigate: (href: string) => void;
  leaving: boolean;
}

const Ctx = createContext<NavContext | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // Pathname we are navigating away from; the page is "leaving" until the route changes.
  const [leavingFrom, setLeavingFrom] = useState<string | null>(null);
  // Reset once the route has changed (React's "adjust state on prop change" pattern),
  // so coming back to a page later never finds it still faded out.
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setLeavingFrom(null);
  }
  const leaving = leavingFrom !== null && leavingFrom === pathname;
  const timer = useRef<number | undefined>(undefined);

  // New route rendered: start it at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const navigate = useCallback(
    (href: string) => {
      const target = new URL(href, window.location.href);
      if (target.pathname === pathname) return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setLeavingFrom(pathname);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => router.push(target.pathname), reduce ? 0 : LEAVE_MS);
    },
    [pathname, router],
  );

  const value = useMemo(() => ({ navigate, leaving }), [navigate, leaving]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNavigation(): NavContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useNavigation must be used inside <NavigationProvider>');
  return ctx;
}

/** A next/link that plays the page-leave animation. Modified clicks keep native behaviour. */
export function NavLink({ href, onClick, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const { navigate } = useNavigation();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(href);
  };
  return <Link href={href} onClick={handle} {...rest} />;
}

/** Wraps the routed content so it can fade out while a navigation is pending. */
export function PageShell({ children }: { children: ReactNode }) {
  const { leaving } = useNavigation();
  return (
    <div className="page-shell" data-leaving={leaving || undefined}>
      {children}
    </div>
  );
}
