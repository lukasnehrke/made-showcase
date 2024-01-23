import Link from 'next/link';
import type { ReactNode } from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { Container } from '@/components/container';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { Divider } from '@/components/divider';
import { semesters } from '@/lib/constants';

export interface HeaderProps {
  className?: string;
  children?: ReactNode;
}

export function Header({ className, children }: HeaderProps) {
  return (
    <div className="pb-16 md:pb-20">
      <header
        className={cn(
          'pt-4 md:pt-8 fixed z-50 bg-background left-0 w-full',
          className,
        )}
      >
        <div className={RemoveScroll.classNames.fullWidth}>
          <Container className="space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-lg leading-tight">
                <span className="mr-2">🔥</span>
                <Link className="hover:underline" href={`/${semesters.at(-1)}`}>
                  <span className="font-medium">#MADE</span> Showcase
                </Link>
              </h1>
              <ThemeToggle />
            </div>
            {children}
            <Divider />
          </Container>
        </div>
      </header>
    </div>
  );
}
