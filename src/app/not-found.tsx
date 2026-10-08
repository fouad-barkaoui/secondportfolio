import { NavLink } from '@/lib/navigation';

export default function NotFound() {
  return (
    <main id="content" className="home">
      <div className="home-column">
        <section className="intro">
          <h1 className="reveal">Nothing here.</h1>
          <p className="subtitle reveal">This page doesn’t exist.</p>
          <p className="reveal">
            <NavLink href="/" className="text-link">
              Back home
            </NavLink>
          </p>
        </section>
      </div>
    </main>
  );
}
