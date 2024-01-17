import { Card } from '@/app/card';

const projects = [
  {
    featured: false,
    id: '1',
    title: 'Electromobility and Charging Infrastructure in Germany',
    description:
      'The aim of this project is to investigate if there is a relationship between the charging point infrastructure and electromobility in Germany.',
    image:
      'https://oss.cs.fau.de/wp-content/uploads/2023/09/madess23_markert-480x320.jpg',
    repository: 'https://github.com/nmarkert/electromobility',
    report:
      'https://github.com/nmarkert/electromobility/blob/main/project/report.ipynb',
    stars: 0,
    author: {
      avatar: 'https://avatars.githubusercontent.com/u/66016784?v=4',
      username: 'nmarkert',
      name: 'Niklas Markert',
    },
  },
  {
    featured: true,
    id: '2',
    title:
      'Correlation between rates of accidents in Germany and Münster with respect to bicycle count in Münster',
    description:
      'Münster, a city in North Rhine-Westphalia, is the home to an estimated 500,000 bicycles. It is famous for its bike-friendly streets and is hence popularly known as the “Bicycle capital of Germany"',
    image:
      'https://oss.cs.fau.de/wp-content/uploads/2023/08/majumdar-MADE-SS23-463x320.jpg',
    repository: 'https://github.com/thesagni/2023-AMSE-Sagni',
    report:
      'https://github.com/thesagni/2023-AMSE-Sagni/blob/main/project/report.ipynb',
    stars: 0,
    author: {
      avatar: 'https://avatars.githubusercontent.com/u/129326306?v=4',
      username: 'thesagni',
      name: '@thesagni',
    },
  },
];

export default function Home() {
  return (
    <main className="max-w-screen-lg mx-auto pt-24">
      <div className="grid grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} {...project} />
        ))}
      </div>
    </main>
  );
}
