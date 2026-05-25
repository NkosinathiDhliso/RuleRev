import type { CSSProperties } from 'react';

type Props = {
  /** Use the high-saturation dark variant for inverted sections. */
  variant?: 'light' | 'dark';
  /** Apply a subtle scroll-linked parallax via the GSAP engine. */
  parallax?: boolean;
  /** Parallax travel in px (negative shifts up as user scrolls). */
  parallaxStrength?: number;
  /** Adds film-grain overlay for tactile depth. */
  grain?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * A non-interactive layered background — radial gradient mesh + optional grain.
 * Drop inside any `position: relative` parent. Sits behind content (z-index: 0/1).
 */
export function GradientMesh({
  variant = 'light',
  parallax = false,
  parallaxStrength = 60,
  grain = true,
  className,
  style,
}: Props) {
  const meshClass = variant === 'dark' ? 'mesh-bg-dark' : 'mesh-bg';
  return (
    <>
      <div
        aria-hidden="true"
        className={`${meshClass} ${className ?? ''}`}
        data-parallax={parallax ? '' : undefined}
        data-parallax-y={parallax ? String(parallaxStrength) : undefined}
        style={style}
      />
      {grain ? <div aria-hidden="true" className="grain" /> : null}
    </>
  );
}
