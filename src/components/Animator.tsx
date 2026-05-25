'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Premium motion engine — Apple / ElevenLabs tier.
 *
 * Dramatic, prominent animations:
 *  - Large travel distances (40-80px)
 *  - Blur-in on reveals
 *  - Longer durations (1.2-1.6s) with spring-like easing
 *  - Staggered card reveals with cascading delays
 *  - Scroll-linked parallax
 *  - Magnetic cursor on CTAs
 *  - Counter animations
 */

const SAFETY_MS = 3500;

type AnimType =
  | 'fade'
  | 'fade-up'
  | 'fade-up-sm'
  | 'scale-in'
  | 'slide-left'
  | 'slide-right';

const FROM_BY_TYPE: Record<AnimType, gsap.TweenVars> = {
  'fade': { opacity: 0, filter: 'blur(8px)' },
  'fade-up': { opacity: 0, y: 60, filter: 'blur(6px)' },
  'fade-up-sm': { opacity: 0, y: 30, filter: 'blur(4px)' },
  'scale-in': { opacity: 0, scale: 0.88, filter: 'blur(10px)' },
  'slide-left': { opacity: 0, x: -60, filter: 'blur(6px)' },
  'slide-right': { opacity: 0, x: 60, filter: 'blur(6px)' },
};

const TO_DEFAULTS: gsap.TweenVars = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  filter: 'blur(0px)',
  duration: 1.2,
  ease: 'power4.out',
  clearProps: 'willChange,filter',
};

function readDelayMs(el: HTMLElement): number {
  const cs = getComputedStyle(el);
  const dRaw = cs.getPropertyValue('--d').trim();
  if (dRaw) {
    const ms = dRaw.endsWith('ms')
      ? parseFloat(dRaw)
      : dRaw.endsWith('s')
        ? parseFloat(dRaw) * 1000
        : parseFloat(dRaw);
    if (!Number.isNaN(ms)) return ms;
  }
  const iRaw = cs.getPropertyValue('--i').trim();
  const dsRaw = cs.getPropertyValue('--ds').trim();
  if (iRaw) {
    const i = parseFloat(iRaw);
    const ds = dsRaw
      ? dsRaw.endsWith('ms')
        ? parseFloat(dsRaw)
        : parseFloat(dsRaw) * 1000
      : 120;
    if (!Number.isNaN(i)) return i * ds;
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
  useEffect(() => {
    const html = document.documentElement;
    const reducedQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    if (reducedQuery?.matches) {
      html.classList.add('motion-reduced');
      html.classList.remove('motion');
      return;
    }

    html.classList.add('motion');

    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    // Set GSAP defaults for premium feel
    gsap.defaults({ overwrite: 'auto' });

    const cleanups: (() => void)[] = [];
    const triggers: ScrollTrigger[] = [];

    const safetyId = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>('[data-animate], [data-split-words], [data-split-chars]')
        .forEach((el) => {
          el.classList.add('in-view');
          gsap.set(el, { clearProps: 'all' });
        });
    }, SAFETY_MS);

    // ---- Standard data-animate elements -----------------------------------
    const animTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-animate]'),
    );
    animTargets.forEach((el) => {
      const type = (el.dataset.animate || 'fade-up') as AnimType;
      const from = FROM_BY_TYPE[type] ?? FROM_BY_TYPE['fade-up'];
      const delayMs = readDelayMs(el);
      gsap.set(el, { ...from, willChange: 'transform, opacity, filter' });

      const t = ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          el.classList.add('in-view');
          gsap.to(el, {
            ...TO_DEFAULTS,
            delay: delayMs / 1000,
          });
        },
      });
      triggers.push(t);

      // Already on-screen at mount
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in-view');
        gsap.to(el, { ...TO_DEFAULTS, delay: delayMs / 1000 });
      }
    });

    // ---- Word-level split -------------------------------------------------
    const wordTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-split-words]'),
    );
    wordTargets.forEach((el) => {
      const words = el.querySelectorAll<HTMLElement>('.rr-word');
      if (!words.length) return;
      gsap.set(words, {
        opacity: 0,
        y: '0.7em',
        rotateX: -20,
        filter: 'blur(4px)',
        transformOrigin: '50% 100%',
        willChange: 'transform, opacity, filter',
      });

      const t = ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          el.classList.add('in-view');
          gsap.to(words, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: 'blur(0px)',
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.07,
            clearProps: 'willChange,filter',
          });
        },
      });
      triggers.push(t);

      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in-view');
        gsap.to(words, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.07,
          clearProps: 'willChange,filter',
        });
      }
    });

    // ---- Char-level split (premium hero) ----------------------------------
    const charTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-split-chars]'),
    );
    charTargets.forEach((el) => {
      const chars = el.querySelectorAll<HTMLElement>('.rr-char');
      if (!chars.length) return;
      gsap.set(chars, {
        opacity: 0,
        y: '0.8em',
        rotateX: -60,
        scale: 0.8,
        filter: 'blur(8px)',
        transformOrigin: '50% 100%',
        willChange: 'transform, opacity, filter',
      });

      const t = ScrollTrigger.create({
        trigger: el,
        start: 'top 94%',
        once: true,
        onEnter: () => {
          el.classList.add('in-view');
          gsap.to(chars, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.4,
            ease: 'power4.out',
            stagger: 0.025,
            clearProps: 'willChange,filter',
          });
        },
      });
      triggers.push(t);

      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in-view');
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'power4.out',
          stagger: 0.025,
          clearProps: 'willChange,filter',
        });
      }
    });

    // ---- Parallax ---------------------------------------------------------
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

    // ---- Counters ---------------------------------------------------------
    const counterTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-counter]'),
    );
    counterTargets.forEach((el) => {
      const t = ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => animateCounter(el),
      });
      triggers.push(t);
    });

    // ---- Magnetic CTAs ----------------------------------------------------
    document
      .querySelectorAll<HTMLElement>('[data-magnetic]')
      .forEach((el) => bindMagnetic(el, cleanups));

    // ---- Smooth scroll-linked header opacity (Apple-style) ----------------
    const header = document.querySelector('header');
    if (header) {
      const onScroll = () => {
        const progress = Math.min(1, window.scrollY / 100);
        (header as HTMLElement).style.setProperty('--header-opacity', String(progress));
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener('scroll', onScroll));
    }

    // ---- Reduced-motion live switch ---------------------------------------
    const onReducedChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        html.classList.add('motion-reduced');
        html.classList.remove('motion');
        triggers.forEach((t) => t.kill());
        gsap.set('[data-animate], [data-split-words] .rr-word, [data-split-chars] .rr-char', {
          clearProps: 'all',
        });
        document
          .querySelectorAll<HTMLElement>('[data-animate], [data-split-words], [data-split-chars]')
          .forEach((el) => el.classList.add('in-view'));
      }
    };
    reducedQuery?.addEventListener?.('change', onReducedChange);

    return () => {
      window.clearTimeout(safetyId);
      triggers.forEach((t) => t.kill());
      cleanups.forEach((fn) => fn());
      reducedQuery?.removeEventListener?.('change', onReducedChange);
    };
  }, []);

  return null;
}
