import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  children: ReactNode;
  className?: string;
};

type AnchorProps = CommonProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'className'> & {
    href: string;
    external?: boolean;
  };

type ButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<'button'>, 'className'> & {
    href?: undefined;
  };

function classes(variant: Variant, size: Size, full: boolean | undefined, extra?: string): string {
  return [
    styles.button,
    styles[`variant_${variant}`],
    size === 'sm' ? styles.size_sm : size === 'lg' ? styles.size_lg : '',
    full ? styles.full : '',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function Button(props: AnchorProps | ButtonProps) {
  const { variant = 'primary', size = 'md', full, children, className } = props as CommonProps;
  const cls = classes(variant, size, full, className);

  if ('href' in props && props.href) {
    const { href, external, variant: _v, size: _s, full: _f, children: _c, className: _cl, ...rest } = props as AnchorProps;
    if (external || /^(https?:|mailto:|tel:|wa\.me)/i.test(href) || href.startsWith('https://wa.me')) {
      const isHttp = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          className={cls}
          {...(isHttp ? { target: '_blank', rel: 'noopener' } : {})}
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, full: _f, children: _c, className: _cl, ...rest } = props as ButtonProps;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
