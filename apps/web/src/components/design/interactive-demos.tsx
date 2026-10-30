'use client';

import { normalizeIraqiMobile } from '@mahalla/shared';
import { Chip, Field, PhoneInput } from '@mahalla/ui';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function PhoneDemo() {
  const t = useTranslations('design');
  const [value, setValue] = useState('0770 123 4567');
  const normalized = normalizeIraqiMobile(value);
  return (
    <Field
      id="design-phone"
      label={t('phoneLabel')}
      hint={normalized ? t('phoneValid', { value: normalized }) : t('phoneHint')}
      error={value && !normalized ? t('phoneInvalid') : undefined}
    >
      <PhoneInput
        id="design-phone"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-invalid={Boolean(value) && !normalized}
      />
    </Field>
  );
}

export function BedroomChips() {
  const t = useTranslations('design');
  const tl = useTranslations('listing');
  const [selected, setSelected] = useState(3);
  return (
    <div>
      <p className="mb-2 text-[13px] font-semibold text-sand-900">{t('bedrooms')}</p>
      <div className="flex flex-wrap gap-2">
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <Chip key={n} selected={selected === n} onClick={() => setSelected(n)}>
            {n === 0 ? tl('beds', { count: 0 }) : n === 5 ? '+5' : n}
          </Chip>
        ))}
      </div>
    </div>
  );
}
