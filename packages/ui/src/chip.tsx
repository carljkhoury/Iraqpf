import type { ButtonHTMLAttributes } from 'react';
import { cn } from './cn';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Chip({ className, selected = false, type, ...props }: ChipProps) {
  return (
    <button
      type={type ?? 'button'}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors',
        selected
          ? 'border-lapis-600 bg-lapis-600 text-white'
          : 'border-sand-200 bg-white text-sand-700 hover:border-lapis-200 hover:bg-lapis-50',
        className,
      )}
      {...props}
    />
  );
}
