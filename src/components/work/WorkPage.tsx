import { pages, projects, type PageId } from '@/content/site';
import { NavLink } from '@/lib/navigation';
import { Rail } from './Rail';

const d = (ms: number) => ({ '--delay': `${ms}ms` }) as React.CSSProperties;

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m6.5 3-4 4 4 4M3 7h6a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m4 12 8-8M4 4h8v8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KeyGlyph({ letter }: { letter: string }) {
  return (
    <svg className="back-key" width="18" height="16" viewBox="0 0 22 20" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M4.5 2.5h-3v15h3M17.5 2.5h3v15h-3" />
      <text x="11" y="14.6" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none">
        {letter}
      </text>
    </svg>
  );
}

export function WorkPage({ pageId }: { pageId: PageId }) {
  const page = pages[pageId];
  const next = pages[page.next];

  return (
    <main id="content" className={`work work--${page.kind}`} aria-label={page.title}>
      <div className="work-layout">
        {page.projects.map((id, n) => {
          const p = projects[id];
          const Heading = n === 0 ? 'h1' : 'h2';
          const last = n === page.projects.length - 1;
          return (
            <section key={id} className="project" aria-labelledby={`t-${id}`}>
              <div className="work-intro">
                <header className="work-heading reveal" style={d(n * 60)}>
                  <div className="heading-row">
                    {n === 0 && (
                      <div className="back-group">
                        <NavLink href="/" className="back" aria-keyshortcuts={`${page.key} Escape`}>
                          <BackIcon />
                          Back
                        </NavLink>
                        <span className="back-section">{page.title.toUpperCase()}</span>
                        <KeyGlyph letter={page.key} />
                      </div>
                    )}
                    <Heading id={`t-${id}`}>
                      {p.url ? (
                        <a href={p.url} target="_blank" rel="noreferrer">
                          {p.name}
                          <OutIcon />
                        </a>
                      ) : (
                        <span className="title">{p.name}</span>
                      )}
                      <span className="status">{p.status}</span>
                    </Heading>
                    <span className="years">{p.years}</span>
                  </div>
                </header>
                <p className="summary reveal" style={d(35 + n * 60)}>
                  {p.summary}
                </p>
              </div>
              <Rail project={p} delayBase={n * 60} next={last ? { href: next.href, title: next.title, kind: next.kind } : undefined} />
            </section>
          );
        })}
      </div>
      <span className="sr-only">Press Escape to return home.</span>
    </main>
  );
}
