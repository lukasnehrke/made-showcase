'use client';

import * as React from 'react';
import { Github } from 'lucide-react';
import { login } from '@/actions/auth';
import { Button } from '@/components/button';

export function SignInButton() {
  return (
    <form action={() => void login()}>
      <Button type="submit" variant="ghost">
        <Github className="w-4 h-4 mr-2" />
        Sign in with GitHub
      </Button>
    </form>
  );
}
