import { cn } from './cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the group. */
  label: string;
  tone?: 'light' | 'dark';
  className?: string;
}

/** A set of mutually exclusive toggle buttons (e.g. Buy / Rent / Commercial). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  tone = 'light',
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'inline-flex rounded-md p-1',
        tone === 'dark' ? 'bg-white/10' : 'bg-sand-100',
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'h-9 rounded-[8px] px-4 text-sm font-semibold transition-colors',
              active
                ? tone === 'dark'
                  ? 'bg-white text-lapis-800'
                  : 'bg-white text-lapis-700 shadow-card'
                : tone === 'dark'
                  ? 'text-lapis-100 hover:text-white'
                  : 'text-sand-500 hover:text-sand-900',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
