'use client';

import { cn } from '@mahalla/ui';
import { Building2, MapPin, Map as MapIcon, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useId, useMemo, useRef, useState } from 'react';
import { type LocationOption, searchLocations } from '@/lib/locations';

interface LocationComboboxProps {
  value: LocationOption | null;
  onChange: (value: LocationOption | null) => void;
}

const TYPE_ICON = {
  governorate: MapIcon,
  city: Building2,
  district: MapPin,
  neighbourhood: MapPin,
  compound: MapPin,
} as const;

/**
 * Accessible combobox (WAI-ARIA 1.2 pattern) for picking a location.
 * Matching is Arabic-aware: "الكراده", "كرادة" and "karrada" all find Karrada.
 */
export function LocationCombobox({ value, onChange }: LocationComboboxProps) {
  const t = useTranslations('hero');
  const locale = useLocale() as 'ar' | 'en';
  const id = useId();
  const listId = `${id}-list`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(() => searchLocations(query), [query]);
  const display = value ? value.name[locale] : query;
  const showList = open && query.trim().length > 0 && !value;

  function select(option: LocationOption) {
    onChange(option);
    setQuery('');
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showList) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      select(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-xs text-sand-500">
        {t('locationLabel')}
      </label>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && results[active] ? `${listId}-${active}` : undefined}
          autoComplete="off"
          placeholder={t('locationPlaceholder')}
          value={display}
          onChange={(e) => {
            if (value) onChange(null);
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          className="h-7 w-full min-w-0 bg-transparent text-[15px] font-medium text-sand-900 placeholder:font-normal placeholder:text-sand-500 focus:outline-none"
        />
        {(value || query) && (
          <button
            type="button"
            aria-label={t('clearLocation')}
            onClick={() => {
              onChange(null);
              setQuery('');
              inputRef.current?.focus();
            }}
            className="grid size-6 shrink-0 place-items-center rounded-full text-sand-500 hover:bg-sand-100"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-3 max-h-80 overflow-y-auto rounded-lg border border-sand-200 bg-white py-1.5 shadow-overlay"
        >
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-sand-500">{t('locationEmpty')}</li>
          ) : (
            results.map((option, i) => {
              const Icon = TYPE_ICON[option.type];
              return (
                <li
                  key={option.path}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => select(option)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 px-4 py-2.5',
                    i === active && 'bg-lapis-50',
                  )}
                >
                  <Icon className="size-4 shrink-0 text-sand-500" aria-hidden />
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] text-sand-900">
                      {option.name[locale]}
                    </span>
                    {option.parent && (
                      <span className="block truncate text-xs text-sand-500">
                        {option.parent[locale]}
                      </span>
                    )}
                  </span>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
