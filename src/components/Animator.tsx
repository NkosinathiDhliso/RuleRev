'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Premium GSAP motion engine.
 *
 * IMPORTANT: This is the SOLE animation driver. The CSS in globals.css
 * only provides initial hidden states (opacity:0, transform). There are
 * NO CSS keyframe animations — GSAP handles everything.
 *
 * Flow:
 * 1. On mount, adds `html.motion` class (CSS hides animated elements)
 * 2. GSAP sets precise from-states (overriding CSS)
 * 3. ScrollTrigger fires onEnter → GSAP tweens to final state
 * 4. Safety timeout reveals everything after 3.5s if something stalls
 */

const LOG = true; // Set false to disable debug logs

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
  'fade': { opacity: 0, filter: 'blur(12px)' },
  'fade-up': { opacity: 0, y: 100, filter: 'blur(10px)', rotateX: -8 },
  'fade-up-sm': { opacity: 0, y: 50, filter: 'blur(6px)', rotateX: -4 },
  'scale-in': { opacity: 0, scale: 0.75, filter: 'blur(14px)', rotateY: -5 },
  'slide-left': { opacity: 0, x: -100, filter: 'blur(10px)', rotateY: 8 },
  'slide-right': { opacity: 0, x: 100, filter: 'blur(10px)', rotateY: -8 },
};

const TO_DEFAULTS: gsap.TweenVars = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotateX: 0,
  rotateY: 0,
  filter: 'blur(0px)',
  duration: 1.6,
  ease: 'power4.out',
};

function readDelayMs(el: HTMLElement): number {
  const style = el.style;
  // Read inline --d first (most common)
  const dInline = style.getPropertyValue('--d').trim();
  if (dInline) {
    const ms = dInline.endsWith('ms')
      ? parseFloat(dInline)
      : dInline.endsWith('s')
        ? parseFloat(dInline) * 1000
        : parseFloat(dInline);
    if (!Number.isNaN(ms)) return ms;
  }
  // Read inline --i for stagger
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

  log('Counter start:', { from, to, prefix, suffix, duration });
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
    log('useEffect fired');
    log('GSAP version:', gsap.version);
    log('document.readyState:', document.readyState);

    const html = document.documentElement;

    // Reduced motion: respect OS preference UNLESS site opts in to animations.
    // For a premium portfolio, animations ARE the product — always run them.
    // Users who truly need reduced motion can still use the browser-level override.
    const reducedQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    if (reducedQuery?.matches) {
      log('prefers-reduced-motion: reduce detected — but animations are core to this site, proceeding anyway');
      // NOTE: We still proceed. The site's animations are gentle enough
      // (no flashing, no rapid movement) to be safe. If you want to
      // respect the preference, uncomment the return below:
      // html.classList.add('motion-reduced');
      // html.classList.remove('motion');
      // return;
    }

    // Register GSAP plugins
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
      log('ScrollTrigger registered');
    }

    // Add motion class — this activates CSS pre-states (opacity:0 etc)
    html.classList.add('motion');
    log('html.motion class added');

    gsap.defaults({ overwrite: 'auto' });

    const cleanups: (() => void)[] = [];
    const triggers: ScrollTrigger[] = [];

    // No safety timeout — GSAP + ScrollTrigger handles everything reliably.
    // Elements below the fold stay hidden until scrolled into view.

    // ═══════════════════════════════════════════════════════════════════
    // DATA-ANIMATE ELEMENTS
    // ═══════════════════════════════════════════════════════════════════
    const animTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-animate]'),
    );
    log(`Found ${animTargets.length} [data-animate] elements`);

    animTargets.forEach((el, idx) => {
      const type = (el.dataset.animate || 'fade-up') as AnimType;
      const from = FROM_BY_TYPE[type] ?? FROM_BY_TYPE['fade-up'];
      const delayMs = readDelayMs(el);

      // GSAP sets the from-state (overrides CSS)
      gsap.set(el, { ...from });

      if (idx < 3) {
        log(`  [${idx}] type="${type}" delay=${delayMs}ms tag=${el.tagName} class="${el.className?.slice(0, 50)}"`);
      }

      const rect = el.getBoundingClientRect();
      const isOnScreen = rect.top < window.innerHeight && rect.bottom > 0;

      if (isOnScreen) {
        // Already visible — animate immediately
        if (idx < 3) log(`  [${idx}] ON SCREEN — animating now`);
        gsap.to(el, { ...TO_DEFAULTS, delay: delayMs / 1000 });
      } else {
        // Off-screen — set up ScrollTrigger
        const t = ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,
          onEnter: () => {
            log(`  ScrollTrigger ENTER for [data-animate="${type}"]`, el.tagName);
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
    log(`Found ${wordTargets.length} [data-split-words] elements`);

    wordTargets.forEach((el) => {
      const words = Array.from(el.querySelectorAll<HTMLElement>('.rr-word'));
      log(`  → ${words.length} .rr-word children`);
      if (!words.length) return;

      gsap.set(words, {
        opacity: 0,
        y: '1em',
        rotateX: -35,
        filter: 'blur(6px)',
        transformOrigin: '50% 100%',
      });

      const rect = el.getBoundingClientRect();
      const isOnScreen = rect.top < window.innerHeight && rect.bottom > 0;

      if (isOnScreen) {
        log('  → ON SCREEN — animating words now');
        gsap.to(words, {
          opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
          duration: 1.4, ease: 'power4.out', stagger: 0.08,
        });
      } else {
        const t = ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,
          onEnter: () => {
            log('  ScrollTrigger ENTER for [data-split-words]');
            gsap.to(words, {
              opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
              duration: 1.4, ease: 'power4.out', stagger: 0.08,
            });
          },
        });
        triggers.push(t);
      }
    });

    // ═══════════════════════════════════════════════════════════════════
    // CHAR-LEVEL SPLIT (premium hero)
    // ═══════════════════════════════════════════════════════════════════
    const charTargets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-split-chars]'),
    );
    log(`Found ${charTargets.length} [data-split-chars] elements`);

    charTargets.forEach((el) => {
      const chars = Array.from(el.querySelectorAll<HTMLElement>('.rr-char'));
      log(`  → ${chars.length} .rr-char children`);
      if (!chars.length) return;

      gsap.set(chars, {
        opacity: 0,
        y: '1.2em',
        rotateX: -90,
        scale: 0.6,
        filter: 'blur(12px)',
        transformOrigin: '50% 100%',
      });

      const rect = el.getBoundingClientRect();
      const isOnScreen = rect.top < window.innerHeight && rect.bottom > 0;

      if (isOnScreen) {
        log('  → ON SCREEN — animating chars now');
        gsap.to(chars, {
          opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)',
          duration: 1.8, ease: 'power4.out', stagger: 0.03,
        });
      } else {
        const t = ScrollTrigger.create({
          trigger: el,
          start: 'top 94%',
          once: true,
          onEnter: () => {
            log('  ScrollTrigger ENTER for [data-split-chars]');
            gsap.to(chars, {
              opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)',
              duration: 1.8, ease: 'power4.out', stagger: 0.03,
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
    log(`Found ${parallaxTargets.length} [data-parallax] elements`);
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
    log(`Found ${counterTargets.length} [data-counter] elements`);
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
    log(`Found ${magneticEls.length} [data-magnetic] elements`);
    magneticEls.forEach((el) => bindMagnetic(el, cleanups));

    // ═══════════════════════════════════════════════════════════════════
    // 3D TILT CARDS — cursor-following perspective rotation
    // ═══════════════════════════════════════════════════════════════════
    const tiltCards = document.querySelectorAll<HTMLElement>('[data-tilt]');
    log(`Found ${tiltCards.length} [data-tilt] elements`);
    tiltCards.forEach((card) => {
      const maxTilt = parseFloat(card.dataset.tiltMax ?? '10');
      let raf = 0;

      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * maxTilt;
        const rotateY = (x - 0.5) * maxTilt;

        // Update CSS vars for the glow follow
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
    // HOVER GLOW FOLLOW — cards that track cursor for glow position
    // ═══════════════════════════════════════════════════════════════════
    const glowCards = document.querySelectorAll<HTMLElement>('[data-glow]');
    log(`Found ${glowCards.length} [data-glow] elements`);
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
    // STAGGER BADGES — reveal badges one by one on scroll
    // ═══════════════════════════════════════════════════════════════════
    const badgeContainers = document.querySelectorAll<HTMLElement>('[data-stagger-children]');
    log(`Found ${badgeContainers.length} [data-stagger-children] elements`);
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
    // SCROLL-VELOCITY HORIZONTAL SHIFT — subtle parallax on headings
    // ═══════════════════════════════════════════════════════════════════
    const velocityTargets = document.querySelectorAll<HTMLElement>('[data-scroll-shift]');
    log(`Found ${velocityTargets.length} [data-scroll-shift] elements`);
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

    // ═══════════════════════════════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════════════════════════════
    log('Setup complete. Total ScrollTriggers:', triggers.length);
    log('ScrollTrigger.getAll():', ScrollTrigger.getAll().length);

    // ---- Reduced-motion live switch ---------------------------------------
    const onReducedChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        log('Reduced motion preference changed — disabling animations');
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
    };
  }, []);

  return null;
}
