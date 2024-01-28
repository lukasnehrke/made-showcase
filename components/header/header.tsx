import Link from 'next/link';
import * as React from 'react';
import type { ReactNode } from 'react';
import { RemoveScroll } from 'react-remove-scroll';
import { HelpCircle } from 'lucide-react';
import { Container } from '@/components/container';
import { ThemeToggle } from '@/components/header/theme-toggle';
import { cn } from '@/lib/utils';
import { Divider } from '@/components/divider';
import { semesters } from '@/lib/constants';
import { Button } from '@/components/button';
import { CurrentUser } from '@/components/header/user';

export interface HeaderProps {
  className?: string;
  children?: ReactNode;
}

export function Header({ className, children }: HeaderProps) {
  return (
    <div className="pb-16 md:pb-20">
      <header className={cn('pt-4 md:pt-8 fixed z-50 bg-background left-0 w-full', className)}>
        <div className={RemoveScroll.classNames.fullWidth}>
          <Container className="space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-lg leading-tight">
                <span className="mr-2">🔥</span>
                <Link className="hover:underline" href={`/${semesters.at(-1)}`}>
                  <span className="font-medium">#MADE</span> Showcase
                </Link>
              </h1>
              <div className="flex items-center">
                <CurrentUser />
                <div className="mx-2">
                  <div className="w-[1px] h-[30px] bg-border" />
                </div>
                <Link href="/faq">
                  <Button size="icon" variant="ghost">
                    <HelpCircle className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100" />
                    <span className="sr-only">FAQ</span>
                  </Button>
                </Link>
                <ThemeToggle />
              </div>
            </div>
            {children}
            <Divider />
          </Container>
        </div>
      </header>
    </div>
  );
}
