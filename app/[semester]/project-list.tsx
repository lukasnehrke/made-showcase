'use client';

import { Card } from '@/app/[semester]/card';
import type { Project } from '@/lib/schema';

export default function ProjectList({
  projects: initialProjects,
}: {
  projects: Project[];
}) {
  return (
    <div className="mt-8 grid grid-cols-3 gap-4">
      {initialProjects.map((project) => (
        <Card key={project.id} project={project} />
      ))}
    </div>
  );
}
