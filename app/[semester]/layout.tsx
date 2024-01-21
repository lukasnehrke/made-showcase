import type { PropsWithChildren } from 'react';
import Link from 'next/link';
import SemesterSelect from '@/app/[semester]/semester-select';
import ProjectSearch from '@/app/[semester]/project-search';
import { Header } from '@/components/header';
import { Container } from '@/components/container';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header>
        <div className="flex items-center space-x-2.5 w-full">
          <SemesterSelect />
          <ProjectSearch />
        </div>
      </Header>
      <Container className="pt-10">
        <main>{children}</main>
        <footer className="pt-4 md:pt-8">
          <div className="shrink-0 bg-border h-[1px] w-full" />
          <div className="flex items-center justify-between py-5 mx-1 text-sm tracking-tight text-muted-foreground">
            <div>
              <p className="hidden md:block">
                This project is not affiliated with the University of
                Erlangen-Nuremberg.
              </p>
            </div>
            <div className="space-x-6">
              <Link href="https://github.com/lukasnehrke/made-showcase">
                Source Code
              </Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </footer>
      </Container>
    </>
  );
}
