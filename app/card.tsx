import type { ReactNode } from 'react';
import Image from 'next/image';
import { BookMarked, Presentation, Star } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function CardAction({
  className,
  href,
  icon,
  title,
}: {
  className?: string;
  href: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <Link
      className={cn(
        'flex items-center rounded-xl bg-red-400 px-2 py-1 text-white transition-colors hover:bg-red-500 space-x-1 z-20',
        className,
      )}
      href={href}
      target="_blank"
    >
      {icon}
      <p className="text-sm font-medium">{title}</p>
    </Link>
  );
}

export interface CardProps {
  title: string;
  description: string;
  image: string;
  repository: string;
  report?: string;
  presentation?: string;
  stars: number;
  author: {
    avatar: string;
    username: string;
    name: string;
  };
  children?: ReactNode;
}

export function Card(props: CardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-stone-200 transition-all hover:shadow-xl shadow-md">
      <div className="flex flex-col h-full">
        <Image
          alt="made project image"
          className="h-14 w-full object-cover"
          height={400}
          src={props.image}
          width={500}
        />
        <div className="border-t border-stone-200 p-4 flex-grow">
          <p className="my-0 text-xl font-bold leading-tight line-clamp-3">
            {props.title}
          </p>
          <div className="flex items-center space-x-1.5 mt-1 text-slate-500 px-2">
            <Image
              alt="avatar"
              className="inline-block w-6 h-6 rounded-full"
              height={24}
              src={props.author.avatar}
              width={24}
            />
            <Link
              className="text-sm font-medium z-20 hover:underline"
              href={`https://github.com/${props.author.username}`}
              target="_blank"
            >
              {props.author.name}
            </Link>
          </div>
          <p className="mt-2 line-clamp-4 text-sm font-normal leading-snug text-stone-500">
            {props.description}
          </p>
        </div>

        <div className="flex items-center justify-end px-4">
          <CardAction
            className="bg-amber-500 hover:bg-amber-600"
            href={`${props.repository}/stargazers`}
            icon={<Star size={16} />}
            title={props.stars > 0 ? String(props.stars) : 'Gift a star'}
          />
        </div>
        {props.report || props.presentation ? (
          <div className="flex items-center justify-end px-4 mt-1 mb-4">
            <div className="flex items-center space-x-1">
              {props.report ? (
                <CardAction
                  className="bg-green-400 hover:bg-green-500"
                  href={props.report}
                  icon={<BookMarked size={16} />}
                  title="Final Report"
                />
              ) : null}
              {props.presentation ? (
                <CardAction
                  href={props.presentation}
                  icon={<Presentation size={16} />}
                  title="Presentation"
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <Link
        className="absolute block inset-0 z-10"
        href={props.repository}
        target="_blank"
      />
    </div>
  );
}
