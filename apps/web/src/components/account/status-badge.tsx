import { Badge } from '@mahalla/ui';
import { useTranslations } from 'next-intl';
import type { ListingStatus } from '@/lib/my-listings';

const TONE: Record<ListingStatus, 'new' | 'pending' | 'expired' | 'neutral' | 'verified'> = {
  live: 'new',
  pending_review: 'pending',
  draft: 'expired',
  expired: 'expired',
  paused: 'expired',
  rejected: 'neutral',
  sold_rented: 'verified',
};

export function StatusBadge({ status }: { status: ListingStatus }) {
  const t = useTranslations('account.status');
  return (
    <Badge
      tone={TONE[status]}
      className={status === 'rejected' ? 'bg-danger-50 text-danger-600' : undefined}
    >
      {t(status)}
    </Badge>
  );
}

export function StatTile({
  label,
  value,
  help,
}: {
  label: string;
  value: string | number;
  help?: string;
}) {
  return (
    <div className="rounded-lg border border-sand-200 bg-white p-4">
      <p className="text-xs text-sand-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-sand-900">
        <bdi className="tabular">{value}</bdi>
      </p>
      {help && <p className="mt-1 text-xs text-sand-500">{help}</p>}
    </div>
  );
}
