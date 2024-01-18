import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { updateProjects } from '@/lib/indexer';

export async function GET(_request: NextRequest) {
  /*
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  */

  const statuses = await updateProjects();
  return NextResponse.json(statuses);
}
