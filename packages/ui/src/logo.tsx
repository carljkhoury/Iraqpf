import { cn } from './cn';

export interface LogoMarkProps {
  className?: string;
  inverse?: boolean;
}

/** Map pin + shanasheel window. Placeholder mark until the final logo (design system §1). */
export function LogoMark({ className, inverse = false }: LogoMarkProps) {
  const pin = inverse ? '#FFFFFF' : '#22489A';
  const window = inverse ? '#12244B' : '#FFFFFF';
  return (
    <svg viewBox="0 0 40 48" aria-hidden="true" className={cn('h-9 w-auto', className)}>
      <path
        fill={pin}
        d="M20 2C10.1 2 3 9.6 3 19.2 3 31.4 20 46 20 46s17-14.6 17-26.8C37 9.6 29.9 2 20 2Z"
      />
      <path fill={window} d="M12.5 28V16.5a7.5 7.5 0 0 1 15 0V28Z" />
      <path
        fill="none"
        stroke={pin}
        strokeWidth="1.6"
        d="M17.5 11v17M22.5 11v17M12.5 20.5h15M12.5 24.5h15"
      />
      <circle cx="20" cy="33.5" r="2" fill="#D4A12A" />
    </svg>
  );
}

export interface LogoProps extends LogoMarkProps {
  locale: 'ar' | 'en';
}

export function Logo({ locale, inverse = false, className }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark inverse={inverse} />
      {locale === 'ar' ? (
        <span
          lang="ar"
          className={cn(
            'font-arabic text-[26px] leading-none font-bold',
            inverse ? 'text-white' : 'text-lapis-700',
          )}
        >
          محلّة
        </span>
      ) : (
        <span
          lang="en"
          className={cn(
            'font-latin text-[24px] leading-none font-semibold tracking-tight',
            inverse ? 'text-white' : 'text-lapis-700',
          )}
        >
          mahalla
        </span>
      )}
    </span>
  );
}
