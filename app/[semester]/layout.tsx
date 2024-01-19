import type { PropsWithChildren } from 'react';
import Link from 'next/link';
import SemesterSelect from '@/app/[semester]/semester-select';
import ProjectSearch from '@/app/[semester]/project-search';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <header className="fixed bg-white z-50 w-full">
        <div className="max-w-screen-lg mx-auto pt-8 pb-4 space-y-4">
          <div className="flex items-center bg-white">
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
          </div>
          <div className="flex items-center space-x-2.5 w-full">
            <SemesterSelect />
            <ProjectSearch />
          </div>
          <div className="shrink-0 bg-gray-200 h-[1px] w-full" />
        </div>
      </header>
      <main className="max-w-screen-lg mx-auto pt-32 pb-8">{children}</main>
    </>
  );
}
