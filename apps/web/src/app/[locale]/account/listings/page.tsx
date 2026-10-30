import { Button } from '@mahalla/ui';
import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ListingsManager } from '@/components/account/listings-manager';
import { Link } from '@/i18n/navigation';
import { MY_SAMPLE_LISTINGS } from '@/lib/my-listings';

export default async function MyListingsPage() {
  const t = await getTranslations('account');
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('listingsTitle')}</h1>
          <p className="mt-1 text-sm text-sand-500">{t('listingsSubtitle')}</p>
        </div>
        <Button asChild>
          <Link href="/list-property">
            <Plus className="size-4" aria-hidden />
            {t('listProperty')}
          </Link>
        </Button>
      </div>
      <ListingsManager initial={MY_SAMPLE_LISTINGS} />
    </div>
  );
}
