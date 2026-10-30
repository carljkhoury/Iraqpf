import { Container } from '@mahalla/ui';
import { useTranslations } from 'next-intl';

/** Visible on every page while the site runs on sample data (removed in Phase 3). */
export function SampleNotice() {
  const t = useTranslations('common');
  return (
    <div className="border-b border-gold-200 bg-gold-50 text-gold-700">
      <Container className="py-1.5 text-center text-xs font-medium">{t('sampleNotice')}</Container>
    </div>
  );
}
