import { me, projects } from '@/content/site';
import { NavLink } from '@/lib/navigation';
import { Avatar } from './Avatar';
import { HoverFlow } from './HoverFlow';
import { Tiles } from './Tiles';
import { ExternalLink, Label, Words } from './text';

const d = (ms: number) => ({ '--delay': `${ms}ms` }) as React.CSSProperties;

export function Home() {
  return (
    <main id="content" className="home" aria-label={`About ${me.name}`}>
      <div className="home-column">
        <section className="intro">
          <Avatar />
          <header className="reveal" style={d(15)}>
            <h1>Hey there, I’m {me.name}</h1>
            <p className="subtitle">{me.subtitle}</p>
          </header>

          <HoverFlow className="reveal" style={d(35)}>
            <Words>Currently, I build</Words> <ExternalLink href={projects.kanz.url!} className="c-kanz">Kanz</ExternalLink>{' '}
            <Words>and</Words>{' '}
            <NavLink href="/explorations/" className="c-assas">
              <Label>ASSAS,</Label>
            </NavLink>{' '}
            <Words>a scanner that reviews a whole codebase for security issues. I also turn prompts into products, like my</Words>{' '}
            <ExternalLink href={projects.prompt.url!} className="c-prompt">Prompt Engine.</ExternalLink>
          </HoverFlow>

          <HoverFlow className="reveal" style={d(55)}>
            <Words>
              My edge is problem solving: I break big, messy problems into small steps, and keep learning how systems get built, and how they get attacked.
            </Words>
          </HoverFlow>

          <footer className="contact reveal" style={d(80)}>
            <HoverFlow>
              <span>Say hi via </span>
              <a href={`mailto:${me.email}`}>
                <Label>email</Label>
              </a>
              <span>, </span>
              <ExternalLink href={me.instagram} label={`${me.name} on Instagram`}>Instagram</ExternalLink>
              <span>, or </span>
              <ExternalLink href={me.github} label={`${me.name} on GitHub`}>GitHub</ExternalLink>
              <span>.</span>
            </HoverFlow>
            <span className="signature" role="img" aria-label={`${me.name} signature`}>
              Fouad B.
            </span>
          </footer>

          <Tiles />
        </section>
      </div>
    </main>
  );
}
