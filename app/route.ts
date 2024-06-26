import { NextResponse } from 'next/server';

export const runtime = 'edge';

export function GET(request: Request) {
  return NextResponse.redirect(new URL(`/ws23`, request.url));
}
