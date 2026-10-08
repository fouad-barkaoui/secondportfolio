'use client';

import { ThemeProvider } from 'next-themes';
import { MotionConfig } from 'motion/react';
import { NavigationProvider } from '@/lib/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <NavigationProvider>{children}</NavigationProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
