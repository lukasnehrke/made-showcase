import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Header } from '@/components/header/header';
import { Container } from '@/components/container';
import { getProject } from '@/data/projects';
import { ProjectDetails } from '@/app/settings/project-details';

export default async function ProjectPage() {
  const session = await auth();
  if (!session?.user?.id) notFound();

  const project = await getProject(session.user.id);

  return (
    <>
      <Header />
      <main className="mt-10">
        <Container>
          {project ? (
            <>
              <h1 className="inline-flex items-center text-2xl font-medium mb-8">Edit your MADE Project</h1>
              <ProjectDetails hidden={project.hidden} id={project.id} summary={project.summary} title={project.title} />
            </>
          ) : (
            <>
              <h1 className="inline-flex items-center text-2xl font-medium mb-4">Project not found</h1>
              <p>We could not find your MADE project. If you recently forked the template, check back later!</p>
            </>
          )}
        </Container>
      </main>
    </>
  );
}
