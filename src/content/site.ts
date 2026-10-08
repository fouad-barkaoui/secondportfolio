/**
 * Every word and screenshot on the site lives here.
 * Source: the first portfolio (src/content/content.ts). Nothing invented.
 */

export const SITE_URL = 'https://fouad-barkaoui.vercel.app';

export const me = {
  name: 'Fouad Barkaoui',
  subtitle: 'a SOC analyst & developer based in Morocco',
  description:
    'Fouad Barkaoui is a SOC analyst and fullstack developer from Morocco, building products that are secure by default.',
  email: 'fouadbr2001@gmail.com',
  instagram: 'https://www.instagram.com/heyfouad/',
  github: 'https://github.com/fouad-barkaoui',
  linkedin: 'https://www.linkedin.com/in/fouad-barkaoui/',
} as const;

export type ProjectId = 'kanz' | 'prompt' | 'assas' | 'studio';

export interface Screen {
  file: string;
  width: number;
  height: number;
  caption: string;
  alt: string;
}

export interface Project {
  id: ProjectId;
  name: string;
  url?: string;
  status: string;
  years: string;
  summary: string;
  screens: readonly Screen[];
}

const s = (file: string, width: number, height: number, caption: string, alt: string): Screen => ({
  file: `/assets/${file}.avif`,
  width,
  height,
  caption,
  alt,
});

export const projects: Record<ProjectId, Project> = {
  kanz: {
    id: 'kanz',
    name: 'Kanz',
    url: 'https://kanz-workspace.vercel.app',
    status: 'Live',
    years: '09.26 - Now',
    summary:
      'A private workspace that keeps notes, tasks, articles, courses, docs and analytics on one spatial canvas. It works offline first and syncs through Supabase, with row-level security on every table.',
    screens: [
      s('news-dark', 2400, 1500, 'News feed: dark theme', 'Kanz News page in dark theme: a "Welcome to Kanz" card with three first steps, next to cards for Pro and the Salary Planner beta.'),
      s('arabic-rtl', 1800, 1125, 'Arabic: full right-to-left layout', 'The same News page in Arabic, with the sidebar and every card mirrored right to left.'),
      s('salary-light', 1800, 1125, 'Salary Planner public preview: light theme', 'Salary Planner preview in light theme: an animated demo where a monthly salary of MAD 12,000 is split with a 50/30/20 rule.'),
      s('start-here', 1800, 1125, '"Start here" tour', 'The "Here\'s what\'s in Kanz" tour dialog, with tabs for Start here, Free tools, Pro, Coming next and Your ideas.'),
    ],
  },
  prompt: {
    id: 'prompt',
    name: 'Prompt Engine',
    url: 'https://pebyfouad.vercel.app',
    status: 'Live',
    years: '10.26 - Now',
    summary:
      'You paste a prompt and a crawler reads it section by section, flagging vague words, unsourced claims and risky rules. 11 quality rules and 26 security rules, mapped to the OWASP Top 10 for LLM applications.',
    screens: [
      s('paste', 1800, 1125, 'Paste a prompt', 'The start screen: "Paste a prompt. Watch it get read." with the example prompt loaded and chips showing 5 of 7 sections found.'),
      s('crawl', 2400, 1500, 'The crawler reading the Rules section', 'Prompt Engine crawl view: section clusters around a crawler, flagged words labelled vague, claim or missing, with a crawl log, section bars, a coverage radar and a live spec score of 36 below.'),
      s('report', 1800, 1125, 'Report: score 57 and ranked fixes', 'The report: spec score 57, needs work, a bar per section, and the first recommendations, each with its rule ID, what to do and the points it adds.'),
      s('flow', 1800, 1125, 'User flow page', 'The user flow page: the steps from launch to a finished prompt at a glance, then each step with what you do and what the app does.'),
    ],
  },
  assas: {
    id: 'assas',
    name: 'ASSAS',
    status: 'In development',
    years: '09.26 - Now',
    summary:
      'A SaaS that scans a full codebase for threats, bugs and violations of security rules: authentication, encryption, sessions, input validation, rate limiting, then reports every finding in one place.',
    screens: [
      s('report-summary', 1472, 650, 'Scan report: security grade and release gate', 'ASSAS security review of the HeyfouadKit repository: 198 files scanned, grade A at 96.5 / 100, passes the release gate with 0 critical, 0 high, 4 medium, 2 low and 6 info findings.'),
      s('scan-sweep', 1472, 820, 'Scan sweep: the web crawler walking a flagged file', 'The scan sweep in action: a web crawler moves down the full source of index.html, its legs grabbing the code around it as it stops on line 19 of 65.'),
      s('repo-map', 1472, 920, 'Repository map: risk share per folder', 'Repository map: each folder and file with its share of the total risk, findings counts, and clean files marked in green.'),
      s('create-report', 1728, 1080, 'Report builder: mark up findings, export PNG or PDF', 'The Create report screen: findings to drag onto a page, drawing tools like pen, highlighter and arrow, and the export buttons.'),
      s('offline-install', 1040, 650, 'Runs offline: installs from bundled wheels', 'Terminal: "ASSAS - codebase security review", installing dependencies from the bundled wheels folder with no internet needed, then asking which folder or archive to scan.'),
    ],
  },
  studio: {
    id: 'studio',
    name: 'Resume Studio',
    status: 'Local AI',
    years: '09.26 - Now',
    summary:
      'An offline AI resume optimizer. Most resumes are rejected by an applicant tracking system before a person reads them, and online fixers want your file on their servers. This one runs entirely on your machine.',
    screens: [
      s('home', 2400, 1500, 'Home: the four-stage pipeline, all done', 'Resume Studio home: "Make your resume readable to every ATS", with four coloured stage cards (ATS Diagnostic, Keyword Scan, XYZ Rewrite, LaTeX & PDF), each marked Done.'),
      s('parse-check', 1800, 1125, 'Parse check: instant, no AI', 'Parse check: 7 of 10 checks passed, with OK, WARN and FAIL rows for text layer, contact details, section headings, dates, quantified lines and buzzwords.'),
      s('keyword-scan', 1800, 1125, 'Stage 2: recruiter keyword scan', 'Keyword scan for a SOC Analyst role: a ranked table of the top keywords, each marked as missing, buried or present in the resume.'),
      s('xyz-rewrite', 1800, 1125, 'Stage 3: XYZ bullets with [estimate] markers', 'XYZ Bullet Rewriter: experience bullets rewritten as result, metric and method, with highlighted "estimate, verify before sending" markers where a number is missing.'),
      s('compare', 2400, 1500, 'Stage 4: marked and clean PDFs side by side', 'Resume Studio, Stage 4 compare view: a summary of 5 new lines, 4 rewritten, 3 keywords added and 5 estimates to verify, above the marked PDF with coloured changes and the clean PDF ready to send.'),
    ],
  },
};

export type PageId = 'selected' | 'explorations';

export interface WorkPageDef {
  id: PageId;
  href: `/${PageId}/`;
  title: string;
  key: 'S' | 'E';
  kind: 'work' | 'explore';
  projects: readonly ProjectId[];
  next: PageId;
  previews: readonly [string, string];
  description: string;
}

export const pages: Record<PageId, WorkPageDef> = {
  selected: {
    id: 'selected',
    href: '/selected/',
    title: 'Selected work',
    key: 'S',
    kind: 'work',
    projects: ['kanz', 'prompt'],
    next: 'explorations',
    previews: ['/assets/salary-light.avif', '/assets/news-dark.avif'],
    description: 'Kanz and Prompt Engine — live products built by Fouad Barkaoui.',
  },
  explorations: {
    id: 'explorations',
    href: '/explorations/',
    title: 'Explorations',
    key: 'E',
    kind: 'explore',
    projects: ['assas', 'studio'],
    next: 'selected',
    previews: ['/assets/home.avif', '/assets/report-summary.avif'],
    description: 'ASSAS and Resume Studio — security and local-AI tools by Fouad Barkaoui.',
  },
};

export const pageOrder: readonly PageId[] = ['selected', 'explorations'];
