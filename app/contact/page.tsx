import Link from 'next/link';
import { Container } from '@/components/container';
import { Header } from '@/components/header';

export const dynamic = 'force-static';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mt-2">
        <Container>
          <h1 className="text-lg font-medium mt-6 mb-4">Contact</h1>
          <p className="text-slate-800 dark:text-slate-400">
            Lukas Nehrke
            <br />
            <Link className="hover:underline" href="mailto:lukas.nehrke@fau.de">
              lukas.nehrke@fau.de
            </Link>
            <br />
            <Link className="hover:underline" href="https://lukasnehrke.dev">
              https://lukasnehrke.dev
            </Link>
          </p>
        </Container>
      </main>
    </>
  );
}
