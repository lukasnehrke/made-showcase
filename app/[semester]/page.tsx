import { notFound } from 'next/navigation';
import { getProjects } from '@/data/projects';
import ProjectList from '@/app/[semester]/project-list';
import { baseUrl } from '@/lib/constants';
import { getLongSemester, isValidSemester } from '@/lib/utils';

export const revalidate = 3600;

interface PageProps {
  params: {
    semester: string;
  };
  searchParams?: {
    query?: string;
  };
}

export function generateMetadata({ params }: PageProps) {
  return {
    title: getLongSemester(params.semester),
    description: `Check out the MADE projects from ${getLongSemester(params.semester)}.`,
    alternates: {
      canonical: `${baseUrl}/${params.semester}`,
    },
  };
}

export default async function Page(props: PageProps) {
  const semester = props.params.semester.toLowerCase();
  const query = (props.searchParams?.query ?? '').toLowerCase();

  if (!isValidSemester(semester)) {
    return notFound();
  }

  const projects = await getProjects({ semester, query, offset: 0, limit: 25 });

  return <ProjectList projects={projects} />;
}
