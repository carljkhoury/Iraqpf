import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from './cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-lapis-600 text-white hover:bg-lapis-700',
        secondary: 'border border-lapis-200 bg-white text-lapis-700 hover:bg-lapis-50',
        ghost: 'text-lapis-700 hover:bg-lapis-50',
        danger: 'border border-danger-600/30 bg-white text-danger-600 hover:bg-danger-50',
        whatsapp: 'bg-whatsapp text-white hover:bg-whatsapp-dark',
        inverse: 'bg-white text-lapis-800 hover:bg-lapis-50',
        gold: 'bg-gold-500 text-sand-900 hover:bg-gold-300',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-[15px]',
        lg: 'h-12 px-6 text-base',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Render the child element (e.g. a link) with button styling. */
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...(asChild ? {} : { type: type ?? 'button' })}
      {...props}
    />
  );
}
