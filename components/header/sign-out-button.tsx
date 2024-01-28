'use client';

import { LogOut } from 'lucide-react';
import * as React from 'react';
import { DropdownMenuItem } from '@/components/dropdown-menu';
import { logout } from '@/actions/auth';

export function SignOutButton() {
  return (
    <DropdownMenuItem onClick={() => void logout()}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sign out</span>
    </DropdownMenuItem>
  );
}
