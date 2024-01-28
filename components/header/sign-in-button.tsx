'use client';

import * as React from 'react';
import { Github, LogIn } from 'lucide-react';
import { login } from '@/actions/auth';
import { Button } from '@/components/button';

export function SignInButton() {
  return (
    <form action={() => void login()}>
      <Button className="hidden md:flex" type="submit" variant="ghost">
        <Github className="w-4 h-4 mr-2" />
        Sign in with GitHub
      </Button>
      <Button className="flex md:hidden" size="icon" type="submit" variant="ghost">
        <LogIn className="w-4 h-4" />
        <span className="sr-only">Sign in</span>
      </Button>
    </form>
  );
}
