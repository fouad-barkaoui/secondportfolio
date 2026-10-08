'use client';

import { useThemeToggle } from '@/lib/theme';

/** Sun ⇄ moon. The icon morph is pure CSS keyed on html[data-theme], so it never flashes on load. */
export function ThemeToggle() {
  const { theme, toggle, mounted } = useThemeToggle();
  const label = mounted ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode` : 'Switch colour theme';

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      title={`${label} (T)`}
      aria-keyshortcuts="T"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <mask id="moon-cut">
          <rect width="24" height="24" fill="#fff" />
          <circle className="theme-toggle-cut" cx="30" cy="-2" r="7" fill="#000" />
        </mask>
        <circle className="theme-toggle-core" cx="12" cy="12" r="5" fill="currentColor" mask="url(#moon-cut)" />
        <g className="theme-toggle-rays" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M4.8 19.2l1.7-1.7M17.5 6.5l1.7-1.7" />
        </g>
      </svg>
    </button>
  );
}
