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

export const getRandomColor = (id: string) => {
  const index = id.split('').reduce((acc, cur) => acc + cur.charCodeAt(0), 0);
  return colors[index % colors.length];
};
