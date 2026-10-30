import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { cn } from './cn';

const controlClass =
  'h-11 w-full rounded-sm border border-sand-200 bg-white px-3 text-[15px] text-sand-900 placeholder:text-sand-500 focus:border-lapis-500 focus:outline-2 focus:outline-lapis-200 disabled:bg-sand-50';

export interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ id, label, hint, error, children, className }: FieldProps) {
  return (
    <div className={cn('grid gap-1.5', className)}>
      <label htmlFor={id} className="text-[13px] font-semibold text-sand-900">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-danger-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-sand-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClass, className)} {...props} />;
}

/** Phone and numeric inputs stay left-to-right in Arabic (design system §6). */
export function PhoneInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      dir="ltr"
      className={cn(controlClass, 'text-left', className)}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(controlClass, 'pe-8', className)} {...props} />;
}
