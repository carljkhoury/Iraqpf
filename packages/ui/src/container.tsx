import type { HTMLAttributes } from 'react';
import { cn } from './cn';

/** Max 1280 px content width with 16/24/32 px side padding (design system §4). */
export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  );
}
