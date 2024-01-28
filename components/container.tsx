import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps {
  className?: string;
  children?: React.ReactNode;
}

export function Container({ className, children }: ContainerProps) {
  return <div className={cn('max-w-screen-lg mx-auto px-3.5', className)}>{children}</div>;
}
