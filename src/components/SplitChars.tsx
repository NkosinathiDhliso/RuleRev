import type { ElementType, ReactNode, CSSProperties } from 'react';

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
};

/**
 * Char-level split for premium hero reveals. Each grapheme becomes a
 * `<span class="rr-char">`; the global `Animator` drives the stagger with
 * GSAP (rotateX + y + opacity, expo.out, ~22ms per char).
 *
 * Words are wrapped to preserve word-break behavior and avoid breaking
 * mid-word at narrow viewports.
 */
export function SplitChars({ text, as: As = 'span', className, id }: Props) {
  const words = text.split(/(\s+)/);
  return (
    <As id={id} className={className} data-split-chars>
      {words.map((word, wi) => {
        if (word.length === 0) return null;
        if (/^\s+$/.test(word)) return word;
        const chars = Array.from(word);
        return (
          <span
            key={wi}
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
          >
            {chars.map((ch, ci) => (
              <span key={ci} className="rr-char" aria-hidden="true">
                {ch}
              </span>
            ))}
            <span className="sr-only" style={srOnly}>
              {word}
            </span>
          </span>
        ) as ReactNode;
      })}
    </As>
  );
}

const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};
