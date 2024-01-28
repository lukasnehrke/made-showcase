import { Pencil } from 'lucide-react';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Header } from '@/components/header/header';
import { Container } from '@/components/container';
import { getProject } from '@/data/projects';

export default async function ProjectPage() {
  const session = await auth();

  if (!session?.user?.id) {
    notFound();
  }

  const project = await getProject(session.user.id);

  if (!project) {
    return (
      <>
        <h1>Project not found</h1>
        <p>We could not find your MADE project. If you recently forked the template, check back later!</p>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mt-8">
        <Container>
          <h1 className="inline-flex items-center text-xl mb-8">
            <Pencil className="w-4 h-4 mr-2" />
            <span>Edit your MADE Project</span>
          </h1>
          <div className="grid grid-cols-2 gap-4 items-center">
            <p className="text-lg font-medium mt-6 mb-4">Project Title</p>
            <p className="text-muted-foreground">{project.title}</p>

            <p className="text-lg font-medium mt-6 mb-4">Project Summary</p>
            <p className="text-muted-foreground">{project.summary}</p>
          </div>
        </Container>
      </main>
    </>
  );
}
