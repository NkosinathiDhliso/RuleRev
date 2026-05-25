'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * GSAP motion engine — re-runs on every route change so new page
 * content is always animated in correctly.
 */

const LOG = false;

function log(...args: unknown[]) {
  if (LOG) console.log('%c[Animator]', 'color: #6d5ef5; font-weight: bold;', ...args);
}

type AnimType =
  | 'fade'
  | 'fade-up'
  | 'fade-up-sm'
  | 'scale-in'
  | 'slide-left'
  | 'slide-right';

const FROM_BY_TYPE: Record<AnimType, gsap.TweenVars> = {
  'fade': { opacity: 0, filter: 'blur(6px)' },
  'fade-up': { opacity: 0, y: 40, filter: 'blur(4px)' },
  'fade-up-sm': { opacity: 0, y: 24, filter: 'blur(3px)' },
  'scale-in': { opacity: 0, scale: 0.9, filter: 'blur(6px)' },
  'slide-left': { opacity: 0, x: -60, filter: 'blur(4px)' },
  'slide-right': { opacity: 0, x: 60, filter: 'blur(4px)' },
};

const TO_DEFAULTS: gsap.TweenVars = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotateX: 0,
  rotateY: 0,
  filter: 'blur(0px)',
  duration: 1,
  ease: 'power3.out',
};

function readDelayMs(el: HTMLElement): number {
  const style = el.style;
  const dInline = style.getPropertyValue('--d').trim();
  if (dInline) {
    const ms = dInline.endsWith('ms')
      ? parseFloat(dInline)
      : dInline.endsWith('s')
        ? parseFloat(dInline) * 1000
        : parseFloat(dInline);
    if (!Number.isNaN(ms)) return ms;
  }
  const iInline = style.getPropertyValue('--i').trim();
  if (iInline) {
    const i = parseFloat(iInline);
    if (!Number.isNaN(i)) return i * 200;
  }
  return 0;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function formatNumber(n: number, decimals: number, locale: string): string {
  return n.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function animateCounter(el: HTMLElement) {
  const to = parseFloat(el.dataset.counterTo ?? '0');
  if (Number.isNaN(to)) return;
  const from = parseFloat(el.dataset.counterFrom ?? '0');
  const duration = parseFloat(el.dataset.counterDuration ?? '2.0');
  const decimals = parseInt(el.dataset.counterDecimals ?? '0', 10);
  const prefix = el.dataset.counterPrefix ?? '';
  const suffix = el.dataset.counterSuffix ?? '';
  const locale = el.dataset.counterLocale ?? 'en-US';

  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / (duration * 1000));
    const v = from + (to - from) * easeOutCubic(t);
    el.textContent = `${prefix}${formatNumber(v, decimals, locale)}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function bindMagnetic(el: HTMLElement, cleanups: (() => void)[]) {
  const strength = parseFloat(el.dataset.magneticStrength ?? '0.35');
  let raf = 0;
  const onMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      gsap.to(el, { x: dx, y: dy, duration: 0.5, ease: 'power3.out' });
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(raf);
    gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1.2, 0.4)' });
  };
  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);
  cleanups.push(() => {
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
    cancelAnimationFrame(raf);
  });
}

let registered = false;

export function Animator() {
  const pathname = usePathname();

  useEffect(() => {
    log('useEffect fired — pathname:', pathname);

    const html = document.documentElement;

    // Register GSAP plugins once
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    // Add motion class — activates CSS pre-states (opacity:0)
    html.classList.add('motion');
    gsap.defaults({ overwrite: 'auto' });

    const cleanups: (() => void)[] = [];
    const triggers: ScrollTrigger[] = [];

    // ═══════════════════════════════════════════════════════════════════
    // DATA-ANIMATE ELEMENTS
    // ═══════════════════════════════════════════════════════════════════
    const animTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-animate]'),
    );
    log(`Found ${animTargets.length} [data-animate] elements`);

    animTargets.forEach((el) => {
      const type = (el.dataset.animate || 'fade-up') as AnimType;
      const from = FROM_BY_TYPE[type] ?? FROM_BY_TYPE['fade-up'];
      const delayMs = readDelayMs(el);

      gsap.set(el, { ...from });

      const rect = el.getBoundingClientRect();
      const isOnScreen = rect.top < window.innerHeight && rect.bottom > 0;

      if (isOnScreen) {
        gsap.to(el, { ...TO_DEFAULTS, delay: delayMs / 1000 });
      } else {
        const t = ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,
          onEnter: () => {
            gsap.to(el, { ...TO_DEFAULTS, delay: delayMs / 1000 });
          },
        });
        triggers.push(t);
      }
    });

    // ═══════════════════════════════════════════════════════════════════
    // WORD-LEVEL SPLIT
    // ═══════════════════════════════════════════════════════════════════
    const wordTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-split-words]'),
    );

    wordTargets.forEach((el) => {
      const words = Array.from(el.querySelectorAll<HTMLElement>('.rr-word'));
      if (!words.length) return;

      gsap.set(words, {
        opacity: 0,
        y: '0.5em',
        rotateX: -15,
        filter: 'blur(3px)',
        transformOrigin: '50% 100%',
      });

      const rect = el.getBoundingClientRect();
      const isOnScreen = rect.top < window.innerHeight && rect.bottom > 0;

      if (isOnScreen) {
        gsap.to(words, {
          opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
          duration: 1, ease: 'power3.out', stagger: 0.06,
        });
      } else {
        const t = ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,
          onEnter: () => {
            gsap.to(words, {
              opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
              duration: 1, ease: 'power3.out', stagger: 0.06,
            });
          },
        });
        triggers.push(t);
      }
    });

    // ═══════════════════════════════════════════════════════════════════
    // CHAR-LEVEL SPLIT (hero)
    // ═══════════════════════════════════════════════════════════════════
    const charTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-split-chars]'),
    );

    charTargets.forEach((el) => {
      const chars = Array.from(el.querySelectorAll<HTMLElement>('.rr-char'));
      if (!chars.length) return;

      gsap.set(chars, {
        opacity: 0,
        y: '0.6em',
        rotateX: -45,
        scale: 0.85,
        filter: 'blur(6px)',
        transformOrigin: '50% 100%',
      });

      const rect = el.getBoundingClientRect();
      const isOnScreen = rect.top < window.innerHeight && rect.bottom > 0;

      if (isOnScreen) {
        gsap.to(chars, {
          opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)',
          duration: 1.2, ease: 'power3.out', stagger: 0.025,
        });
      } else {
        const t = ScrollTrigger.create({
          trigger: el,
          start: 'top 94%',
          once: true,
          onEnter: () => {
            gsap.to(chars, {
              opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)',
              duration: 1.2, ease: 'power3.out', stagger: 0.025,
            });
          },
        });
        triggers.push(t);
      }
    });

    // ═══════════════════════════════════════════════════════════════════
    // PARALLAX
    // ═══════════════════════════════════════════════════════════════════
    const parallaxTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-parallax]'),
    );
    parallaxTargets.forEach((el) => {
      const strength = parseFloat(el.dataset.parallaxY ?? '80');
      const t = gsap.to(el, {
        y: -strength,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      }).scrollTrigger;
      if (t) triggers.push(t);
    });

    // ═══════════════════════════════════════════════════════════════════
    // COUNTERS
    // ═══════════════════════════════════════════════════════════════════
    const counterTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-counter]'),
    );
    counterTargets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isOnScreen = rect.top < window.innerHeight && rect.bottom > 0;
      if (isOnScreen) {
        animateCounter(el);
      } else {
        const t = ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,
          onEnter: () => animateCounter(el),
        });
        triggers.push(t);
      }
    });

    // ═══════════════════════════════════════════════════════════════════
    // MAGNETIC CTAs
    // ═══════════════════════════════════════════════════════════════════
    const magneticEls = document.querySelectorAll<HTMLElement>('[data-magnetic]');
    magneticEls.forEach((el) => bindMagnetic(el, cleanups));

    // ═══════════════════════════════════════════════════════════════════
    // 3D TILT CARDS
    // ═══════════════════════════════════════════════════════════════════
    const tiltCards = document.querySelectorAll<HTMLElement>('[data-tilt]');
    tiltCards.forEach((card) => {
      const maxTilt = parseFloat(card.dataset.tiltMax ?? '4');
      let raf = 0;

      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * maxTilt;
        const rotateY = (x - 0.5) * maxTilt;

        card.style.setProperty('--mouse-x', `${x * 100}%`);
        card.style.setProperty('--mouse-y', `${y * 100}%`);

        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          gsap.to(card, {
            rotateX, rotateY,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 800,
          });
        });
      };

      const onLeave = () => {
        cancelAnimationFrame(raf);
        gsap.to(card, {
          rotateX: 0, rotateY: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)',
        });
      };

      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        card.removeEventListener('mousemove', onMove);
        card.removeEventListener('mouseleave', onLeave);
        cancelAnimationFrame(raf);
      });
    });

    // ═══════════════════════════════════════════════════════════════════
    // HOVER GLOW FOLLOW
    // ═══════════════════════════════════════════════════════════════════
    const glowCards = document.querySelectorAll<HTMLElement>('[data-glow]');
    glowCards.forEach((card) => {
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      };
      card.addEventListener('mousemove', onMove);
      cleanups.push(() => card.removeEventListener('mousemove', onMove));
    });

    // ═══════════════════════════════════════════════════════════════════
    // STAGGER BADGES
    // ═══════════════════════════════════════════════════════════════════
    const badgeContainers = document.querySelectorAll<HTMLElement>('[data-stagger-children]');
    badgeContainers.forEach((container) => {
      const children = Array.from(container.children) as HTMLElement[];
      gsap.set(children, { opacity: 0, y: 12, scale: 0.9 });

      const rect = container.getBoundingClientRect();
      const isOnScreen = rect.top < window.innerHeight && rect.bottom > 0;

      if (isOnScreen) {
        gsap.to(children, {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6, ease: 'back.out(2)',
          stagger: 0.08,
        });
      } else {
        const t = ScrollTrigger.create({
          trigger: container,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(children, {
              opacity: 1, y: 0, scale: 1,
              duration: 0.6, ease: 'back.out(2)',
              stagger: 0.08,
            });
          },
        });
        triggers.push(t);
      }
    });

    // ═══════════════════════════════════════════════════════════════════
    // SCROLL-VELOCITY HORIZONTAL SHIFT
    // ═══════════════════════════════════════════════════════════════════
    const velocityTargets = document.querySelectorAll<HTMLElement>('[data-scroll-shift]');
    velocityTargets.forEach((el) => {
      const strength = parseFloat(el.dataset.scrollShift ?? '20');
      const t = gsap.to(el, {
        x: -strength,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      }).scrollTrigger;
      if (t) triggers.push(t);
    });

    log('Setup complete. Total ScrollTriggers:', triggers.length);

    // ---- Reduced-motion live switch ----
    const reducedQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    const onReducedChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        html.classList.add('motion-reduced');
        html.classList.remove('motion');
        triggers.forEach((t) => t.kill());
        gsap.set('[data-animate], [data-split-words] .rr-word, [data-split-chars] .rr-char', {
          clearProps: 'all',
        });
      }
    };
    reducedQuery?.addEventListener?.('change', onReducedChange);

    return () => {
      log('Cleanup — killing', triggers.length, 'triggers');
      triggers.forEach((t) => t.kill());
      cleanups.forEach((fn) => fn());
      reducedQuery?.removeEventListener?.('change', onReducedChange);
      // Clear GSAP inline styles so new page starts fresh
      gsap.set('[data-animate], [data-split-words] .rr-word, [data-split-chars] .rr-char, [data-stagger-children] > *', {
        clearProps: 'all',
      });
    };
  }, [pathname]);

  return null;
}
