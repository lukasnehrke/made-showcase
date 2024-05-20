import * as React from 'react';
import { Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Button } from '@/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown-menu';
import { SignOutButton } from '@/components/header/sign-out-button';
import { SignInButton } from '@/components/header/sign-in-button';

export async function CurrentUser() {
  const session = await auth();

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            {session.user.image ? (
              <Image
                alt="avatar"
                className="inline-block w-6 h-6 rounded-full mr-2"
                height={24}
                src={session.user.image}
                width={24}
              />
            ) : null}
            {session.user.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48">
          <Link href="/settings">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Project Settings</span>
            </DropdownMenuItem>
          </Link>
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return <SignInButton />;
}
