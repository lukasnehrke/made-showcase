'use client';

import * as React from 'react';
import { login } from '@/actions/auth';
import { Button } from '@/components/button';

export function SignInButton() {
  return (
    <form action={() => void login()}>
      <Button type="submit" variant="ghost">
        Sign in with GitHub
      </Button>
    </form>
  );
}
