'use client';

import { Button } from '@mahalla/ui';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useDemoSession } from '@/lib/demo-session';

/** "Log in" for visitors, "My account" with an initial for signed-in users. */
export function AccountButton({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const t = useTranslations('auth');
  const { user } = useDemoSession();
  if (user) {
    return (
      <Button asChild variant="ghost" className={className}>
        <Link href="/account" onClick={onNavigate}>
          <span
            className="grid size-7 place-items-center rounded-full bg-lapis-600 text-xs font-bold text-white"
            aria-hidden
          >
            {user.name[0]}
          </span>
          {t('myAccount')}
        </Link>
      </Button>
    );
  }
  return (
    <Button asChild variant="ghost" className={className}>
      <Link href="/login" onClick={onNavigate}>
        {t('signIn')}
      </Link>
    </Button>
  );
}
