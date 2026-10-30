import { type VariantProps, cva } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from './cn';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 [:lang(ar)_&]:text-[13px] [&_svg]:size-3',
  {
    variants: {
      tone: {
        featured: 'bg-gold-100 text-gold-700',
        verified: 'bg-lapis-50 text-lapis-700',
        new: 'bg-success-50 text-success-600',
        pending: 'bg-warning-50 text-warning-600',
        expired: 'bg-sand-100 text-sand-500',
        neutral: 'bg-white/90 text-sand-900',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
