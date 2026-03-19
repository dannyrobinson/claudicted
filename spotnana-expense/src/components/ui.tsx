import React from 'react';
import clsx from 'clsx';

const buttonBase =
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-body2 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed';

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children
}: {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
  className?: string;
  children: React.ReactNode;
}) {
  const sizeClass = size === 'sm' ? 'h-9 px-3 text-body3' : 'h-11 px-4';
  const variantClass = {
    primary: 'bg-ink-900 text-white hover:bg-ink-800',
    secondary: 'border border-ink-300 text-ink-900 bg-white hover:bg-ink-100',
    ghost: 'text-ink-700 hover:bg-ink-100',
    danger: 'bg-danger-500 text-white hover:brightness-95'
  }[variant];

  return (
    <button className={clsx(buttonBase, sizeClass, variantClass, className)}>
      {children}
    </button>
  );
}

export function Tag({
  tone = 'neutral',
  children
}: {
  tone?: 'neutral' | 'success' | 'warning' | 'brand';
  children: React.ReactNode;
}) {
  const toneClass = {
    neutral: 'bg-ink-100 text-ink-600',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    brand: 'bg-brand-100 text-brand-700'
  }[tone];

  return (
    <span className={clsx('inline-flex items-center rounded-full px-3 py-1 text-body3 font-medium', toneClass)}>
      {children}
    </span>
  );
}

export function Card({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx('rounded-card border border-ink-200 bg-white p-4', className)}>
      {children}
    </div>
  );
}

export function Input({
  placeholder,
  className
}: {
  placeholder: string;
  className?: string;
}) {
  return (
    <input
      placeholder={placeholder}
      className={clsx(
        'h-11 w-full rounded-2xl border border-ink-200 bg-white px-4 text-body2 text-ink-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
        className
      )}
    />
  );
}
