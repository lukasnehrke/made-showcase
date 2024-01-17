import { Card } from '@/app/card';
import { getProjects } from '@/lib/projects';

export const dynamic = 'force-static';
export const revalidate = false;

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="max-w-screen-lg mx-auto pt-24 pb-8">
      <div className="grid grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}
