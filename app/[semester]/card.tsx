import type { ReactNode } from 'react';
import Image from 'next/image';
import { BookMarked, Presentation, Star } from 'lucide-react';
import Link from 'next/link';
import { cn, getRandomColor } from '@/lib/utils';
import type { Project } from '@/data/projects';

function CardAction({
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
  project: Project;
}

export function Card({ project }: CardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-stone-200 transition-all hover:shadow-lg shadow-md">
      <div className="flex flex-col h-full pb-3">
        {project.bannerUrl ? (
          <Image
            alt="made project image"
            className="h-20 w-full object-cover"
            height={400}
            src={project.bannerUrl}
            width={500}
          />
        ) : (
          <div className={cn('h-4 w-full', getRandomColor())} />
        )}
        <div className="border-t border-stone-200 p-4 flex-grow">
          <p className="my-0 text-xl font-bold leading-tight line-clamp-3">
            {project.title}
          </p>
          <div className="flex items-center space-x-1.5 mt-1 text-slate-500 px-2">
            <Image
              alt="avatar"
              className="inline-block w-6 h-6 rounded-full"
              height={24}
              src={project.owner.avatarUrl}
              width={24}
            />
            <Link
              className="text-sm font-medium z-20 hover:underline"
              href={project.owner.url}
              target="_blank"
            >
              {project.owner.name ?? `@${project.owner.username}`}
            </Link>
          </div>
          <p className="mt-2 line-clamp-4 text-sm font-normal leading-snug text-stone-500">
            {project.summary}
          </p>
        </div>

        <div className="flex items-center justify-end px-4">
          <CardAction
            className="bg-amber-500 hover:bg-amber-600"
            href={project.starsUrl}
            icon={<Star size={16} />}
            title={
              project.starsCount > 0 ? String(project.starsUrl) : 'Gift a star'
            }
          />
        </div>
        {project.reportUrl || project.presentationUrl ? (
          <div className="flex items-center justify-end px-4 mt-1">
            <div className="flex items-center space-x-1">
              {project.reportUrl ? (
                <CardAction
                  className="bg-green-400 hover:bg-green-500"
                  href={project.reportUrl}
                  icon={<BookMarked size={16} />}
                  title="Final Report"
                />
              ) : null}
              {project.presentationUrl ? (
                <CardAction
                  href={project.presentationUrl}
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
        href={project.repositoryUrl}
        target="_blank"
      />
    </div>
  );
}
