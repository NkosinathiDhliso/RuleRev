import type { CSSProperties, ElementType, ReactNode } from 'react';

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  baseDelay?: number;
  id?: string;
};

export function SplitWords({ text, as: As = 'span', className, baseDelay = 0, id }: Props) {
  const tokens = text.split(/(\s+)/);
  let wordIndex = 0;
  const children: ReactNode[] = tokens.map((token, i) => {
    if (token.length === 0) return null;
    if (/^\s+$/.test(token)) return token;
    const w = wordIndex + baseDelay;
    wordIndex += 1;
    const style = { ['--w' as string]: w } as CSSProperties;
    return (
      <span key={i} className="rr-word" style={style}>
        {token}
      </span>
    );
  });
  return (
    <As id={id} className={className} data-split-words>
      {children}
    </As>
  );
}
