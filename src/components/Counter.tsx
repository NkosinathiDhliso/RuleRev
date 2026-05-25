import type { CSSProperties } from 'react';

type Props = {
  /** Final numeric value to count up to. */
  to: number;
  /** Starting value. Defaults to 0. */
  from?: number;
  /** Tween duration in seconds. */
  duration?: number;
  /** Decimal places to display. */
  decimals?: number;
  /** Text rendered before the number, e.g. `$` or `~`. */
  prefix?: string;
  /** Text rendered after the number, e.g. `M+` or `%`. */
  suffix?: string;
  /** Locale string for grouping separators. */
  locale?: string;
  className?: string;
  style?: CSSProperties;
  /** Initial text shown before the counter triggers. */
  placeholder?: string;
};

/**
 * Scroll-triggered count-up. Animation is driven by the global `Animator`
 * engine via `data-counter*` attributes — no per-instance JS required.
 */
export function Counter({
  to,
  from = 0,
  duration = 1.6,
  decimals = 0,
  prefix = '',
  suffix = '',
  locale = 'en-US',
  className,
  style,
  placeholder,
}: Props) {
  const initial =
    placeholder ??
    `${prefix}${from.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  return (
    <span
      className={className}
      style={style}
      data-counter=""
      data-counter-to={String(to)}
      data-counter-from={String(from)}
      data-counter-duration={String(duration)}
      data-counter-decimals={String(decimals)}
      data-counter-prefix={prefix}
      data-counter-suffix={suffix}
      data-counter-locale={locale}
    >
      {initial}
    </span>
  );
}
