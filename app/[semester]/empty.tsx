import Image from 'next/image';
import React from 'react';
import image from '@/assets/undraw_empty_street.svg';

export function Empty() {
  return (
    <div className="flex flex-col items-center text-center">
      <Image
        alt="empty street"
        className="max-w-[70%] md:max-w-screen-sm my-4"
        sizes="100vw"
        src={image as string}
      />
      <p className="mt-3 mb-1 text-xl font-medium">This page is empty</p>
      <p className="text-muted-foreground text-sm">
        No projects could be found for your search query.
      </p>
    </div>
  );
}
