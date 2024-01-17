import type { PropsWithChildren } from 'react';
import Link from 'next/link';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="max-w-screen-lg mx-auto pt-14 pb-4">
      <header className="flex items-center">
        <h1 className="text-lg">
          🔥{' '}
          <Link
            className="font-medium hover:underline"
            href="https://oss.cs.fau.de/teaching/specific/made/"
          >
            #MADE
          </Link>{' '}
          Showcase
        </h1>
      </header>
      <div className="shrink-0 bg-gray-200 h-[1px] w-full my-4" />
      <main>{children}</main>
    </div>
  );
}
