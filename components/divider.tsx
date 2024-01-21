import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps {
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return <div className={cn('shrink-0 bg-border h-[1px] w-full', className)} />;
}
