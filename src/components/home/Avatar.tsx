'use client';

import Image from 'next/image';
import { useState } from 'react';
import { me } from '@/content/site';

const INKS = [
  ['#00b443', 'green'],
  ['#1800ff', 'blue'],
  ['#e838ff', 'magenta'],
  ['#ff3b3b', 'red'],
  ['#32a5ff', 'sky'],
  ['#efb94f', 'amber'],
] as const;

/** Hover wipes a colour square over the photo; each click picks the next colour. */
export function Avatar() {
  const [i, setI] = useState(0);
  const [color, name] = INKS[i % INKS.length]!;
  return (
    <button
      type="button"
      className="avatar reveal"
      style={{ '--ink-color': color } as React.CSSProperties}
      aria-label={`${me.name} photo: ${name}. Click to change fill colour`}
      onClick={() => setI((n) => n + 1)}
    >
      <Image src="/assets/avatar.jpg" alt="" width={32} height={32} priority draggable={false} />
    </button>
  );
}
