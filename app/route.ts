import { NextResponse } from 'next/server';
import { semesters } from '@/lib/constants';

export function GET(request: Request) {
  return NextResponse.redirect(new URL(`/${semesters.at(-1)}`, request.url));
}
