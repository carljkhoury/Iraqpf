import { cn } from '@mahalla/ui';

/** Placeholder logo (initial on the agency colour) until agencies upload theirs. */
export function AgencyLogo({
  initial,
  color,
  className,
}: {
  initial: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn('grid shrink-0 place-items-center rounded-md font-bold text-white', className)}
      style={{ backgroundColor: color }}
    >
      {initial}
    </span>
  );
}
