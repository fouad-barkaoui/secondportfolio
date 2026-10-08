import { Fragment } from 'react';

/** Plain text split into word spans so neighbours can slide around a hovered link. */
export function Words({ children }: { children: string }) {
  const parts = children.split(' ').filter(Boolean);
  return (
    <>
      {parts.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span>{w}</span>
        </Fragment>
      ))}
    </>
  );
}

/** Link text with the rainbow sheen that sweeps across on hover. */
export function Label({ children }: { children: string }) {
  return (
    <span className="label">
      <span>{children}</span>
      <span className="label-sheen" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

export function ExternalLink({ href, className, label, children }: { href: string; className?: string; label?: string; children: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer" aria-label={label}>
      <Label>{children}</Label>
    </a>
  );
}
