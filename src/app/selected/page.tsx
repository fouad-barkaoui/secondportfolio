import type { Metadata } from 'next';
import { WorkPage } from '@/components/work/WorkPage';
import { pages } from '@/content/site';

const page = pages.selected;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: page.href },
};

export default function Selected() {
  return <WorkPage pageId="selected" />;
}
