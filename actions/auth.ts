'use server';

import { signIn, signOut } from '@/lib/auth';

export async function login() {
  await signIn('github');
}

export async function logout() {
  await signOut();
}
