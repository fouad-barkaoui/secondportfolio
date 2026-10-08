import type { NextConfig } from 'next';

/**
 * Fully static export: the site is plain HTML/CSS/JS in `out/`
 * and runs on any static host (Vercel, Netlify, GitHub Pages, nginx).
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  // don't write AGENTS.md into the project on `next dev`
  agentRules: false,
};

export default nextConfig;
