import { getProjects } from '@/data/projects';
import { Card } from '@/app/[semester]/card';
import SemesterSelect from '@/app/[semester]/semester-select';
import ProjectSearch from '@/app/[semester]/project-search';

export const revalidate = 3600;

interface PageProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}

export default async function Page(props: PageProps) {
  const query = (props.searchParams?.query || '').toLowerCase();
  //const currentPage = Number(props.searchParams?.page) || 1;

  let projects = await getProjects();

  if (query) {
    // no need to overcomplicate this
    projects = projects.filter((project) => {
      return (
        project.title.toLowerCase().includes(query) ||
        project.summary.toLowerCase().includes(query) ||
        (project.owner.name &&
          project.owner.name.toLowerCase().includes(query)) ||
        project.owner.username.toLowerCase().includes(query)
      );
    });
  }

  return (
    <>
      <div className="flex items-center space-x-2.5 w-full">
        <SemesterSelect />
        <ProjectSearch />
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
