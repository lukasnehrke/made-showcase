import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import type { NextAuthConfig } from 'next-auth';

export const config = {
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
  },
  providers: [
    GitHubProvider({
      authorization: {
        url: 'https://github.com/login/oauth/authorize',
        params: { scope: '' },
      },
    }),
  ],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
