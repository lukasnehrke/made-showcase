'use client';

import { ChevronsDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { Card } from '@/app/[semester]/card';
import type { Project } from '@/lib/schema';
import { Empty } from '@/app/[semester]/empty';
import { Button } from '@/components/button';
import type { FetchProjectsForm } from '@/actions/fetch-projects';
import { fetchProjects } from '@/actions/fetch-projects';

function LoadMoreButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="text-sky-500 hover:text-sky-400"
      type="submit"
      variant="ghost"
    >
      Load more projects
      {pending ? (
        <Loader2 className="ml-2 w-4 h-4 animate-spin" />
      ) : (
        <ChevronsDown className="ml-2 w-4 h-4" />
      )}
    </Button>
  );
}

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
      setLoadMore(state.projects.length === 24);
    }
  }, [state]);

  useEffect(() => {
    setProjects(initialProjects);
    setLoadMore(initialProjects.length === 25);
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
          {loadMore ? (
            <form
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
              <input name="limit" type="hidden" value={24} />
              <LoadMoreButton />
            </form>
          ) : null}
        </>
      ) : (
        <Empty />
      )}
    </div>
  );
}
