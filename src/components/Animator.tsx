'use client';

import { useEffect } from 'react';

const SAFETY_MS = 2000;
const ROOT_MARGIN = '0px 0px -8% 0px';

export function Animator() {
  useEffect(() => {
    const html = document.documentElement;
    const reducedQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

    if (reducedQuery?.matches) {
      html.classList.add('motion-reduced');
      html.classList.remove('motion');
      return;
    }

    html.classList.add('motion');

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-animate], [data-split-words]'),
    );
    if (targets.length === 0) return;

    let safetyId: number | undefined;
    let observer: IntersectionObserver | undefined;

    const revealAll = () => {
      targets.forEach((el) => el.classList.add('in-view'));
    };

    safetyId = window.setTimeout(revealAll, SAFETY_MS);

    if (typeof IntersectionObserver !== 'function') {
      revealAll();
      window.clearTimeout(safetyId);
      return;
    }

    observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: ROOT_MARGIN, threshold: 0.05 },
    );

    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in-view');
      } else {
        observer!.observe(el);
      }
    });

    const onMotionPrefChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        html.classList.add('motion-reduced');
        html.classList.remove('motion');
        revealAll();
      }
    };
    reducedQuery?.addEventListener?.('change', onMotionPrefChange);

    return () => {
      observer?.disconnect();
      if (safetyId !== undefined) window.clearTimeout(safetyId);
      reducedQuery?.removeEventListener?.('change', onMotionPrefChange);
    };
  }, []);

  return null;
}
