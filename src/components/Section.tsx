import type { ReactNode } from 'react';
import styles from './Section.module.css';

type Props = {
  children: ReactNode;
  surface?: boolean;
  tight?: boolean;
  id?: string;
  ariaLabelledBy?: string;
  as?: 'section' | 'div';
};

export function Section({ children, surface, tight, id, ariaLabelledBy, as = 'section' }: Props) {
  const Tag = as;
  const cls = [styles.section, tight ? styles.section_tight : '', surface ? styles.bg_surface : '']
    .filter(Boolean)
    .join(' ');
  return (
    <Tag className={cls} id={id} aria-labelledby={ariaLabelledBy}>
      <div className="container-page" style={{ width: '100%' }}>{children}</div>
    </Tag>
  );
}

import { SplitWords } from './SplitWords';

export function SectionHeading({
  eyebrow,
  title,
  lede,
  centered,
  id,
  as = 'h2',
  splitTitle,
  ledeDelay,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  centered?: boolean;
  id?: string;
  as?: 'h1' | 'h2';
  splitTitle?: boolean;
  ledeDelay?: string;
}) {
  const cls = [styles.heading_block, centered ? styles.heading_block_centered : ''].filter(Boolean).join(' ');
  const Title = as;
  const renderTitle =
    splitTitle && typeof title === 'string' ? (
      <SplitWords as={as} id={id} className={styles.title} text={title} />
    ) : (
      <Title id={id} className={styles.title}>
        {title}
      </Title>
    );
  return (
    <div className={cls}>
      {eyebrow ? <div>{eyebrow}</div> : null}
      {renderTitle}
      {lede ? (
        <p
          className={styles.lede}
          data-animate="fade-up-sm"
          style={ledeDelay ? ({ ['--d' as string]: ledeDelay } as React.CSSProperties) : undefined}
        >
          {lede}
        </p>
      ) : null}
    </div>
  );
}
