'use client';

import dynamic from 'next/dynamic';

/** three.js is ~150 kB; load it after hydration and never on the server. */
export const SignalFieldLoader = dynamic(() => import('./SignalField').then((m) => m.SignalField), {
  ssr: false,
  loading: () => null,
});
