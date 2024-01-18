'use client';

import type { Project } from '@/data/projects';
import { Card } from '@/app/[semester]/card';

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
