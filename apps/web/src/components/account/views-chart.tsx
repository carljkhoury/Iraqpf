'use client';

import { formatDate, type Locale } from '@mahalla/shared';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import type { DailyStat } from '@/lib/my-listings';

const W = 720;
const H = 240;
const PAD = { top: 16, bottom: 28, side: 40 };

/** Round the axis maximum up to a clean number (10, 20, 25, 50, 100…). */
function niceMax(value: number): number {
  if (value <= 0) return 10;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude >= value)!;
  return step * magnitude;
}

/**
 * Views per day, last 30 days. Single series, so no legend: the heading names it.
 * Time runs left to right in both languages (design system §6).
 */
export function ViewsChart({ stats, title }: { stats: DailyStat[]; title: string }) {
  const t = useTranslations('account');
  const locale = useLocale() as Locale;
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(...stats.map((d) => d.views)));
  const ticks = [0, max / 2, max];
  const innerW = W - PAD.side * 2;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / stats.length;
  const barW = Math.max(2, slot - 2); // 2px gap between bars
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const shortDate = (iso: string) =>
    new Intl.DateTimeFormat(locale === 'ar' ? 'ar-IQ-u-nu-latn' : 'en-GB', {
      day: 'numeric',
      month: 'short',
    }).format(new Date(iso));
  const hovered = hover !== null ? stats[hover] : null;

  return (
    <figure className="rounded-lg border border-sand-200 bg-white p-4">
      <figcaption className="mb-3 text-sm font-semibold text-sand-900">{title}</figcaption>
      <div className="relative" dir="ltr">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={title}
          onMouseLeave={() => setHover(null)}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={PAD.side}
                x2={W - PAD.side}
                y1={y(tick)}
                y2={y(tick)}
                stroke="var(--color-sand-100)"
                strokeWidth="1"
              />
              <text
                x={PAD.side - 8}
                y={y(tick) + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--color-sand-500)"
              >
                {tick}
              </text>
            </g>
          ))}
          {stats.map((d, i) => {
            const x = PAD.side + i * slot + 1;
            const h = Math.max(0, PAD.top + innerH - y(d.views));
            const r = Math.min(4, barW / 2, h);
            return (
              <g key={d.date}>
                {h > 0 && (
                  <path
                    d={`M${x},${PAD.top + innerH} v${-(h - r)} q0,${-r} ${r},${-r} h${barW - 2 * r} q${r},0 ${r},${r} v${h - r} z`}
                    fill={
                      hover === null || hover === i
                        ? 'var(--color-lapis-600)'
                        : 'var(--color-lapis-300)'
                    }
                  />
                )}
                {/* Hit target taller and wider than the bar. */}
                <rect
                  x={PAD.side + i * slot}
                  y={PAD.top}
                  width={slot}
                  height={innerH}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  tabIndex={0}
                  aria-label={`${formatDate(new Date(d.date), locale)}: ${d.views}`}
                />
              </g>
            );
          })}
          {stats.map((d, i) =>
            i % 7 === 0 || (i === stats.length - 1 && i % 7 > 3) ? (
              <text
                key={`l-${d.date}`}
                x={PAD.side + i * slot + slot / 2}
                y={H - 8}
                textAnchor="middle"
                fontSize="11"
                fill="var(--color-sand-500)"
              >
                {shortDate(d.date)}
              </text>
            ) : null,
          )}
        </svg>
        {hovered && hover !== null && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-md bg-sand-900 px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-raised"
            style={{ left: `${((PAD.side + hover * slot + slot / 2) / W) * 100}%` }}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            <span className="block text-sand-300">{shortDate(hovered.date)}</span>
            <span className="font-semibold">
              {t('statTiles.views')}: <bdi className="tabular">{hovered.views}</bdi>
            </span>
          </div>
        )}
      </div>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-lapis-600">{t('chartTable')}</summary>
        <div className="mt-2 max-h-64 overflow-auto">
          <table className="w-full text-start text-xs">
            <thead className="text-sand-500">
              <tr>
                <th className="py-1 text-start font-medium">{t('date')}</th>
                <th className="py-1 text-start font-medium">{t('statTiles.views')}</th>
                <th className="py-1 text-start font-medium">{t('statTiles.phoneReveals')}</th>
                <th className="py-1 text-start font-medium">{t('statTiles.whatsappClicks')}</th>
              </tr>
            </thead>
            <tbody className="tabular">
              {[...stats].reverse().map((d) => (
                <tr key={d.date} className="border-t border-sand-100">
                  <td className="py-1">{formatDate(new Date(d.date), locale)}</td>
                  <td className="py-1">{d.views}</td>
                  <td className="py-1">{d.phoneReveals}</td>
                  <td className="py-1">{d.whatsappClicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
