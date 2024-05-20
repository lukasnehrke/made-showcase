import { type NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { octokit } from '@/lib/octokit';
import { madeTemplateRepository } from '@/lib/constants';
import { db } from '@/lib/drizzle';
import { readmeHashes, status } from '@/lib/schema';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET!}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const meta = await db.query.status.findFirst({ where: eq(status.id, 1) });
  await updateReadmeHashes(meta?.lastReadmeUpdate);

  await db
    .insert(status)
    .values({ id: 1, lastReadmeUpdate: new Date() })
    .onConflictDoUpdate({
      target: status.id,
      set: { lastReadmeUpdate: new Date() },
    });

  return NextResponse.json({ ok: true });
}

const updateReadmeHashes = async (lastUpdate?: Date): Promise<void> => {
  const res = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner: madeTemplateRepository.owner,
    repo: madeTemplateRepository.repo,
    path: 'README.md',
    per_page: 100,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
      'If-Modified-Since': lastUpdate?.toISOString(),
    },
  });

  for (const commit of res.data) {
    await db.transaction(async (tx) => {
      const existing = await tx.query.readmeHashes.findFirst({
        columns: { commitHash: true },
        where: eq(readmeHashes.commitHash, commit.sha),
      });

      if (existing) {
        // nothing to do
        return;
      }

      const readme = await octokit.rest.repos.getContent({
        owner: madeTemplateRepository.owner,
        repo: madeTemplateRepository.repo,
        ref: commit.sha,
        path: 'README.md',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      if (!Array.isArray(readme.data) && readme.data.type === 'file' && readme.data.encoding === 'base64') {
        await tx.insert(readmeHashes).values({
          commitHash: commit.sha,
          readmeHash: readme.data.sha,
        });
      }
    });
  }
};
