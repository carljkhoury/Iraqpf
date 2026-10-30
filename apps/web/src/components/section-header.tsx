import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  id?: string;
  children?: ReactNode;
}

export function SectionHeader({ title, subtitle, action, id }: SectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        <h2 id={id} className="text-[22px] font-semibold sm:text-2xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-sand-500">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-lapis-600 hover:text-lapis-700"
        >
          {action.label}
          {/* Points toward the reading direction's "forward": left in Arabic, right in English. */}
          <ChevronLeft className="size-4 ltr:-scale-x-100" aria-hidden />
        </Link>
      )}
    </div>
  );
}
