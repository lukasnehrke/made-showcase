import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import type { NextAuthConfig } from 'next-auth';

export const config = {
  providers: [
    GitHubProvider({
      authorization: {
        url: 'https://github.com/login/oauth/authorize',
        params: { scope: '', prompt: 'consent' },
      },
    }),
  ],
  callbacks: {
    session(opts) {
      if (opts.session.user && 'token' in opts) {
        opts.session.user.id = opts.token.sub;
      }
      return opts.session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
