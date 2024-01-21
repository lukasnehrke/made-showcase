'use client';

import { ChevronsDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useFormState } from 'react-dom';
import { Card } from '@/app/[semester]/card';
import type { Project } from '@/lib/schema';
import { Empty } from '@/app/[semester]/empty';
import { Button } from '@/components/button';
import type { FetchProjectsForm } from '@/actions/fetch-projects';
import { fetchProjects } from '@/actions/fetch-projects';

const initialState: FetchProjectsForm = {
  ok: false,
  projects: [],
};

export default function ProjectList({
  projects: initialProjects,
}: {
  projects: Project[];
}) {
  const { semester } = useParams();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [state, formAction] = useFormState(fetchProjects, initialState);
  const [loadMore, setLoadMore] = useState(initialProjects.length === 25);

  useEffect(() => {
    if (state.ok) {
      setProjects((prev) => [...prev, ...state.projects]);
      setLoadMore(state.projects.length === 25);
    }
  }, [state]);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const shownProjects = loadMore ? projects.toSpliced(-1) : projects;

  return (
    <div className="mt-8">
      {projects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shownProjects.map((project) => (
              <Card key={project.id} project={project} />
            ))}
          </div>
          {loadMore ? <form
              action={formAction}
              className="flex items-center justify-center mt-8"
            >
              <input name="semester" type="hidden" value={semester} />
              <input
                name="query"
                type="hidden"
                value={searchParams.get('query') ?? ''}
              />
              <input name="offset" type="hidden" value={projects.length} />
              <input name="limit" type="hidden" value={25} />
              <Button
                className="text-sky-500 hover:text-sky-400"
                type="submit"
                variant="ghost"
              >
                Load more projects
                <ChevronsDown className="ml-2 w-4 h-4" />
              </Button>
            </form> : null}
        </>
      ) : (
        <Empty />
      )}
    </div>
  );
}
