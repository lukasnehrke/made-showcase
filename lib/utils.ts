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

export const isValidSemester = (semester: string) => {
  return /^(?:ws|ss)\d{2}$/.test(semester);
};

export const getPrettySemester = (semester: string) => {
  if (!isValidSemester(semester)) return semester;
  if (semester.startsWith('ss')) return `SS${semester.slice(2)}`;
  return `WS${semester.slice(2)}/${parseInt(semester.slice(2)) + 1}`;
};

export const getLongSemester = (semester: string) => {
  if (!isValidSemester(semester)) return semester;
  if (semester.startsWith('ss')) return `SS 20${semester.slice(2)}`;
  return `WS 20${semester.slice(2)}/20${parseInt(semester.slice(2)) + 1}`;
};
