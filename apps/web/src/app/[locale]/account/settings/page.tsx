import { Suspense } from 'react';
import { SettingsForm } from '@/components/account/settings-form';

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsForm />
    </Suspense>
  );
}
