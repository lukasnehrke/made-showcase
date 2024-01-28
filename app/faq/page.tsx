import Link from 'next/link';
import { Header } from '@/components/header';
import { Container } from '@/components/container';

export const dynamic = 'force-static';

export default function Page() {
  return (
    <>
      <Header />
      <main className="mt-2">
        <Container>
          <h1 className="text-xl font-medium mt-6 mb-6">Frequently Asked Questions</h1>

          <h2 className="text-lg font-medium mt-6 mb-4">How long do projects need to update?</h2>
          <p className="text-muted-foreground">Projects are queried and updated in weekly intervals.</p>

          <h2 className="text-lg font-medium mt-6 mb-4">How can I remove my project?</h2>
          <p className="text-muted-foreground">You have multiple options to remove your project from this list:</p>
          <ol className="text-muted-foreground my-2 pl-5 list-decimal list-inside">
            <li>Change your repository visibility to private (do not do this during the course)</li>
            <li>
              Disassociate your fork from the <em>made-template</em> repository (via{' '}
              <Link className="text-sky-500" href="https://support.github.com/request/fork" target="_blank">
                GitHub Virtual Assistant
              </Link>
              )
            </li>
            <li>Click &apos;Sign in with GitHub&apos; and check &apos;Hide my project&apos;</li>
          </ol>
          <p className="text-muted-foreground">
            Option 3 is the preferred choice as it ensures immediate updates, unlike the other options which may take up
            to one week.
          </p>

          <h2 className="text-lg font-medium mt-6 mb-4">Is this an open source project?</h2>
          <p className="text-muted-foreground">
            Yes, you can find the source code on{' '}
            <Link className="text-sky-500" href="https://github.com/lukasnehrke/made-showcase" target="_blank">
              GitHub
            </Link>
            .
          </p>

          <h2 className="text-lg font-medium mt-6 mb-4">Is this an &apos;official&apos; website?</h2>
          <p className="text-muted-foreground">
            This is a community project. It is not affiliated with the the University of Erlangen-Nuremberg, the
            Professorship of Open-Source Software, or the MADE team.
          </p>
        </Container>
      </main>
    </>
  );
}
