import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const colors = [
  'bg-blue-600',
  'bg-red-500',
  'bg-fuchsia-500',
  'bg-green-500',
  'bg-cyan-500',
  'bg-amber-500',
  'bg-lime-500',
];

export const getRandomColor = () =>
  colors[Math.floor(Math.random() * colors.length)];
