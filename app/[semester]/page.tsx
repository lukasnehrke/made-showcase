import { getProjects } from '@/data/projects';
import ProjectList from '@/app/[semester]/project-list';

export const revalidate = 3600;

interface PageProps {
  params: {
    semester: string;
  };
  searchParams?: {
    query?: string;
  };
}

export default async function Page(props: PageProps) {
  const semester = props.params.semester.toLowerCase();
  const query = (props.searchParams?.query || '').toLowerCase();

  const projects = await getProjects({ semester, query, offset: 0, limit: 25 });

  return (
    <ProjectList projects={projects} />
  );
}
