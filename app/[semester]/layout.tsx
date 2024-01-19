import type { PropsWithChildren } from 'react';
import Link from 'next/link';
import SemesterSelect from '@/app/[semester]/semester-select';
import ProjectSearch from '@/app/[semester]/project-search';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <header className="fixed z-50 bg-background left-0 w-full">
        <div className="max-w-screen-lg mx-auto px-3.5 pt-8 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg">
              <span className="mr-2">🔥</span>{' '}
              <Link
                className="font-medium hover:underline"
                href="https://oss.cs.fau.de/teaching/specific/made/"
                target="_blank"
              >
                #MADE
              </Link>{' '}
              Showcase
            </h1>
            <ThemeToggle />
          </div>
          <div className="flex items-center space-x-2.5 w-full">
            <SemesterSelect />
            <ProjectSearch />
          </div>
          <div className="shrink-0 bg-border h-[1px] w-full" />
        </div>
      </header>
      <main className="max-w-screen-lg mx-auto px-3.5 pt-32 pb-8">
        {children}
      </main>
    </>
  );
}
